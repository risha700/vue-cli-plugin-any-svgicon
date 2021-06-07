
module.exports = (api, options) => {
  
    // const { configSVGIcon } = require(api.resolve('node_modules/vue-cli-plugin-any-svgicon/project.config.js')) 
    //TODO:// set it from prompts
    const { configSVGIcon } = require(api.resolve('project.config.js')) 

    api.chainWebpack(webpackConfig => {
        // configSVGIcon(webpackConfig, api.resolve('node_modules/vue-cli-plugin-any-svgicon/generator/template/assets/svg_icons'))
        configSVGIcon(webpackConfig, api.resolve('src/assets/svg_icons'))
      })
} 
