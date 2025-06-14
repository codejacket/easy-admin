<template>
    <div class="m20 app-card">
        <easy-table-pro :config="config">
            <!-- 查询 -->
            <template #query="{ query, getList }">
                <el-form-item prop="name" label="字典名称">
                    <el-input v-model="query.data.name" placeholder="请输入名称" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="key" label="键名">
                    <el-input v-model="query.data.key" placeholder="请输入字典键名" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-select v-model="query.data.status" placeholder="请选择字典状态" clearable>
                        <el-option label="正常" value="0" />
                        <el-option label="停用" value="1" />
                    </el-select>
                </el-form-item>
            </template>
            <!-- 工具栏 -->
            <template #toolbar="{ query, table, openDialog, getList, deleteItems, printTable }">
                <easy-button type="primary" i="plus" t="common.add" size="small" plain @click="openDialog" />
                <easy-button type="danger" i="delete" t="common.delete" size="small" plain @click="deleteItems(table.selections)" />
                <easy-button type="info" i="edit" t="common.update" size="small" :disabled="table.selections.length !== 1" plain
                    @click="openDialog(table.selections[0])" />
                <table-toolbar v-model:show-search="query.show" v-model:columns="table.columns" @print="printTable" @refresh="getList" />
            </template>
            <!-- 表格 -->
            <template #table="{ openDialog, deleteItems }">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="id" label="编号" width="60" />
                <el-table-column prop="name" label="字典名称" min-width="100" />
                <el-table-column prop="key" label="字典键名" min-width="160">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openDictDataDialog(row)">{{ row.key }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="字典状态" width="100">
                    <template #default="{ row: { status } }">
                        <el-tag :type="status === '1' ? 'danger' : 'success'">
                            {{ status === '1' ? '停用' : '正常' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建者" width="100" hidden />
                <el-table-column prop="createTime" label="创建时间" :formatter="row => $parseTime(row.createTime)" width="180" sortable />
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
            <!-- 弹窗 -->
            <template #form="{ form }">
                <el-form-item label="字典名称" prop="name">
                    <el-input v-model="form.data.name" placeholder="请输入字典名称" clearable />
                </el-form-item>
                <el-form-item label="字典键名" prop="key">
                    <el-input v-model="form.data.key" placeholder="请输入字典键名" clearable />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.data.status">
                        <el-radio value="0">正常</el-radio>
                        <el-radio value="1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.data.remark" type="textarea" placeholder="请输入备注" />
                </el-form-item>
            </template>
        </easy-table-pro>
        <dict-data-dialog ref="dict-data-dialog" />
    </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import DictDataDialog from './components/DictDataDialog'
import { list, get, add, update, del } from '@api/system/dict'

export default {
    name: 'Dict',
    components: { DictDataDialog },
    data() {
        return {
            config: {
                api: { list, get, add, update, del },
                query: {
                    data: {
                        name: '',
                        key: '',
                        status: ''
                    }
                },
                dialog: {
                    title: '字典表',
                    width: '500px',
                },
                form: {
                    data: {
                        id: '',
                        name: '',
                        key: '',
                        status: '0',
                        remark: ''
                    },
                    rules: {
                        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
                        key: [{ required: true, message: '请输入字典键', trigger: 'blur' }]
                    }
                }
            }
        }
    },
    methods: {
        async openDictDataDialog(row) {
            this.$refs['dict-data-dialog'].openDialog(row)
        }
    }
}
</script>