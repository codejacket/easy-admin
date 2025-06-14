<template>
    <el-container>
        <el-header v-if="header.fixed">
            <Navbar v-show="!tabFullscreen">
                <SystemLogo class="logo-container" />
                <Menu :data="sidebarRoutes" mode="horizontal">
                    <template #default="{ meta }">
                        <svg-icon class="menu-icon" :icon="meta.icon" />
                        <span class="text-ellipsis">{{ meta.title }}</span>
                    </template>
                </Menu>
            </Navbar>
            <Tabs v-if="tabs.show" />
        </el-header>
        <el-main>
            <el-scrollbar class="main-scrollbar">
                <el-header v-if="!header.fixed">
                    <Navbar v-show="!tabFullscreen">
                        <SystemLogo class="logo-container" />
                        <Menu :data="sidebarRoutes" mode="horizontal">
                            <template #default="{ meta }">
                                <svg-icon class="menu-icon" :icon="meta.icon" />
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

<script>
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'

import SystemLogo from "@/components/SystemLogo"
import Menu from "@/layout/components/Menu"
import Navbar from "@/layout/components/Navbar"
import Tabs from "@/layout/components/Tabs"
import AppMain from "@/layout/components/AppMain"

export default {
    name: 'Horizontal',
    components: { SystemLogo, Menu, Navbar, Tabs, AppMain },
    computed: {
        ...mapState(useAppStore, ["title", "tabFullscreen"]),
        ...mapState(useRouteStore, ["sidebarRoutes"]),
        ...mapState(useSettingsStore, ["header", "tabs"]),
    }
}
</script>

<style lang="scss" scoped>
.el-container {
    width: 100vw;
    height: 100vh;
    background: var(--base-bg);

    .el-header {
        height: auto;

        .logo-container {
            height: 100%;
            margin-left: 30px;
            margin-right: 30px;
            flex-shrink: 0;
        }

        .el-menu {
            width: 100%;
            height: 100%;
            border-bottom: none;

            .is-active {
                &.el-sub-menu>.el-sub-menu__title {
                    color: var(--sidebar-text-color-active);

                    svg {
                        color: var(--sidebar-text-color-active);
                    }
                }

                &.el-menu-item {
                    svg {
                        color: var(--sidebar-text-color-active);
                    }
                }
            }

            .el-menu-item,
            .el-sub-menu {
                &:hover svg {
                    color: var(--sidebar-text-color-active);
                }
            }
        }

        .menu-icon {
            color: var(--sidebar-text-color);
        }
    }
}
</style>