<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="{ icon, title } in $route.matched.slice(1).map(route => route.meta)" :key="title">
        <svg-icon :icon="icon" v-if="header.showBreadcrumbIcon && icon" />
        <span>{{ title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'

export default {
  name: "Breadcrumb",
  computed: {
    ...mapState(useSettingsStore, ["header"])
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  display: inline-block;
  font-size: 14px;

  svg {
    margin-right: 4px;
    color: var(--el-text-color-regular);
  }
}
</style>
