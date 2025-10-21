import { getInfo, login, logout } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    nickname: '',
    avatar: '',
    roles: [],
    auths: [],
  }),
  actions: {
    // 登录
    async login({ username, password }) {
      const { token } = await login(username, password)
      setToken((this.token = token))
    },
    // 退出系统
    async logout() {
      await logout(this.token)
      this.$patch(state => {
        state.token = ''
        state.name = ''
        state.nickname = ''
        state.avatar = ''
        state.roles = []
        state.auths = []
      })
      removeToken()
    },
    // 获取用户信息
    async getInfo() {
      const { data } = await getInfo()
      const user = data.user
      this.$patch(state => {
        state.name = user.username
        state.nickname = user.nickname
        state.avatar = user.avatar
        if (data.roles instanceof Array) state.roles = data.roles
        if (data.auths instanceof Array) state.auths = data.auths
      })
    },
  },
})
