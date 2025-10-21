<script name="SystemLogo" setup>
const props = defineProps({
  color: {
    type: String,
    default: 'var(--el-color-primary)',
  },
  collapse: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
  },
})
</script>

<template>
  <div class="system-logo-container">
    <router-link v-if="link" :to="link">
      <svg-icon icon="logo" />
    </router-link>
    <svg-icon v-else icon="logo" />
    <h1 class="system-logo-title" :class="{ collapse }">
      <span class="pl-8px">{{ $t('system.title') }}</span>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
.system-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: v-bind(color);

  a {
    outline: none;
  }

  svg {
    flex-shrink: 0;
    font-size: 28px;
    color: v-bind(color);
    cursor: pointer;
    outline: none;
  }

  .system-logo-title {
    overflow: hidden;
    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.28s;

    // width: calc-size(fit-content, size)
    interpolate-size: allow-keywords;

    &.collapse {
      width: 0;
      opacity: 0;
      transform: scaleX(0);
    }
  }
}
</style>
