import { getRoutes } from '@/api/route'
import { arrayToTree, treeToArray } from '@/utils/tree'
import { isExternal } from '@/utils/validate'
import Fuse from 'fuse.js'
import { upperFirst } from 'lodash-es'

const modules = import.meta.glob('@/views/modules/**/index.vue')

export const useRouteStore = defineStore('route', () => {
  const routes = ref([])
  const sidebarRoutes = ref([])
  const searchFuse = computed(() => {
    let searchPool = treeToArray(
      sidebarRoutes.value,
      ({ path, meta, hasChild, query }, parentNodes) => {
        return {
          path,
          query,
          hasChild,
          icon: meta.icon,
          title: parentNodes
            .map(node => node.meta.title)
            .concat(meta.title)
            .join(' > '),
        }
      },
    ).filter(({ hasChild }) => !hasChild)
    // console.log(searchPool)
    return new Fuse(searchPool, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
      keys: [{ name: 'title', weight: 0.7 }],
    })
  })

  return {
    routes,
    sidebarRoutes,
    // 生成路由
    async generateRoutes() {
      const { data } = await getRoutes()
      routes.value = generateRoutes(data)
      sidebarRoutes.value = generateSidebarRoutes(data)
      return routes.value
    },
    // 搜索路由
    searchRoutes(query) {
      if (query[0] !== ' ' && query[0] !== '>') {
        return searchFuse.value.search(query)
      } else {
        return []
      }
    },
  }
})

function generateRoutes(routes) {
  return arrayToTree(
    routes.filter(route => !isExternal(route.path)),
    (
      { path, component, children, icon, title, noCache, hidden, transition, affixTab },
      parentNodes,
    ) => {
      // prettier-ignore
      let name = parentNodes.concat({ path }).map(node => upperFirst(node.path)).join('')
      let meta = { icon, title, noCache, hidden, transition, affixTab }
      if (Array.isArray(children)) {
        return {
          path,
          meta,
          children,
          redirect: '/404',
        }
      } else {
        return {
          path,
          name,
          meta,
          component: async () => {
            if (isExternal(component)) {
              let iframe = await import('@/layout/components/AppIframe/index.vue')
              return h(iframe.default, { src: component })
            } else {
              return loadView(component)
            }
          },
        }
      }
    },
  )
}

function generateSidebarRoutes(routes) {
  return arrayToTree(
    routes,
    ({ icon, title, noCache, hidden, transition, affixTab, query, ...node }, parentNodes) => {
      let nodes = parentNodes.concat(node)
      return {
        ...node,
        path: isExternal(node.path) ? node.path : `/${nodes.map(node => node.path).join('/')}`,
        query: JSON.parse(query),
        meta: { icon, title, noCache, hidden, transition, affixTab },
      }
    },
  )
}

function loadView(component) {
  let views = modules[`/src/views/modules/${component}`]
  if (views) {
    return views()
  } else {
    return import('@/views/404/index.vue')
  }
}
