import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default {
  ...zhCn,
  'system': {
    'title': 'Easy-Admin',
    'icp': '备案号：粤ICP备2025413388号',
    'copyright': '版权所有 © 2025 Easy-Admin 保留所有权利',
    'watermark': 'Easy-Admin',
  },
  'common': {
    'back': '返回',
    'backtop': '回到顶部',
    'systemTip': '系统提示',
    'backHome': '返回首页',
    'relogin': '重新登录',
    'logout': '退出登录',
    'confirm': '确定',
    'cancel': '取消',
    'search': '搜索',
    'select': '选择',
    'add': '新增',
    'delete': '删除',
    'update': '修改',
    'edit': '编辑',
    'drag': '拖拽',
    'copy': '复制',
    'operation': '操作',
    'expand': '展开',
    'collapse': '折叠',
    'fullscreen': '全屏',
    'exitFullscreen': '退出全屏',
    'closeCurrent': '关闭当前',
    'closeOthers': '关闭其他',
    'closeLeft': '关闭左侧',
    'closeRight': '关闭右侧',
    'closeAll': '全部关闭',
    'save': '保存配置',
    'reset': '重置',
    'resetDefault': '恢复默认',
    'userCenter': '个人中心',
    'configuration': '系统配置',
    'showSearchBar': '显示搜索栏',
    'hiddenSearchBar': '隐藏搜索栏',
    'import': '导入',
    'export': '导出',
    'print': '打印',
    'columnSetting': '列设置',
    'refresh': '刷新',
    'clickUploadAvatar': '点击上传头像',
  },
  'message': {
    'loginSuccess': '登录成功',
    'operationSuccess': '操作成功',
    'addSuccess': '新增成功',
    'deleteSuccess': '删除成功',
    'updateSuccess': '修改成功',
    'confirmDelete': '确认删除？',
    'selectDeleteItems': '请选择要删除的数据',
    'fileFormatError': '文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。',
    'confirmLogout': '确定要退出系统吗？',
    'unsupportFullscreen': '你的浏览器不支持全屏',
    'saving': '正在保存到本地，请稍候...',
    'reseting': '正在清除设置，请稍候...',
    'copied': '已复制',
    'loginExpired': '登录状态已过期，您可以继续留在该页面，或者重新登录',
    'loading': '加载中...',
  },
  'state': {
    '401': '认证失败，无法访问系统资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    'default': '系统未知错误',
  },
  'settings': {
    'system': {
      'title': '系统',
      'children': {
        'mode': {
          'title': '模式',
          'options': {
            'light': '白天',
            'dark': '黑夜',
            'auto': '自动',
          },
        },
        'layout': {
          'options': {
            'vertical': '左侧菜单模式',
            'vertical-mix': '左侧菜单混合模式',
            'horizontal': '顶部菜单模式',
            'horizontal-mix': '顶部菜单混合模式',
          },
        },
        'language': {
          'title': '语言',
          'placeholder': '选择语言',
          'options': {
            'en': 'English',
            'zh-CN': '简体中文',
          },
        },
        'pageAnimateType': {
          'title': '页面切换动画',
          'options': {
            'fade': '淡入淡出',
            'fade-zoom': '缩放淡入',
            'slide-right': '向右滑动',
            'slide-bottom': '向下滑动',
            'flip': '翻页',
            'none': '无',
          },
        },
        'dynamicTitle': {
          'title': '开启动态标题',
        },
        'watermark': {
          'title': '开启水印',
        },
        'grey': {
          'title': '灰色模式',
        },
        'colorWeak': {
          'title': '色弱模式',
        },
      },
    },
    'theme': {
      'title': '主题',
      'children': {
        'primary': {
          'title': '主题色',
        },
        'success': {
          'title': '成功色',
        },
        'info': {
          'title': '消息色',
        },
        'warning': {
          'title': '警告色',
        },
        'danger': {
          'title': '危险色',
        },
      },
    },
    'header': {
      'title': '顶栏',
      'children': {
        'height': {
          'title': '头部高度',
        },
        'fixed': {
          'title': '固定头部',
          'tip': '开启后，顶栏和标签栏将固定在顶部',
        },
        'showBreadcrumb': {
          'title': '显示面包屑',
        },
        'showBreadcrumbIcon': {
          'title': '显示面包屑图标',
        },
      },
    },
    'navToolbar': {
      'title': '工具栏',
      'options': {
        'Search': '搜索',
        'Fullscreen': '全屏',
        'DataScreen': '数据大屏',
        'LangSelect': '语言切换',
        'ModeSwitch': '模式切换',
      },
    },
    'tabs': {
      'title': '标签栏',
      'children': {
        'show': {
          'title': '显示标签栏',
        },
        'showIcon': {
          'title': '显示标签栏图标',
        },
        'height': {
          'title': '标签栏高度',
        },
        'style': {
          'title': '标签栏风格',
          'placeholder': '请选择标签风格',
          'options': {
            'card': '卡片风格',
            'button': '按钮风格',
            'line': '线条风格',
            'chrome': '谷歌风格',
          },
        },
        'draggable': {
          'title': '开启标签拖拽',
        },
      },
    },
    'sidebar': {
      'title': '侧边栏',
      'children': {
        'width': {
          'title': '侧边栏宽度',
        },
        'itemHeight': {
          'title': '菜单项高度',
        },
        'style': {
          'title': '菜单项风格',
          'placeholder': '',
          'options': {
            'card': '卡片风格',
          },
        },
        'dark': {
          'title': '深色侧边栏',
          'tip': '仅在白天模式生效',
        },
        'showToolbar': {
          'title': '侧边工具栏',
        },
        'uniqueOpened': {
          'title': '手风琴模式',
          'tip': '手风琴模式下，只允许一个子菜单展开',
        },
      },
    },
  },
  'dict': {
    'gender': [
      { 'label': '男', 'value': 0 },
      { 'label': '女', 'value': 1 },
    ],
    'status': [
      { 'label': '正常', 'value': 0 },
      { 'label': '禁用', 'value': 1 },
    ],
    'menu_type': [
      { 'label': '目录', 'value': 'catalog' },
      { 'label': '菜单', 'value': 'menu' },
      { 'label': '外链', 'value': 'link' },
      { 'label': '内链', 'value': 'iframe' },
    ],
  },
}
