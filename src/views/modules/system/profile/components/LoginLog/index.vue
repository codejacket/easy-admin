<template>
    <div class="login-log" v-loading="loading">
        <div class="flex-column g14 p14">
            <easy-table :data="list">
                <el-table-column prop="title" label="详情" width="200" align="left" />
                <el-table-column prop="ipAddress" label="IP地址" width="160" />
                <el-table-column prop="loginLocation" label="登录地点" min-width="200" align="left" />
                <el-table-column prop="browser" label="浏览器类型" width="120" />
                <el-table-column prop="os" label="操作系统" width="120" />
                <el-table-column prop="loginTime" label="时间" width="180" />
            </easy-table>
            <pagination :total="total" v-model:current-page="params.pageIndex" v-model:page-size="params.pageSize" @change="getList" />
        </div>
    </div>
</template>

<script>
import { getLoginLogs } from '@api/system/profile'

export default {
    name: 'LoginLog',
    data() {
        return {
            loading: false,
            total: 0,
            list: [],
            params: {
                pageIndex: 1,
                pageSize: 10,
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.loading = true
            getLoginLogs(this.params).then(res => {
                console.log(res)
                this.loading = false
                this.list = res.data.rows
                this.total = res.data.total
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.login-log {
    height: 100%;
    padding-left: 8px;
}
</style>