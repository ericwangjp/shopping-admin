module.exports = {
  // 通过chainWebpack来自定义打包入口
  //   chainWebpack: config => {
  //     config.when(process.env.NODE_ENV === 'production', config => {
  //       config.entry('app').clear().add('./src/main-prod.js')

  //   打发布包时配置以下包不打入包中，以减少包体积
  //   config.set('externals', {
  //     vue: 'Vue',
  //     'vue-router': 'VueRouter',
  //     axios: 'axios'
  //   })
  //   然后在public/index.html文件的头部添加CDN资源引用<link rel="" href="" />

  //   配置页面标题环境
  //   然后在页面中通过 htmlWebpackPlugin.options.isProd来获取环境值
  //   config.plugin('html').tap(args => {
  //     args[0].isProd = true
  //     return args
  //   })

  //     })
  //     config.when(process.env.NODE_ENV === 'development', config => {
  //       config.entry('app').clear().add('./src/main-dev.js')

  //   配置页面标题环境
  //   config.plugin('html').tap(args => {
  //     args[0].isProd = false
  //     return args
  //   })

  //     })
  //   }
}
