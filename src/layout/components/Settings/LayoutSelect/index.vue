<template>
    <div class="layout-select">
        <el-tooltip v-for="item in options" :key="item" :content="$t(`settings.system.children.layout.options.${item}`)"
            placement="top" :show-after="300">
            <div :class="['layout-select-item', { 'is-active': modelValue === item }]"
                @click="$emit('update:modelValue', item)">
                <svg-icon :icon="item" />
            </div>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'LayoutSelect',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: []
        }
    }
}
</script>

<style lang="scss" scoped>
    .layout-select {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        row-gap: 16px;
        column-gap: 32px;

        .layout-select-item {
            width: 96px;
            height: 64px;
            border: 2px solid transparent;
            border-radius: 6px;
            cursor: pointer;

            svg {
                width: 100%;
                height: 100%;
                box-shadow: var(--el-box-shadow-lighter);
            }

            &.is-active {
                border-color: var(--el-color-primary);
            }
        }
    }
</style>