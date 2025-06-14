<template>
  <div class="register">
    <Copyright class="copyright" />
  </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import Copyright from '@/components/Copyright'
export default {
  name: 'Register',
  components: { Copyright },
  mounted() {
    this.$modal.alert.error(`<font color='red'>${this.$t('systemTipDesc')}</font>`, {
      dangerouslyUseHTMLString: true,
      showClose: false,
    }).then(() => {
      this.$router.push("/login")
    }).catch(() => { })
  }
}
</script>

<style lang="scss" scoped>
  .register {
    width: 100vw;
    height: 100vh;
    background-image: url("@/assets/img/login-background.jpg");
    background-size: cover;
    position: relative;

    .copyright {
      color: #999;
      position: absolute;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
    }
  }
</style>