const defaults = require('../defaults');
const fs = require('fs')
const path = require('path')


module.exports = (api, options) => {
    const IconFolderPath = options.IconFolderPath || defaults.IconFolderPath
    const dir_path = `${api.resolve('src/assets')}/${IconFolderPath}`

    const write_file = path.resolve(path.join(__dirname, 'iconFolderName'))
    fs.writeFileSync(write_file, IconFolderPath, {flag: 'w+'}, err => {}) 
    const expressServerJs = api.resolve(`node_modules/${api.id}/icon_viewer/icon_viewer_server.js`)
    api.extendPackage({
        devDependencies:{
            "svg-sprite-loader": "^5.0.0",
            "svgo-loader": "^2.2.1",
            "node-sass": "^4.12.0",
            "sass-loader": "^8.0.2"
        },
        scripts:{
          'icons':`node ${expressServerJs}`
        },
        // vue:{}
    })

    api.render('./template', {IconFolderPath: IconFolderPath})
    api.injectImports(api.entryFile, `import SvgIcon from '@/components/SvgIcon.vue'`)

    try{fs.mkdirSync(dir_path)}catch{}
    const starterIconsPath = api.resolve(`node_modules/${api.id}/starter_icons`)
    const starterIcons = fs.readdirSync(starterIconsPath,{encoding:'utf8', flag:'r'})
    if(starterIcons.length){
      for (const icon in starterIcons) {
        if (Object.hasOwnProperty.call(starterIcons, icon)) {
            const element = starterIcons[icon];
            if(!element.startsWith('.'))
            fs.copyFileSync(`${starterIconsPath}/${element}`, `${dir_path}/${element}`)
        }
      }
    }


    
}

module.exports.hooks = (api) => {
  const { EOL, tmpdir } = require('os')
  api.afterInvoke(() => {
      const contentMain = fs.readFileSync(api.resolve(api.entryFile), { encoding: 'utf-8' })
      const lines = contentMain.split(/\r?\n/g)
      const previously_declared = lines.findIndex(line => line.match(/(const app)/))
      const renderIndex = lines.findIndex(line => line.match(/mount/))
      let [, ...appline] = lines[renderIndex].split('.')
      if(previously_declared === -1){
        lines[renderIndex] = `const app = createApp(App)`
        for (const key in appline) {
          if (Object.hasOwnProperty.call(appline, key)) {
            const opt = appline[key];
            lines[renderIndex] += `${EOL} app.${opt}`
          }
        }
        lines[renderIndex] += `${EOL} app.component('SvgIcon', SvgIcon)`
        // lines[renderIndex] += `${EOL} app.mount('#app')`
      }
      fs.writeFileSync(api.resolve(api.entryFile), lines.join(EOL), { encoding: 'utf-8' })




    })

    api.onCreateComplete(() => {
      // system link node_modules
      const ProjectTargetPath = api.resolve('')
      const SvgConfigPath = path.join(__dirname, '../svg-icon.config.js')
        fs.copyFileSync(SvgConfigPath, `${ProjectTargetPath}/svg-icon.config.js`, 0, (e)=>{})
    })
    
  }

