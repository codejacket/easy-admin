import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  theme: {
    colors: {
      'el-text-color-regular': 'var(--el-text-color-regular)',
    },
  },
})
