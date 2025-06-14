<template>
    <el-backtop target=".main-scrollbar .el-scrollbar__wrap" :visibility-height="160" :title="$t('common.backtop')">
        <template #default>
            <svg-icon icon="to-top" />
        </template>
    </el-backtop>
</template>

<script>
export default {
    name: 'BackTop'
}
</script>

<style lang="scss" scoped></style>