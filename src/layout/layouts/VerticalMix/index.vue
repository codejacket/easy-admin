<template>
    <el-container>
        <el-aside class="sidebar" v-show="!tabFullscreen">
            <Sidebar :style="{ width: `${collapse ? 54 : 90}px` }">
                <template #header>
                    <SystemLogo class="logo-container" collapse />
                </template>
                <el-menu class="sidebar-menu" :default-active="`/${$route.path.split('/')[1]}`">
                    <el-menu-item v-for="item in sidebarRoutes" :key="item.path" :index="item.path"
                        @click="handleClick(item)">
                        <svg-icon :icon="item.meta.icon" />
                        <span v-if="!collapse">{{ item.meta.title }}</span>
                    </el-menu-item>
                </el-menu>
                <template #footer>
                    <div class="sidebar-footer-container">
                        <Hamburger />
                    </div>
                </template>
            </Sidebar>
        </el-aside>
        <el-container>
            <el-aside :style="{ position: fixSubMenu ? 'relative' : 'absolute' }">
                <Sidebar class="sidebar-submenu" :style="{ width: `${subMenu?.children ? 215 : 0}px` }"
                    v-show="!tabFullscreen" @mouseleave="handleMouseleave">
                    <template #header>
                        <div class="sidebar-submenu-title">
                            <h2 style="color: var(--el-color-primary)">{{ $t('system.title') }}</h2>
                            <svg-icon
                                :icon="fixSubMenu ? 'pin-fixed' : 'pin'"
                                :style="{ color: fixSubMenu ? 'var(--el-color-primary)' : '#808080' }"
                                :class="{ 'primary-color': fixSubMenu }"
                                @click="fixSubMenu = !fixSubMenu" />
                        </div>
                    </template>
                    <Menu :data="subMenu?.children" :collapse="false">
                        <template #default="{ meta }">
                            <div><svg-icon class="menu-icon" :icon="meta.icon" /></div>
                            <span>{{ meta.title }}</span>
                        </template>
                    </Menu>
                </Sidebar>
            </el-aside>
            <el-container>
                <el-header>
                    <div v-if="header.fixed">
                        <Navbar v-show="!tabFullscreen">
                            <Hamburger style="margin: 0 15px" />
                            <Breadcrumb v-if="header.showBreadcrumb" />
                        </Navbar>
                        <Tabs v-if="tabs.show" />
                    </div>
                </el-header>
                <el-main>
                    <el-scrollbar class="main-scrollbar">
                        <div v-if="!header.fixed">
                            <Navbar v-show="!tabFullscreen">
                                <Hamburger style="margin: 0 15px" />
                                <Breadcrumb v-if="header.showBreadcrumb" />
                            </Navbar>
                            <Tabs v-if="tabs.show" />
                        </div>
                        <AppMain />
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'
import { isExternal } from '@/utils/validate'

import Sidebar from "@/layout/components/Sidebar"
import SystemLogo from "@/components/SystemLogo"
import Menu from "@/layout/components/Menu"
import Navbar from "@/layout/components/Navbar"
import Tabs from "@/layout/components/Tabs"
import AppMain from "@/layout/components/AppMain"
import Hamburger from "@/components/Hamburger"
import Breadcrumb from "@/components/Breadcrumb"

export default {
    name: 'VerticalMix',
    components: { Sidebar, SystemLogo, Menu, Navbar, Tabs, AppMain, Hamburger, Breadcrumb },
    data() {
        return {
            subMenu: null,
            fixSubMenu: false
        }
    },
    computed: {
        ...mapState(useAppStore, ["collapse", "tabFullscreen"]),
        ...mapState(useRouteStore, ["sidebarRoutes"]),
        ...mapState(useSettingsStore, ["header", "tabs"])
    },
    methods: {
        handleClick(route) {
            this.subMenu = route
            if (!Array.isArray(route.children)) {
                if (isExternal(route.path)) {
                    window.open(route.path)
                } else {
                    this.$router.push({
                        path: route.path,
                        query: route.query
                    })
                }
            }
        },
        handleMouseleave(e) {
            if (e.layerX > 0 && !this.fixSubMenu) {
                this.subMenu = null
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.el-container {
    width: 100vw;
    height: 100vh;
    background: var(--base-bg);

    .sidebar {
        width: auto;
        box-shadow: 1px 0 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 1px 0 6px rgba(0, 0, 0, 0.1);
        display: flex;
        z-index: 2002;

        .logo-container {
            width: 100%;
            height: 50px;
        }

        .sidebar-menu {
            .el-menu-item {
                margin-bottom: 6px;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 4px;

                span {
                    line-height: normal;
                    font-size: smaller;
                }
            }
        }

        .sidebar-footer-container {
            width: 100%;
            height: 50px;
            border-top: 1px solid #333;
            display: flex;
            justify-content: center;
            align-items: center;

            svg {
                color: var(--sidebar-text-color);
            }
        }
    }

    .el-container {
        .el-aside {
            width: auto;
            height: 100%;
            box-shadow: 1px 0 6px rgba(0, 0, 0, 0.1);
            -webkit-box-shadow: 1px 0 6px rgba(0, 0, 0, 0.1);
            z-index: 2001;

            .sidebar-submenu {
                box-shadow: 1px 0 6px rgba(0, 0, 0, 0.1);
                flex-shrink: 0;
                transition: 0.28s;

                .sidebar-submenu-title {
                    height: 50px;
                    padding: 0 10px;
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;

                    h2 {
                        font-weight: 700;
                        font-size: 16px;
                        overflow: hidden;
                        white-space: nowrap;
                        cursor: pointer;
                    }

                    svg {
                        cursor: pointer;

                        &:hover {
                            background: rgba(128, 128, 128, 0.122);
                            box-shadow: 0 0 0 4px rgba(128, 128, 128, 0.122);
                        }
                    }
                }
            }
        }

        .el-header {
            height: auto;
        }
    }
}
</style>