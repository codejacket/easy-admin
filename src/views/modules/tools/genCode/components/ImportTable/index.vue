<template>
    <easy-dialog title="导入表" width="800" height="600">
        <easy-table-pro class="easy-table-pro" :config="config">
            <template #query="{ query, getList }">
                <el-form-item prop="tableName" label="表名称">
                    <el-input v-model="query.data.tableName" placeholder="请输入表名称" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="tableComment" label="表描述">
                    <el-input v-model="query.data.tableComment" placeholder="请输入表描述" clearable @keyup.enter="getList" />
                </el-form-item>
            </template>
            <template #table>
                <el-table-column prop="tableName" label="表名称" width="160" align="left" />
                <el-table-column prop="tableComment" label="表描述" align="left" />
                <el-table-column prop="createTime" label="创建时间" :formatter="row => $parseTime(row.createTime)" width="180" />
                <el-table-column prop="updateTime" label="更新时间" :formatter="row => $parseTime(row.createTime)" width="180" hidden />
                <el-table-column :label="$t('common.operation')" width="80" fixed="right">
                    <template #default="{ row }">
                        <easy-button type="primary" i="to-bottom" t="common.import" size="small" link @click="handleClick(row)" />
                    </template>
                </el-table-column>
            </template>
        </easy-table-pro>
    </easy-dialog>
</template>

<script>
import { listDbTable, importDbTable } from '@api/tools/genCode'
export default {
    name: 'ImportTable',
    data() {
        return {
            config: {
                api: { list: listDbTable },
                query: {
                    data: {
                        tableName: '',
                        tableComment: ''
                    }
                }
            }
        }
    },
    methods: {
        async handleClick(row) {
            let { data } = await importDbTable(row.tableName)
            this.$emit('import', data)
        }
    }
}
</script>

<style lang="scss" scoped>
.easy-table-pro {
    :deep(.query-form) {
        padding-top: 0;

        .el-form-item:not(:last-child) {
            min-width: 250px;
        }
    }

    :deep(.flex-column) {
        padding-top: 0;
    }
}
</style>