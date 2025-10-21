import { setLocale } from '@/locales'
import defaultSettings from '@/settings'
import { useAppStore } from '@/store/modules/app'
import { colord, fade, invert, mixColor } from '@/utils/color'
import { local } from '@plugins/cache'
import { cloneDeep, mapValues } from 'lodash-es'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const media = matchMedia('(prefers-color-scheme: light)')
    const storageSettings = local.getItem('system-settings')
    const mergedSettings = cloneDeep(
      mapValues(defaultSettings, (v, k) => storageSettings?.[k] ?? v),
    )

    const settings = reactive({
      system: {
        light: media.matches,
      },
      ...mergedSettings,
    })

    watch(() => settings.system.language, setLocale, { immediate: true })

    watch(
      () => settings.system.mode,
      mode => {
        settings.system.light = mode === 'auto' ? media.matches : mode === 'light'
      },
      { immediate: true },
    )

    media.addEventListener('change', () => {
      let mode = settings.system.mode
      settings.system.light = mode === 'auto' ? media.matches : mode === 'light'
    })

    watch(
      () => settings.system.light,
      light => {
        document.documentElement.className = light ? 'light' : 'dark'
      },
      { immediate: true },
    )

    watch(
      () => settings.system.grey,
      grey => {
        document.documentElement.classList[grey ? 'add' : 'remove']('grey')
      },
      { immediate: true },
    )

    watch(
      () => settings.system.colorWeak,
      colorWeak => {
        document.documentElement.classList[colorWeak ? 'add' : 'remove']('color-weak')
      },
      { immediate: true },
    )

    // 设置 css 变量
    let appStore = useAppStore()
    watchEffect(() => {
      let headerHeight = !appStore.tabFullscreen * settings.header.height
      let tabsHeight = settings.tabs.show * settings.tabs.height
      let mainHeight = `calc(100vh - ${headerHeight + tabsHeight}px)`
      appendStyle('system-vars', createStyleStr(settings.theme, mainHeight))
    })

    return {
      ...toRefs(settings),
      // 保存配置
      saveSettings() {
        local.setItem('system-settings', this.$state)
      },
      // 恢复默认
      resetSettings() {
        local.removeItem('system-settings')
        this.$patch(state => {
          for (const key in defaultSettings) {
            state[key] = cloneDeep(defaultSettings[key])
          }
        })
      },
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)

function appendStyle(styleId, content) {
  const style = document.querySelector(`#${styleId}`) || document.createElement('style')
  style.id = styleId
  style.textContent = content
  document.head.appendChild(style)
}

function createStyleStr(theme, mainHeight) {
  let colorTypes = ['primary', 'success', 'info', 'warning', 'danger']
  let baseColor = { 'light': '#ffffff', 'dark': '#0a0a0a' }
  let primaryHsl = colord(theme.primary).toHsl()

  let lightStyles = colorTypes.flatMap(colorType =>
    createCssVars(theme[colorType], baseColor['light'], colorType),
  )
  let darkStyles = colorTypes.flatMap(colorType =>
    createCssVars(theme[colorType], baseColor['dark'], colorType),
  )

  return `
      html {
          --main-height: ${mainHeight};
          --el-color-primary-h: ${primaryHsl.h};
          --el-color-primary-s: ${primaryHsl.s};
          --el-color-primary-l: ${primaryHsl.l};
      }
      html.light {
          --is-light: 1;
          ${lightStyles.join(';')}
      }
      html.dark {
          --is-light: 0;
          ${darkStyles.join(';')}
      }
  `
}

function createCssVars(color, baseColor, colorType) {
  return Object.entries({
    '': 1,
    '-dark-2': 1.2,
    '-light-3': 0.7,
    '-light-5': 0.5,
    '-light-7': 0.3,
    '-light-8': 0.2,
    '-light-9': 0.1,
  }).map(([key, val]) => {
    if (val > 1) {
      return `--el-color-${colorType}${key}: ${mixColor(fade(invert(baseColor), val - 1), color).toHslString()}`
    } else {
      return `--el-color-${colorType}${key}: ${mixColor(fade(color, val), baseColor).toHslString()}`
    }
  })
}
