<script name="User" setup>
import { validEmail, validPhoneNumber } from '@/utils/validate'
import { listRole } from '@api/system/role'
import { addUser, delUser, getUser, listUser, updateUser } from '@api/system/user'
import dict from '@plugins/dict'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const options = dict.all(['gender', 'status'])
const roleOptions = ref([])
const config = reactive({
  api: {
    list: listUser,
    get: getUser,
    add: addUser,
    update: updateUser,
    del: delUser,
  },
  query: {
    data: {
      username: '',
      nickname: '',
      gender: '',
      email: '',
      phoneNumber: '',
      status: '',
    },
  },
  dialog: {
    async openedDialog() {
      const { data } = await listRole()
      roleOptions.value = data.list.map(role => ({ label: role.name, value: role.id }))
    },
  },
  form: {
    data: {
      username: '',
      nickname: '',
      phoneNumber: '',
      email: '',
      gender: '0',
      status: '0',
      roles: [],
      password: '',
      brief: '',
      remark: '',
    },
    rules: {
      username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度需在 6 到 20 个字符之间', trigger: 'blur' },
        {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            // 长度6 ~ 20, 必须包含: 数字、 字母, 且不能包含空格
            const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).+$/
            if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('密码必须包含数字和字母，不能包含空格'))
            }
          },
        },
      ],
      phoneNumber: [
        {
          trigger: 'blur',
          validator(rule, value, callback) {
            if (!validPhoneNumber(value)) {
              callback(new Error('手机号输入错误'))
            } else {
              callback()
            }
          },
        },
      ],
      email: [
        {
          trigger: 'blur',
          validator(rule, value, callback) {
            if (validEmail(value)) {
              callback()
            } else {
              callback(new Error('邮箱输入错误'))
            }
          },
        },
      ],
    },
  },
})

const imageViewer = reactive({
  open: false,
  urlList: [],
})

function showPreview(row) {
  if (row.avatar) {
    imageViewer.open = true
    imageViewer.urlList = [row.avatar]
  }
}
</script>

<template>
  <div class="m20px app-card">
    <easy-table-pro :config="config">
      <!-- 查询 -->
      <template #query="{ query, getList }">
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="query.data.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
        <el-form-item prop="nickname" label="昵称">
          <el-input
            v-model="query.data.nickname"
            placeholder="请输入昵称"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-select v-model="query.data.gender" placeholder="请选择性别" clearable>
            <el-option
              v-for="{ value, label } in options.gender"
              :value="value"
              :label="label"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            v-model="query.data.email"
            placeholder="请输入邮箱"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
        <el-form-item prop="phoneNumber" label="手机号">
          <el-input
            v-model="query.data.phoneNumber"
            placeholder="请输入手机号"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="query.data.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="{ value, label } in options.status"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>
      </template>
      <template #toolbar="{ query, table, openDialog, deleteItems, printTable, getList }">
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
        <table-toolbar
          v-model:show-search="query.show"
          v-model:columns="table.columns"
          :refresh="getList"
          :print="printTable"
        />
      </template>
      <template #table="{ deleteItems, openDialog }">
        <el-table-column width="40" type="selection" noPrint />
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column width="80" :show-overflow-tooltip="false" prop="avatar" label="头像">
          <template #default="{ row }">
            <el-avatar
              class="absolute top-50% left-50% transform-translate--50% cursor-pointer"
              :size="32"
              :src="row.avatar"
              alt="avatar"
              @click="showPreview(row)"
            >
              <img src="@/assets/img/default-avatar.png" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column min-width="160" prop="username" label="用户名" align="left" />
        <el-table-column width="160" prop="nickname" label="昵称" />
        <el-table-column width="100" prop="gender" label="性别" sortable>
          <template #default="{ row }">
            <el-tag :type="['primary', 'danger'][row.gender]">
              {{ options.gender.find(option => `${option.value}` === `${row.gender}`)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="160" prop="email" label="邮箱" />
        <el-table-column width="160" prop="phoneNumber" label="电话" />
        <el-table-column width="100" prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="['success', 'danger'][row.status]">
              {{ options.status.find(option => `${option.value}` === `${row.status}`)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          hidden
          :formatter="row => $parseTime(row.createTime)"
          prop="createTime"
          label="注册时间"
          sortable
        />
        <el-table-column width="180" :label="$t('common.operation')" fixed="right" noPrint>
          <template #default="{ row }">
            <easy-button t="common.update" type="primary" i="edit" link @click="openDialog(row)" />
            <easy-button
              t="common.delete"
              type="primary"
              i="delete"
              link
              @click="deleteItems(row)"
            />
          </template>
        </el-table-column>
      </template>
      <template #form="{ form, dialog }">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.data.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="form.data.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="!dialog.isEdit" prop="password" label="密码">
          <el-input v-model="form.data.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-radio-group class="ml6px" v-model="form.data.gender">
            <el-radio :value="0">男 <svg-icon icon="male" /></el-radio>
            <el-radio :value="1">女 <svg-icon icon="female" /></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="phoneNumber" label="手机号">
          <el-input v-model="form.data.phoneNumber" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.data.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item prop="roles" label="角色">
          <el-select v-model="form.data.roles" placeholder="请选择角色" multiple>
            <el-option
              v-for="option in roleOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group class="ml6px" v-model="form.data.status">
            <el-radio v-for="{ value, label } in options.status" :key="value" :value="value">
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="brief" label="简介">
          <el-input
            v-model="form.data.brief"
            :rows="3"
            :placeholder="t('placeholder.brief')"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </template>
    </easy-table-pro>
    <!-- 预览图片 -->
    <el-image-viewer
      v-if="imageViewer.open"
      :url-list="imageViewer.urlList"
      @close="imageViewer.open = false"
    />
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped></style>
