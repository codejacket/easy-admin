<template>
    <el-container>
        <el-header v-show="!tabFullscreen">
            <Navbar>
                <SystemLogo class="logo-container" />
                <Menu :data="subMenu?.children" :collapse="false" mode="horizontal">
                    <template #default="{ meta }">
                        <svg-icon class="menu-icon" :icon="meta.icon" />
                        <span class="text-ellipsis">{{ meta.title }}</span>
                    </template>
                </Menu>
            </Navbar>
        </el-header>
        <el-container>
            <el-aside :style="{ height: `calc(100vh - ${header.height}px)` }" v-show="!tabFullscreen">
                <Sidebar :style="{ width: `${collapse ? 54 : 90}px` }">
                    <el-menu class="sidebar-menu" :default-active="$route.matched[1]?.path">
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
            <el-main>
                <Tabs v-if="tabs.show && header.fixed" />
                <el-scrollbar class="main-scrollbar"
                    :style="{ height: `calc(100vh - ${header.height + !tabFullscreen * tabs.height}px)` }">
                    <Tabs v-if="tabs.show && !header.fixed" />
                    <AppMain />
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'
import { isExternal } from '@/utils/validate'
import { findFirstLeafNode } from '@/utils/tree'

import Sidebar from "@/layout/components/Sidebar"
import SystemLogo from '@/components/SystemLogo'
import Menu from "@/layout/components/Menu"
import Navbar from '@/layout/components/Navbar'
import Tabs from "@/layout/components/Tabs"
import AppMain from "@/layout/components/AppMain"
import Hamburger from "@/components/Hamburger"

export default {
    name: 'HorizontalMix',
    components: { Sidebar, SystemLogo, Menu, Navbar, Tabs, AppMain, Hamburger },
    computed: {
        ...mapState(useAppStore, ["collapse", "tabFullscreen"]),
        ...mapState(useRouteStore, ["sidebarRoutes"]),
        ...mapState(useSettingsStore, ["header", "tabs"]),
    },
    data() {
        return {
            subMenu: null
        }
    },
    methods: {
        // 查找第一个叶子节点
        findFirstLeafNode,
        handleClick(route) {
            let { path, query } = Array.isArray(route.children) ? this.findFirstLeafNode(route.children) : route
            if (isExternal(path)) {
                this.subMenu = route
                window.open(path)
            } else {
                this.$router.push({ path, query })
            }
        }
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                this.subMenu = this.sidebarRoutes.find(item => item.path === this.$route.matched[1]?.path)
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

    .el-header {
        height: auto;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        z-index: 9;

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

    .el-container {
        .el-aside {
            width: auto;
            box-shadow: 1px 0 6px rgba(0, 0, 0, 0.1);
            -webkit-box-shadow: 1px 0 6px rgba(0, 0, 0, 0.1);
            z-index: 8;

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
    }
}
</style>