<template>
    <div class="settings-item">
        <span :class="['settings-title', { disabled }]">
            {{ $t(`settings.${title}.title`) }}
            <el-tooltip v-if="tip" :content="$t(`settings.${title}.tip`)" placement="top" :show-after="500">
                <svg-icon icon="circle-question-mark" aria-hidden />
            </el-tooltip>
        </span>
        <component :is="type" :class="{ disabled }" :size="size" v-bind="$attrs">
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
            </template>
        </component>
    </div>
</template>

<script>
export default {
    name: 'SettingItem',
    props: {
        type: {
            type: String
        },
        title: {
            type: String,
            default: ''
        },
        tip: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'small'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.settings-item {
    padding: 4px 8px;
    color: var(--el-text-color-regular);
    display: flex;
    justify-content: space-between;

    .settings-title {
        svg {
            opacity: 0.6;
            cursor: pointer;
        }

        &.disabled {
            color: var(--el-text-color-placeholder);
        }
    }

    .el-segmented {
        width: 100px;
        padding: 4px;

        .is-selected svg {
            color: var(--el-segmented-item-selected-color);
        }

        svg {
            color: var(--el-segmented-color)
        }
    }

    .el-select,
    .el-input-number {
        width: 100px;
    }

    .el-input {
        width: 140px;
    }

    .disabled {
        pointer-events: none;
        opacity: 0.7;
    }
}
</style>