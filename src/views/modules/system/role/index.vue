<template>
    <div class="m20 app-card">
        <easy-table-pro :config="config">
            <template #query="{ query, getList }">
                <el-form-item prop="name" label="角色名称">
                    <el-input v-model="query.data.name" placeholder="请输入角色名称" @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-select v-model="query.data.status" placeholder="请选择角色状态">
                        <el-option label="正常" value="0" />
                        <el-option label="停用" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="createTime" label="创建时间">
                    <el-date-picker v-model="query.data.createTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
            </template>
            <template #toolbar></template>
            <template #table="{ openDialog, deleteItems }">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="id" label="编号" width="60" />
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'">
                            {{ row.status ? '正常' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建人" hidden />
                <el-table-column prop="createTime" label="创建时间" :formatter="row => $parseTime(row.createTime)" sortable />
                <el-table-column prop="updateBy" label="更新者" width="100" hidden />
                <el-table-column prop="updateTime" label="更新时间" :formatter="row => $parseTime(row.createTime)" width="180" sortable hidden />
                <el-table-column prop="remark" label="备注" hidden />
                <el-table-column :label="$t('common.operation')" width="180" fixed="right">
                    <template #default="{ row }">
                        <easy-button type="primary" i="edit" t="common.update" link @click="openDialog(row)" />
                        <easy-button type="primary" i="delete" t="common.delete" link @click="deleteItems(row)" />
                    </template>
                </el-table-column>
            </template>
            <template #form="{ form }">
                <el-form-item prop="name" label="角色名称">
                    <el-input v-model="form.data.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-radio-group v-model="form.data.status">
                        <el-radio value="0">正常</el-radio>
                        <el-radio value="1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input type="textarea" v-model="form.data.remark" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="菜单权限">
                    <el-checkbox v-model="selectAll" @change="handleSelectAll">全选/全不选</el-checkbox>
                    <el-checkbox v-model="expandAll" @change="handleExpandAll">展开/折叠</el-checkbox>
                    <el-checkbox v-model="noCheckStrictly">父子联动</el-checkbox>
                    <el-tree ref="menu" :data="menuTree" class="menu-tree" node-key="id" :check-strictly="!noCheckStrictly"
                        :expand-on-click-node="false" :default-checked-keys="form.data.menuIds" show-checkbox
                        @check="(_, binding) => form.data.menuIds = binding.checkedKeys" />
                </el-form-item>
            </template>
        </easy-table-pro>
    </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import { list, get, add, update, del } from '@api/system/role'
import { list as listMenu } from '@api/system/menu'
import { arrayToTree } from '@/utils/tree'

export default {
    name: 'Role',
    data() {
        return {
            // 全选/全不选
            selectAll: false,
            // 展开/折叠
            expandAll: false,
            // 父子联动
            noCheckStrictly: true,
            menuTree: [],
            config: {
                api: { list, get, add, update, del },
                query: {
                    data: {
                        name: '',
                        status: '',
                        createTime: ''
                    }
                },
                dialog: {
                    title: '角色',
                    openedDialog: this.onOpenedDialog
                },
                form: {
                    data: {
                        id: '',
                        name: '',
                        status: '',
                        remark: '',
                        menuIds: []
                    },
                    rules: {}
                }
            }
        }
    },
    methods: {
        async onOpenedDialog() {
            const { data } = await listMenu()
            this.menuTree = arrayToTree(data.list, ({ id, title, icon, type, disabled, children }) => {
                return { id, label: title, icon, type, disabled, children }
            })
        },
        handleSelectAll(val) {
            this.$refs['menu'].setCheckedNodes(val ? this.menuTree : [])
        },
        handleExpandAll(val) {
            for (const node of this.menuTree) {
                this.$refs['menu'].store.nodesMap[node.id].expanded = val
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-tree {
    width: 100%;
    padding: 4px 0;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}
</style>