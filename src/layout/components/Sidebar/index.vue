<template>
    <div :class="['sidebar-container', sidebar.style, { 'dark-sidebar': sidebar.dark }]">
        <slot name="header" />
        <el-scrollbar>
            <slot />
        </el-scrollbar>
        <slot name="footer" />
    </div>
</template>

<script>
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'

export default {
    name: 'Sidebar',
    computed: {
        ...mapState(useSettingsStore, ['sidebar'])
    }
}
</script>

<style lang="scss" scoped>
.sidebar-container {
    height: 100%;
    background: var(--sidebar-menu-bg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: width 0.28s;

    .el-scrollbar {
        :deep(.el-scrollbar__wrap) {
            -webkit-mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%);
            mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%);
        }
    }

    :deep(.el-menu) {
        --el-menu-bg-color: var(--sidebar-menu-bg);
        --el-menu-border-color: var(--sidebar-menu-bg);
        --el-menu-item-height: v-bind('`${sidebar.itemHeight}px`');
        --el-menu-sub-item-height: v-bind('`${sidebar.itemHeight - 6}px`');

        span {
            max-width: 100%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
