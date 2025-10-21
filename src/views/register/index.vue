<script name="Register" setup>
import Copyright from '@/components/Copyright'
import modal from '@plugins/modal'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

onMounted(() => {
  modal.alert
    .error(`<font color='red'>${t('systemTip')}</font>`, {
      dangerouslyUseHTMLString: true,
      showClose: false,
    })
    .then(() => {
      router.push('/login')
    })
    .catch(() => {})
})
</script>

<template>
  <div class="register-page">
    <Copyright class="copyright" />
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.register-page {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    65% 52% at 50% 55%,
    hsl(var(--el-color-primary-h) 84% 58% / 40%) 0,
    hsl(calc(var(--el-color-primary-h) + 10) 80% 50% / 30.2%) 50%,
    #09090b00
  );
}

.copyright {
  position: absolute;
  bottom: 16px;
  left: 50%;
  color: #999;
  transform: translateX(-50%);
}
</style>
