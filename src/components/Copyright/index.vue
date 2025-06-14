<template>
    <span class="copyright">
        {{ $t('system.copyright', { date: copyright.date, company: copyright.company }) }}
        <el-divider direction="vertical" />
        {{ $t('system.icp', { icp: copyright.icp })  }}
    </span>
</template>

<script>
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'
export default {
    name: 'Copyright',
    computed: {
        ...mapState(useSettingsStore, ['copyright'])
    }
}
</script>

<style scoped>
.copyright {
    color: var(--el-text-color-secondary);
    font-size: 12px;

    .el-divider {
        margin: 0 5px;
        border-color: currentColor;
    }
}
</style>