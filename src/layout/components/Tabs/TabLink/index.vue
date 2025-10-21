<script name="TabLink" setup>
const emits = defineEmits(['close'])
const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
})

function close() {
  if (!props.route.meta.affixTab) {
    emits('close')
  }
}
</script>

<template>
  <component
    @click.middle="close"
    :class="['tab', { 'is-active': route.path === $route.path }]"
    :to="{ path: route.path, query: route.query, fullPath: route.fullPath }"
    is="router-link"
  >
    <svg-icon v-if="showIcon && route.meta.icon" :icon="route.meta.icon" />
    <span>{{ route.meta.title }}</span>
    <svg-icon
      class="close-icon"
      v-if="!route.meta.affixTab"
      icon="wrong"
      @click.prevent.stop="close"
    />
  </component>
</template>

<style lang="css" scoped>
.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;

  span {
    margin: 0 6px;
    font-size: 14px;
  }

  svg {
    width: 12px;
    height: 12px;
    vertical-align: middle;

    &.close-icon {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
}
</style>
