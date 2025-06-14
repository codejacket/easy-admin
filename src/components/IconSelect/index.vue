<template>
    <el-popover width="460" trigger="click" :hide-after="0" @show="reset">
        <template #reference>
            <el-input :modelValue="modelValue" :placeholder="$t('placeholder.selectIcon')" v-bind="$attrs" readonly>
                <template #prefix v-if="modelValue">
                    <svg-icon :icon="modelValue" fill="var(--el-text-color-regular)" />
                </template>
            </el-input>
        </template>
        <div class="icon-select-container">
            <el-input class="icon-search" v-model="name" clearable :placeholder="$t('placeholder.enterIconName')"
                @clear="filterIcons" @input="filterIcons">
                <template #suffix>
                    <svg-icon icon="search" />
                </template>
            </el-input>
            <div style="height: 200px">
                <el-scrollbar>
                    <div class="icon-container">
                        <div class="icon-item-wrapper" v-for="(icon, index) in iconList" :key="index">
                            <div :class="['icon-item', { 'active': modelValue === icon }]" :title="icon"
                                @click="selectedIcon(icon)">
                                <svg-icon :icon="icon" />
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </el-popover>
</template>

<script>
// 获取所有图标名称
const iconList = require.context('@/assets/svg/icons', true, /\.svg$/).keys().map(i => i.match(/\.\/(.*)\.svg/)[1])

export default {
    name: 'IconSelect',
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            name: '',
            iconList: iconList
        }
    },
    methods: {
        filterIcons() {
            this.iconList = iconList
            if (this.name) {
                this.iconList = this.iconList.filter(i => i.includes(this.name))
            }
        },
        selectedIcon(name) {
            this.$emit('update:modelValue', name)
            document.body.click()
        },
        reset() {
            this.name = ''
            this.iconList = iconList
        }
    }
}
</script>

<style lang="scss" scoped>
.icon-select-container {
    width: 100%;
    padding-bottom: 8px;
    box-sizing: border-box;

    .icon-search {
        width: calc(100% - 16px);
        margin: 8px;
        position: relative;

        :deep(.el-input__wrapper) {
            background-color: transparent;
        }

        svg {
            color: var(--el-border-color-hover);
        }
    }

    :deep(.el-scrollbar) {
        height: 100%;
        overflow: visible;

        .el-scrollbar__wrap {
            overflow-x: hidden;

            .icon-container {
                padding: 0 4px;
                display: flex;
                flex-wrap: wrap;

                .icon-item-wrapper {
                    width: calc(100% / 10);
                    aspect-ratio: 1 / 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .icon-item {
                        width: 100%;
                        margin: 5px;
                        border: 1px solid var(--el-border-color);
                        border-radius: 2px;
                        box-sizing: border-box;
                        aspect-ratio: 1 / 1;
                        color: var(--el-text-color-secondary);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: var(--el-transition-box-shadow);
                        cursor: pointer;

                        svg {
                            width: 75%;
                            height: 75%;
                        }

                        &:hover {
                            border-color: var(--el-color-primary);
                            box-shadow: 0 0 3px var(--el-color-primary-light-7);

                            svg {
                                color: var(--el-color-primary);
                                filter: drop-shadow(0 0 3px var(--el-color-primary-light-7));
                            }
                        }

                        &.active {
                            border-color: var(--el-color-primary);
                            background: var(--el-color-primary-light-9);

                            svg {
                                color: var(--el-color-primary);
                            }
                        }
                    }
                }
            }
        }

        .el-scrollbar__bar.is-vertical {
            width: 4px;
            transform: translateX(4px);

            .el-scrollbar__thumb {
                opacity: 0.2;
            }
        }
    }
}
</style>