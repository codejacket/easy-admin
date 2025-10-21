<script name="EasyTable" setup>
import EasyRenderer from '@/components/EasyRenderer'
import { add } from '@/utils'
import { createRefProxy } from '@/utils/vue'
import { reduceTree } from '@/utils/tree'
import { omit, remove } from 'lodash-es'
import { useDraggable } from 'vue-draggable-plus'

const columns = defineModel('columns', {
  type: Array,
  default: () => [],
})

const expandRowKeys = defineModel('expandRowKeys', {
  type: Array,
  default: () => [],
})

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  dragOptions: {
    type: Object,
    default: () => ({
      disabled: true,
    }),
  },
})

let tableRef = useTemplateRef('tableRef')
let draggableInstance = null

const attrs = useAttrs()
const slots = useSlots()

const tableProps = {
  'tooltip-options': { showAfter: 600 },
  'border': true,
}

const tableColumnProps = {
  'align': 'center',
  'show-overflow-tooltip': '',
}

let slotColumns = reduceTree(
  // 过滤掉注释的节点
  (slots.default?.() || []).filter(slot => slot.type?.description !== 'v-cmt'),
  (acc, cur) => {
    // v-fgt 节点的子节点需要提取出来
    if (cur.type?.description !== 'v-fgt') {
      acc.push(cur)
      return false
    }
  },
  [],
).map(({ props, children }) => {
  return { ...props, ...omit(children, ['_']) }
})

// 提取 props 和 children，最后添加插槽里的列
columns.value.unshift(...slotColumns)

let columnsJson = JSON.stringify(slotColumns)

const selections = ref([])

onMounted(() => {
  let el = tableRef.value.$el.querySelector('.el-table__body-wrapper table > tbody')
  draggableInstance = useDraggable(el, props.data, props.dragOptions)
  draggableInstance.start()
})

onUnmounted(() => {
  columns.value.splice(0, columns.value.length, ...JSON.parse(columnsJson))
})

watch(
  () => props.dragOptions,
  options => {
    if (draggableInstance) {
      Object.entries(options).forEach(([key, value]) => {
        draggableInstance.option(key, value)
      })
    }
  },
  { deep: true },
)

function handleExpandChange(row, expandedRows) {
  let rowKey = attrs['rowKey']
  if (rowKey) {
    if (expandedRows) {
      add(expandRowKeys.value, `${row[rowKey]}`)
    } else {
      remove(expandRowKeys.value, id => id === `${row[rowKey]}`)
    }
  }
}

defineExpose(createRefProxy(tableRef))
</script>

<template>
  <el-table
    class="easy-table"
    v-bind="tableProps"
    :data="data"
    :expand-row-keys="$attrs['rowKey'] ? expandRowKeys : undefined"
    ref="tableRef"
    @expand-change="handleExpandChange"
    @selection-change="val => (selections = val)"
  >
    <template v-for="(column, index) in columns" :key="index">
      <el-table-column
        v-if="!column.hidden && column.hidden !== ''"
        v-bind="{ ...tableColumnProps, ...column }"
      >
        <template #default="slotProps">
          <easy-renderer
            v-if="column['default']"
            :items="column['default']"
            :item-props="slotProps"
          />
        </template>
        <template #header="slotProps">
          <easy-renderer
            v-if="column['header']"
            :items="column['header']"
            :item-props="slotProps"
          />
        </template>
        <template #filter-icon="slotProps">
          <easy-renderer
            v-if="column['filter-icon']"
            :items="column['filter-icon']"
            :item-props="slotProps"
          />
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

<style lang="scss" scoped>
.easy-table {
  width: auto;

  :deep(.el-table__header-wrapper),
  :deep(.el-table__fixed-header-wrapper) {
    th {
      height: 40px;
      font-size: 13px;
      word-break: break-all;
      background-color: var(--el-fill-color-lighter);
    }
  }
}
</style>
