<template>
  <svg-icon className="fullscreen" :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" @click="fullscreen" />
</template>

<script>
import screenfull from "screenfull"

export default {
  name: "Screenfull",
  data() {
    return {
      isFullscreen: screenfull.isFullscreen,
    }
  },
  mounted() {
    screenfull.on('change', this.changeIcon)
  },
  unmounted() {
    screenfull.off('change', this.changeIcon)
  },
  methods: {
    fullscreen() {
      if (screenfull.isEnabled) {
        screenfull.toggle()
      } else {
        this.$message.warning(this.$t('message.unsupportFullscreen'))
      }
    },
    changeIcon() {
      this.isFullscreen = screenfull.isFullscreen
    }
  },
}
</script>

<style lang="scss" scoped>
  .fullscreen {
    width: 1em;
    height: 1em;
    color: var(--navbar-icon-fill-color);
    cursor: pointer;
  }
</style>
