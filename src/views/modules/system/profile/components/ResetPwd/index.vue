<template>
    <el-form class="reset-pwd-form" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="form.oldPassword" placeholder="请输入旧密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" placeholder="请输入新密码" type="password" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
        </el-form-item>
        <el-form-item>
            <easy-button type="primary" t="修改" @click="submitForm" />
            <easy-button type="danger" t="忘记密码" />
        </el-form-item>
    </el-form>
</template>

<script>
import { updatePwd } from "@api/system/profile"

export default {
    name: 'ResetPwd',
    data() {
        return {
            form: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: "旧密码不能为空", trigger: "blur" }
                ],
                newPassword: [
                    { required: true, message: "新密码不能为空", trigger: "blur" },
                    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" }
                ],
                confirmPassword: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    { 
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (this.form.newPassword !== value) {
                                callback(new Error("两次输入的密码不一致"))
                            } else {
                                callback()
                            }
                        }
                    }
                ]
            }
        }
    },
    methods: {
        reset() {
            this.$refs['form']?.resetFields()
            this.form = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        },
        submitForm() {
            this.$refs["form"]?.validate(async valid => {
                if (valid) {
                    await updatePwd(this.form)
                    this.reset()
                    this.$modal.message.success(this.$t('message.updateSuccess'))
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.reset-pwd-form {
    .el-form-item {
        .el-input {
            width: 240px;
        }
    }
}
</style>