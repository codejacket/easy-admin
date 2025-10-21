<script name="ModeSwitch" setup>
import { useSettingsStore } from '@store/settings'
const { system } = storeToRefs(useSettingsStore())
const modeSwitch = useTemplateRef('modeSwitch')

function toggleMode() {
  // 是否开启过渡动画
  let withTransition = !matchMedia('(prefers-reduced-motion: reduce)').matches
  if (document.startViewTransition && withTransition) {
    document
      .startViewTransition(async () => {
        system.value.mode = system.value.light ? 'dark' : 'light'
        await nextTick()
      })
      .ready.then(() => {
        let rect = modeSwitch.value.getBoundingClientRect()
        let x = rect.x + rect.width / 2
        let y = rect.y + rect.height / 2
        let r = Math.hypot(Math.max(window.innerWidth - x, x), Math.max(window.innerHeight - y, y))
        let clipPath = [`circle(0% at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`]
        document.documentElement.animate(
          {
            clipPath: system.value.light ? clipPath : clipPath.reverse(),
          },
          {
            duration: 500,
            fill: 'both',
            easing: 'ease-in-out',
            pseudoElement: system.value.light
              ? '::view-transition-new(root)'
              : '::view-transition-old(root)',
          },
        )
      })
  } else {
    system.value.mode = system.value.mode === 'light' ? 'dark' : 'light'
  }
}
</script>

<template>
  <div class="mode-switch hover-shake" ref="modeSwitch" @click="toggleMode">
    <svg-icon
      :style="{ transform: system.light ? 'scale(1) rotate(360deg)' : 'scale(0)' }"
      icon="light"
    />
    <svg-icon :style="{ transform: system.light ? 'rotate(360deg) scale(0)' : '' }" icon="dark" />
  </div>
</template>

<style lang="scss" scoped>
.mode-switch {
  display: grid;
  place-items: center;

  svg {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
    transition: transform 500ms;
  }
}
</style>
