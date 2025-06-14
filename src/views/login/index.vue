<template>
  <div class="login">
    <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginRules">
      <SystemLogo class="logo-container" color="var(--el-text-color-regular)">
        <svg-icon icon="logo" />
      </SystemLogo>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" :placeholder="$t('account')">
          <template #prefix>
            <svg-icon icon="user" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" :placeholder="$t('password')">
          <template #prefix>
            <svg-icon icon="lock" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captcha">
        <captcha ref="captchaRef" type="pick" @success="handleLogin" />
      </el-form-item>
      <div class="box">
        <el-checkbox v-model="loginForm.rememberMe">
          {{ $t('remember') }}
        </el-checkbox>
        <router-link v-if="register" class="el-link el-link--info is-underline" :to="'/register'">
          {{ $t('register') }}
        </router-link>
      </div>
      <easy-button style="width:100%" type="primary" :t="loading ? 'logging' : 'login'" :loading="loading" auto-insert-space 
        @click.native.prevent="validate" />
    </el-form>
    <div class="login-tools">
      <LangSelect />
    </div>
    <Copyright class="copyright" />
  </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import Cookies from "js-cookie"
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import { mapState } from 'pinia'

import SystemLogo from '@/components/SystemLogo'
import Copyright from '@/components/Copyright'
import Captcha from '@/components/Captcha'
import LangSelect from '@/components/LangSelect'

export default {
  name: 'Login',
  components: { SystemLogo, Copyright, Captcha, LangSelect },
  data() {
    return {
      img: "",
      uuid: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: this.$t('rules.account') }],
        password: [{ required: true, trigger: "blur", message: this.$t('rules.password') }]
      },
      loading: false,
      // 验证码开关
      captcha: true,
      // 注册开关
      register: true
    }
  },
  created() {
    this.getCookie()
  },
  computed: {
    ...mapState(useAppStore, ['title']),
    ...mapState(useUserStore, ['name', 'nickname'])
  },
  methods: {
    getCookie() {
      let username = Cookies.get("username")
      let password = Cookies.get("password")
      let rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username ?? this.loginForm.username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: Boolean(rememberMe)
      }
    },
    validate() {
      this.$refs?.loginForm.validate(valid => {
        if (valid) {
          if (this.$refs.captchaRef) {
            this.$refs?.captchaRef?.open()
          } else {
            this.handleLogin()
          }
        }
      })
    },
    async handleLogin() {
      if (this.loginForm.rememberMe) {
        Cookies.set("username", this.loginForm.username, { expires: 30 })
        Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 })
        Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
      } else {
        Cookies.remove("username")
        Cookies.remove("password")
        Cookies.remove('rememberMe')
      }
      try {
        this.loading = true
        await useUserStore().login(this.loginForm)
        this.loading = false
        let loginSuccess = this.$t('message.loginSuccess')
        let welcomeBack = this.$t('message.welcomeBack')
        await this.$router.push({ path: this.$route.query?.redirect || "/" })
        this.$notify.success({ title: loginSuccess, message: `${welcomeBack}, ${this.nickname || this.name} !` })
      } catch (error) {
        this.loading = false
        this.$refs?.captchaRef?.open?.()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  position: relative;

  &::before {
    content: '';
    background-image: url("@/assets/img/login-background.jpg");
    background-size: cover;
    filter: hue-rotate(calc((var(--el-color-primary-h) - 214) * 1deg));
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .login-form {
    width: 400px;
    height: auto;
    padding: 25px;
    border-radius: 6px;
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: default;

    .logo-container {
      margin-bottom: 25px;

      :deep(svg) {
        width: 32px;
        height: 32px;
      }

      :deep(h1) {
        width: 96px;
        font-size: 15px;
      }
    }

    .el-input {
      height: 38px;

      svg {
        color: #a8abb2;
      }
    }

    .box {
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .login-tools {
    display: flex;
    align-items: center;
    gap: 16px;
    position: absolute;
    right: 30px;
    top: 30px;
  }

  .copyright {
    color: #999;
    position: absolute;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
  }
}
</style>
