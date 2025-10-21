import Cookies from 'js-cookie'

const TOKEN_KEY = 'Admin-Token'
const STORAGE_TYPE = 'localStorage'

// 存储策略
const storageStrategies = {
  cookies: {
    getToken() {
      return Cookies.get(TOKEN_KEY)
    },
    setToken(token) {
      return Cookies.set(TOKEN_KEY, token)
    },
    removeToken() {
      return Cookies.remove(TOKEN_KEY)
    },
  },
  localStorage: {
    getToken() {
      return localStorage.getItem(TOKEN_KEY)
    },
    setToken(token) {
      return localStorage.setItem(TOKEN_KEY, token)
    },
    removeToken() {
      return localStorage.removeItem(TOKEN_KEY)
    },
  },
}

export const { getToken, setToken, removeToken } = storageStrategies[STORAGE_TYPE]
