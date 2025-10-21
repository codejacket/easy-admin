<script name="AppIframe" setup>
const props = defineProps({
  src: {
    type: String,
  },
})
</script>

<template>
  <div class="app-iframe">
    <iframe class="w-full h-full border-none" :src="src" />
  </div>
</template>

<style lang="scss" scoped>
.app-iframe {
  box-sizing: border-box;
  height: var(--main-height);
  padding: 20px;
}
</style>
