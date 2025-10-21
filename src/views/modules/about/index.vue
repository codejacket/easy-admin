<script name="About" setup>
import CHANGELOG from '@/../CHANGELOG.md?raw'
import packageJson from '@/../package.json?raw'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const changeLog = parseCHANGELOG(CHANGELOG)

const pkg = JSON.parse(packageJson)

const info = computed(() => {
  return {
    name: pkg.name,
    version: pkg.version,
    author: pkg.author,
    license: pkg.license,
    description: pkg.description,
    dependencies: Object.entries(pkg.dependencies).map(([name, version]) => ({ name, version })),
    devDependencies: Object.entries(pkg.devDependencies).map(([name, version]) => ({
      name,
      version,
    })),
    buildTime: '2025-09-14',
    preview: 'https://easy-admin.cn',
    introduction: t('info.introduction'),
  }
})

function parseCHANGELOG(changeLog) {
  try {
  } catch (err) {
    console.error('解析 CHANGELOG.md 文件失败:', err)
  }
}
</script>

<template>
  <div class="m20px flex flex-col gap16px">
    <div class="app-card">
      <h4 class="title">{{ t('projectIntro') }}</h4>
      <p class="content">
        <el-link class="indent-0" :href="info.preview" type="primary">Easy-Admin</el-link>
        {{ info.introduction }}
      </p>
    </div>
    <div class="app-card">
      <h4 class="title">{{ t('projectInfo') }}</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item>
          <template #label>{{ t('version') }}</template>
          <el-tag type="primary">v{{ info.version }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>{{ t('buildTime') }}</template>
          <template #default>{{ info.buildTime }}</template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>{{ t('license') }}</template>
          <template #default>{{ info.license }}</template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>{{ t('author') }}</template>
          <template #default>{{ info.author.name }}</template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>{{ t('github') }}</template>
          <template #default>{{ info.author.url }}</template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>{{ t('preview') }}</template>
          <template #default>{{ info.preview }}</template>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="app-card">
      <h4 class="title">
        <el-badge :value="info.dependencies.length" :offset="[15, 11]" type="primary">
          {{ t('dependencies') }}
        </el-badge>
      </h4>
      <el-descriptions label-width="270" :column="3" border>
        <el-descriptions-item v-for="item in info.dependencies">
          <template #label>{{ item.name }}</template>
          {{ item.version }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="app-card">
      <h4 class="title">
        <el-badge :value="info.devDependencies.length" :offset="[15, 11]" type="primary">
          {{ t('devDependencies') }}
        </el-badge>
      </h4>
      <el-descriptions label-width="270" :column="3" border>
        <el-descriptions-item v-for="item in info.devDependencies">
          <template #label>{{ item.name }}</template>
          {{ item.version }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.app-card {
  padding: 16px;

  .title {
    padding-bottom: 16px;
    color: var(--el-text-color-regular);
    cursor: pointer;
  }

  .content {
    font-size: 14px;
    line-height: 25px;
    color: var(--el-text-color-regular);
    text-indent: 2em;
  }

  .el-descriptions {
    --el-descriptions-item-bordered-label-background: var(--el-fill-color-lighter);
  }
}
</style>
