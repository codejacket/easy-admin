<script name="EasyButton" lang="jsx" setup>
const props = defineProps({
  i: {
    type: String,
    default: '',
  },
  t: {
    type: String,
  },
})
</script>

<template>
  <el-button>
    <svg-icon v-if="i" :icon="i" />
    <span v-if="t" v-text="$t(t)" />
    <slot v-else />
  </el-button>
</template>

<style lang="scss" scoped>
.el-button {
  svg:first-child:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
