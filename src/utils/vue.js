export function createRefProxy(r) {
  return new Proxy(
    {},
    {
      get(target, key) {
        return r.value?.[key]
      },
      has(target, key) {
        return key in r.value
      },
    },
  )
}
