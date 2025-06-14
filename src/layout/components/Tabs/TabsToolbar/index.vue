<template>
    <div class="tabs-toolbar">
        <el-tooltip :content="$t('common.refresh')" effect="light" :show-after="600">
            <div class="refresh" v-on-click-rotate @click="isRefresh = true">
                <svg-icon icon="refresh" aria-hidden="false" />
            </div>
        </el-tooltip>
        <el-tooltip :content="$t(`common.${tabFullscreen ? 'exitFullscreen' : 'fullscreen'}`)" effect="light"
            :show-after="600">
            <svg-icon :icon="tabFullscreen ? 'fullscreen-exit' : 'fullscreen'" aria-hidden="false"
                @click="tabFullscreen = !tabFullscreen" />
        </el-tooltip>
    </div>
</template>

<script>
import { useAppStore } from '@store/app'
import { mapWritableState } from 'pinia'

export default {
    name: 'TabsToolbar',
    computed: {
        ...mapWritableState(useAppStore, ['tabFullscreen', 'isRefresh'])
    }
}
</script>

<style lang="scss" scoped>
    .tabs-toolbar {
        padding: 0 8px;
        display: flex;
        align-items: center;

        & > * {
            width: 16px;
            height: 16px;
            padding: 5px;
            border-radius: 2px;
            cursor: pointer;

            &:hover {
                background: rgba(128, 128, 128, 0.122);
            }
        }

        svg {
            color: var(--navbar-icon-fill-color);
            outline: none;
        }

        .refresh {
            display: flex;
            align-items: center;
        }
    }
</style>