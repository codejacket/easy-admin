import i18n from '@/locales'
import { $tm } from '@/locales'
import { getDict } from '@api/system/dict'
import { isEmpty } from 'lodash'

const { availableLocales, mergeLocaleMessage } = i18n.global

export default function(...keys) {
    let nokeys = keys.filter(key => isEmpty($tm(`dict.${key}`)))
    if (nokeys.length) {
        getDict?.(nokeys, availableLocales)?.then(({ data }) => {
            let locales = Object.keys(data).filter(locale => availableLocales.includes(locale))
            locales.forEach(locale => {
                mergeLocaleMessage(locale, {
                    dict: data[locale]
                })
            })
        })
    }
    return keys.reduce((acc, key) => {
        acc[key] = $tm(`dict.${key}`)
        return acc
    }, {})
}