<script name="Mobile" setup>
import SystemLogo from '@/components/SystemLogo'
import AppMain from '@/layout/components/AppMain'
import Menu from '@/layout/components/Menu'
import LangSelect from '@/layout/components/Navbar/Toolbar/LangSelect'
import MobileSearch from '@/layout/components/Navbar/Toolbar/MobileSearch'
import ModeSwitch from '@/layout/components/Navbar/Toolbar/ModeSwitch'
import Sidebar from '@/layout/components/Sidebar'
import Tabs from '@/layout/components/Tabs'
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'

const showSidebar = ref(false)
const { tabFullscreen } = storeToRefs(useAppStore())
const { sidebarRoutes } = storeToRefs(useRouteStore())
</script>

<template>
  <el-container>
    <el-header>
      <div class="navbar-container" :style="{ height: `${tabFullscreen ? 0 : 50}px` }">
        <div class="left-side">
          <svg-icon
            class="hamburger"
            :style="{ transform: `rotate(${showSidebar ? 0 : 180}deg)` }"
            icon="indent"
            @click="showSidebar = !showSidebar"
          />
        </div>
        <div class="right-side">
          <MobileSearch class="nav-tool" />
          <LangSelect class="nav-tool" />
          <ModeSwitch class="nav-tool" />
        </div>
      </div>
      <Tabs />
    </el-header>
    <el-main>
      <el-scrollbar>
        <AppMain />
      </el-scrollbar>
    </el-main>
  </el-container>
  <el-drawer
    class="sidebar-drawer"
    v-model="showSidebar"
    :with-header="false"
    size="200"
    direction="ltr"
  >
    <Sidebar :width="200">
      <template #header>
        <SystemLogo class="w-full h-50px" />
      </template>
      <Menu :data="sidebarRoutes">
        <template #default="{ meta }">
          <div>
            <svg-icon class="mr-6px" :icon="meta.icon" />
          </div>
          <span>{{ meta.title }}</span>
        </template>
      </Menu>
    </Sidebar>
  </el-drawer>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100vw;
  height: 100vh;

  .el-header {
    height: auto;

    .navbar-container {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 50px;
      overflow: hidden;
      background: var(--navbar-bg);
      box-shadow: var(--el-box-shadow-lighter);
      transition: height 0.28s;

      .left-side {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .hamburger {
          margin: 0 15px;
          font-size: 20px;
          color: var(--tabs-tag-text-color);
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);

          &:hover {
            background: rgb(128 128 128 / 12.2%);
            box-shadow: 0 0 0 6px rgb(128 128 128 / 12.2%);
          }
        }
      }

      .right-side {
        display: flex;
        flex-shrink: 0;
        gap: 16px;
        align-items: center;
        height: 100%;
        padding-right: 12px;
        margin-left: 16px;

        .nav-tool {
          font-size: 18px;
          color: var(--navbar-text-color);
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.sidebar-drawer {
  .el-drawer__body {
    padding: 0;
  }
}
</style>
