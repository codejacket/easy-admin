<script name="Fullscreen" setup>
import { $t } from '@/locales'
import { ElMessage } from 'element-plus'
import screenfull from 'screenfull'

const isFullscreen = ref(screenfull.isFullscreen)

screenfull.on('change', changeIcon)
onUnmounted(() => {
  screenfull.off('change', changeIcon)
})

function changeIcon() {
  isFullscreen.value = screenfull.isFullscreen
}

function toggleFullscreen() {
  if (screenfull.isEnabled) {
    screenfull.toggle()
  } else {
    ElMessage.warning($t('message.unsupportFullscreen'))
  }
}
</script>

<template>
  <svg-icon
    class="hover-expand"
    :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
    @click="toggleFullscreen"
  />
</template>

<style lang="scss" scoped></style>
