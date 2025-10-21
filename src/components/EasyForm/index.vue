<script name="EasyForm" setup>
import { createRefProxy } from '@/utils/vue'

const modelValue = defineModel()
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const formRef = useTemplateRef('formRef')

defineExpose(createRefProxy(formRef))
</script>

<template>
  <el-form label-width="auto" class="easy-form" :model="modelValue" ref="formRef">
    <slot />
    <template v-for="(item, index) in items" :key="index">
      <el-form-item v-if="item.hidden !== true" v-bind="item">
        <template v-if="item.slots?.default" #default="slotProps">
          <component :is="item.slots.default(slotProps)" />
        </template>
        <template v-if="item.slots?.label" #label="slotProps">
          <component :is="item.slots.label(slotProps)" />
          <el-tooltip v-if="item.tip" :content="item.tip" :show-after="500" placement="top">
            <svg-icon icon="circle-question-mark" />
          </el-tooltip>
        </template>
        <template v-if="item.slots?.error" #error="slotProps">
          <component :is="item.slots.error(slotProps)" />
        </template>
      </el-form-item>
    </template>
  </el-form>
</template>

<style lang="scss" scoped>
.easy-form {
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: var(--el-text-color-secondary);
  }
}
</style>
