<template>
    <el-menu :default-active="$route.path" :collapse="collapse" :unique-opened="sidebar.uniqueOpened">
        <template v-for="route in data" :key="route.path">
            <MenuItem  :item="route" v-show="route.meta && !route.meta.hidden">
                <template #default="{ meta }">
                    <slot :meta="meta" />
                </template>
            </MenuItem>
        </template>
    </el-menu>
</template>

<script>
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'

import MenuItem from "./MenuItem"

export default {
    name: 'Menu',
    components: { MenuItem },
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    computed: {
        ...mapState(useAppStore, ["collapse"]),
        ...mapState(useSettingsStore, ["sidebar"])
    }
}
</script>

<style lang="scss" scoped>
.el-menu {
    width: v-bind('sidebar.width + "px"');
}
</style>
