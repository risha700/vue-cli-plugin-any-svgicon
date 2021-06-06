const { configSVGIcon } = require('./project.config.js')

module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        configSVGIcon(webpackConfig, './generator/template/src/assets/svg_icons')
      })
}
