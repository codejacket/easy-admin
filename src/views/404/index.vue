<template>
  <div class="page-404">
    <h2>{{ $t('title') }}</h2>
    <div class="svg-container">
      <svg-icon icon="404" style="width: 800px;height: 600px" />
    </div>
    <div class="page-404-content">
      <easy-button type="primary" t="common.backHome" @click="back" />
    </div>
  </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
export default {
  name: '404',
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-404 {
  height: var(--main-height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    color: var(--el-text-color-regular);
    font-size: 30px;
    letter-spacing: 2px;
    transform: translateY(0.5em);
  }

  .svg-container {
    width: 800px;
    height: 400px;
    overflow: hidden;
    position: relative;

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      filter: drop-shadow(0 0 3px rgba(128, 128, 128, 0.15));
    }
  }
}
</style>
