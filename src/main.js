import { createApp } from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import plugins from '@/plugins'
import directive from '@/directive'
import { createMetaManager } from 'vue-meta'
import i18n from '@/locales'

// UI组件库
import DataV, { setClassPrefix } from '@dataview/datav-vue3'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import '@/assets/styles/index.scss'
import '@/permission'
import '@/assets/svg'

// 全局方法
import { parseTime } from '@/utils'
import { download } from '@/utils/request'

// 全局组件
import SvgIcon from '@/components/SvgIcon'
import QueryForm from '@/components/QueryForm'
import RightToolbar from '@/components/RightToolbar'
import EasyTable from '@/components/EasyTable'
import EasyDialog from '@/components/EasyDialog'
import EasyColorPicker from '@/components/EasyColorPicker'
import EasyButton from '@/components/EasyButton'
import Pagination from '@/components/Pagination'
import BackTop from '@/components/BackTop'

const app = createApp(App)

// 禁用生产提示信息
app.config.productionTip = false

app.config.globalProperties.$parseTime = parseTime
app.config.globalProperties.$download = download

app.component(SvgIcon.name || 'SvgIcon', SvgIcon)
app.component(QueryForm.name || 'QueryForm', QueryForm)
app.component(RightToolbar.name || 'RightToolbar', RightToolbar)
app.component(EasyTable.name || 'EasyTable', EasyTable)
app.component(EasyDialog.name || 'EasyDialog', EasyDialog)
app.component(EasyColorPicker.name || 'EasyColorPicker', EasyColorPicker)
app.component(EasyButton.name || 'EasyButton', EasyButton)
app.component(Pagination.name || 'Pagination', Pagination)
app.component(BackTop.name || 'BackTop', BackTop)

app.use(store)
app.use(router)
app.use(plugins)
app.use(directive)
app.use(createMetaManager(false, { meta: { tag: 'meta', nameless: true } }))
app.use(i18n)
app.use(DataV, { classNamePrefix: 'Dv' })
app.use(ElementPlus)

app.mount('#app')
