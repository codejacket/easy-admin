<script name="LayoutSelect" setup>
const modelValue = defineModel()
const props = defineProps({
  options: {
    type: Array,
    default: [],
  },
})
</script>

<template>
  <div class="layout-select">
    <el-tooltip
      v-for="item in options"
      :key="item"
      :content="$t(`settings.system.children.layout.options.${item}`)"
      :show-after="300"
      placement="top"
    >
      <div
        :class="['layout-select-item', { 'is-active': modelValue === item }]"
        @click="modelValue = item"
      >
        <svg-icon :icon="`illus:${item}`" />
      </div>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.layout-select {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  align-items: center;
  justify-content: center;

  .layout-select-item {
    width: 96px;
    height: 64px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 6px;

    svg {
      width: 100%;
      height: 100%;
      box-shadow: var(--el-box-shadow-lighter);
    }

    &.is-active {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
