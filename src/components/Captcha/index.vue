<script name="Captcha" setup>
import { createRefProxy } from '@/utils/vue'
import { kebabCase } from 'lodash-es'

const props = defineProps({
  type: {
    type: String,
    default: 'pick',
  },
})

const captchaRef = useTemplateRef('captchaRef')
const components = import.meta.glob('./components/*/index.vue')
const component = computed(() => {
  for (const path in components) {
    const c = path.split('/').at(-2)
    if (kebabCase(c) === kebabCase(props.type)) {
      return defineAsyncComponent(components[path])
    }
  }
})

defineExpose(createRefProxy(captchaRef))
</script>

<template>
  <component :is="component" ref="captchaRef" />
</template>
