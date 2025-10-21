<script name="Dict" setup>
import { $tm } from '@/locales'
import { addDict, delDict, getDict, listDict, updateDict } from '@api/system/dict'
import dict from '@plugins/dict'
import DictDataDialog from './components/DictDataDialog'

const options = dict.all(['status'])
const langOptions = $tm('settings.system.children.language.options')

const config = reactive({
  api: {
    list: listDict,
    get: getDict,
    add: addDict,
    update: updateDict,
    del: delDict,
  },
  query: {
    data: {
      name: '',
      type: '',
      locale: '',
      status: '',
    },
  },
  dialog: {
    title: '字典表',
    width: '600px',
  },
  form: {
    data: {
      id: '',
      name: '',
      type: '',
      locale: '',
      status: '0',
      remark: '',
    },
    rules: {
      name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
      type: [{ required: true, message: '请输入字典键', trigger: 'blur' }],
    },
  },
})

const dictDataDialog = reactive({
  open: false,
  data: {},
})

function openDictDataDialog(row) {
  dictDataDialog.open = true
  dictDataDialog.data = row
}
</script>

<template>
  <div class="m20px app-card">
    <easy-table-pro :config="config">
      <!-- 查询 -->
      <template #query="{ query, getList }">
        <el-form-item prop="name" label="字典名称">
          <el-input
            v-model="query.data.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
        <el-form-item prop="key" label="字典类型">
          <el-input
            v-model="query.data.key"
            placeholder="请输入字典类型"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
        <el-form-item prop="locale" label="字典语言">
          <el-select v-model="query.data.locale" placeholder="请选择字典语言" clearable>
            <el-option
              v-for="(label, value) in langOptions"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="query.data.status" placeholder="请选择字典状态" clearable>
            <el-option
              v-for="{ value, label } in options.status"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
      </template>
      <!-- 工具栏 -->
      <template #toolbar="{ query, table, getList, openDialog, deleteItems, printTable }">
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
          @click="deleteItems(table.selections)"
        />
        <easy-button
          :disabled="table.selections.length !== 1"
          t="common.update"
          type="info"
          i="edit"
          size="small"
          plain
          @click="openDialog(table.selections[0])"
        />
        <table-toolbar
          v-model:show-search="query.show"
          v-model:columns="table.columns"
          :refresh="getList"
          :print="printTable"
        />
      </template>
      <!-- 表格 -->
      <template #table="{ openDialog, deleteItems }">
        <el-table-column width="40" type="selection" />
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column min-width="100" prop="name" label="字典名称" />
        <el-table-column min-width="160" prop="type" label="字典类型">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDictDataDialog(row)">
              {{ row.type }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="locale" label="字典语言">
          <template #default="{ row }">
            {{ langOptions[row.locale] }}
          </template>
        </el-table-column>
        <el-table-column width="100" prop="status" label="字典状态">
          <template #default="{ row }">
            <el-tag :type="['success', 'danger'][row.status]">
              {{ options.status?.find(option => `${option.value}` === `${row.status}`)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100" hidden prop="createBy" label="创建者" />
        <el-table-column
          width="180"
          :formatter="row => $parseTime(row.createTime)"
          prop="createTime"
          label="创建时间"
          sortable
        />
        <el-table-column width="100" hidden prop="updateBy" label="更新者" />
        <el-table-column
          width="180"
          hidden
          :formatter="row => $parseTime(row.createTime)"
          prop="updateTime"
          label="更新时间"
          sortable
        />
        <el-table-column hidden prop="remark" label="备注" />
        <el-table-column width="180" :label="$t('common.operation')" fixed="right">
          <template #default="{ row }">
            <easy-button type="primary" i="edit" t="common.update" link @click="openDialog(row)" />
            <easy-button
              type="primary"
              i="delete"
              t="common.delete"
              link
              @click="deleteItems(row)"
            />
          </template>
        </el-table-column>
      </template>
      <!-- 弹窗 -->
      <template #form="{ form }">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.data.name" placeholder="请输入字典名称" clearable />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="form.data.type" placeholder="请输入字典类型" clearable />
        </el-form-item>
        <el-form-item label="字典语言" prop="type">
          <el-select v-model="form.data.locale" placeholder="请选择字典语言" clearable>
            <el-option
              v-for="(label, value) in langOptions"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.data.status">
            <el-radio v-for="{ value, label } in options.status" :key="value" :value="value">
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.data.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </template>
    </easy-table-pro>
    <DictDataDialog v-model="dictDataDialog.open" :data="dictDataDialog.data" />
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped></style>
