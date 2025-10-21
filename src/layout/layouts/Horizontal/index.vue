<script name="Horizontal" setup>
import SystemLogo from '@/components/SystemLogo'
import AppMain from '@/layout/components/AppMain'
import Menu from '@/layout/components/Menu'
import Navbar from '@/layout/components/Navbar'
import Tabs from '@/layout/components/Tabs'
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'
import { useSettingsStore } from '@store/settings'

const { tabFullscreen } = storeToRefs(useAppStore())
const { sidebarRoutes } = storeToRefs(useRouteStore())
const { header, tabs } = storeToRefs(useSettingsStore())
</script>

<template>
  <el-container>
    <el-header v-if="header.fixed">
      <Navbar :height="tabFullscreen ? 0 : header.height">
        <SystemLogo class="logo-container" />
        <Menu :data="sidebarRoutes" mode="horizontal">
          <template #default="{ meta }">
            <svg-icon class="mr-6px" :icon="meta.icon" />
            <span class="text-ellipsis">{{ meta.title }}</span>
          </template>
        </Menu>
      </Navbar>
      <Tabs v-if="tabs.show" />
    </el-header>
    <el-main>
      <el-scrollbar class="main-scrollbar">
        <el-header v-if="!header.fixed">
          <Navbar :height="tabFullscreen ? 0 : header.height">
            <SystemLogo class="logo-container" />
            <Menu :data="sidebarRoutes" mode="horizontal">
              <template #default="{ meta }">
                <svg-icon class="mr-6px" :icon="meta.icon" />
                <span class="text-ellipsis">{{ meta.title }}</span>
              </template>
            </Menu>
          </Navbar>
          <Tabs v-if="tabs.show" />
        </el-header>
        <AppMain />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100vw;
  height: 100vh;
  background: var(--base-bg);

  .el-header {
    height: auto;

    .logo-container {
      flex-shrink: 0;
      height: 100%;
      margin-right: 30px;
      margin-left: 30px;
    }

    .el-menu {
      width: 100%;
      height: 100%;
      border-bottom: none;

      .el-menu-item,
      .el-sub-menu {
        &:hover svg {
          color: var(--el-color-primary);
        }
      }

      .is-active {
        &.el-sub-menu > .el-sub-menu__title {
          color: var(--el-color-primary);
        }

        &.el-menu-item {
          svg {
            color: var(--el-color-primary);
          }
        }
      }
    }

    .menu-icon {
      color: var(--sidebar-text-color);
    }
  }
}
</style>
