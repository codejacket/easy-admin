import { useUserStore } from '@store/user'

export default {
  mounted(el, binding) {
    const { value } = binding
    const all_auth = '*:*:*'
    const auths = useUserStore().auths
    if (value instanceof Array && value.length) {
      if (!auths.some(auth => all_auth === auth || value.includes(auth))) {
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('v-auth value must be Array, and not empty!')
    }
  },
}
