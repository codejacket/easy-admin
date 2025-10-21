<script name="Pagination" setup>
const props = defineProps({
  pageSizes: {
    type: Array,
    default: () => [10, 15, 20, 25, 30],
  },
})
</script>

<template>
  <el-pagination
    :pager-count="7"
    :page-sizes="pageSizes"
    background
    layout="sizes, ->, total, prev, pager, next, jumper"
  >
    <slot />
  </el-pagination>
</template>

<style lang="scss" scoped></style>
