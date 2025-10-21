<script name="Profile" setup>
import { useI18n } from 'vue-i18n'
import BaseInfo from './components/BaseInfo'
import LoginLog from './components/LoginLog'
import ResetPwd from './components/ResetPwd'

const { t } = useI18n()
const activeIndex = ref(0)

const menuList = computed(() => {
  return [
    { title: t('basicSettings'), icon: 'user', component: BaseInfo },
    { title: t('passwordSettings'), icon: 'lock', component: ResetPwd },
    { title: t('loginLog'), icon: 'log', component: LoginLog },
  ]
})
</script>

<template>
  <div class="app-card">
    <h3 class="header p14px">{{ $route.meta.title }}</h3>
    <div class="flex h100% overflow-hidden">
      <div class="aside">
        <div
          :class="['menu-item', { 'activeItem': i === activeIndex }]"
          v-for="(item, i) in menuList"
          :key="item"
          @click="activeIndex = i"
        >
          <svg-icon :icon="item.icon" />
          <span class="text-ellipsis">{{ item.title }}</span>
        </div>
      </div>
      <el-scrollbar class="w100%">
        <div class="box-border p16px w100%">
          <component :is="menuList[activeIndex].component" />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.app-card {
  display: flex;
  flex-direction: column;
  height: calc(var(--main-height) - 40px);
  margin: 20px;
  border-radius: 4px;

  .header {
    padding-left: 20px;
    color: var(--el-text-color-regular);
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .aside {
    width: 200px;
    padding: 16px;
    border-right: 1px solid var(--el-border-color);

    .menu-item {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 36px;
      padding: 0 9px;
      color: var(--el-text-color-regular);
      cursor: pointer;
      user-select: none;
      border-radius: 6px;

      svg {
        margin-right: 5px;
        color: var(--el-text-color-regular);
      }

      &:hover {
        background: rgb(128 128 128 / 8%);
      }

      &.activeItem {
        color: var(--el-color-primary);
        background: hsl(
          var(--el-color-primary-h) calc(var(--el-color-primary-s) * 1%)
            calc(var(--el-color-primary-l) * 1%) / 8%
        );
        border: 1px solid var(--el-color-primary-light-8);

        svg {
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
