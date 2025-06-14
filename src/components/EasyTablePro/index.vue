<template>
    <div>
        <!-- 查询条件 -->
        <query-form v-model="query.data" v-bind="queryProps" v-if="$slots.query" @search="getList">
            <slot name="query" v-bind="scope" />
        </query-form>
        <div class="flex-column g14 p14">
            <div class="flex" v-if="$slots.toolbar">
                <slot name="toolbar" v-bind="scope">
                    <!-- 默认的按钮 -->
                    <easy-button type="primary" i="plus" t="common.add" size="small" plain @click="openDialog" />
                    <easy-button type="danger" i="delete" t="common.delete" size="small" plain @click="deleteItems(table.selections)" />
                    <table-toolbar v-model:show-search="query.show" v-model:columns="table.columns" @refresh="getList" />
                </slot>
            </div>
            <!-- 表格 -->
            <easy-table ref="table-ref" v-model:columns="table.columns" v-bind="tableProps" v-loading="table.loading"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
                <slot name="table" v-bind="scope" />
            </easy-table>
            <!-- 分页 -->
            <pagination v-model:currentPage="pagination.currentPage" v-model:pageSize="pagination.pageSize" v-bind="paginationProps"
                @change="getList" />
        </div>
        <!-- 弹窗 -->
        <easy-dialog :title="title" v-model="dialog.open" v-bind="dialogProps" v-if="$slots.form" @closed="closedDialog">
            <easy-form ref="dialog-form" v-model="form.data" v-bind="formProps">
                <slot name="form" v-bind="scope" />
            </easy-form>
        </easy-dialog>
    </div>
</template>

<script>
import { omit, merge } from 'lodash'

export default {
    name: 'EasyTablePro',
    props: {
        config: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            api: {},
            query: {
                data: {},
                show: true
            },
            table: {
                loading: false,
                columns: [],
                selections: [],
                sort: {},
                data: [],
                'row-key': 'id'
            },
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            dialog: {
                open: false,
                title: '',
                isEdit: false,
                openedDialog: async () => {},
                loading: false,
                confirm: this.confirm
            },
            form: {
                data: {}
            }
        }
    },
    computed: {
        title() {
            return `${this.$t(this.dialog.isEdit ? 'common.update' : 'common.add')}${this.dialog.title}`
        },
        queryProps() {
            return omit(this.query, ['data'])
        },
        tableProps() {
            return omit(this.table, ['loading', 'columns', 'selections'])
        },
        paginationProps() {
            return omit(this.pagination, ['currentPage', 'pageSize'])
        },
        dialogProps() {
            return omit(this.dialog, ['open', 'title', 'isEdit', 'openedDialog'])
        },
        formProps() {
            return omit(this.form, ['data'])
        },
        scope() {
            return {
                query: this.query,
                table: this.table,
                form: this.form,
                // 方法
                openDialog: this.openDialog,
                getList: this.getList,
                deleteItems: this.deleteItems,
                importTable: this.importTable,
                exportTable: this.exportTable,
                printTable: this.printTable
            }
        }
    },
    created() {
        // 合并配置
        this.mergeConfig()
        // 初始化表格
        this.getList()
    },
    methods: {
        mergeConfig() {
            merge(this.api, this.config.api)
            merge(this.query, this.config.query)
            merge(this.table, this.config.table)
            merge(this.pagination, this.config.pagination)
            merge(this.dialog, this.config.dialog)
            merge(this.form, this.config.form)
        },
        handleSelectionChange(selections) {
            this.table.selections = selections
        },
        handleSortChange(sort) {
            let { prop, order } = sort
            this.table.sort = { prop, order }
            this.getList()
        },
        async getList() {
            this.table.loading = true
            let { currentPage, pageSize } = this.pagination
            let { prop, order } = this.table.sort
            let { data } = await this.api.list({ 
                query: this.query.data,
                currentPage,
                pageSize,
                sortBy: prop,
                isAsc: order === 'ascending'
            })
            this.table.data = data.list
            this.pagination.total = data.total
            this.table.loading = false
        },
        async deleteItems(items, msg) {
            let rowKey = this.table['row-key']
            let valid = items?.[rowKey] !== undefined || Array.isArray(items)
            let rows = [].concat(valid ? items : this.table.selections)
            if (rows.length) {
                let ids = rows.map(item => item[rowKey])
                let message = typeof msg === 'function' ? msg(rows) : msg
                try {
                    await this.$modal.confirm.warning(message || `是否确认删除数据吗?`)
                    await this.api.del(ids)
                    await this.getList()
                    this.$modal.message.success(this.$t('message.deleteSuccess'))
                } catch {}
            } else {
                this.$modal.message.warning('请选择要删除的数据')
            }
        },
        async openDialog(row) {
            let rowKey = this.table['row-key']
            this.dialog.isEdit = Boolean(row?.[rowKey])
            this.dialog.open = true
            this.dialog.loading = true
            this.$refs['dialog-form']?.resetFields()
            await this.dialog.openedDialog?.(row)
            // 编辑时获取数据
            if (this.dialog.isEdit) {
                let { data } = await this.api.get(row[rowKey])
                this.form.data = data
            }
            this.dialog.loading = false
        },
        closedDialog() {
            this.$refs['dialog-form']?.resetFields()
        },
        confirm() {
            return this.$refs['dialog-form'].validate(async (valid) => {
                if (valid) {
                    let action = this.dialog.isEdit ? 'update' : 'add'
                    await this.api[action]?.(this.form.data)
                    this.$modal.message.success(this.$t(`message.${action}Success`))
                    this.getList()
                }
            })
        },
        importTable(file) {

        },
        exportTable() {

        },
        printTable() {
            this.$refs['table-ref'].print()
        }
    }
}
</script>