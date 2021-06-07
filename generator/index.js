const spawn = require('cross-spawn');
const defaults = require('../defaults');
const fs = require('fs')

module.exports = (api, options) => {
    console.log('options', options);

    const IconFolderPath = options.IconFolderPath || defaults.IconFolderPath

    const expressServerJs = api.resolve('node_modules/vue-cli-plugin-any-svgicon/icon_viewer/icon_viewer_server.js')
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

    api.render('./template')
    api.injectImports(api.entryFile, `import SvgIcon from '@/components/SvgIcon.vue'`)

    try{
      fs.mkdirSync(api.resolve(IconFolderPath))
      api.exitLog(`${IconFolderPath} directory created successfully`)
    }catch(e){api.exitLog(`${IconFolderPath} directory was not created, probably it exists! or ${e}`)}
    
    
    const starterIconsPath = api.resolve('node_modules/vue-cli-plugin-any-svgicon/starter_icons')
    const starterIcons = fs.readdirSync(starterIconsPath,{encoding:'utf8', flag:'r'})
    if(starterIcons.length){
      for (const icon in starterIcons) {
        if (Object.hasOwnProperty.call(starterIcons, icon)) {
            const element = starterIcons[icon];
            if(!element.startsWith('.'))
            fs.copyFileSync(`${starterIconsPath}/${element}`, `${api.resolve(IconFolderPath)}/${element}`)
        }
      }
    }


    
}

module.exports.hooks = (api) => {
  const { EOL } = require('os')
  api.afterInvoke(() => {
      const contentMain = fs.readFileSync(api.resolve(api.entryFile), { encoding: 'utf-8' })
      const lines = contentMain.split(/\r?\n/g)
      const previously_declared = lines.findIndex(line => line.match(/(const app)/))
      const renderIndex = lines.findIndex(line => line.match(/mount/))
      if(previously_declared === -1){
        lines[renderIndex] = `const app = createApp(App)`
        lines[renderIndex] += `${EOL} app.component('SvgIcon', SvgIcon)`
        lines[renderIndex] += `${EOL} app.mount('#app')`
      }
      fs.writeFileSync(api.resolve(api.entryFile), lines.join(EOL), { encoding: 'utf-8' })




    })

    api.onCreateComplete(() => {
      // system link node_modules
      const ProjectNodeModulesPath = api.resolve('node_modules')
      const pluginInstallPath = api.resolve('node_modules/vue-cli-plugin-any-svgicon')
      
      fs.rmdirSync(`${pluginInstallPath}/node_modules`,{recursive: true})
      fs.symlinkSync(ProjectNodeModulesPath, `${pluginInstallPath}/node_modules`, 'dir')

      // spawn.sync('ln', [
      //   'sfnv',
      //  `${ProjectNodeModulesPath}/`,
      //   pluginInstallPath
      // ], {
      //   env: process.env,
      //   stdio: 'inherit', // pipe to console
      //   encoding: 'utf-8'
      // })
   


    })
    
  }

