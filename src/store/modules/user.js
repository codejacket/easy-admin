import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/login'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: getToken(),
        name: '',
        nickname: '',
        avatar: '',
        roles: [],
        permissions: []
    }),
    actions: {
        // 登录
        async login({ username, password }) {
            const { token } = await login(username, password)
            setToken(this.token = token)
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
                state.permissions = []
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
                if (data.permissions instanceof Array) state.permissions = data.permissions
            })
            return data
        }
    }
})