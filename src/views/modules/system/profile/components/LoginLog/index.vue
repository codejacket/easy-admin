<script name="LoginLog" setup>
import { getLoginLogs } from '@api/system/profile'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)

const list = ref([])

const total = ref(0)

const params = ref({
  currentPage: 1,
  pageSize: 10,
})

getList()

async function getList() {
  loading.value = true
  const { data } = await getLoginLogs(params.value)
  list.value = data.list
  total.value = data.total
  loading.value = false
}
</script>

<template>
  <div class="h100% pl-8px" v-loading="loading">
    <div class="flex flex-col gap14px p14px">
      <easy-table :data="list">
        <el-table-column width="60" prop="id">
          <template #header>{{ t('columns.id') }}</template>
        </el-table-column>
        <el-table-column min-width="180" prop="msg" align="left">
          <template #header>{{ t('columns.msg') }}</template>
        </el-table-column>
        <el-table-column width="120" prop="ipAddress">
          <template #header>{{ t('columns.ipAddress') }}</template>
        </el-table-column>
        <el-table-column min-width="180" prop="loginLocation" align="left">
          <template #header>{{ t('columns.loginLocation') }}</template>
        </el-table-column>
        <el-table-column width="120" prop="browser">
          <template #header>{{ t('columns.browser') }}</template>
        </el-table-column>
        <el-table-column width="120" prop="os">
          <template #header>{{ t('columns.os') }}</template>
        </el-table-column>
        <el-table-column width="180" :formatter="row => $parseTime(row.loginTime)" prop="loginTime">
          <template #header>{{ t('columns.loginTime') }}</template>
        </el-table-column>
      </easy-table>
      <pagination
        v-model:current-page="params.currentPage"
        v-model:page-size="params.pageSize"
        :total="total"
        @change="getList"
      />
    </div>
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped></style>
