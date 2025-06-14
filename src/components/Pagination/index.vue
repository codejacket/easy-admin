<template>
    <el-pagination background layout="sizes, ->, total, prev, pager, next, jumper" :pager-count="7"
        :page-sizes="pageSizes">
        <slot />
    </el-pagination>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        pageSizes: {
            type: Array,
            default: () => [10, 15, 20, 25, 30]
        }
    }
}
</script>

<style lang="scss" scoped></style>