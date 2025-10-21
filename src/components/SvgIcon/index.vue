<script name="SvgIcon" setup>
import { Icon } from '@iconify/vue'
const props = defineProps({
  icon: {
    type: [String, Object],
    required: true,
  },
})

const normalizedIcon = computed(() => {
  if (typeof props.icon === 'string') {
    let parts = props.icon.split(':')
    if (parts.length === 1) {
      return `icons:${props.icon}`
    } else {
      return props.icon
    }
  } else {
    return props.icon
  }
})
</script>

<template>
  <Icon class="svg-icon" :icon="normalizedIcon" />
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  outline: none;
}
</style>
