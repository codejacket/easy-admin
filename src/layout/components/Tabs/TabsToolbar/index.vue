<script name="TabsToolbar" setup>
import { useAppStore } from '@store/app'
const { tabFullscreen, isRefresh } = storeToRefs(useAppStore())
</script>

<template>
  <div class="tabs-toolbar">
    <el-tooltip :content="$t('common.refresh')" :show-after="600" effect="light">
      <div class="refresh" v-click-rotate @click="isRefresh = true">
        <svg-icon aria-hidden="false" icon="refresh" />
      </div>
    </el-tooltip>
    <el-tooltip
      :content="$t(`common.${tabFullscreen ? 'exitFullscreen' : 'fullscreen'}`)"
      :show-after="600"
      effect="light"
    >
      <svg-icon
        aria-hidden="false"
        :icon="tabFullscreen ? 'fullscreen-exit' : 'fullscreen'"
        @click="tabFullscreen = !tabFullscreen"
      />
    </el-tooltip>
  </div>
</template>

<style lang="css" scoped>
.tabs-toolbar {
  display: flex;
  align-items: center;
  padding: 0 8px;

  & > * {
    width: 16px;
    height: 16px;
    padding: 5px;
    cursor: pointer;
    border-radius: 2px;

    &:hover {
      background-color: rgb(128 128 128 / 12.2%);
    }
  }

  svg {
    color: var(--navbar-text-color);
    outline: none;
  }

  .refresh {
    display: flex;
    align-items: center;
  }
}
</style>
