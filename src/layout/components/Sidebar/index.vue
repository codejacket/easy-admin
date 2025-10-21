<script name="Sidebar" setup>
import { useSettingsStore } from '@store/settings'
const { sidebar } = storeToRefs(useSettingsStore())
const props = defineProps({
  width: {
    type: Number,
    default: 200,
  },
})
</script>

<template>
  <div
    :class="['sidebar-container', sidebar.style, { 'dark-sidebar': sidebar.dark }]"
    :style="{ width: `${width}px` }"
  >
    <slot name="header" />
    <el-scrollbar>
      <slot />
    </el-scrollbar>
    <slot v-if="sidebar.showToolbar" name="footer" />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--sidebar-menu-bg);
  transition: width 0.28s;

  .el-scrollbar {
    :deep(.el-scrollbar__wrap) {
      mask: linear-gradient(
        to bottom,
        rgb(0 0 0 / 100%) 0%,
        rgb(0 0 0 / 100%) 90%,
        rgb(0 0 0 / 0%) 100%
      );
    }
  }

  :deep(.el-menu) {
    --el-menu-bg-color: var(--sidebar-menu-bg);
    --el-menu-border-color: var(--sidebar-menu-bg);
    --el-menu-item-height: v-bind('`${sidebar.itemHeight}px`');
    --el-menu-sub-item-height: v-bind('`${sidebar.itemHeight - 6}px`');

    span {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
