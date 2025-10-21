<script name="Home" setup>
import { useI18n } from 'vue-i18n'
import { CountTo } from 'vue3-count-to'

const { t } = useI18n()

const overview = computed(() => {
  return [
    {
      label: t('overview.users'),
      value: 1500,
      icon: 'peoples',
    },
    {
      label: t('overview.visits'),
      value: 12500,
      icon: 'chart-proportion',
    },
    {
      label: t('overview.downloads'),
      value: 3000,
      icon: 'download',
    },
    {
      label: t('overview.usage'),
      value: 7500,
      icon: 'ranking',
    },
  ]
})
</script>

<template>
  <div class="m20px flex flex-col gap16px">
    <el-card>
      <el-row justify="space-between">
        <el-col :span="24">
          <div class="header-title">
            <svg-icon icon="logo" />
            Easy-Admin
          </div>
          <p class="header-content">
            {{ t('introduction') }}
          </p>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="16" justify="space-between">
      <el-col v-for="item in overview" :span="6">
        <el-card class="overview-card">
          <div>{{ item.label }}</div>
          <div class="flex">
            <count-to :endVal="item.value" :duration="1000" />
            <svg-icon :icon="item.icon" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.header-title {
  padding-bottom: 6px;
  font-size: 1.2em;
  font-weight: 600;
  color: var(--el-color-primary);
  cursor: pointer;
}

.header-content {
  font-size: 15px;
  line-height: 25px;
  color: var(--el-text-color-regular);
}

.el-card {
  box-shadow: 0 0 5px rgb(0 0 0 / 12%);
}

.overview-card {
  position: relative;
  cursor: pointer;

  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .flex {
      align-items: center;
      justify-content: space-between;

      svg {
        font-size: 1.6em;
        color: var(--el-color-primary);
      }
    }

    &::after {
      position: absolute;
      right: -15%;
      bottom: -20%;
      width: 60%;
      height: 140%;
      content: '';
      background: rgb(128 128 128 / 5%);
      border-radius: 30%;
      transform: rotate(-20deg);
    }
  }

  &:hover {
    transform: scale(1.05);
  }
}
</style>
