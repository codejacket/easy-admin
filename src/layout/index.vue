<script name="Layout" setup>
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import { useMediaQuery } from '@vueuse/core'
import { kebabCase } from 'lodash-es'
import settings from './components/Settings'

const layoutModules = import.meta.glob('./layouts/*/index.vue')
const { showSettings } = storeToRefs(useAppStore())
const { system } = storeToRefs(useSettingsStore())

const isMobile = useMediaQuery('(min-width: 320px) and (max-width: 480px)')
const isDesktop = useMediaQuery('(min-width: 769px)')

const watermarkStyle = computed(() => {
  return {
    color: system.value.light ? '#00000026' : '#ffffff26',
    fontStyle: 'italic',
  }
})

const layout = computed(() => {
  if (isMobile.value) {
    return getLayout('Mobile')
  } else if (isDesktop.value) {
    return getLayout(system.value.layout)
  }
})

function getLayout(name) {
  for (const path in layoutModules) {
    const layout = path.split('/').at(-2)
    if (kebabCase(layout) === kebabCase(name)) {
      return defineAsyncComponent(layoutModules[path])
    }
  }
}
</script>

<template>
  <el-watermark
    :font="watermarkStyle"
    :content="system.watermark ? $t('system.watermark') : null"
    :zIndex="9999"
  >
    <component :is="layout" />
  </el-watermark>
  <settings v-model="showSettings" />
</template>
