<script name="Avatar" setup>
import { $t } from '@/locales'
import modal from '@plugins/modal'
import { useAppStore } from '@store/app'
import { useTabsStore } from '@store/tabs'
import { useUserStore } from '@store/user'
import { useRouter } from 'vue-router'

const { showSettings } = storeToRefs(useAppStore())
const userStore = useUserStore()
const { name, nickname, avatar } = storeToRefs(userStore)
const tabsStore = useTabsStore()
const router = useRouter()

async function handleLogout() {
  await modal.confirm.warning($t('message.confirmLogout'))
  await userStore.logout()
  await router.push('/login')
  // 清除所有标签页
  tabsStore.$reset()
}
</script>

<template>
  <el-dropdown trigger="click" teleported>
    <slot :src="avatar" :username="nickname || name">
      <el-avatar
        class="box-border w-28px h-28px rounded-full"
        :src="avatar"
        :size="28"
        alt="avatar"
      >
        <img src="@/assets/img/default-avatar.png" />
      </el-avatar>
    </slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="router.push('/system/profile')">
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
