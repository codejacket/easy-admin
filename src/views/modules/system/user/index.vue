<template>
    <div class="app-card m20">
        <easy-table-pro :config="config">
            <template #query="{ query, getList }">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="query.data.username" placeholder="请输入用户名" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="nickname" label="昵称">
                    <el-input v-model="query.data.nickname" placeholder="请输入昵称" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="gender" label="性别">
                    <el-select v-model="query.data.gender" placeholder="请选择性别" clearable>
                        <el-option v-for="{ value, label } in genderOptions" key="value" :value="value" :label="label" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="query.data.email" placeholder="请输入邮箱" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="phoneNumber" label="手机号">
                    <el-input v-model="query.data.phoneNumber" placeholder="请输入手机号" clearable @keyup.enter="getList" />
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-select v-model="query.data.status" placeholder="请选择状态" clearable>
                        <el-option v-for="{ value, label } in statusOptions" key="value" :value="value" :label="label" />
                    </el-select>
                </el-form-item>
            </template>
            <template #toolbar></template>
            <template #table="{ openDialog, deleteItems }">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="id" label="编号" width="60" />
                <el-table-column prop="avatar" label="头像" width="80" :show-overflow-tooltip="false">
                    <template #default="{ row }">
                        <el-avatar class="abs-center" style="cursor:pointer" :size="32" :src="row.avatar" alt="avatar" 
                            @click="showPreview(row)">
                            <img src="@/assets/img/default-avatar.png" />
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" min-width="160" align="left" />
                <el-table-column prop="nickname" label="昵称" width="160" />
                <el-table-column prop="gender" label="性别" width="100" sortable>
                    <template #default="{ row }">
                        <el-tag v-if="row.gender === '0'">
                            {{ genderOptions.find(option => option.value === row.gender).label }}
                        </el-tag>
                        <el-tag type="danger" v-if="row.gender === '1'">
                            {{ genderOptions.find(option => option.value === row.gender).label }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="160" />
                <el-table-column prop="phoneNumber" label="电话" width="160" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag type="success" v-if="row.status === '0'">
                            {{ statusOptions.find(option => option.value === row.status).label }}
                        </el-tag>
                        <el-tag type="danger" v-if="row.status === '1'">
                            {{ statusOptions.find(option => option.value === row.status).label }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="注册时间" :formatter="row => $parseTime(row.createTime)" width="180" hidden sortable />
                <el-table-column :label="$t('common.operation')" width="180" fixed="right">
                    <template #default="{ row }">
                        <easy-button type="primary" i="edit" t="common.update" link @click="openDialog(row)" />
                        <easy-button type="primary" i="delete" t="common.delete" link @click="deleteItems(row)" />
                    </template>
                </el-table-column>
            </template>
            <template #form="{ form }">
                
            </template>
        </easy-table-pro>
        <el-image-viewer v-if="imageViewer.open" :url-list="imageViewer.urlList" @close="imageViewer.open = false" />
    </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import { listUser, getUser, addUser, updateUser, delUser } from '@api/system/user'
export default {
    name: 'User',
    data() {
        return {
            config: {
                api: {
                    list: listUser,
                    get: getUser,
                    add: addUser,
                    update: updateUser,
                    del: delUser
                },
                query: {
                    data: {
                        username: '',
                        nickname: '',
                        gender: '',
                        email: '',
                        phoneNumber: '',
                        status: ''
                    }
                },
                dialog: {},
                form: {
                    data: {}
                }
            },
            imageViewer: {
                open: false,
                urlList: []
            },
            genderOptions: [
                { label: '男', value: '0' },
                { label: '女', value: '1' }
            ],
            statusOptions: [
                { label: '正常', value: '0' },
                { label: '停用', value: '1' }
            ]
        }
    },
    methods: {
        showPreview(row) {
            if (row.avatar) {
                this.imageViewer.open = true
                this.imageViewer.urlList = [row.avatar]
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>