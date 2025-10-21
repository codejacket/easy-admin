import en from 'element-plus/es/locale/lang/en'

export default {
  ...en,
  'system': {
    'title': 'Easy-Admin',
    'icp': 'ICP: yue2025413388',
    'copyright': 'Copyright © 2025 Easy-Admin All Rights Reserved',
    'watermark': 'Easy-Admin',
  },
  'common': {
    'back': 'Back',
    'backtop': 'Backtop',
    'systemTip': 'System Tip',
    'backHome': 'Back Home',
    'relogin': 'Relogin',
    'logout': 'Logout',
    'confirm': 'Confirm',
    'cancel': 'Cancel',
    'search': 'Search',
    'select': 'Select',
    'add': 'Add',
    'delete': 'Delete',
    'update': 'Update',
    'edit': 'Edit',
    'drag': 'Drag',
    'copy': 'Copy',
    'operation': 'Operation',
    'expand': 'Expand',
    'collapse': 'Collapse',
    'fullscreen': 'Fullscreen',
    'exitFullscreen': 'Exit Fullscreen',
    'closeCurrent': 'Close Current',
    'closeOthers': 'Close Others',
    'closeLeft': 'Close Left',
    'closeRight': 'Close Right',
    'closeAll': 'Close All',
    'save': 'Save',
    'reset': 'Restore',
    'resetDefault': 'Reset Default',
    'userCenter': 'User Center',
    'configuration': 'Configuration',
    'showSearchBar': 'Show Search Bar',
    'hiddenSearchBar': 'Hidden Search Bar',
    'import': 'Import',
    'export': 'Export',
    'print': 'Print',
    'columnSetting': 'Column Setting',
    'refresh': 'Refresh',
    'clickUploadAvatar': 'Click Upload Avatar',
  },
  'message': {
    'loginSuccess': 'Login Successfully',
    'operationSuccess': 'Operation Successfully',
    'addSuccess': 'Add Success',
    'deleteSuccess': 'Delete Success',
    'updateSuccess': 'Update Success',
    'confirmDelete': 'Are you sure you want to delete?',
    'selectDeleteItems': 'Please select the data to delete',
    'fileFormatError':
      'The file format is incorrect, please upload a file with an image type, such as JPG or PNG suffix.',
    'confirmLogout': 'Are you sure you want to logout?',
    'unsupportFullscreen': 'Your browser does not support full screen display',
    'saving': 'Saving to local, please wait...',
    'reseting': 'Clearing settings, please wait...',
    'copied': 'Copied',
    'loginExpired': 'Your login status has expired, and you can stay on that page or log back in',
    'loading': 'Loading...',
  },
  'state': {
    '401': 'The authentication fails and the system resources cannot be accessed',
    '403': 'The current operation does not have auths',
    '404': 'The access resource does not exist',
    'default': 'System Unknown Error',
  },
  'settings': {
    'system': {
      'title': 'System',
      'children': {
        'mode': {
          'title': 'Mode',
          'options': {
            'light': 'Light',
            'dark': 'Dark',
            'auto': 'Auto',
          },
        },
        'layout': {
          'options': {
            'vertical': 'Vertical',
            'vertical-mix': 'Vertical Mix',
            'horizontal': 'Horizontal',
            'horizontal-mix': 'Horizontal Mix',
          },
        },
        'language': {
          'title': 'Language',
          'placeholder': 'Select Language',
          'options': {
            'en': 'English',
            'zh-CN': '简体中文',
          },
        },
        'pageAnimateType': {
          'title': 'Page Animate Type',
          'options': {
            'fade': 'Fade',
            'fade-zoom': 'Fade Zoom',
            'slide-right': 'Slide Right',
            'slide-bottom': 'Slide Bottom',
            'flip': 'Flip',
            'none': 'None',
          },
        },
        'dynamicTitle': {
          'title': 'Dynamic Title',
        },
        'watermark': {
          'title': 'Watermark',
        },
        'grey': {
          'title': 'Grey',
        },
        'colorWeak': {
          'title': 'Color Weak',
        },
      },
    },
    'theme': {
      'title': 'Theme',
      'children': {
        'primary': {
          'title': 'Primary Color',
        },
        'success': {
          'title': 'Success Color',
        },
        'info': {
          'title': 'Info Color',
        },
        'warning': {
          'title': 'Warning Color',
        },
        'danger': {
          'title': 'Danger Color',
        },
      },
    },
    'header': {
      'title': 'Header',
      'children': {
        'height': {
          'title': 'Header Height',
        },
        'fixed': {
          'title': 'Fixed Header',
          'tip': 'When turned on, the navbar and tabs bar will be fixed to the top',
        },
        'showBreadcrumb': {
          'title': 'Show Breadcrumb',
        },
        'showBreadcrumbIcon': {
          'title': 'Show BreadcrumbIcon',
        },
      },
    },
    'navToolbar': {
      'title': 'Toolbar',
      'options': {
        'Search': 'Search',
        'Fullscreen': 'Fullscreen',
        'DataScreen': 'Data Screen',
        'LangSelect': 'Language Select',
        'ModeSwitch': 'Mode Switch',
      },
    },
    'tabs': {
      'title': 'Tabs',
      'children': {
        'show': {
          'title': 'Show Tabs',
        },
        'showIcon': {
          'title': 'Show Tabs Icon',
        },
        'height': {
          'title': 'Tabs Height',
        },
        'style': {
          'title': 'Tabs Style',
          'placeholder': 'Select Style',
          'options': {
            'card': 'Card',
            'button': 'Button',
            'line': 'Line',
            'chrome': 'Chrome',
          },
        },
        'draggable': {
          'title': 'Draggable',
        },
      },
    },
    'sidebar': {
      'title': 'Sidebar',
      'children': {
        'width': {
          'title': 'Sidebar Width',
        },
        'itemHeight': {
          'title': 'Item Height',
        },
        'style': {
          'title': 'Sidebar Style',
          'placeholder': '',
          'options': {
            'card': 'Card',
          },
        },
        'dark': {
          'title': 'Dark Sidebar',
          'tip': 'Takes effect only in daylight mode',
        },
        'showToolbar': {
          'title': 'Show Toolbar',
        },
        'uniqueOpened': {
          'title': 'Accordion',
          'tip': 'In accordion mode, only one submenu is allowed to expand',
        },
      },
    },
  },
  'dict': {
    'gender': [
      { 'label': 'Male', 'value': 0 },
      { 'label': 'Female', 'value': 1 },
    ],
    'status': [
      { 'label': 'Normal', 'value': 0 },
      { 'label': 'Disable', 'value': 1 },
    ],
    'menu_type': [
      { 'label': 'Catalog', 'value': 'catalog' },
      { 'label': 'Menu', 'value': 'menu' },
      { 'label': 'Link', 'value': 'link' },
      { 'label': 'iframe', 'value': 'iframe' },
    ],
  },
}
