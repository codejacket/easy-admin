export const useAppStore = defineStore('app', {
  state: () => ({
    title: '',
    collapse: false,
    showSettings: false,
    tabFullscreen: false,
    isRefresh: false,
    isRelogin: false,
  }),
})
