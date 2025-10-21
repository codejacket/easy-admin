import { getSVGViewBox, parseSVGContent } from '@iconify/utils'
import fs from 'fs'
import path from 'path'

export default function vitePluginLocalIconify(options) {
  let virtualId = 'virtual:local-iconify'
  let dir = 'src/assets/svg'
  let collections = []
  // 遍历所有集合
  for (let item of fs.readdirSync(path.join(process.cwd(), dir))) {
    let itemPath = path.join(dir, item)
    if (fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory()) {
      collections.push({
        prefix: item,
        icons: getLocalIcons(itemPath),
      })
    }
  }
  return {
    name: 'vite-plugin-local-iconify',
    resolveId(id) {
      if (id === virtualId) {
        return id
      }
    },
    load(id) {
      if (id === virtualId) {
        return `export default ${JSON.stringify(collections)}`
      }
    },
  }
}

function getLocalIcons(dir, currentPath = [], result = {}) {
  for (let item of fs.readdirSync(dir)) {
    let filePath = path.join(dir, item)
    let extendedPath = currentPath.concat(item)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      getLocalIcons(filePath, extendedPath, result)
    } else if (item.endsWith('.svg')) {
      let key = extendedPath.join(':').replace(/.svg/g, '')
      let content = fs.readFileSync(filePath, 'utf-8')
      let { body, attribs } = parseSVGContent(content)
      let viewBox = getSVGViewBox(attribs.viewBox)
      if (viewBox) {
        // 返回iconify格式
        result[key] = {
          body,
          width: viewBox[2],
          height: viewBox[3],
        }
      }
    }
  }
  return result
}
