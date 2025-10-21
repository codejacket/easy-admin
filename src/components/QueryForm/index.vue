<script name="QueryForm" setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['search', 'reset'])

const queryFormRef = useTemplateRef('queryForm')

function search() {
  emit('search')
}

function reset() {
  queryFormRef.value.resetFields?.()
  emit('reset')
  emit('search')
}
</script>

<template>
  <el-collapse-transition>
    <easy-form class="query-form" v-if="show" v-bind="$attrs" ref="queryForm" inline>
      <slot />
      <el-form-item>
        <easy-button t="common.search" type="primary" i="search" plain @click="search" />
        <easy-button v-click-rotate t="common.reset" i="refresh" plain @click="reset" />
      </el-form-item>
    </easy-form>
  </el-collapse-transition>
</template>

<style lang="scss" scoped>
.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 14px;
  border-bottom: 0.8px solid var(--el-border-color-lighter);

  :deep(.el-form-item) {
    min-width: 300px;
    margin: 0;

    &:last-child {
      width: auto;
      min-width: initial;
      margin-left: auto;
    }

    .query-form-item,
    .el-input,
    .el-select,
    .el-date-editor {
      width: 200px;
    }
  }
}
</style>
