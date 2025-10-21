<script name="AuthDialog" setup>
import { listAuth, addAuth, delAuth, getAuth, updateAuth } from '@api/system/menu'
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
    list: listAuth,
    get: getAuth,
    add: addAuth,
    update: updateAuth,
    del: delAuth,
  },
  query: {
    data: {
      menuId: '',
    },
  },
  form: {
    data: {
      id: '',
      menuId: '',
      name: '',
      key: '',
      status: '',
      remark: '',
    },
    rules: {},
  },
})

watch(modelValue, val => {
  if (val) {
    config.query.data.menuId = props.data.id
    config.form.data.menuId = props.data.id
  }
})
</script>

<template>
  <easy-dialog width="800" v-model="modelValue" :title="`权限 <${data.title}>`" destroy-on-close>
    <easy-table-pro class="easy-table-pro" :config="config">
      <template #toolbar="{ table, openDialog, getList, deleteItems }"></template>
      <template #table="{ openDialog, deleteItems }">
        <el-table-column width="40" type="selection" />
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column width="120" prop="name" label="权限名称" />
        <el-table-column prop="key" label="权限标识" />
        <el-table-column prop="status" label="状态">
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
        <el-form-item prop="name" label="权限名称">
          <el-input v-model="form.data.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item prop="key" label="权限标识">
          <el-input v-model="form.data.key" placeholder="请输入权限标识" />
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

<style lang="scss" scoped>
.easy-table-pro {
  :deep(.flex-col) {
    padding-top: 0;
  }
}
</style>
