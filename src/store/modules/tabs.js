import { defineStore } from 'pinia'
import router from '@/router'
import { add } from '@/utils'
import { remove } from 'lodash'

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabs: [],
        defaultTab: "Home"
    }),
    getters: {
        cachesTabs() {
            return this.tabs.filter(tab => !tab.meta.noCache).map(tab => tab.name)
        }
    },
    actions: {
        init() {
            let tab = router.getRoutes().find(route => route.name === this.defaultTab)
            if (tab) this.addTab(tab)
        },
        // 判断是否已存在，若存在不添加
        addTab({ path, fullPath, name, meta, query }) {
            let tab = { path, fullPath, name, meta, query }
            add(this.tabs, tab, (a, b) => a.path === b.path)
        },
        // 删除符合条件的标签
        delTabs(condition) {
            remove(this.tabs, (tab, i) => condition(tab, i) && tab.name !== this.defaultTab)
        }
    },
    persist: {
        storage: sessionStorage,
        paths: ["tabs"]
    }
})