<template>
    <el-form :model="modelValue" ref="form-ref" class="easy-form" :label-width="labelWidth">
        <template v-for="item in formItems">
            <el-form-item v-bind="item">
                <template #default="slotProps">
                    <easy-renderer v-if="item['default']" :items="item['default']" :item-props="slotProps" />
                </template>
                <template #label="slotProps">
                    <easy-renderer v-if="item['label']" :items="item['label']" :item-props="slotProps" />
                </template>
                <template #error="slotProps">
                    <easy-renderer v-if="item['error']" :items="item['error']" :item-props="slotProps" />
                </template>
            </el-form-item>
        </template>
        <slot />
    </el-form>
</template>

<script>
import { merge, isPlainObject } from 'lodash'
import EasyRenderer from '@/components/EasyRenderer'

export default {
    name: 'EasyForm',
    components: { EasyRenderer },
    props: {
        modelValue: {
            type: Object,
            default: {}
        },
        labelWidth: {
            type: String,
            default: 'auto'
        },
        items: {
            type: Array,
            default: []
        }
    },
    mounted() {
        const formRef = this.$refs['form-ref']
        for (const key in formRef) this[key] = formRef?.[key]
    },
    computed: {
        formItems() {
            return this.items.map(item => {
                if (isPlainObject(item.default)) return item
                return {
                    ...item,
                    default: [].concat(item.default).map(slot => {
                        return merge({}, slot, {
                            props: {
                                modelValue: this.modelValue[item.prop],
                                'onUpdate:modelValue': (val) => {
                                    this.modelValue[item.prop] = val
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.easy-form {
    :deep(.el-form-item__label) {
        font-weight: 600;
        color: var(--el-text-color-secondary);
    }
}
</style>