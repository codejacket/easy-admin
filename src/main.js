import App from '@/App.vue'
import directive from '@/directive'
import i18n from '@/locales'
import plugins from '@/plugins'
import router from '@/router'
import store from '@/store'
import utils from '@/utils'
import { createHead } from '@unhead/vue'
import { createApp } from 'vue'

// UI组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import '@/assets/style/index.scss'
import '@/assets/svg/index.js'
import 'virtual:uno.css'

import EasyButton from '@/components/EasyButton'
import EasyColorPicker from '@/components/EasyColorPicker'
import EasyDialog from '@/components/EasyDialog'
import EasyDrawer from '@/components/EasyDrawer'
import EasyForm from '@/components/EasyForm'
import EasyTable from '@/components/EasyTable'
import EasyTablePro from '@/components/EasyTablePro'
import Pagination from '@/components/Pagination'
import QueryForm from '@/components/QueryForm'
import SvgIcon from '@/components/SvgIcon'
import TableToolbar from '@/components/TableToolbar'
import { JsonViewer } from 'vue3-json-viewer'

const app = createApp(App)
const head = createHead()

// 禁用生产提示信息
app.config.productionTip = false

app.use(directive)
app.use(i18n)
app.use(plugins)
app.use(router)
app.use(store)
app.use(utils)
app.use(head)
app.use(ElementPlus)

app.component(EasyButton.name || 'EasyButton', EasyButton)
app.component(EasyColorPicker.name || 'EasyColorPicker', EasyColorPicker)
app.component(EasyDialog.name || 'EasyDialog', EasyDialog)
app.component(EasyDrawer.name || 'EasyDrawer', EasyDrawer)
app.component(EasyForm.name || 'EasyForm', EasyForm)
app.component(EasyTable.name || 'EasyTable', EasyTable)
app.component(EasyTablePro.name || 'EasyTablePro', EasyTablePro)
app.component(Pagination.name || 'Pagination', Pagination)
app.component(SvgIcon.name || 'SvgIcon', SvgIcon)
app.component(QueryForm.name || 'QueryForm', QueryForm)
app.component(TableToolbar.name || 'TableToolbar', TableToolbar)
app.component(JsonViewer.name || 'JsonViewer', JsonViewer)

app.mount('#app')
