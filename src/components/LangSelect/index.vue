<template>
    <el-dropdown class="lang-select" trigger="click">
        <svg-icon icon="translate" aria-hidden />
        <template #dropdown>
            <el-dropdown-menu>
                <template v-for="(val, key) in $tm('settings.system.children.language.options')" :key="key">
                    <el-dropdown-item @click="system.language = key" 
                        :class="{ 'primary-color': system.language === key }"
                        style="justify-content: space-between">
                        {{ val }}
                        <svg-icon icon="right" style="margin-left: 5px" v-if="system.language === key" />
                    </el-dropdown-item>
                </template>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import { useSettingsStore } from '@store/settings'
import { mapWritableState } from 'pinia'

export default {
    name: 'LangSwitch',
    computed: {
        ...mapWritableState(useSettingsStore, ['system'])
    }
}
</script>

<style lang="scss" scoped>
    .lang-select {
        svg {
            width: 18px;
            height: 18px;
            color: var(--navbar-icon-fill-color);
            outline: none;
            cursor: pointer;
        }
    }
</style>