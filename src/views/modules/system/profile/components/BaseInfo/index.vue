<script name="BaseInfo" setup>
import AvatarUpload from '@/components/AvatarUpload'
import { validEmail, validPhoneNumber } from '@/utils/validate'
import { getBaseInfo, updateBaseInfo, uploadAvatar } from '@api/system/profile'
import modal from '@plugins/modal'
import { useUserStore } from '@store/user'
import { cloneDeep, debounce, isEqual } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()

const formRef = useTemplateRef('formRef')

const img = ref('')

const imgChange = ref(false)

const form = ref({
  id: 1,
  username: '',
  nickname: '',
  phoneNumber: '',
  gender: '',
  email: '',
  createTime: '',
  brief: '',
})

const formChange = ref(false)

const oldForm = ref({})

const rules = {
  phoneNumber: [
    {
      trigger: 'blur',
      validator(rule, value, callback) {
        if (!validPhoneNumber(value)) {
          callback(new Error(t('rules.phoneNumber')))
        } else {
          callback()
        }
      },
    },
  ],
  email: [
    {
      trigger: 'blur',
      validator(rule, value, callback) {
        if (validEmail(value)) {
          callback()
        } else {
          callback(new Error(t('rules.email')))
        }
      },
    },
  ],
}

created()

async function created() {
  await getBaseInfoData()
  oldForm.value = cloneDeep(form.value)
  imgChange.value = false
  formChange.value = false
}

async function getBaseInfoData() {
  const {
    data: { avatar, ...info },
  } = await getBaseInfo()
  img.value = avatar
  console.log(avatar)
  form.value = info
}

function submitForm() {
  formRef.value?.validate(async valid => {
    if (valid) {
      if (formChange.value) {
        await updateBaseInfo(form.value)
        modal.message.success('')
        getBaseInfoData()
      }
      if (imgChange.value) {
        let blob = dataURLToBlob(img)
        let formData = new FormData()
        formData.append('avatarfile', blob, form.id + '.png')
        await uploadAvatar(formData)
        modal.message.success('')
        userStore().avatar = img.value
        imgChange.value = false
      }
    }
  })
}

watch(
  form,
  debounce(val => {
    formChange.value = !isEqual(val, oldForm.value)
  }, 500),
  { deep: true },
)

watch(img, () => (imgChange.value = true))
</script>

<template>
  <el-form
    label-width="auto"
    class="pl8px pr8px"
    :model="form"
    :rules="rules"
    ref="formRef"
    label-position="left"
    require-asterisk-position="right"
  >
    <el-form-item :label="t('avatar')">
      <AvatarUpload v-model:img-url="img" />
    </el-form-item>
    <el-form-item :label="t('username')" prop="username">
      <span>{{ form.username }}</span>
      <svg-icon class="copy" v-clipboard="form.username" icon="copy" />
    </el-form-item>
    <el-form-item :label="t('nickname')" prop="nickname">
      <el-input v-model="form.nickname" :maxlength="30" :placeholder="t('placeholder.nickname')" />
    </el-form-item>
    <el-form-item :label="t('phoneNumber')" prop="phoneNumber">
      <el-input v-model="form.phoneNumber" :placeholder="t('placeholder.phoneNumber')" />
    </el-form-item>
    <el-form-item :label="t('gender')" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio :value="0">
          {{ $dict.get('gender')[0]?.label }}
          <svg-icon icon="male" />
        </el-radio>
        <el-radio :value="1">
          {{ $dict.get('gender')[1]?.label }} <svg-icon icon="female" />
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="t('email')" prop="email">
      <el-input v-model="form.email" :placeholder="t('placeholder.email')" />
    </el-form-item>
    <el-form-item :label="t('createTime')" prop="createTime">
      <span class="text-el-text-color-regular">
        {{ $parseTime(form.createTime) }}
      </span>
    </el-form-item>
    <el-form-item class="items-[unset]" :label="t('brief')" prop="brief">
      <el-input
        v-model="form.brief"
        :rows="3"
        :placeholder="t('placeholder.brief')"
        type="textarea"
        maxlength="100"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label=" ">
      <easy-button
        :plain="!formChange && !imgChange"
        :t="t('submit')"
        type="primary"
        @click="submitForm"
      />
    </el-form-item>
  </el-form>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.el-form-item {
  align-items: center;

  .copy {
    margin-left: 12px;
    cursor: pointer;
    transition: 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .el-input {
    width: 200px;
  }

  .el-textarea {
    width: 400px;

    .el-textarea__inner {
      max-height: 300px;
    }
  }

  :deep(.el-form-item__label) {
    padding-right: 24px;
  }
}
</style>
