export default {
    // 系统
    system: {
        // 浅色模式
        mode: 'auto',
        // 系统布局
        layout: 'vertical',
        // 系统语言
        language: 'zh',
        // 页面切换动画类型
        pageAnimateType: 'fade',
        // 是否开启动态标题
        dynamicTitle: false,
        // 是否开启水印
        watermark: false,
        // 是否开启灰色模式
        grey: false,
        // 是否开启色弱模式
        colorWeak: false,
    },
    // 头部
    header: {
        // 头部高度
        height: 50,
        // 是否固定头部
        fixed: true,
        // 是否显示面包屑
        showBreadcrumb: true,
        // 是否显示面包屑图标
        showBreadcrumbIcon: true,
    },
    // 标签栏
    tabs: {
        // 标签栏高度
        height: 40,
        // 标签栏风格
        style: 'card',
        // 是否显示标签栏
        show: true,
        // 是否显示标签栏图标
        showIcon: true,
        // 是否开启标签拖拽
        draggable: true,
    },
    // 侧边栏
    sidebar: {
        // 宽度
        width: 216,
        // 菜单项高度
        itemHeight: 50,
        // 菜单项风格
        style: 'card',
        // 深色侧边栏
        dark: true,
        // 是否只保持一个子菜单展开
        uniqueOpened: true,
    },
    // 主题颜色
    theme: {
        // 主题色
        primary: '#409eff',
        // 成功色
        success: '#67c23a',
        // 信息色
        info: '#909399',
        // 警告色
        warning: '#e6a23c',
        // 错误色
        danger: '#f56c6c',
    },
    // 工具栏
    navToolbar: [
        { is: 'NavbarSearch', icon: 'search', show: true },
        { is: 'Screenfull', icon: 'fullscreen', show: true },
        { is: 'DataScreen', icon: 'screen', show: true },
        { is: 'LangSelect', icon: 'translate', show: true },
        { is: 'ModeSwitch', icon: 'light', show: true },
    ],
    // 版权
    copyright: {
        // 是否显示
        show: true,
        // 公司名称
        company: 'Easy-Admin',
        // 日期
        date: '2025',
        // 备案号
        icp: '粤ICP备2025413388号',
    }
}