export const session = {
  setItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  getItem(key) {
    return JSON.parse(sessionStorage.getItem(key) ?? 'null')
  },
  removeItem(key) {
    sessionStorage.removeItem(key)
  },
}

export const local = {
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  getItem(key) {
    return JSON.parse(localStorage.getItem(key) ?? 'null')
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
}

export default { session, local }
