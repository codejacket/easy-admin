import { createApp } from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import utils from '@/utils'
import plugins from '@/plugins'
import directive from '@/directive'
import { createMetaManager } from 'vue-meta'
import i18n from '@/locales'

// UI组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import '@/assets/styles/index.scss'
import '@/utils/console'
import '@/assets/svg'

// 全局组件
import SvgIcon from '@/components/SvgIcon'
import QueryForm from '@/components/QueryForm'
import TableToolbar from '@/components/TableToolbar'
import EasyForm from '@/components/EasyForm'
import EasyTable from '@/components/EasyTable'
import EasyTablePro from '@/components/EasyTablePro'
import EasyDialog from '@/components/EasyDialog'
import EasyDrawer from '@/components/EasyDrawer'
import EasyColorPicker from '@/components/EasyColorPicker'
import EasyButton from '@/components/EasyButton'
import Pagination from '@/components/Pagination'
import BackTop from '@/components/BackTop'
import JsonViewer from 'vue-json-viewer'
const app = createApp(App)

// 禁用生产提示信息
app.config.productionTip = false

app.component(SvgIcon.name || 'SvgIcon', SvgIcon)
app.component(QueryForm.name || 'QueryForm', QueryForm)
app.component(TableToolbar.name || 'TableToolbar', TableToolbar)
app.component(EasyForm.name || 'EasyForm', EasyForm)
app.component(EasyTable.name || 'EasyTable', EasyTable)
app.component(EasyTablePro.name || 'EasyTablePro', EasyTablePro)
app.component(EasyDialog.name || 'EasyDialog', EasyDialog)
app.component(EasyDrawer.name || 'EasyDrawer', EasyDrawer)
app.component(EasyColorPicker.name || 'EasyColorPicker', EasyColorPicker)
app.component(EasyButton.name || 'EasyButton', EasyButton)
app.component(Pagination.name || 'Pagination', Pagination)
app.component(BackTop.name || 'BackTop', BackTop)
app.component('JsonViewer', JsonViewer)

app.use(store)
app.use(router)
app.use(utils)
app.use(plugins)
app.use(directive)
app.use(createMetaManager(false, { meta: { tag: 'meta', nameless: true } }))
app.use(i18n)
app.use(ElementPlus)

app.mount('#app')
