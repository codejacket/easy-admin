<template>
    <el-form class="base-info-form" ref="form" :model="form" :rules="rules"
        label-width="100px" label-position="left" require-asterisk-position="right">
        <el-form-item label="头像">
            <AvatarUpload v-model:img="img" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
            <span>{{ form.username }}</span>
            <svg-icon icon="copy" class="copy" v-clipboard="form.username" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称" :maxlength="30" />
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
                <el-radio value="0">男 <svg-icon icon="male" /></el-radio>
                <el-radio value="1">女 <svg-icon icon="female" /></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
            <span style="color: var(--el-text-color-regular)">
                {{ $parseTime(form.createTime) }}
            </span>
        </el-form-item>
        <el-form-item label="个人简介" prop="brief" class="brief">
            <el-input type="textarea" v-model="form.brief" placeholder="简单介绍一下你自己 ~" :rows="3" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item>
            <easy-button type="primary" t="提交修改" :plain="!formChange && !imgChange" @click="submitForm" />
        </el-form-item>
    </el-form>
</template>

<script>
import { useUserStore } from '@store/user'
import { mapWritableState } from 'pinia'
import { cloneDeep, debounce } from 'lodash'
import { dataURLToBlob } from '@/utils'
import { isEqual, validPhoneNumber, validEmail } from '@/utils/validate'
import { getBaseInfo, updateBaseInfo, uploadAvatar } from '@api/system/profile'

import AvatarUpload from '@/components/AvatarUpload'

export default {
    name: 'BaseInfo',
    components: { AvatarUpload },
    data() {
        return {
            formChange: false,
            imgChange: false,
            oldForm: {},
            form: {
                id: 1,
                username: '',
                nickname: '',
                phoneNumber: '',
                gender: '',
                email: '',
                createTime: '',
                brief: '',
            },
            img: '',
            rules: {
                phoneNumber: [{ 
                    trigger: 'blur',
                    validator(rule, value, callback) {
                        if (!validPhoneNumber(value)) {
                            callback(new Error('手机号输入错误'))
                        } else {
                            callback()
                        }
                    }
                }],
                email: [{
                    trigger: 'blur',
                    validator(rule, value, callback) {
                        if (validEmail(value)) {
                            callback()
                        } else {
                            callback(new Error('邮箱输入错误'))
                        }
                    }
                }]
            }
        }
    },
    async created() {
        await this.getBaseInfo()
        this.imgChange = false
    },
    computed: {
        ...mapWritableState(useUserStore, ['avatar'])
    },
    methods: {
        async getBaseInfo() {
            const { data } = await getBaseInfo()
            let { avatar, ...form } = data
            this.form = form
            this.img = avatar
            this.oldForm = cloneDeep(this.form)
        },
        submitForm() {
            this.$refs["form"]?.validate(async valid => {
                if (valid) {
                    if (this.formChange) {
                        await updateBaseInfo(this.form)
                        this.$modal.message.success(this.$t('message.updateSuccess'))
                        this.getBaseInfo()
                    }
                    if (this.imgChange) {
                        let blob = dataURLToBlob(this.img)
                        let formData = new FormData()
                        formData.append('avatarfile', blob, this.form.id + '.png')
                        await uploadAvatar(formData)
                        this.$modal.message.success(this.$t('message.updateSuccess'))
                        this.avatar = this.img
                        this.imgChange = false
                    }
                }
            })
        }
    },
    watch: {
        form: {
            deep: true,
            handler: debounce(function(val) {
                this.formChange = !isEqual(val, this.oldForm)
            }, 500)
        },
        img() {
            this.imgChange = true
        }
    }
}
</script>

<style lang="scss" scoped>
.base-info-form {
    padding: 0 8px;
    
    .el-form-item {
        align-items: center;

        .copy {
            margin-left: 12px;
            transition: 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            cursor: pointer;

            &:hover {
                color: var(--el-color-primary);
            }
        }

        .el-input {
            width: 200px;
        }

        &.brief {
            align-items: unset;

            .el-textarea {
                width: 400px;

                .el-textarea__inner {
                    max-height: 300px;
                }
            }
        }
    }
}
</style>