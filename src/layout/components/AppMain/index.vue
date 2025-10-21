<script name="AppMain" setup>
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import { useTabsStore } from '@store/tabs'

const { isRefresh } = storeToRefs(useAppStore())
const { system } = storeToRefs(useSettingsStore())
const { cachesTabs } = storeToRefs(useTabsStore())

watch(isRefresh, val => {
  if (val) {
    // 延迟刷新，避免刷新时页面闪烁
    let t = 0
    setTimeout(() => {
      nextTick(() => {
        isRefresh.value = false
      })
    }, t)
  }
})
</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta?.transition || system.pageAnimateType || ''" mode="out-in">
        <keep-alive v-if="!isRefresh" :include="cachesTabs">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<style lang="css" scoped>
.app-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: var(--main-height);
  background: var(--base-bg);
}
</style>
