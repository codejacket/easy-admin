<template>
    <el-dialog class="easy-dialog" :show-close="false" :fullscreen="fullscreen" align-center append-to-body>
        <template #header="{ close, titleClass }">
            <span :class="titleClass">{{ $attrs.title }}</span>
            <div class="flex g12">
                <svg-icon :icon="fullscreen ? 'fullscreen-exit' : 'square'" v-if="showFullscreen" @click="fullscreen = !fullscreen" />
                <svg-icon icon="wrong" @click="close" />
            </div>
        </template>
        <el-scrollbar v-bind="bodyProps" v-if="scroll">
            <div class="p18 relative" v-loading="loading" element-loading-background="var(--el-dialog-bg-color)">
                <slot />
            </div>
        </el-scrollbar>
        <div :style="bodyProps" class="p18 relative" style="box-sizing:border-box" v-loading="loading"
            element-loading-background="var(--el-dialog-bg-color)" v-else>
            <slot />
        </div>
        <template #footer v-if="showFooter">
            <slot name="footer" :close="close">
                <easy-button t="common.cancel" auto-insert-space @click="close" />
                <easy-button type="primary" t="common.confirm" auto-insert-space @click="handleConfirm" />
            </slot>
        </template>
    </el-dialog>
</template>

<script>
export default {
    name: 'EasyDialog',
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        height: {
            type: [String, Number, Array],
            default: ['0', '600px']
        },
        showFullscreen: {
            type: Boolean,
            default: true
        },
        scroll: {
            type: Boolean,
            default: true
        },
        confirm: {
            type: Function
        }
    },
    data() {
        return {
            fullscreen: false
        }
    },
    computed: {
        showFooter() {
            return Boolean(this.confirm || this.$slots.footer) && !this.loading
        },
        bodyProps() {
            if (this.fullscreen) {
                let headerHeight = 48.8
                let footerHeight = 60
                return {
                    height: `calc(100vh - ${headerHeight + this.showFooter * footerHeight}px)`
                }
            } else {
                if (this.height instanceof Array) {
                    return {
                        minHeight: this.height[0] instanceof String ? this.height[0] : `${this.height[0]}px`,
                        maxHeight: this.height[1] instanceof String ? this.height[1] : `${this.height[1]}px`,
                    }
                } else {
                    return {
                        height: this.height
                    }
                }
            }
        }
    },
    methods: {
        close() {
            this.$emit('update:modelValue', false)
        },
        async handleConfirm() {
            let res = await this.confirm()
            if (res !== false) this.close()
        }
    }
}
</script>

<style lang="scss">
    .easy-dialog {
        padding: 0;
        transition: 0.3s;
        interpolate-size: allow-keywords;

        .el-dialog__header {
            padding: 12px;
            background: rgba(128, 128, 128, 0.06);
            border-bottom: 1px solid var(--el-border-color-lighter);
            display: flex;
            justify-content: space-between;

            .flex {
                align-items: center;

                svg {
                    color: var(--el-text-color-primary);
                    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                    cursor: pointer;

                    &:hover {
                        color: var(--el-color-primary);
                    }
                }
            }
        }

        .el-dialog__footer {
            padding: 14px;
        }
    }
</style>