<script name="SettingItem" setup>
const props = defineProps({
  is: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  tip: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'small',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="settings-item">
    <span :class="['settings-title', { disabled }]">
      {{ $t(`settings.${title}.title`) }}
      <el-tooltip
        v-if="tip"
        :content="$t(`settings.${title}.tip`)"
        :show-after="500"
        placement="top"
      >
        <svg-icon icon="circle-question-mark" />
      </el-tooltip>
    </span>
    <component :class="{ disabled }" v-bind="$attrs" :is="is" :size="size">
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot v-bind="slotProps ?? {}" :name="name" />
      </template>
    </component>
  </div>
</template>

<style lang="scss" scoped>
.settings-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  color: var(--el-text-color-regular);

  .settings-title {
    svg {
      cursor: pointer;
      opacity: 0.6;
    }

    &.disabled {
      color: var(--el-text-color-placeholder);
    }
  }

  .el-segmented {
    width: 100px;
    padding: 4px;

    svg {
      color: var(--el-segmented-color);
    }

    .is-selected svg {
      color: var(--el-segmented-item-selected-color);
    }
  }

  .el-select,
  .el-input-number {
    width: 100px;
  }

  .el-input {
    width: 140px;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.7;
  }
}
</style>
