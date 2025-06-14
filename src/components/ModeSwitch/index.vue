<template>
  <div class="mode-switch" @click="toggleMode">
    <svg-icon icon="light" :style="{ transform: light ? 'scale(1) rotate(360deg)' : 'scale(0)' }" />
    <svg-icon icon="dark" :style="{ transform: light ? 'rotate(360deg) scale(0)' : '' }" />
  </div>
</template>

<script>
import { useSettingsStore } from '@store/settings'
import { mapWritableState } from 'pinia'

export default {
  name: "ModeSwitch",
  computed: {
    ...mapWritableState(useSettingsStore, ["system", "light"])
  },
  methods: {
    toggleMode() {
      // 是否开启过渡动画
      let withTransition = !matchMedia('(prefers-reduced-motion: reduce)').matches
      if (document.startViewTransition && withTransition) {
        document.startViewTransition(async () => {
          this.system.mode = this.light ? 'dark' : 'light'
          await this.$nextTick()
        }).ready.then(() => {
          let rect = this.$el.getBoundingClientRect()
          let x = rect.x + rect.width / 2
          let y = rect.y + rect.height / 2
          let r = Math.hypot(Math.max(window.innerWidth - x, x), Math.max(window.innerHeight - y, y))
          let clipPath = [`circle(0% at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`]
          document.documentElement.animate({
            clipPath: this.light ? clipPath : clipPath.reverse()
          }, {
            duration: 500,
            pseudoElement: this.light
              ? '::view-transition-new(root)'
              : '::view-transition-old(root)'
          })
        })
      } else {
        this.system.mode = this.system.mode === 'light' ? 'dark' : 'light'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mode-switch {
  display: grid;
  place-items: center;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    color: var(--navbar-icon-fill-color);
    transition: transform 500ms;
  }
}
</style>
