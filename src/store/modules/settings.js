import { defineStore } from 'pinia'
import { useAppStore } from '@store/app'
import { ref, toRefs, watch, watchEffect } from 'vue'
import { colord } from 'colord'
import { mixColor, fade, invert } from '@/utils/color'
import { cloneDeep, mapValues } from 'lodash'
import { local } from '@/plugins/modules/cache'
import defaultSettings from '@/settings'
import i18n from '@/locales'

export const useSettingsStore = defineStore('settings', () => {
    const media = matchMedia('(prefers-color-scheme: light)')
    const storageSettings = local.getItem('system-settings')
    const settings = ref(cloneDeep(mapValues(defaultSettings, (val, key) => storageSettings?.[key] ?? val)))
    const light = ref(media.matches)

    // 监听 system.language
    watch(() => settings.value.system.language, (language) => {
        i18n.global.locale = language
    }, { immediate: true })

    // 监听 system.mode
    watch(() => settings.value.system.mode, (mode) => {
        light.value = mode === 'auto' ? media.matches : mode === 'light'
    }, { immediate: true })

    // 监听 prefers-prefers-color-scheme
    media.addEventListener('change', () => {
        light.value = settings.value.system.mode === 'auto' ? media.matches : settings.value.system.mode === 'light'
    })

    // 监听 light
    watch(() => light.value, (light) => {
        document.documentElement.className = light ? 'light' : 'dark'
    }, { immediate: true })

    // 监听 system.grey
    watch(() => settings.value.system.grey, (grey) => {
        document.documentElement.classList[grey ? 'add' : 'remove']('grey')
    }, { immediate: true })

    // 监听 system.colorWeak
    watch(() => settings.value.system.colorWeak, (colorWeak) => {
        document.documentElement.classList[colorWeak ? 'add' : 'remove']('color-weak')
    }, { immediate: true })

    // 设置 css 变量
    let appStore = useAppStore()
    watchEffect(() => {
        let headerHeight = !appStore.tabFullscreen * settings.value.header.height
        let tabsHeight = settings.value.tabs.show * settings.value.tabs.height
        let mainHeight = `calc(100vh - ${headerHeight + tabsHeight}px)`
        appendStyle('system-vars', createStyleStr(settings.value.theme, mainHeight))
    })

    return {
        light,
        ...toRefs(settings.value),
        // 保存配置
        saveSettings() {
            local.setItem("system-settings", this.$state)
        },
        // 恢复默认
        resetSettings() {
            local.removeItem("system-settings")
            this.$patch(state => {
                for (const key in defaultSettings) {
                    state[key] = cloneDeep(defaultSettings[key])
                }
            })
        }
    }
}, {
    persist: {
        storage: sessionStorage
    }
})

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

    let lightStyles = colorTypes.flatMap(colorType => createCssVars(theme[colorType], baseColor['light'], colorType))
    let darkStyles = colorTypes.flatMap(colorType => createCssVars(theme[colorType], baseColor['dark'], colorType))

    return `
        html {
            --main-height: ${mainHeight};
            --el-color-primary-h: ${primaryHsl.h};
            --el-color-primary-s: ${primaryHsl.s};
            --el-color-primary-l: ${primaryHsl.l};
        }
        html.light {
            --light: 1;
            ${lightStyles.join(';')}
        }
        html.dark {
            --light: 0;
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
