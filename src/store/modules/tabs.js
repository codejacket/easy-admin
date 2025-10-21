import { add } from '@/utils'
import { forEachTree } from '@/utils/tree'
import { useRouteStore } from '@store/route'
import { remove } from 'lodash'
import { useRouter } from 'vue-router'

export const useTabsStore = defineStore(
  'tabs',
  () => {
    const router = useRouter()
    const routes = useRouteStore().routes
    const tabs = ref([])

    forEachTree(routes, route => {
      if (!Array.isArray(route.children) && route.meta?.affixTab) {
        route.path = '/' + route.path
        addTab(route)
      }
    })

    let firstTab = tabs.value[0]
    if (firstTab) {
      router.push(firstTab.path)
    }

    const cachesTabs = computed(() => {
      return tabs.value.filter(tab => !tab.meta.noCache).map(tab => tab.name)
    })

    // 判断是否已存在，若存在不添加
    function addTab({ path, fullPath, name, meta, query }) {
      let tab = { path, fullPath, name, meta, query }
      add(tabs.value, tab, (a, b) => a.path === b.path)
    }

    // 删除符合条件的标签
    function delTabs(condition) {
      remove(tabs.value, (tab, i) => condition(tab, i) && !tab.meta?.affixTab)
    }

    return {
      tabs,
      cachesTabs,
      addTab,
      delTabs,
    }
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['tabs'],
    },
  },
)
