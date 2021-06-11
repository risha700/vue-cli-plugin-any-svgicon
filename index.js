const path = require('path')
const fs = require('fs');


module.exports = (api, options) => {
    const wrote_file = path.resolve(path.join(__dirname, 'generator/iconFolderName'))
    const IconFolderPath = fs.readFileSync(wrote_file, { encoding: 'utf-8' })
    const dir_path = `${api.resolve('src/assets')}/${IconFolderPath}`
    const { configSVGIcon } = require(api.resolve('svg-icon.config.js'))

    const write_file = path.resolve(path.join(__dirname, 'icon_viewer/iconFolderPath'))
    fs.writeFileSync(write_file, dir_path, {flag: 'w+'}, err => {}) 
    api.chainWebpack(webpackConfig => {
        configSVGIcon(webpackConfig, dir_path)
      })

    api.configureWebpack(config=>{
      Object.assign(config.module, {exprContextCritical: false})
      // Object.assign(config.module, {noParse: /\/native-require.js$/})
      // Object.assign(config.stats, {warningsFilter: [/critical dependency:/i]})

    })
} 
