import { defineStore } from 'pinia'
import { getRoutes } from '@/api/route'
import { arrayToTree } from '@/utils/tree'
import { isExternal } from '@/utils/validate'
import { upperFirst } from 'lodash'

export const useRouteStore = defineStore('route', {
    state: () => ({
        routes: [],
        sidebarRoutes: []
    }),
    actions: {
        // 生成路由
        async generateRoutes() {
            const { data } = await getRoutes()
            this.sidebarRoutes = generateSidebarRoutes(data)
            return this.routes = generateRoutes(data)
        }
    }
})

function generateRoutes(routes) {
    return arrayToTree(routes.filter(route => !isExternal(route.path)),
        ({ path, component, children, icon, title, noCache, hidden, disabled, transition }, parentNodes) => {
        let name = parentNodes.concat({ path }).map(node => upperFirst(node.path)).join('')
        let meta = { icon, title, noCache, hidden, disabled, transition }
        if (Array.isArray(children)) {
            return { 
                path,
                meta,
                children,
                redirect: '/404'
            }
        } else {
            return {
                path,
                name,
                meta,
                component: async () => {
                    if (isExternal(component)) {
                        let view = require('@/layout/components/AppIframe/index.vue')
                        view.default.name = name
                        return <view.default src={component} />
                    } else {
                        let view = await loadView(component)
                        view.default.name = name
                        return <view.default />
                    }
                }
            }
        }
    })
}

function generateSidebarRoutes(routes) {
    return arrayToTree(routes, ({ icon, title, noCache, hidden, disabled, transition, query, ...node }, parentNodes) => {
        let nodes = parentNodes.concat(node)
        let path = isExternal(node.path) ? node.path : `/${nodes.map(node => node.path).join('/')}`
        return {
            ...node,
            path,
            query: JSON.parse(query),
            meta: { icon, title, noCache, hidden, disabled, transition }
        }
    }).filter(route => !route.parentId)
}

async function loadView(component) {
    try {
        if (process.env.NODE_ENV === 'development') {
            return require(`@/views/modules/${component}/index.vue`)
        } else {
            return await import(`@/views/modules/${component}/index.vue`)
        }
    } catch {
        return require(`@/views/404/index.vue`)
    }
}
