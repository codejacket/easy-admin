<script name="Role" setup>
import { arrayToTree } from '@/utils/tree'
import { listAuth, listMenu } from '@api/system/menu'
import { addRole, delRole, getRole, listRole, updateRole } from '@api/system/role'
import dict from '@plugins/dict'

const options = dict.all(['status'])

// 全选/全不选
const selectAll = ref(false)
// 展开/折叠
const expandAll = ref(false)
// 父子联动
const noCheckStrictly = ref(true)

const menuTree = ref([])
const menuRef = useTemplateRef('menuRef')

const config = reactive({
  api: {
    list: listRole,
    get: getRole,
    add: addRole,
    update: updateRole,
    del: delRole,
  },
  query: {
    data: {
      name: '',
      status: '',
      createTime: '',
    },
  },
  dialog: {
    title: '角色',
    async openedDialog() {
      const {
        data: { list: menuList },
      } = await listMenu({ currentPage: 1, pageSize: 10000 })
      const {
        data: { list: authList },
      } = await listAuth({ currentPage: 1, pageSize: 10000 })
      menuTree.value = arrayToTree(menuList, ({ id, title, icon, disabled, children }) => {
        let auths = authList.filter(auth => auth.menuId === id)
        return { id, label: title, icon, disabled, children, auths }
      })
    },
  },
  form: {
    data: {
      id: '',
      name: '',
      status: '',
      menus: [],
      auths: [],
      remark: '',
    },
    rules: {},
  },
})

function handleSelectAll(val) {
  menuRef.value.setCheckedNodes(val ? menuTree.value : [])
}

function handleExpandAll(val) {
  for (const node of menuTree.value) {
    menuRef.value.store.nodesMap[node.id].expanded = val
  }
}
</script>

<template>
  <div class="m20px app-card">
    <easy-table-pro :config="config">
      <template #query="{ query, getList }">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="query.data.name" placeholder="请输入角色名称" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="query.data.status" placeholder="请选择角色状态">
            <el-option
              v-for="{ value, label } in options.status"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="createTime" label="创建时间">
          <el-date-picker
            v-model="query.data.createTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </template>
      <template #toolbar></template>
      <template #table="{ openDialog, deleteItems }">
        <el-table-column width="40" type="selection" />
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column width="100" prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="['success', 'danger'][row.status]">
              {{ options['status'].find?.(option => `${option.value}` === `${row.status}`)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column hidden prop="createBy" label="创建人" />
        <el-table-column
          width="180"
          hidden
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
      <template #form="{ form }">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="form.data.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="form.data.status">
            <el-radio v-for="{ value, label } in options.status" :key="value" :value="value">
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="selectAll" @change="handleSelectAll">全选/全不选</el-checkbox>
          <el-checkbox v-model="expandAll" @change="handleExpandAll">展开/折叠</el-checkbox>
          <el-checkbox v-model="noCheckStrictly">父子联动</el-checkbox>
          <el-tree
            class="menu-tree"
            :data="menuTree"
            :check-strictly="!noCheckStrictly"
            :expand-on-click-node="false"
            :default-checked-keys="form.data.menus"
            ref="menuRef"
            node-key="id"
            show-checkbox
            @check="(_, binding) => (form.data.menus = binding.checkedKeys)"
          />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="form.data.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </template>
    </easy-table-pro>
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.menu-tree {
  width: 100%;
  padding: 4px 0;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
