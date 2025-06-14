<template>
    <el-select v-if="isActive" v-bind="$attrs" ref="select-ref" :loading="loading" :placeholder="placeholder"
        @blur="handleBlur">
        <el-option v-for="option in options" :key="option.value" :value="option.value" :label="option.label">
            <slot name="option" :option="option" />
        </el-option>
    </el-select>
    <div v-else class="el-select" @click="handleClick">
        <div class="el-select__wrapper el-tooltip__trigger">
            <div class="el-select__selection">
                <div :class="['el-select__selected-item el-select__placeholder', { 'is-transparent': !label }]">
                    <span>{{ label || placeholder }}</span>
                </div>
            </div>
            <div class="el-select__suffix __web-inspector-hide-shortcut__">
                <i class="el-icon el-select__caret el-select__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                        <path fill="currentColor" d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z" />
                    </svg>
                </i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LazySelect',
    props: {
        placeholder: {
            type: String,
            default: '请选择'
        },
        loadOptions: {
            type: Function,
            default: async () => { }
        }
    },
    data() {
        return {
            isActive: false,
            loading: false,
            options: []
        }
    },
    computed: {
        label() {
            return this.options.find(option => option.value === this.$attrs.modelValue)?.label || this.$attrs.modelValue
        }
    },
    methods: {
        handleBlur() {
            this.isActive = false
        },
        async handleClick() {
            this.isActive = true
            await this.$nextTick()
            // 自动展开下拉框
            this.$refs['select-ref'].toggleMenu()
            // 加载数据
            this.loading = true
            this.options = await this.loadOptions?.() || this.$attrs.options
            this.loading = false
        }
    }
}
</script>