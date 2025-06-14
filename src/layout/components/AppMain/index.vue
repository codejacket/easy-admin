<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition mode="out-in" :name="route.meta?.transition || system.pageAnimateType || ''">
        <keep-alive :include="cachesTabs" v-if="!isRefresh">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <Copyright class="copyright" v-if="copyright.show" />
  </section>
</template>

<script>
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import { useTabsStore } from '@store/tabs'
import { mapState, mapWritableState } from 'pinia'

import Copyright from '@/components/Copyright'

export default {
  name: "AppMain",
  components: { Copyright },
  computed: {
    ...mapWritableState(useAppStore, ["isRefresh"]),
    ...mapState(useSettingsStore, ["system", "copyright"]),
    ...mapState(useTabsStore, ["cachesTabs"]),
  },
  watch: {
    isRefresh(newVal) {
      if (newVal) {
        // 延迟刷新，避免刷新时页面闪烁
        let t = 0
        setTimeout(() => {
          this.$nextTick(() => {
            this.isRefresh = false
          })
        }, t)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    min-height: var(--main-height);
    background: var(--base-bg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .copyright {
      padding: 12px 0;
      text-align: center;
    }
  }
</style>