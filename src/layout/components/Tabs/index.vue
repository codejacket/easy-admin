<template>
    <div :class="['tabs-container', settingsStore.tabs.style]" :style="{ height: `${settingsStore.tabs.height}px` }">
        <ScrollPane ref="scrollPane" class="scroll-pane" @scroll="closeMenu">
            <TabLink ref="tab" v-for="tab in tabs" :key="tab" :route="tab" :draggable="settingsStore.tabs.draggable"
                :show-icon="settingsStore.tabs.showIcon" :show-close="tab.name !== defaultTab"
                @contextmenu.prevent="openMenu($event, tab)" @close="closeTab(tab)" />
        </ScrollPane>
        <TabsToolbar />
        <ul class="contextmenu" v-show="visible" :style="{ left: left + 'px', top: top + 'px' }">
            <li @click="closeTab(selectedTab)" v-if="showCloseTab">
                <svg-icon icon="wrong" />
                {{ $t('operation.closeCurrent') }}
            </li>
            <li @click="closeOthersTabs" v-if="showCloseOthersTabs">
                <svg-icon icon="wrong" />
                {{ $t('operation.closeOthers') }}
            </li>
            <li @click="closeLeftTabs" v-if="showCloseLeftTabs">
                <svg-icon icon="arrow-L" />
                {{ $t('operation.closeLeft') }}
            </li>
            <li @click="closeRightTabs" v-if="showCloseRightTabs">
                <svg-icon icon="arrow-R" />
                {{ $t('operation.closeRight') }}
            </li>
            <li @click="closeAllTabs" v-if="showCloseAllTabs">
                <svg-icon icon="circle-wrong" />
                {{ $t('operation.closeAll') }}
            </li>
        </ul>
    </div>
</template>

<script>
import { useSettingsStore } from '@store/settings'
import { useTabsStore } from '@store/tabs'
import { mapStores, mapState, mapActions } from 'pinia'
import { useDraggable } from "vue-draggable-plus"

import ScrollPane from "./ScrollPane"
import TabLink from "./TabLink"
import TabsToolbar from "./TabsToolbar"

export default {
    name: 'Tabs',
    components: { ScrollPane, TabLink, TabsToolbar },
    data() {
        return {
            left: 0,
            top: 0,
            visible: false,
            selectedTab: {},
            draggableInstance: null,
        }
    },
    computed: {
        ...mapStores(useSettingsStore),
        ...mapState(useTabsStore, ["tabs", "defaultTab"]),
        currentTabIndex() {
            return this.tabs.findIndex(t => t.path === this.$route.path)
        },
        selectedTabIndex() {
            return this.tabs.findIndex(t => t.path === this.selectedTab.path)
        },
        defaultTabIndex() {
            return this.tabs.findIndex(t => t.name === this.defaultTab)
        },
        showCloseTab() {
            return this.selectedTabIndex !== this.defaultTabIndex
        },
        showCloseOthersTabs() {
            return this.tabs.length - 1 - (this.selectedTabIndex !== this.defaultTabIndex)
        },
        showCloseLeftTabs() {
            return this.selectedTabIndex > (this.selectedTabIndex > this.defaultTabIndex)
        },
        showCloseRightTabs() {
            return this.tabs.length - this.selectedTabIndex > (this.selectedTabIndex < this.defaultTabIndex ? 2 : 1)
        },
        showCloseAllTabs() {
            return this.tabs.length > 1
        },
    },
    mounted() {
        this.init()
        this.addTab(this.$route)
        this.draggableInstance = useDraggable(this.$refs.scrollPane.$el.querySelector(".el-scrollbar__view"), this.tabs, {
            animation: 150,
            disabled: !this.settingsStore.tabs.draggable,
            ghostClass: "ghost"
        })
        this.draggableInstance.start()
        document.body.addEventListener("click", this.closeMenu)
    },
    unmounted() {
        document.body.removeEventListener("click", this.closeMenu)
    },
    methods: {
        ...mapActions(useTabsStore, ["init", "addTab", "delTabs"]),
        openMenu(e, tab) {
            this.left = Math.min(e.clientX - this.$el.getBoundingClientRect().left + 15, this.$el.offsetWidth - 105)
            this.top = e.clientY - 50
            this.visible = true
            this.selectedTab = tab
        },
        closeMenu() {
            this.visible = false
        },
        moveToCurrentTab() {
            const tabs = this.$refs.tab
            this.$nextTick(() => {
                for (const [index, tab] of tabs.entries()) {
                    if (tab.route.path === this.$route.path) {
                        const scrollContainer = this.$el.querySelector(".scroll-container")
                        const scrollWrapper = scrollContainer.querySelector(".el-scrollbar__wrap")

                        let containerWidth = scrollContainer.offsetWidth
                        let tabAndTabSpacing = 4
                        let firstTab = null
                        let lastTab = null
                        let prevTab = tabs[index - 1]
                        let nextTab = tabs[index + 1]

                        if (tabs.length) {
                            firstTab = tabs[0]
                            lastTab = tabs.at(-1)
                        }

                        if (firstTab === tab) {
                            scrollWrapper.scrollLeft = 0
                        } else if (lastTab === tab) {
                            scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth
                        } else {
                            let afterNextTabOffsetLeft = nextTab.$el.offsetLeft + nextTab.$el.offsetWidth + tabAndTabSpacing
                            let beforePrevTabOffsetLeft = prevTab.$el.offsetLeft - tabAndTabSpacing

                            if (afterNextTabOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
                                scrollWrapper.scrollLeft = afterNextTabOffsetLeft - containerWidth
                            } else if (beforePrevTabOffsetLeft < scrollWrapper.scrollLeft) {
                                scrollWrapper.scrollLeft = beforePrevTabOffsetLeft
                            }
                        }

                        break
                    }
                }
            })
        },
        toLastTab() {
            let lastTab = this.tabs.at(-1)
            this.$router.push(lastTab.fullPath ?? lastTab.path)
        },
        closeTab(tab) {
            let currentTabIndex = this.currentTabIndex
            let tabIndex = this.tabs.findIndex(t => t.path === tab.path)
            this.delTabs((tab, i) => i === tabIndex)
            if (currentTabIndex === tabIndex) {
                this.toLastTab()
            }
        },
        closeOthersTabs() {
            let currentTabIndex = this.currentTabIndex
            let selectedTabIndex = this.selectedTabIndex
            this.delTabs((tab, i) => i !== currentTabIndex)
            if (currentTabIndex !== selectedTabIndex) {
                this.toLastTab()
            }
        },
        closeLeftTabs() {
            let currentTabIndex = this.currentTabIndex
            let selectedTabIndex = this.selectedTabIndex
            this.delTabs((tab, i) => i < selectedTabIndex)
            if (currentTabIndex < selectedTabIndex) {
                this.toLastTab()
            }
        },
        closeRightTabs() {
            let currentTabIndex = this.currentTabIndex
            let selectedTabIndex = this.selectedTabIndex
            this.delTabs((tab, i) => i > selectedTabIndex)
            if (currentTabIndex > selectedTabIndex) {
                this.toLastTab()
            }
        },
        closeAllTabs() {
            this.delTabs(() => true)
            this.toLastTab()
        }
    },
    watch: {
        $route(route) {
            this.addTab(route)
            this.moveToCurrentTab()
        },
        'settingsStore.tabs.draggable' (val) {
            this.draggableInstance?.option?.('disabled', !val)
        }
    }
}
</script>

<style lang="scss" scoped>
    .tabs-container {
        width: 100%;
        height: 34px;
        background: var(--tabs-bg);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        .scroll-pane .ghost {
            opacity: 0.2;
        }

        .contextmenu {
            padding: 5px 0;
            border-radius: 4px;
            border: 1px solid var(--el-border-color-light);
            background: var(--el-bg-color-overlay);
            box-shadow: var(--el-box-shadow-light);
            font-size: 12px;
            font-weight: 400;
            position: absolute;
            list-style-type: none;
            z-index: 3000;
            cursor: pointer;

            li {
                margin: 0;
                padding: 7px 16px;
                color: var(--el-text-color-regular);

                svg {
                    color: var(--el-text-color-regular);
                    margin-right: 5px;
                }

                &:hover {
                    background: var(--el-color-primary-light-9);
                    color: var(--el-color-primary);

                    svg {
                        color: var(--el-color-primary);
                    }
                }
            }
        }
    }
</style>