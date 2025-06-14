<template>
    <el-table ref="el-table-ref" class="easy-table" :data="data" :tooltip-options="{ showAfter: 600 }" border
        :expand-row-keys="$attrs['row-key'] ? expandRowKeys : undefined" @expand-change="handleExpandChange"
        @selection-change="handleSelect">
        <template v-for="(column, index) in columns" :key="index">
            <el-table-column v-bind="{ ...defaultTableColumn, ...column }" v-if="!column.hidden && column.hidden !== ''">
                <template #default="slotProps">
                    <easy-renderer v-if="column['default']" :items="column['default']" :item-props="slotProps" />
                </template>
                <template #header="slotProps">
                    <easy-renderer v-if="column['header']" :items="column['header']" :item-props="slotProps" />
                </template>
                <template #filter-icon="slotProps">
                    <easy-renderer v-if="column['filter-icon']" :items="column['filter-icon']" :item-props="slotProps" />
                </template>
            </el-table-column>
        </template>
        <template #append>
            <slot name="append" />
        </template>
        <template #empty>
            <slot name="empty" />
        </template>
    </el-table>
</template>

<script>
import { printTable } from "@/utils/print"
import { add } from '@/utils'
import { reduceTree } from '@/utils/tree'
import { remove, pick, omit, merge } from 'lodash'
import { useDraggable } from "vue-draggable-plus"

import EasyRenderer from '@/components/EasyRenderer'

export default {
    name: 'EasyTable',
    components: { EasyRenderer },
    props: {
        columns: {
            type: Array,
            default: []
        },
        data: {
            type: Array,
            default: []
        },
        expandRowKeys: {
            type: Array,
            default: []
        },
        dragOptions: {
            type: Object,
            default: {
                disabled: true,
            }
        }
    },
    data() {
        return {
            columnsJson: JSON.stringify(this.columns),
            selections: [],
            draggableInstance: null,
            defaultTableColumn: {
                'align': 'center',
                'show-overflow-tooltip': ''
            }
        }
    },
    created() {
        // 获取插槽里的列，并过滤掉注释的节点
        let slots = (this.$slots.default?.() || []).filter(slot => slot.type?.description !== 'v-cmt')
        // v-fgt 节点的子节点需要提取出来
        slots = reduceTree(slots, (acc, cur) => {
            if (cur.type?.description !== 'v-fgt') {
                acc.push(cur)
                return false
            }
        }, [])
        // 提取 props 和 children
        slots = slots.map(({ props, children }) => ({ ...props, ...omit(children, ['_']) }))
        // 添加插槽里的列
        this.columns.unshift(...slots)
    },
    mounted() {
        merge(this, pick(this.$refs['el-table-ref'], ['clearSelection', 'scrollTo', 'setScrollTop']))
        let el = this.$el.querySelector(".el-table__body-wrapper table > tbody")
        if (el) {
            this.draggableInstance = useDraggable(el, this.data, this.dragOptions)
            this.draggableInstance.start()
        }
    },
    unmounted() {
        this.columns.splice(0, this.columns.length, ...JSON.parse(this.columnsJson))
    },
    methods: {
        handleExpandChange(row, expandedRows) {
            let rowKey = this.$attrs['row-key']
            if (rowKey) {
                if (expandedRows) {
                    add(this.expandRowKeys, `${row[rowKey]}`)
                } else {
                    remove(this.expandRowKeys, id => id === `${row[rowKey]}`)
                }
            }
        },
        handleSelect(selections) {
            this.selections = selections
        },
        print(options) {
            let { isHead = true, isSelected = true } = options || {}
            let data = isSelected && this.selections.length ? this.selections : this.data
            let columns = this.columns.filter(column => !column.hidden && column.noPrint !== true)
            printTable(data, columns, { isHead })
        }
    },
    watch: {
        dragOptions: {
            deep: true,
            handler(options) {
                if (this.draggableInstance) {
                    Object.entries(options).forEach(([key, value]) => {
                        this.draggableInstance.option(key, value)
                    })
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.easy-table {
    width: auto;

    :deep(.el-table__header-wrapper),
    :deep(.el-table__fixed-header-wrapper) {
        th {
            word-break: break-word;
            background-color: var(--el-fill-color-lighter);
            height: 40px;
            font-size: 13px;
        }
    }
}
</style>