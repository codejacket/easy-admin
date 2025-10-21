<script name="EasyTablePro" setup>
import { $t } from '@/locales'
import { printTable as printable } from '@/utils/print'
import modal from '@plugins/modal'
import { merge } from 'lodash-es'

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
})

const scope = reactive({
  api: {},
  query: {
    data: {},
    show: true,
  },
  table: {
    loading: false,
    columns: [],
    selections: [],
    sort: {},
    data: [],
    rowKey: 'id',
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
  dialog: {
    open: false,
    title: '',
    isEdit: false,
    loading: false,
    async openedDialog() {},
    confirm,
  },
  form: {
    data: {},
    rules: {},
  },
  getList,
  deleteItems,
  openDialog,
  printTable,
})

const formRef = useTemplateRef('formRef')

const title = computed(() => {
  return `${$t(scope.dialog.isEdit ? 'common.update' : 'common.add')}${scope.dialog.title}`
})

merge(scope, props.config)
getList()
defineExpose(scope)

async function getList() {
  scope.table.loading = true
  let { currentPage, pageSize } = scope.pagination
  let { prop, order } = scope.table.sort
  let { data } = await scope.api.list({
    query: toRaw(scope.query.data),
    currentPage,
    pageSize,
    sortBy: prop,
    isAsc: order === 'ascending',
  })
  scope.table.data = data.list
  scope.pagination.total = data.total
  scope.table.loading = false
}

async function deleteItems(items, msg) {
  let rowKey = scope.table.rowKey
  let valid = items?.[rowKey] !== undefined || Array.isArray(items)
  let rows = [].concat(valid ? items : scope.table.selections)
  if (rows.length) {
    let ids = rows.map(item => item[rowKey])
    let message = typeof msg === 'function' ? msg(rows) : msg
    try {
      await modal.confirm.warning(message || $t('message.confirmDelete'))
      await scope.api.del(ids)
      await getList()
      modal.message.success($t('message.deleteSuccess'))
    } catch {}
  } else {
    modal.message.warning($t('message.selectDeleteItems'))
  }
}

async function openDialog(row) {
  let id = row?.[scope.table.rowKey]
  scope.dialog.isEdit = Boolean(id)
  scope.dialog.open = true
  scope.dialog.loading = true
  formRef.value?.resetFields?.()
  await scope.dialog.openedDialog?.(row)
  // 编辑时获取数据
  if (scope.dialog.isEdit) {
    let { data } = await scope.api.get(id)
    scope.form.data = data
  }
  scope.dialog.loading = false
}

async function openAdd(row, callback) {
  scope.dialog.isEdit = false
  scope.dialog.open = true
  scope.dialog.loading = true
  formRef.value?.resetFields?.()
  let res = await callback?.(row)
  if (res) scope.form.data = res
  scope.dialog.loading = false
}

async function openUpdate(row, callback) {
  scope.dialog.isEdit = true
  scope.dialog.open = true
  scope.dialog.loading = true
  formRef.value?.resetFields?.()
  let id = row?.[scope.table.rowKey]
  let { data } = await scope.api.get(id)
  scope.form.data = data
  let res = await callback?.(data)
  if (res) scope.form.data = res
  scope.dialog.loading = false
}

function closedDialog() {
  formRef.value?.resetFields?.()
}

function confirm() {
  return formRef.value?.validate?.(async valid => {
    if (valid) {
      let action = scope.dialog.isEdit ? 'update' : 'add'
      await scope.api[action]?.(scope.form.data)
      modal.message.success($t(`message.${action}Success`))
      await getList()
    }
  })
}

function printTable(config = {}) {
  let { selections, data, columns } = scope.table
  printable({
    ...config,
    data: selections.length ? selections : data,
    columns: columns.filter(c => !c.hidden && c.hidden !== '' && !c.noPrint && c.noPrint !== ''),
  })
}

function handleSelectionChange(selections) {
  scope.table.selections = selections
}

function handleSortChange(sort) {
  let { prop, order } = sort
  scope.table.sort = { prop, order }
  getList()
}
</script>

<template>
  <div>
    <!-- 查询条件 -->
    <query-form
      v-if="$slots.query"
      v-model="scope.query.data"
      v-bind="scope.query"
      @reset="scope.pagination.currentPage = 1"
      @search="getList"
    >
      <slot v-bind="scope" name="query" />
    </query-form>
    <div class="flex flex-col gap14px p14px">
      <div class="flex" v-if="$slots.toolbar">
        <slot v-bind="scope" name="toolbar">
          <!-- 默认的按钮 -->
          <easy-button
            t="common.add"
            type="primary"
            i="plus"
            size="small"
            plain
            @click="openDialog"
          />
          <easy-button
            t="common.delete"
            type="danger"
            i="delete"
            size="small"
            plain
            @click="deleteItems(scope.table.selections)"
          />
          <table-toolbar
            v-model:show-search="scope.query.show"
            v-model:columns="scope.table.columns"
            :refresh="getList"
          />
        </slot>
      </div>
      <!-- 表格 -->
      <easy-table
        v-model:columns="scope.table.columns"
        v-bind="scope.table"
        v-loading="scope.table.loading"
        ref="tableRef"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <slot v-bind="scope" name="table" />
      </easy-table>
      <!-- 分页 -->
      <pagination
        v-model:currentPage="scope.pagination.currentPage"
        v-model:pageSize="scope.pagination.pageSize"
        v-bind="scope.pagination"
        @change="getList"
      />
    </div>
    <!-- 弹窗 -->
    <easy-dialog
      v-if="$slots.form"
      v-model="scope.dialog.open"
      v-bind="scope.dialog"
      :title="title"
      @closed="closedDialog"
    >
      <easy-form v-model="scope.form.data" v-bind="scope.form" ref="formRef">
        <slot v-bind="scope" name="form" />
      </easy-form>
    </easy-dialog>
  </div>
</template>
