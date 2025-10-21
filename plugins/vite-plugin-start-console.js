import boxen from 'boxen'
import picocolors from 'picocolors'

export default function vitePluginStartConsole() {
  return {
    name: 'vite-plugin-start-console',
    apply: 'serve',
    async buildStart() {
      const { bold, cyan, underline, magenta } = picocolors
      // prettier-ignore
      console.log(
        boxen(
          `${cyan(bold('✨ 欢迎使用 Easy-Admin ✨'))}\n\n` +
          `${bold('🚀 官方文档:')} ${underline(cyan('https://easy-admin.cn'))}\n\n` +
          `${bold('🌟 GitHub:')}  ${underline(cyan('https://github.com/codejacket/easy-admin'))}`,
          {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'cyan',
            textAlignment: 'center',
            title: magenta(' 🎯 启动成功 '),
            titleAlignment: 'right',
          },
        ),
      )
    },
    transform(code, id) {
      if (/src\/main\.(js|ts)$/.test(id)) {
        let str = `console.log(
          \`✨ 欢迎使用 Easy-Admin ✨\n\` +
          \`🚀 官方文档: https://easy-admin.cn\n\` +
          \`🌟 GitHub: https://github.com/codejacket/easy-admin\`
          );`
        return {
          code: str.concat(code),
          map: null,
        }
      }
    },
  }
}
