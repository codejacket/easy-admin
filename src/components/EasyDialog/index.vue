<script name="EasyDialog" setup>
import { createRefProxy } from '@/utils/vue'
import { useToggle } from '@vueuse/core'

const modelValue = defineModel()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  showFullscreen: {
    type: Boolean,
    default: true,
  },
  height: {
    type: [String, Number, Array],
    default: ['0', '600px'],
  },
  scroll: {
    type: Boolean,
    default: true,
  },
  confirm: {
    type: Function,
  },
})

const [fullscreen, toggle] = useToggle(false)

const slots = useSlots()
const showFooter = computed(() => {
  return Boolean(props.confirm || slots.footer) && !props.loading
})

const bodyProps = computed(() => {
  if (fullscreen.value) {
    let headerHeight = 48.8
    let footerHeight = 60
    return {
      height: `calc(100vh - ${headerHeight + showFooter.value * footerHeight}px)`,
    }
  } else {
    let height = props.height
    if (height instanceof Array) {
      return {
        minHeight: typeof height[0] === 'string' ? height[0] : `${height[0]}px`,
        maxHeight: typeof height[1] === 'string' ? height[1] : `${height[1]}px`,
      }
    } else {
      return {
        height,
      }
    }
  }
})

const dialogRef = useTemplateRef('dialogRef')

function close() {
  modelValue.value = false
}

async function handleConfirm() {
  let res = await props.confirm()
  if (res !== false) close()
}

defineExpose(createRefProxy(dialogRef))
</script>

<template>
  <el-dialog
    class="easy-dialog"
    v-model="modelValue"
    :show-close="false"
    :fullscreen="fullscreen"
    align-center
    append-to-body
    ref="dialogRef"
  >
    <template #header="{ close, titleClass }">
      <span :class="titleClass">{{ $attrs.title }}</span>
      <div class="flex items-center gap12px">
        <svg-icon
          v-if="showFullscreen"
          :icon="fullscreen ? 'fullscreen-exit' : 'square'"
          @click="toggle()"
        />
        <svg-icon icon="wrong" @click="close" />
      </div>
    </template>
    <el-scrollbar v-if="scroll" v-bind="bodyProps">
      <div
        class="p18px relative"
        v-loading="loading"
        element-loading-background="var(--el-dialog-bg-color)"
      >
        <slot />
      </div>
    </el-scrollbar>
    <div
      class="p18px relative box-border"
      v-loading="loading"
      v-else
      :style="bodyProps"
      element-loading-background="var(--el-dialog-bg-color)"
    >
      <slot />
    </div>
    <template v-if="showFooter" #footer>
      <slot name="footer">
        <easy-button t="common.cancel" auto-insert-space @click="close" />
        <easy-button t="common.confirm" type="primary" auto-insert-space @click="handleConfirm" />
      </slot>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.easy-dialog {
  interpolate-size: allow-keywords;
  padding: 0;
  transition: 0.3s;

  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background: rgb(128 128 128 / 6%);
    border-bottom: 1px solid var(--el-border-color-lighter);

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

  .el-dialog__footer {
    padding: 14px;
  }
}
</style>
