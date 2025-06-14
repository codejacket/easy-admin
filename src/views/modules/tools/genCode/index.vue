<template>
    <div class="m20 app-card">
        <easy-table-pro :config="config">
            <template #query="{ query, getList }">
                <el-form-item prop="tableName" label="表名称">
                    <el-input v-model="query.data.tableName" placeholder="请输入表名称" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="tableComment" label="表描述">
                    <el-input v-model="query.data.tableComment" placeholder="请输入表描述" clearable @keyup.enter="getList" />
                </el-form-item>
            </template>
            <template #toolbar="{ query, table, getList, openDialog, deleteItems }">
                <easy-button type="primary" i="plus" t="common.add" size="small" plain @click="openDialog" />
                <easy-button type="danger" i="delete" t="common.delete" size="small" plain
                    @click="deleteItems(table.selections)" />
                <easy-button type="warning" i="to-bottom" t="生成" size="small" plain
                    @click="handleDownloadCode(table.selections)" />
                <table-toolbar v-model:show-search="query.show" v-model:columns="table.columns" @refresh="getList" />
            </template>
            <template #table="{ openDialog, deleteItems }">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="id" label="编号" width="60" />
                <el-table-column prop="tableName" label="表名称" width="160" />
                <el-table-column prop="tableComment" label="表描述" align="left" />
                <el-table-column prop="createBy" label="创建者" width="100" hidden />
                <el-table-column prop="createTime" label="创建时间" :formatter="row => $parseTime(row.createTime)"
                    width="180" sortable />
                <el-table-column prop="updateBy" label="更新者" width="100" hidden />
                <el-table-column prop="updateTime" label="更新时间" :formatter="row => $parseTime(row.createTime)"
                    width="180" sortable hidden />
                <el-table-column prop="remark" label="备注" hidden />
                <el-table-column :label="$t('common.operation')" width="360" fixed="right">
                    <template #default="{ row }">
                        <easy-button type="primary" i="preview-open" t="预览" link @click="handlePreview(row)" />
                        <easy-button type="primary" i="code" t="代码" link @click="handlePreviewCode(row)" />
                        <easy-button type="primary" i="to-bottom" t="生成" link @click="handleDownloadCode(row)" />
                        <easy-button type="primary" i="edit" t="common.edit" link @click="openDialog(row)" />
                        <easy-button type="primary" i="delete" t="common.delete" link @click="deleteItems(row)" />
                    </template>
                </el-table-column>
            </template>
            <template #form="{ form }">
                <el-tabs class="tabs" v-model="currentTab">
                    <el-tab-pane label="基本信息" name="basicInfo">
                        <div class="base-info-form">
                            <el-form-item prop="tableName" label="表名称">
                                <el-input v-model="form.data.tableName" placeholder="请输入表名称" :readonly="true">
                                    <template #append>
                                        <easy-button i="to-bottom" t="common.import" @click="importTable.open = true" />
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="tableComment" label="表描述">
                                <el-input v-model="form.data.tableComment" placeholder="请输入表描述" :readonly="true" />
                            </el-form-item>
                            <el-form-item prop="className" label="实体类名称">
                                <el-input v-model="form.data.className" placeholder="请输入实体类名称" />
                            </el-form-item>
                            <el-form-item label="作者">
                                <el-input v-model="form.data.author" placeholder="请输入作者" />
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input v-model="form.data.remark" type="textarea" placeholder="请输入备注" :rows="3" />
                            </el-form-item>
                        </div>
                        <import-table v-model="importTable.open" :loading="importTable.loading"
                            @import="handleImport($event, form.data)" />
                    </el-tab-pane>
                    <el-tab-pane label="字段信息" name="fieldsInfo">
                        <field-table :data="form.data.fields" :table-fields="currentTableFields" />
                    </el-tab-pane>
                    <el-tab-pane label="生成信息" name="genInfo">
                        <div class="gen-info">
                            <el-form-item prop="moduleName" label="模块名称">
                                <el-input v-model="form.data.moduleName" placeholder="请输入模块名称" />
                            </el-form-item>
                            <el-form-item prop="packageName" label="包名称">
                                <el-input v-model="form.data.packageName" placeholder="请输入包名称" />
                            </el-form-item>
                            <el-form-item prop="businessName" label="业务名称">
                                <el-input v-model="form.data.businessName" placeholder="请输入业务名称" />
                            </el-form-item>
                            <el-form-item prop="chineseName" label="中文名称">
                                <el-input v-model="form.data.chineseName" placeholder="请输入中文名称" />
                            </el-form-item>
                            <el-form-item prop="parentMenuId" label="上级菜单">
                                <el-tree-select v-model="form.data.parentMenuId" :data="catalog" placeholder="选择上级菜单"
                                    :props="{ value: 'id', label: 'title', class: () => 'el-tree-select-node' }"
                                    check-strictly highlight-current>
                                    <template #default="{ data }">
                                        {{ data.title }}
                                        <span v-if="data.hasChild" style="opacity: 0.5">
                                            ({{ data.children?.length }})
                                        </span>
                                    </template>
                                </el-tree-select>
                            </el-form-item>
                            <el-form-item label="生成配置">
                                <div class="checkbox-item">
                                    <el-checkbox v-model="form.data.frontEnd" label="生成前端" />
                                    <el-checkbox v-model="form.data.backEnd" label="生成后端" />
                                    <el-checkbox v-model="form.data.mock" label="生成mock" />
                                </div>
                            </el-form-item>
                            <el-form-item label="自动化配置">
                                <div class="checkbox-item">
                                    <el-checkbox v-model="form.data.syncSchema" label="同步表结构" />
                                    <el-checkbox v-model="form.data.autoCreateMenu" label="自动创建菜单" />
                                </div>
                            </el-form-item>
                            <el-form-item label="页面功能">
                                <div class="checkbox-item">
                                    <el-checkbox v-model="form.data.isPrint" label="打印" />
                                    <el-checkbox v-model="form.data.isImport" label="导入" />
                                    <el-checkbox v-model="form.data.isExport" label="导出" />
                                </div>
                            </el-form-item>
                            <el-form-item prop="schema" label="表结构">
                                <div class="checkbox-item">
                                    <el-radio-group v-model="form.data.schema">
                                        <el-radio value="single">单表结构</el-radio>
                                        <el-radio value="tree">树形结构</el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                            <el-form-item prop="downloadMethod" label="下载方式">
                                <div class="checkbox-item">
                                    <el-radio-group v-model="form.data.downloadMethod">
                                        <el-radio value="zip">zip压缩包</el-radio>
                                        <el-radio value="custom">自定义路径</el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                            <el-form-item />
                        </div>
                        <transition name="el-zoom-in-bottom">
                            <div class="else-info"
                                v-if="form.data.schema === 'tree' || form.data.downloadMethod === 'custom'">
                                <el-divider>其他信息</el-divider>
                                <el-row justify="space-around" v-if="form.data.schema === 'tree'">
                                    <el-col :span="10">
                                        <el-form-item prop="idKey" label="主键名">
                                            <el-select v-model="form.data.idKey">
                                                <el-option v-for="field in currentTableFields" :key="field"
                                                    :label="field" :value="field" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item prop="parentIdKey" label="父节点键名">
                                            <el-select v-model="form.data.parentIdKey">
                                                <el-option v-for="field in currentTableFields" :key="field"
                                                    :label="field" :value="field" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-around" v-if="form.data.schema === 'tree'">
                                    <el-col :span="10">
                                        <el-form-item prop="orderKey" label="排序键名">
                                            <el-select v-model="form.data.orderKey">
                                                <el-option v-for="field in currentTableFields" :key="field"
                                                    :label="field" :value="field" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item prop="hasChildKey" label="hasChild 键名">
                                            <el-select v-model="form.data.hasChildKey">
                                                <el-option v-for="field in currentTableFields" :key="field"
                                                    :label="field" :value="field" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="center" v-if="form.data.downloadMethod === 'custom'">
                                    <el-col :span="22">
                                        <el-form-item prop="downloadPath" label="自定义路径">
                                            <el-input v-model="form.data.downloadPath" placeholder="请输入自定义下载路径" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </transition>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </easy-table-pro>
        <preview v-model="preview.open" />
        <preview-code v-model="previewCode.open" :loading="previewCode.loading" :data="previewCode.data" />
    </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import { list, get, add, update, del, listDbTableField, previewCode, downloadCode } from '@api/tools/genCode'
import { list as listMenu } from '@api/system/menu'
import { arrayToTree } from '@/utils/tree'
import { isBlob } from '@/utils/validate'
import { saveAs } from 'file-saver'
import { camelCase, upperFirst } from 'lodash'
import FieldTable from './components/FieldTable'
import Preview from './components/Preview'
import PreviewCode from './components/PreviewCode'
import ImportTable from './components/ImportTable'

export default {
    name: 'GenCode',
    components: { FieldTable, Preview, PreviewCode, ImportTable },
    data() {
        return {
            currentTab: "basicInfo",
            currentTableFields: [],
            catalog: [],
            config: {
                api: { list, get, add, update, del },
                query: {
                    data: {
                        tableName: '',
                        tableComment: ''
                    }
                },
                dialog: {
                    title: '模块',
                    width: '80%',
                    height: '80vh',
                    scroll: false,
                    openedDialog: this.onOpenedDialog
                },
                form: {
                    data: {
                        tableName: '',
                        tableComment: '',
                        className: '',
                        author: 'easy-admin',
                        moduleName: 'system',
                        businessName: '',
                        packageName: 'com.example',
                        chineseName: '',
                        parentMenuId: 0,
                        frontEnd: true,
                        backEnd: true,
                        mock: false,
                        syncSchema: false,
                        autoCreateMenu: false,
                        isPrint: false,
                        isImport: false,
                        isExport: false,
                        schema: 'single',
                        downloadMethod: 'zip',
                        idKey: '',
                        parentIdKey: '',
                        orderKey: '',
                        hasChildKey: '',
                        downloadPath: '',
                        fields: [],
                        remark: ''
                    },
                    rules: {
                        tableName: [
                            { required: true, message: '表名称不能为空', trigger: 'blur' }
                        ],
                        className: [
                            { required: true, message: '实体类名称不能为空', trigger: 'blur' }
                        ],
                        moduleName: [
                            { required: true, message: '模块名称不能为空', trigger: 'blur' }
                        ],
                        packageName: [
                            { required: true, message: '包名称不能为空', trigger: 'blur' }
                        ],
                        businessName: [
                            { required: true, message: '业务名称不能为空', trigger: 'blur' }
                        ],
                        downloadPath: [
                            { required: true, message: '路径不能为空', trigger: 'blur' },
                            { max: 260, message: '路径总长度超过260字符限制', trigger: 'blur' }
                        ]
                    }
                }
            },
            preview: {
                open: false,
                loading: false,
            },
            previewCode: {
                open: false,
                loading: false,
                data: []
            },
            importTable: {
                open: false,
                loading: false,
            }
        }
    },
    methods: {
        async onOpenedDialog(row) {
            const { data } = await listMenu()
            this.catalog = [{ id: 0, title: '根目录', hasChild: true, children: arrayToTree(data.list) }]
            if (row.tableName) {
                const { data } = await listDbTableField(row.tableName)
                this.currentTableFields = data.map(item => item.columnName)
            }
        },
        async handleImport(table, form) {
            this.importTable.open = false
            form.tableName = table.tableName
            form.className ||= upperFirst(camelCase(table.tableName))
            form.tableComment = table.tableComment
            form.businessName ||= camelCase(table.tableName)
            form.fields = table.fields
            this.currentTableFields = table.fields.map(item => item.fieldName)
            this.$modal.message.success(`${table.tableName} 表导入成功`)
        },
        handlePreview(row) {
            this.preview.loading = true
            this.preview.open = true
        },
        async handlePreviewCode(row) {
            this.previewCode.loading = true
            this.previewCode.open = true
            let { data } = await previewCode(row.id)
            this.previewCode.data = this.convertToNestedArray(data)
            this.previewCode.loading = false
        },
        async handleDownloadCode(row) {
            let ids = [].concat(row).map(item => item.id)
            if (ids.length) {
                const data = await downloadCode(ids)
                if (isBlob(data)) {
                    saveAs(new Blob([data], { type: 'application/zip' }), "easy-admin.zip")
                } else {
                    this.$modal.message.success('生成成功')
                }
            }
        },
        convertToNestedArray(obj) {
            return Object.entries(obj).map(([label, value]) => {
                if (Object.prototype.toString.call(value) === '[object Object]') {
                    return {
                        label,
                        children: this.convertToNestedArray(value)
                    }
                } else {
                    return {
                        label,
                        content: value
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.tabs {
    padding: 18px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    :deep(.el-tabs__nav-wrap) {
        .el-tabs__nav-scroll {
            display: flex;
            justify-content: center;
        }

        &::after {
            height: 1px;
        }
    }

    .el-tab-pane {
        height: 100%;
        position: relative;

        .checkbox-item {
            padding-left: 12px;
        }

        .base-info-form {
            padding-top: 5px;

            .el-form-item {
                padding: 0 12px;
            }
        }

        .gen-info {
            padding-top: 5px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;

            .el-form-item {
                width: 42%;
            }
        }

        .else-info {
            width: 100%;
            position: absolute;
            bottom: 0;
        }
    }
}
</style>