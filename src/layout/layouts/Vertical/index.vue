<script name="Vertical" setup>
import SystemLogo from '@/components/SystemLogo'
import AppMain from '@/layout/components/AppMain'
import Breadcrumb from '@/layout/components/Breadcrumb'
import Hamburger from '@/layout/components/Hamburger'
import Menu from '@/layout/components/Menu'
import Navbar from '@/layout/components/Navbar'
import Sidebar from '@/layout/components/Sidebar'
import Tabs from '@/layout/components/Tabs'
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'
import { useSettingsStore } from '@store/settings'

const { tabFullscreen, collapse } = storeToRefs(useAppStore())
const { sidebarRoutes } = storeToRefs(useRouteStore())
const { header, sidebar, tabs } = storeToRefs(useSettingsStore())

const sidebarWidth = computed(() => {
  if (tabFullscreen.value) {
    return 0
  } else if (collapse.value) {
    return 54
  } else {
    return sidebar.value.width
  }
})
</script>

<template>
  <el-container>
    <el-aside>
      <Sidebar :width="sidebarWidth">
        <template #header>
          <SystemLogo class="w-full h-50px" :collapse="collapse" />
        </template>
        <Menu :data="sidebarRoutes">
          <template #default="{ meta }">
            <div>
              <svg-icon class="mr-6px" :icon="meta.icon" />
            </div>
            <span>{{ meta.title }}</span>
          </template>
        </Menu>
        <template #footer>
          <div class="sidebar-footer">
            <Hamburger color="var(--sidebar-text-color)" />
          </div>
        </template>
      </Sidebar>
    </el-aside>
    <el-main class="flex flex-col">
      <div v-if="header.fixed">
        <Navbar :height="tabFullscreen ? 0 : header.height">
          <Hamburger class="mx-15px" />
          <Breadcrumb v-if="header.showBreadcrumb" />
        </Navbar>
        <Tabs v-if="tabs.show" />
      </div>
      <el-scrollbar class="main-scrollbar">
        <div v-if="!header.fixed">
          <Navbar :height="tabFullscreen ? 0 : header.height">
            <Hamburger class="mx-15px" />
            <Breadcrumb v-if="header.showBreadcrumb" />
          </Navbar>
          <Tabs v-if="tabs.show" />
        </div>
        <AppMain />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100vw;
  height: 100vh;

  .el-aside {
    z-index: 9;
    width: auto;
    box-shadow: 1px 0 6px rgb(0 0 0 / 10%);

    .sidebar-footer {
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 16px;
      border-top: 1px solid rgb(128 128 128 / 50%);
    }
  }
}
</style>
