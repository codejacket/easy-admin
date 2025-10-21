const modules = import.meta.glob('./modules/*.js', { eager: true })

export default {
  install(app) {
    Object.entries(modules).forEach(([path, module]) => {
      let name = path.match(/\.\/modules\/(.*)\.js$/)[1]
      app.directive(name, module.default ?? module)
    })
  },
}
