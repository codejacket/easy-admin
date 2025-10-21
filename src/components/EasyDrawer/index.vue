<script name="EasyDrawer" setup>
import { createRefProxy } from '@/utils/vue'

const modelValue = defineModel()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  confirm: {
    type: Function,
  },
})

const slots = useSlots()
const showFooter = computed(() => {
  return Boolean(props.confirm || slots.footer) && !props.loading
})

const drawerRef = useTemplateRef('drawerRef')

function close() {
  modelValue.value = false
}

defineExpose(createRefProxy(drawerRef))
</script>

<template>
  <el-drawer
    class="easy-drawer"
    v-model="modelValue"
    :show-close="false"
    ref="drawerRef"
    resizable
    append-to-body
  >
    <template #header="{ close, titleId, titleClass }">
      <span :id="titleId" :class="titleClass">{{ $attrs.title }}</span>
      <div class="flex gap12px">
        <svg-icon icon="wrong" @click="close" />
      </div>
    </template>
    <el-scrollbar>
      <div class="p16px" v-loading="loading" element-loading-background="var(--el-dialog-bg-color)">
        <slot />
      </div>
    </el-scrollbar>
    <template v-if="showFooter" #footer>
      <slot name="footer">
        <easy-button t="common.cancel" auto-insert-space @click="close" />
        <easy-button type="primary" t="common.confirm" auto-insert-space />
      </slot>
    </template>
  </el-drawer>
</template>

<style lang="scss">
.easy-drawer {
  .el-drawer__header {
    padding: 16px;
    margin-bottom: 0;
    border-bottom: 1px solid var(--el-border-color);

    .flex {
      svg {
        color: var(--el-text-color-primary);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .el-drawer__body {
    padding: 0;
  }

  .el-drawer__footer {
    padding: 16px;
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
