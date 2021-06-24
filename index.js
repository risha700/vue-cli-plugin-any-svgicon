module.exports = (api, options) => {
    const { configSVGIcon } = require(api.resolve('svg-icon.config.js'))
    api.chainWebpack(webpackConfig => {
      // it will read first time from generator and then from target .env subsequently
        configSVGIcon(webpackConfig,
           process.env.VUE_APP_SVG_FOLDERPATH,
           process.env.VUE_APP_EXTRACT_SPRITE) 
      })

    api.configureWebpack(config=>{
      Object.assign(config.module, {exprContextCritical: false})
    })
} 
