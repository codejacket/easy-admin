<template>
  <div class="app-card">
    <h3 class="header p14">{{ $route.meta.title }}</h3>
    <div class="body">
      <div class="aside">
        <div :class="['menu-item', { 'activeItem': i === activeIndex }]" v-for="(item, i) in menuList" :key="item"
          @click="activeIndex = i">
          <svg-icon :icon="item.icon" />
          <span>{{ $t(item.title) }}</span>
        </div>
      </div>
      <el-scrollbar style="width: 100%">
        <div class="main">
          <component :is="menuList[activeIndex].component" />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import BaseInfo from './components/BaseInfo'
import ResetPwd from './components/ResetPwd'
import LoginLog from './components/LoginLog'

export default {
  name: "Profile",
  components: { BaseInfo, ResetPwd, LoginLog },
  data() {
    return {
      activeIndex: 0,
      menuList: [
        { title: "基本设置", icon: "user", component: 'BaseInfo' },
        { title: "密码设置", icon: "lock", component: 'ResetPwd' },
        { title: "登录日志", icon: "log", component: 'LoginLog' },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.app-card {
  height: calc(var(--main-height) - 40px);
  margin: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  .header {
    padding-left: 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    color: var(--el-text-color-regular);
  }

  .body {
    height: 100%;
    display: flex;
    overflow: hidden;

    .aside {
      width: 200px;
      padding: 16px;
      border-right: 1px solid var(--el-border-color);

      .menu-item {
        height: 36px;
        padding-left: 9px;
        border-radius: 6px;
        box-sizing: border-box;
        color: var(--el-text-color-regular);
        display: flex;
        align-items: center;
        user-select: none;
        cursor: pointer;

        svg {
          color: var(--el-text-color-regular);
          margin-right: 5px;
        }

        &:hover {
          background: rgba(128, 128, 128, 0.08);
        }

        &.activeItem {
          border: 1px solid var(--el-color-primary-light-8);
          background: hsla(var(--el-color-primary-h),
              calc(var(--el-color-primary-s) * 1%),
              calc(var(--el-color-primary-l) * 1%), 0.08);

          color: var(--el-color-primary);

          svg {
            color: var(--el-color-primary);
          }
        }
      }
    }

    .main {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
    }
  }
}
</style>
