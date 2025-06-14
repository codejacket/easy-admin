<template>
  <el-dropdown trigger="click" teleported>
    <slot :src="avatar" :username="nickname || name">
      <el-avatar :src="avatar" :size="28" class="user-avatar" alt="avatar">
        <img src="@/assets/img/default-avatar.png" />
      </el-avatar>
    </slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="$router.push('/system/profile')">
          <span>
            <svg-icon icon="user-center" />
            {{ $t('common.userCenter') }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item @click="showSettings = true">
          <span>
            <svg-icon icon="setting" />
            {{ $t('common.configuration') }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item divided @click="handleLogout">
          <span>
            <svg-icon icon="power" />
            {{ $t('common.logout') }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { useAppStore } from '@store/app'
import { useTabsStore } from '@store/tabs'
import { useUserStore } from '@store/user'
import { mapState, mapWritableState, mapActions } from 'pinia'

export default {
  name: "Avatar",
  computed: {
    ...mapState(useUserStore, ["name", "nickname", "avatar"]),
    ...mapWritableState(useAppStore, ["showSettings"]),
  },
  methods: {
    ...mapActions(useUserStore, ["logout"]),
    async handleLogout() {
      await this.$modal.confirm.warning(this.$t('message.confirmLogout'))
      await this.logout()
      await this.$router.push("/login")
      // 清除所有标签页
      useTabsStore().$reset()
    },
  },
}
</script>

<style scoped>
  .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    box-sizing: border-box;
  }
</style>
