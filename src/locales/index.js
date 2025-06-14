import { createI18n } from 'vue-i18n'
import { local } from '@/plugins/modules/cache'
import defaultSettings from '@/settings'

const locales = require.context('./lang', true, /\.js$/)
const localeSettings = local.getItem('system-settings')

const messages = {}

locales.keys().forEach(key => messages[key.split('/').pop().replace(/\.|js/g, '')] = locales(key).default)

const i18n = createI18n({
    locale: localeSettings?.system.language ?? defaultSettings.system.language,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    messages
})

export const $t = i18n.global.t
// 用于处理复数形式的翻译
export const $tc = i18n.global.tc
// 用于判断翻译是否存在
export const $te = i18n.global.te
// 用于获取当前语言对象
export const $tm = i18n.global.tm

export default i18n
