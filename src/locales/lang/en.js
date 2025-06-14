import en from 'element-plus/dist/locale/en.mjs'

export default {
    ...en,
    dict: {},
    'system': {
        'title': 'Easy-Admin',
        'icp': 'ICP: {icp}',
        'copyright': 'Copyright © {date} {company} All Rights Reserved',
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
        'reset': 'Reset',
        'select': 'Select',
        'add': 'Add',
        'delete': 'Delete',
        'import': 'Import',
        'export': 'Export',
        'update': 'Update',
        'edit': 'Edit',
        'drag': 'Drag',
        'copy': 'Copy',
        'operation': 'Operation',
        'refresh': 'Refresh',
        'expand': 'Expand',
        'collapse': 'Collapse',
        'fullscreen': 'Fullscreen',
        'exitFullscreen': 'Exit Fullscreen',
        'validate': 'Please Complete Security Verification',
        'userCenter': 'User Center',
        'configuration': 'Configuration',
    },
    'placeholder': {
        "captcha": "Please enter the correct captcha",
        'enterIconName': 'Please enter icon name',
        'selectIcon': 'Please select icon',
        'search': 'Search'
    },
    'operation': {
        'closeCurrent': 'Close Current',
        'closeOthers': 'Close Others',
        'closeLeft': 'Close Left',
        'closeRight': 'Close Right',
        'closeAll': 'Close All',
        'save': 'Save',
        'reset': 'Restore'
    },
    'message': {
        'loginSuccess': 'Login Successfully',
        'operationSuccess': 'Operation Successfully',
        'addSuccess': 'Add Success',
        'deleteSuccess': 'Delete Success',
        'updateSuccess': 'Update Success',
        'validateSuccess': 'Validate Success',
        'validateFailed': 'Validate Failed',
        'copied': 'Copied',
        'loading': 'Loading...',
        'welcomeBack': 'Welcome back',
        'captchaSliderTip': 'Hold down the left button and drag',
        'captchaPickTip': 'Click in that order',
        'fileFormatError': 'The file format is incorrect, please upload a file with an image type, such as JPG or PNG suffix.',
        'loginExpired': 'Your login status has expired, and you can stay on that page or log back in',
        'invalidSession': 'If the session is invalid, or the session has expired, please log in again.',
        'committing': 'The data is being processed, please do not submit it repeatedly',
        'networkError': 'The backend interface is abnormally connected',
        'timeout': 'The system interface request timed out',
        'downloading': 'Downloading data, please wait...',
        'downloadFailed': 'The download file failed, please contact the administrator!',
        'confirmLogout': 'Are you sure you want to logout?',
        'unsupportFullscreen': 'Your browser does not support full screen display',
        'saving': 'Saving to local, please wait...',
        'reseting': 'Clearing settings, please wait...',
    },
    'state': {
        '401': 'The authentication fails and the system resources cannot be accessed',
        '403': 'The current operation does not have permissions',
        '404': 'The access resource does not exist',
        'default': 'System Unknown Error'
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
                        'auto': 'Auto'
                    }
                },
                'layout': {
                    'options': {
                        'vertical': 'Vertical',
                        'vertical-mix': 'Vertical Mix',
                        'horizontal': 'Horizontal',
                        'horizontal-mix': 'Horizontal Mix',
                    }
                },
                'language': {
                    'title': 'Language',
                    'placeholder': 'Select Language',
                    'options': {
                        'en': 'English',
                        'zh': '简体中文',
                    }
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
                    }
                },
                'dynamicTitle': {
                    'title': 'Dynamic Title'
                },
                'watermark': {
                    'title': 'Watermark'
                },
                'grey': {
                    'title': 'Grey'
                },
                'colorWeak': {
                    'title': 'Color Weak'
                },
            }
        },
        'theme': {
            'title': 'Theme',
            'children': {
                'primary': {
                    'title': 'Primary Color'
                },
                'success': {
                    'title': 'Success Color'
                },
                'info': {
                    'title': 'Info Color'
                },
                'warning': {
                    'title': 'Warning Color'
                },
                'danger': {
                    'title': 'Danger Color'
                }
            }
        },
        'header': {
            'title': 'Header',
            'children': {
                'height': {
                    'title': 'Header Height'
                },
                'fixed': {
                    'title': 'Fixed Header',
                    'tip': 'When turned on, the navbar and tabs bar will be fixed to the top'
                },
                'showBreadcrumb': {
                    'title': 'Show Breadcrumb'
                },
                'showBreadcrumbIcon': {
                    'title': 'Show BreadcrumbIcon'
                },
            }
        },
        'navToolbar': {
            'title': 'Toolbar',
            'options': {
                'NavbarSearch': 'Search',
                'Screenfull': 'Screenfull',
                'DataScreen': 'Data Screen',
                'LangSelect': 'Language Select',
                'ModeSwitch': 'Mode Switch',
            }
        },
        'tabs': {
            'title': 'Tabs',
            'children': {
                'show': {
                    'title': 'Show Tabs'
                },
                'showIcon': {
                    'title': 'Show Tabs Icon'
                },
                'height': {
                    'title': 'Tabs Height'
                },
                'style': {
                    'title': 'Tabs Style',
                    'placeholder': 'Select Style',
                    'options': {
                        'card': 'Card',
                        'button': 'Button',
                        'line': 'Line',
                        'chrome': 'Chrome',
                    }
                },
                'draggable': {
                    'title': 'Draggable'
                },
            }
        },
        'sidebar': {
            'title': 'Sidebar',
            'children': {
                'width': {
                    'title': 'Sidebar Width'
                },
                'itemHeight': {
                    'title': 'Item Height'
                },
                'style': {
                    'title': 'Sidebar Style',
                    'placeholder': '',
                    'options': {
                        'card': 'Card'
                    }
                },
                'dark': {
                    'title': 'Dark Sidebar',
                    'tip': 'Takes effect only in daylight mode'
                },
                'uniqueOpened': {
                    'title': 'Accordion',
                    'tip': 'In accordion mode, only one submenu is allowed to expand'
                }
            }
        },
        'copyright': {
            'title': 'Copyright',
            'children': {
                'show': {
                    'title': 'Show Copyright'
                },
                'company': {
                    'title': 'Company Name',
                    'placeholder': 'Please enter company name',
                },
                'date': {
                    'title': 'Year',
                    'placeholder': 'Please enter year',
                },
                'icp': {
                    'title': 'ICP License Number',
                    'placeholder': 'Please enter ICP License Number',
                },
            }
        }
    }
}