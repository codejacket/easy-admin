<script name="Breadcrumb" setup>
import { useSettingsStore } from '@store/settings'
const { header } = storeToRefs(useSettingsStore())
</script>

<template>
  <el-breadcrumb class="inline-block text-14px" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="{ icon, title } in $route.matched.slice(1).map(route => route.meta)"
        :key="title"
      >
        <svg-icon
          class="mr-4px"
          v-if="header.showBreadcrumbIcon && icon"
          :icon="icon"
          color="var(--el-text-color-regular)"
        />
        <span>{{ title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
