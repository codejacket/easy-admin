import i18n, { $tm } from '@/locales'
import { getDicts } from '@api/system/dict'
import { isEmpty } from 'lodash-es'

const { availableLocales, mergeLocaleMessage } = i18n.global

export default {
  get(type) {
    return this.all([type]).value?.[type]
  },
  all(types) {
    let missing = types.filter(type => isEmpty($tm(`dict.${type}`)))
    if (missing.length) {
      getDicts({
        types: missing,
        locales: availableLocales,
      }).then(({ data }) => {
        for (const [locale, dicts] of Object.entries(data)) {
          if (availableLocales.includes(locale)) {
            mergeLocaleMessage(locale, { dict: dicts })
          }
        }
      })
    }
    return computed(() => {
      return types.reduce((acc, type) => {
        acc[type] = $tm(`dict.${type}`)
        return acc
      }, {})
    })
  },
}
