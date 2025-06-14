<template>
    <el-collapse-transition>
        <easy-form ref="query-form" class="query-form" v-bind="$attrs" v-if="show" inline>
            <slot />
            <el-form-item>
                <easy-button type="primary" i="search" t="common.search" plain @click="search" />
                <easy-button i="refresh" t="common.reset" v-on-click-rotate plain @click="reset" />
            </el-form-item>
        </easy-form>
    </el-collapse-transition>
</template>

<script>
export default {
    name: 'QueryForm',
    props: {
        show: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        search() {
            this.$emit('search')
        },
        reset() {
            this.$refs['query-form']?.resetFields?.()
            this.$emit('search')
        }
    }
}
</script>

<style lang="scss" scoped>
.query-form {
    padding: 14px;
    border-bottom: 0.8px solid var(--el-border-color-lighter);
    display: flex;
    flex-wrap: wrap;
    gap: 14px;

    :deep(.el-form-item) {
        min-width: 300px;
        margin: 0;

        &:last-child {
            width: auto;
            min-width: initial;
            margin-left: auto;
        }

        .query-form-item,
        .el-input,
        .el-select,
        .el-date-editor {
            width: 200px;
        }
    }
}
</style>