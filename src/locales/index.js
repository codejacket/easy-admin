import defaultSettings from '@/settings'
import { local } from '@plugins/cache'
import { createI18n } from 'vue-i18n'

const locales = import.meta.glob('./lang/*.js')
const localeSettings = local.getItem('system-settings')

const messages = {}

// 遍历 locales 对象
for (const key in locales) {
  const res = await locales[key]()
  const langCode = key.split('/').at(-1).split('.')[0]
  messages[langCode] = res.default
}

const getLocale = () => {
  if (localeSettings?.language) {
    return localeSettings?.language
  } else if (Object.keys(messages).includes(navigator.language)) {
    return navigator.language
  } else {
    return defaultSettings.language
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  fallbackLocale: 'en',
  missingWarn: false,
  silentTranslationWarn: true,
  messages,
})

export default i18n
export const {
  t: $t, // 用于根据键（key）获取对应的翻译文本
  tc: $tc, // 用于处理复数形式的翻译文本
  te: $te, // 用于检查指定的翻译键是否存在
  tm: $tm, // 获取翻译消息对象（message object）而非解析后的字符串
  d: $d, // 用于日期时间格式化
  n: $n, // 用于数字格式化（支持复数、货币、百分比等）
} = i18n.global

export function setLocale(locale) {
  i18n.global.locale.value = locale
}
