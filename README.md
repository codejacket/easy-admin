<div align="center">
    <a href="https://easy-admin.cn">
        <img alt="Easy-Admin Logo" width="120" src="https://github.com/codejck/assets/blob/main/logo.png?raw=true">
    </a>
    <br>
    <br>
    <h1>Easy-Admin</h1>
    简体中文 | <a href="#">English</a>
</div>

## 项目概述

Easy-Admin 是一款基于 Vue3 开发的开源后台管理系统框架， 采用 Vue CLI、Vue Router、Vue I18n、Element Plus、Pinia、Axios 等主流技术栈。 它具备丰富的基础功能模块，支持多语言切换与灵活的权限管理，代码结构清晰，扩展性强。无论是快速搭建项目， 还是作为学习 Vue3 开发的实践范例， Easy-Admin 都能提供高效、便捷的解决方案，帮助开发者轻松应对各类后台管理需求 。

---

**项目使用**

```bash
# 安装依赖
npm install

# 运行项目
npm run dev

# 打包项目
npm run build

# 克隆项目
git clone https://github.com/gg3081779049/easy-admin.git
```

## 预览
测试账号: admin / admin1234

![](https://github.com/codejck/assets/blob/main/preview1.png?raw=true)

![](https://github.com/codejck/assets/blob/main/preview2.png?raw=true)

![](https://github.com/codejck/assets/blob/main/preview3.png?raw=true)

**目录结构**
```
├── bin  命令文件
├── dist 打包出来的文件
├── mock 模拟数据
│   ├── modules  模拟数据模块
│   └── index.js  模拟数据入口文件
├── public  静态文件
│   ├── favicon.ico  网站图标
│   └── index.html  网站入口文件
├── src  开发的总目录
│   ├── api  接口api
│   ├── assets  静态文件
│   │   ├── img  图片文件
│   │   ├── styles  全局的样式文件
│   │   └── svg  全局svg文件
│   │       ├── icons  普通图标
│   │       ├── layout  布局图标
│   │       ├── state  http状态图标
│   │       └── index.js  导入所有图标文件
│   ├── components  通用组件和业务的组件
│   ├── directive  指令
│   │   ├── modules  指令模块
│   │   └── index.js  指令入口文件
│   ├── layout  布局文件
│   │   ├── components  布局组件模块
│   │   ├── layouts  布局组件
│   │   └── index.js  布局入口文件
│   ├── locales  国际化文件
│   │   ├── lang  多语言模块
│   │   └── index.js  国际化入口文件
│   ├── plugins  插件
│   │   ├── modules  插件模块
│   │   └── index.js  插件入口文件
│   ├── router  路由
│   │   ├── guard.js  路由守卫
│   │   └── index.js  路由入口文件
│   ├── store  数据状态管理
│   │   ├── modules  状态管理划分的模块
│   │   └── index.js  pinia入口文件
│   ├── styles  全局的样式文件
│   ├── utils  全局的公共方法和工具
│   ├── views  所有的页面
|   │   ├── modules  页面模块
│   │   ├── 401  401页面
│   │   ├── 404  404页面
│   │   ├── login  登录页面
│   │   └── register  注册页面
│   ├── App.vue  vue最外层组件
│   ├── main.js  vue入口文件
│   └── settings.js  系统配置文件
```

## 联系与支持

如果在使用 Easy-Admin 过程中遇到问题或有任何建议，欢迎通过以下方式联系我们：

**GitHub Issues**：在项目仓库的[Issues 页面](https://github.com/gg3081779049/easy-admin/issues)提交问题或反馈，我们会及时查看并回复。

**邮箱**：\[gg3081779049@qq.com]，你也可以发送邮件详细描述你的问题或建议。

## 感谢你的喜爱与支持
无需捐赠，如果你觉得这个项目有帮助，或者正在使用它，欢迎前往 Github 或 Gitee 为我们点亮一颗 ⭐ Star。你的认可是我们持续优化的最大动力！
