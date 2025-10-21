<script name="Login" setup>
import { getCaptcha, verifyCaptcha } from '@/api/login'
import Captcha from '@/components/Captcha'
import Copyright from '@/components/Copyright'
import SystemLogo from '@/components/SystemLogo'
import LangSelect from '@/layout/components/Navbar/Toolbar/LangSelect'
import ModeSwitch from '@/layout/components/Navbar/Toolbar/ModeSwitch'
import { decrypt, encrypt } from '@/utils/jsencrypt'
import { useUserStore } from '@store/user'
import cookies from 'js-cookie'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()

const form = reactive({
  username: cookies.get('username') || '',
  password: decrypt(cookies.get('password')) || '',
  rememberMe: Boolean(cookies.get('rememberMe')),
})

const rules = computed(() => {
  return {
    username: [{ required: true, trigger: 'blur', message: t('rules.account') }],
    password: [{ required: true, trigger: 'blur', message: t('rules.password') }],
  }
})

const loading = ref(false)
const loginForm = useTemplateRef('loginForm')

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const captchaRef = useTemplateRef('captchaRef')
let isFirstCaptcha = true
const firstCaptchaData = ref(null)

getCaptcha().then(res => {
  firstCaptchaData.value = res.data
})

async function validate() {
  try {
    if (firstCaptchaData.value.type) {
      await loginForm.value.validate()
      captchaRef.value.test()
    } else {
      await handleLogin()
    }
  } catch {}
}

async function handleLogin() {
  if (form.rememberMe) {
    cookies.set('username', form.username, { expires: 30 })
    cookies.set('password', encrypt(form.password), { expires: 30 })
    cookies.set('rememberMe', form.rememberMe, { expires: 30 })
  } else {
    cookies.remove('username')
    cookies.remove('password')
    cookies.remove('rememberMe')
  }
  try {
    loading.value = true
    await userStore.login(form)
    loading.value = false
    router.push({ path: route.query?.redirect || '/' })
  } catch {
    loading.value = false
  }
}

async function getData() {
  if (isFirstCaptcha) {
    isFirstCaptcha = false
    return firstCaptchaData.value
  } else {
    const { data } = await getCaptcha()
    return data
  }
}
</script>

<template>
  <div class="login-page">
    <el-form class="login-form" :model="form" :rules="rules" ref="loginForm">
      <SystemLogo class="logo-container" color="var(--el-text-color-regular)" />
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          :placeholder="t('account')"
          type="text"
          auto-complete="off"
        >
          <template #prefix>
            <svg-icon icon="user" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          :placeholder="t('password')"
          show-password
          type="password"
          auto-complete="off"
          @keyup.enter="validate"
        >
          <template #prefix>
            <svg-icon icon="lock" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="firstCaptchaData?.type">
        <Captcha
          :get-data="getData"
          :verify="verifyCaptcha"
          :type="firstCaptchaData?.type"
          ref="captchaRef"
          @success="handleLogin"
        />
      </el-form-item>
      <div class="mb-25px flex justify-between items-center">
        <el-checkbox v-model="form.rememberMe">
          {{ t('remember') }}
        </el-checkbox>
        <router-link class="el-link el-link--info is-underline" to="/register">
          {{ t('register') }}
        </router-link>
      </div>
      <easy-button
        class="w-100%"
        :loading="loading"
        type="primary"
        auto-insert-space
        @click.native.prevent="validate"
      >
        {{ t(loading ? 'logging' : 'login') }}
      </easy-button>
    </el-form>
    <div class="login-tools">
      <ModeSwitch />
      <LangSelect />
    </div>
    <Copyright class="copyright" />
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    65% 52% at 50% 55%,
    hsl(var(--el-color-primary-h) 84% 58% / 40%) 0,
    hsl(calc(var(--el-color-primary-h) + 10) 80% 50% / 30.2%) 50%,
    #09090b00
  );
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  height: auto;
  padding: 25px;
  cursor: default;
  background: var(--el-bg-color);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
  transform: translate(-50%, -50%);

  .logo-container {
    margin-bottom: 25px;

    :deep(svg) {
      width: 32px;
      height: 32px;
    }

    :deep(h1) {
      font-size: 16px;
    }
  }

  @include respond-to('phone') {
    width: 90%;
  }

  @include respond-to('pad') {
    width: 400px;
  }

  @include respond-to('desktop') {
    width: 450px;
  }
}

.login-tools {
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 18px;
  color: var(--el-text-color-regular);

  div {
    cursor: pointer;
  }
}

.copyright {
  position: absolute;
  bottom: 16px;
  left: 50%;
  color: #999;
  transform: translateX(-50%);
}
</style>
