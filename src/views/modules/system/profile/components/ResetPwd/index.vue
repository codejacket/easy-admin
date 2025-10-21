<script name="ResetPwd" setup>
import { updatePwd } from '@api/system/profile'
import modal from '@plugins/modal'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formRef = useTemplateRef('formRef')

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = computed(() => {
  return {
    oldPassword: [{ required: true, message: t('rules.oldPwdRequired'), trigger: 'blur' }],
    newPassword: [
      { required: true, message: t('rules.newPwdRequired'), trigger: 'blur' },
      { min: 6, max: 20, message: t('rules.newPwdLength'), trigger: 'blur' },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          // 长度6 ~ 20, 必须包含: 数字、 字母, 且不能包含空格
          const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).+$/
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error(t('rules.newPwdFormat')))
          }
        },
      },
    ],
    confirmPassword: [
      { required: true, message: t('rules.confirmPwdRequired'), trigger: 'blur' },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (form.value.newPassword === value) {
            callback()
          } else {
            callback(new Error(t('rules.confirmPwdMatch')))
          }
        },
      },
    ],
  }
})

function reset() {
  formRef.value?.resetFields()
  form.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

function submitForm() {
  formRef.value?.validate(async valid => {
    if (valid) {
      await updatePwd(form.value)
      reset()
      modal.message.success(t('successMsg'))
    }
  })
}
</script>

<template>
  <el-form label-width="auto" :model="form" :rules="rules" ref="formRef">
    <el-form-item :label="t('oldPassword')" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        :placeholder="t('placeholder.oldPassword')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item :label="t('newPassword')" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        :placeholder="t('placeholder.newPassword')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item :label="t('confirmPassword')" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        :placeholder="t('placeholder.confirmPassword')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label=" ">
      <easy-button :t="t('update')" type="primary" @click="submitForm" />
      <easy-button :t="t('reset')" type="danger" />
    </el-form-item>
  </el-form>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    .el-input {
      width: 240px;
    }
  }
}
</style>
