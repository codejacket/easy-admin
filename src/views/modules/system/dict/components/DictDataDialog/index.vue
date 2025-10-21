<script name="DictDataDialog" setup>
import {
  listDictData,
  getDictData,
  addDictData,
  updateDictData,
  delDictData,
} from '@api/system/dict'
import dict from '@plugins/dict'

const modelValue = defineModel({ default: false })
const props = defineProps({
  data: {
    type: Object,
  },
})

const options = dict.all(['status'])

const config = reactive({
  api: {
    list: listDictData,
    get: getDictData,
    add: addDictData,
    update: updateDictData,
    del: delDictData,
  },
  query: {
    data: {
      dictId: '',
    },
  },
  dialog: {
    width: '600px',
  },
  form: {
    data: {
      id: '',
      dictId: '',
      label: '',
      value: '',
      order: 0,
      status: '0',
      remark: '',
    },
    rules: {},
  },
})

watch(modelValue, newVal => {
  if (newVal) {
    config.query.data.dictId = props.data.id
    config.form.data.dictId = props.data.id
  }
})
</script>

<template>
  <easy-dialog width="800" v-model="modelValue" :title="`字典数据 <${data.name}>`" destroy-on-close>
    <easy-table-pro class="easy-table-pro" :config="config">
      <template #toolbar="{ table, openDialog, getList, deleteItems }">
        <easy-button
          type="primary"
          i="plus"
          t="common.add"
          size="small"
          plain
          @click="openDialog"
        />
        <easy-button
          type="danger"
          i="delete"
          t="common.delete"
          size="small"
          plain
          @click="deleteItems(table.selections)"
        />
        <table-toolbar v-model:columns="table.columns" :refresh="getList" />
      </template>
      <template #table="{ openDialog, deleteItems }">
        <el-table-column width="40" type="selection" />
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="order" label="排序" />
        <el-table-column width="100" prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="['success', 'danger'][row.status]">
              {{ options.status.find(option => `${option.value}` === `${row.status}`)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100" hidden prop="createBy" label="创建者" />
        <el-table-column
          width="180"
          hidden
          :formatter="row => $parseTime(row.createTime)"
          prop="createTime"
          label="创建时间"
        />
        <el-table-column width="100" hidden prop="updateBy" label="更新者" />
        <el-table-column
          width="180"
          hidden
          :formatter="row => $parseTime(row.createTime)"
          prop="updateTime"
          label="更新时间"
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
      <template #form="{ form }">
        <el-form-item prop="label" label="数据标签">
          <el-input v-model="form.data.label" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item prop="value" label="数据键值">
          <el-input v-model="form.data.value" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item prop="order" label="排序">
          <el-input-number v-model="form.data.order" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="form.data.status">
            <el-radio v-for="{ value, label } in options.status" :value="value" :key="value">
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="form.data.remark" type="textarea" />
        </el-form-item>
      </template>
    </easy-table-pro>
  </easy-dialog>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.easy-table-pro {
  :deep(.flex-col) {
    padding-top: 0;
  }
}
</style>
