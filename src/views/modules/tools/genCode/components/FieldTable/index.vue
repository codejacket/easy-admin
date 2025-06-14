<template>
    <div class="field-table flex-column g14">
        <div class="flex">
            <easy-button type="primary" i="plus" t="common.add" size="small" plain @click="handleAdd" />
            <easy-button type="danger" i="delete" t="common.delete" size="small" plain @click="handleDelete(fieldOrders)" />
        </div>
        <easy-table ref="table-ref" v-bind="$attrs" v-model:columns="columns" :drag-options="dragOptions" 
            @selection-change="handleSelect">
            <el-table-column type="selection" width="40" fixed="left" />
            <el-table-column type="index" label="序号" width="60" fixed="left" />
            <el-table-column prop="fieldName" label="字段名称" width="160" fixed="left">
                <template #default="{ row }">
                    <lazy-select v-model="row.fieldName" placeholder="请选择字段名称" :options="toOptions(tableFields)" />
                </template>
            </el-table-column>
            <el-table-column prop="fieldDesc" label="字段描述" width="160">
                <template #default="{ row }">
                    <el-input v-model="row.fieldDesc" placeholder="请输入字段描述" />
                </template>
            </el-table-column>
            <el-table-column prop="isList" label="列表" width="60">
                <template #default="{ row }">
                    <el-checkbox v-model="row.isList" />
                </template>
            </el-table-column>
            <el-table-column prop="isSort" label="排序" width="60">
                <template #default="{ row }">
                    <el-checkbox v-model="row.isSort" />
                </template>
            </el-table-column>
            <el-table-column prop="isInsert" label="插入" width="60">
                <template #default="{ row }">
                    <el-checkbox v-model="row.isInsert" />
                </template>
            </el-table-column>
            <el-table-column prop="isEdit" label="编辑" width="60">
                <template #default="{ row }">
                    <el-checkbox v-model="row.isEdit" />
                </template>
            </el-table-column>
            <el-table-column prop="isRequire" label="必填" width="60">
                <template #default="{ row }">
                    <el-checkbox v-model="row.isRequire" />
                </template>
            </el-table-column>
            <el-table-column prop="isQuery" label="查询" width="60">
                <template #default="{ row }">
                    <el-checkbox v-model="row.isQuery" />
                </template>
            </el-table-column>
            <el-table-column prop="queryMethod" label="查询方法" width="120">
                <template #default="{ row }">
                    <lazy-select v-model="row.queryMethod" placeholder="请选择查询方法" :options="toOptions(queryMethodList)" />
                </template>
            </el-table-column>
            <el-table-column prop="dictId" label="关联字典" width="160">
                <template #default="{ row }">
                    <lazy-select v-model="row.dictId" placeholder="请选择关联的字典" :loadOptions="loadDict" clearable>
                        <template #option="{ option }">
                            <span style="float: left;">{{ option.label }}</span>
                            <span style="float: right; opacity: 0.7; transform: translateX(12px);">{{ option.key }}</span>
                        </template>
                    </lazy-select>
                </template>
            </el-table-column>
            <el-table-column prop="tableName" label="数据表" width="160">
                <template #default="{ row }">
                    <lazy-select v-model="row.tableName" placeholder="请选择数据表" :options="toOptions(tableNameList)" />
                </template>
            </el-table-column>
            <el-table-column prop="tableJoinField" label="数据表的连接字段" width="160">
                <template #default="{ row }">
                    <lazy-select v-model="row.tableJoinField" placeholder="请选择连接字段" :loadOptions="loadTableFields(row.tableName)" />
                </template>
            </el-table-column>
            <el-table-column prop="tableShowField" label="数据表的展示字段" width="160">
                <template #default="{ row }">
                    <lazy-select v-model="row.tableShowField" placeholder="请选择展示字段" :loadOptions="loadTableFields(row.tableName)" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('common.operation')" width="180" fixed="right">
                <template #default="{ row, $index }">
                    <easy-button type="primary" i="drag" class="handle-drag" :title="$t('common.drag')" link />
                    <easy-button type="primary" i="edit" t="common.edit" link @click="handleEdit(row, $index)" />
                    <easy-button type="primary" i="delete" t="common.delete" link @click="handleDelete($index)" />
                </template>
            </el-table-column>
        </easy-table>
        <easy-dialog :title="dialog.title" height="600px" v-model="dialog.open" :confirm="handleConfirm">
            <easy-form v-model="dialog.form" :rules="dialog.rules">
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item prop="fieldName" label="字段名称">
                            <el-select v-model="dialog.form.fieldName" placeholder="请选择字段名称">
                                <el-option v-for="field in tableFields" :key="field" :label="field" :value="field" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="fieldDesc" label="字段描述">
                            <el-input v-model="dialog.form.fieldDesc" placeholder="请输入字段描述" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item prop="fieldType" label="字段类型">
                            <el-select v-model="dialog.form.fieldType" placeholder="请选择字段类型">
                                <el-option v-for="fieldType in fieldTypeList" :value="fieldType" :label="fieldType" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="fieldJavaType" label="Java类型">
                            <el-select v-model="dialog.form.fieldJavaType" placeholder="请选择字段Java类型">
                                <el-option v-for="fieldJavaType in fieldJavaTypeList" :value="fieldJavaType" :label="fieldJavaType" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item prop="dictId" label="关联字典">
                            <lazy-select v-model="dialog.form.dictId" placeholder="请选择关联的字典" :loadOptions="loadDict" clearable>
                                <template #option="{ option }">
                                    <span style="float: left;">{{ option.label }}</span>
                                    <span style="float: right; opacity: 0.7; transform: translateX(12px);">{{ option.key }}</span>
                                </template>
                            </lazy-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="" label="" />
                    </el-col>
                </el-row>
                <el-divider border-style="dotted" />
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item label="查询配置">
                            <div class="padding-left-12">
                                <el-checkbox v-model="dialog.form.isQuery">展示</el-checkbox>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="compQuery" label="渲染组件">
                            <el-select v-model="dialog.form.compQuery"></el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item prop="queryMethod" label="查询方法">
                            <el-select v-model="dialog.form.queryMethod" placeholder="请选择查询方法">
                                <el-option v-for="queryMethod in queryMethodList" :value="queryMethod" :label="queryMethod" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11"></el-col>
                </el-row>
                <el-divider border-style="dotted" />
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item label="列表配置">
                            <div class="padding-left-12">
                                <el-checkbox v-model="dialog.form.isList">展示</el-checkbox>
                                <el-checkbox v-model="dialog.form.isSort">排序</el-checkbox>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="compList" label="渲染组件">
                            <el-select v-model="dialog.form.compList"></el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-divider border-style="dotted" />
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item label="表单配置">
                            <div class="padding-left-12">
                                <el-checkbox v-model="dialog.form.isInsert">插入</el-checkbox>
                                <el-checkbox v-model="dialog.form.isEdit">编辑</el-checkbox>
                                <el-checkbox v-model="dialog.form.isRequire">必填</el-checkbox>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="compForm" label="渲染组件">
                            <el-select v-model="dialog.form.compForm"></el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-divider border-style="dotted" />
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item prop="tableName" label="数据源表">
                            <el-select v-model="dialog.form.tableName" placeholder="请选择数据源表">
                                <el-option v-for="tableName in tableNameList" :key="tableName" :value="tableName" :label="tableName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="tableJoinField" label="连接字段">
                            <lazy-select v-model="dialog.form.tableJoinField" placeholder="请选择数据连接字段" 
                                :loadOptions="loadTableFields(dialog.form.tableName)" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item prop="tableShowField" label="展示字段">
                            <lazy-select v-model="dialog.form.tableShowField" placeholder="请选择数据展示字段" 
                                :loadOptions="loadTableFields(dialog.form.tableName)" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </easy-form>
        </easy-dialog>
    </div>
</template>

<script>
import { listDbTableName, listDbTableField } from '@api/tools/genCode'
import { list } from '@api/system/dict'
import { remove } from 'lodash'
import LazySelect from '../LazySelect'
export default {
    name: 'FieldTable',
    components: { LazySelect },
    props: {
        tableFields: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            editIndex: 0,
            columns: [],
            fieldOrders: [],
            tableNameList: [],
            queryMethodList: ['=', '!=', '>', '<', '>=', '<=', 'like', 'between'],
            fieldTypeList: ['varchar', 'int', 'tinyint', 'double', 'datetime'],
            fieldJavaTypeList: ['String', 'Integer', 'Boolean', 'Double', 'Date'],
            dragOptions: {
                animation: 150,
                handle: '.handle-drag',
                disabled: false,
            },
            dialog: {
                open: false,
                title: '',
                form: {
                    fieldName: '',
                    fieldDesc: '',
                    fieldType: 'varchar',
                    fieldJavaType: 'String',
                    dictId: '',
                    isQuery: false,
                    queryMethod: '',
                    isList: true,
                    isSort: false,
                    isInsert: true,
                    isEdit: true,
                    isRequire: false,
                    compQuery: '',
                    compList: '',
                    compForm: '',
                    tableName: '',
                    tableJoinField: '',
                    tableShowField: '',
                },
                rules: {
                    fieldName: [
                        { required: true, message: '字段名称不能为空', trigger: 'blur' }
                    ],
                }
            }
        }
    },
    async created() {
        let { data } = await listDbTableName()
        this.tableNameList = data
    },
    methods: {
        handleEdit(row, index) {
            this.editIndex = index
            this.dialog.form = JSON.parse(JSON.stringify(row))
            this.dialog.title = '编辑字段'
            this.dialog.open = true
        },
        handleConfirm() {
            this.$attrs.data[this.editIndex] = JSON.parse(JSON.stringify(this.dialog.form))
            this.editIndex = 0
        },
        handleAdd() {
            this.dialog.title = '新增字段'
            this.dialog.open = true
        },
        handleDelete(row) {
            if (Array.isArray(row)) {
                remove(this.$attrs.data, item => this.fieldOrders.includes(item.fieldOrder))
                this.fieldOrders = []
                this.$refs['table-ref'].clearSelection()
            } else if (Number.isInteger(row)) {
                this.$attrs.data.splice(row, 1)
            }
        },
        handleSelect(selection) {
            this.fieldOrders = selection.map(field => field.fieldOrder)
        },
        toOptions(list) {
            return list.map(item => ({ label: item, value: item }))
        },
        loadTableFields(tableName) {
            return async () => {
                const { data } = await listDbTableField(tableName)
                return data.map(item => {
                    return {
                        label: item.columnName,
                        value: item.columnName,
                    }
                })
            }
        },
        async loadDict() {
            let { data } = await list({
                currentPage: 1,
                pageSize: 1000,
                query: {}
            })
            return data.list?.map?.(item => {
                return {
                    label: item.name,
                    key: item.key,
                    value: item.id,
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.field-table {
    height: 100%;
}

.el-form {
    padding: 10px 20px 0 20px;
}

.padding-left-12 {
    width: 100%;
    padding-left: 10px;
}

.el-divider {
    margin: 2px 0 20px 0;
    :deep(.el-divider__text) {
        opacity: 0.7;
        cursor: default;
    }
}
</style>