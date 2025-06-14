# 更新日志

## v1.2.2 (2025-06-06)
### 功能增强
- 代码生成新增了打印导入导出功能
- 修复了fieldTable加载卡顿问题
- 升级了element-plus版本到2.10.0
- 添加了用户管理

## v1.2.1 (2025-05-22)
### 功能增强
- 侧边栏增加了渐变遮罩效果
- 新增了防调试功能
- 新增了别名 @api, @store
- 接口采用了Restful风格
- 增强了EasyDialog组件
- 修复了EasyTable组件注释列的异常
- 优化了EasyTable组件
- 添加了代码生成模块
- 修复了复制指令的bug
- EasyTablePro组件添加了sortable功能

## v1.2.0 (2025-05-16)
### 功能优化
- 扁平路由改为了嵌套路由
- 修复了AppMain外边距折叠问题
- settings数据改为嵌套数据
- 新增了版权配置
- 修复了布局组件的bug

## v1.1.9 (2025-05-08)
### 功能增强
- EasyTable组件expandRowKeys属性支持双向绑定
- 修复EasyTablePro组件deleteItems方法的bug
- EasyTablePro组件添加了opened-dialog事件
- EasyDialog组件界面优化
- 新增了EasyDrawer组件
- 新增了跟随系统功能

## v1.1.8 (2025-05-01)
### 升级与优化
- 升级了element-plus版本到2.9.2
- 优化了EasyTablePro组件
- 优化了EasyButton组件
- 优化了列设置文本溢出问题
- 修改了v-hasPerim指令的名称为v-auth
- 优化了Tabs组件动态控制拖拽功能
- EasyTable组件添加了拖拽功能

## v1.1.7 (2025-04-30)
### 新增了EasyTablePro组件
- 新增了EasyTablePro组件
- @/utils/auth.js添加了存储策略
- 修复了EasyRenderer组件中的异常

## v1.1.6 (2025-04-28)
### 功能精简与优化
- 删除了水印组件
- 移动了路由守卫的位置
- 添加了面包屑动画
- 优化了EasyTable组件
- 添加了字典管理

## v1.1.5 (2025-04-25)
### 开发体验优化
- 修改了TableToolbar组件（改为了选项式）
- 添加了dict插件
- 消除了::v-deep编译警告
- 消除 `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` 警告信息
- 添加了首加载的控制台输出
- SlotRenderer 组件改名为 EasyRenderer
- mock接口type选项名改为method
- 修复了arrayToTree方法的bug

## v1.1.4 (2025-04-24)
### 表单设计新增
- 系统工具添加了表单设计模块
- 添加了SlotRenderer组件
- 优化了EasyTable组件（在模板中渲染列）
- 添加了EasyForm组件

## v1.1.3 (2025-04-22)
### 工具与Mock增强
- RightToolbar 组件改名为 TableToolbar
- 自动读取更新日志文件内容
- 删除了table插件
- utils 添加 print.js
- mock 接口支持异步函数了
- mock 新增 timeout 配置
- 更换了状态码的插画
- 删除了代码生成模块
- 全局添加了 `--mian-height` 变量

## v1.1.2 (2025-04-21)
### 表格功能升级
- 添加了table插件
- 升级了EasyTable组件

## v1.1.1 (2025-04-15)
### 图标与路由优化
- 更换了所有系统图标
- 升级了SvgIcon组件
- 修改了 search.svg
- 根目录添加了 CHANGELOG.md 文件
- 修改了 route.meta.title 的值
- 删除了 router 中的 user 路由
- 菜单管理添加了拖拽按钮

## v1.1.0 (2025-04-13)
### 工具函数增强
- utils新增了removeIf函数
- 修复了EasyTable组件的bug
- 优化了IconSelect组件

## v1.0.9 (2025-04-12)
### 组件优化
- 优化了RightToolbar组件
- 优化了EasyTable组件

## v1.0.8 (2025-04-10)
### 功能增强
- 新增了EasyButton组件
- 安装了@intlify/vue-i18n-loader插件
- 新增了路由模式选择
- 验证码组件三合一

## v1.0.7 (2025-04-05)
### 组件重构
- 调整了views目录下的页面模块位置
- AppTable组件名字修改为EasyTable
- AppDialog组件名字修改为EasyDialog
- ColorPick组件名字修改为EasyColorPick
- 新增了QueryForm组件

## v1.0.6 (2025-04-01)
### 多语言与主题增强
- 登录页面新增了语言切换
- 登录页背景图会随着主题变化
- 新增灰色模式
- 新增了 系统工具-代码生成
- 新增了深色侧边栏
- 优化了SettingItem组件

## v1.0.5 (2025-03-28)
### 加载优化
- 修改优化了首加载的动画
- 修改了404插画

## v1.0.4 (2025-03-27)
### 界面优化
- 取消了打印按钮
- 新增了置顶按钮
- 优化了i18n的数据
- 修改了登录背景图

## v1.0.3 (2025-03-25)
### 路由增强
- 给路由添加了图标和标题
- 新增了打印按钮

## v1.0.2 (2025-03-21)
### 布局优化
- 修改了异常页的位置
- 添加了一些基础页面
- 修改了styles的位置
- 修复了水平布局模式下顶栏溢出问题
- 修改了工具栏组件位置
- 给LangSelect组件添加了选中时的钩子

## v1.0.1 (2025-03-17)
### 侧边栏优化
- 修复了侧边栏折叠动画异常
- 新增了标签栏刷新按钮
- 修复了水平混合布局模式下侧边栏溢出问题

## v1.0.0 (2025-03-12)
### 基础功能开发完成
- 基础功能开发完成