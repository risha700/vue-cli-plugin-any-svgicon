const defaults = require('../defaults');
const fs = require('fs')
const path = require('path')
const { EOL, tmpdir } = require('os')


module.exports = (api, options) => {
    const IconFolderPath = options.IconFolderPath || defaults.IconFolderPath
    const ExtractSprite = options.ExtractSprite
    const AllIconsFolderPath = options.AllIconsFolderPath|| defaults.AllIconsFolderPath

    const VUE_APP_SVG_FOLDERPATH =`${api.resolve('src/assets')}/${IconFolderPath}`
    const ALL_ICONS_PATH = path.isAbsolute(AllIconsFolderPath)?AllIconsFolderPath:api.resolve(AllIconsFolderPath)
    const expressServerJs = api.resolve(`node_modules/${api.id}/icon_viewer/icon_viewer_server.js`)
    api.extendPackage({
        devDependencies:{
            "svg-sprite-loader": "^5.0.0",
            "svgo-loader": "^2.2.1",
            "node-sass": "^4.12.0",
            "sass-loader": "^8.0.2"
        },
        scripts:{
          'icons':`node ${expressServerJs} ${VUE_APP_SVG_FOLDERPATH} ${ALL_ICONS_PATH}`
        },
        // vue:{}
    })

    api.render('./template', {IconFolderPath: IconFolderPath, ExtractSprite:ExtractSprite})
    api.injectImports(api.entryFile, `import SvgIcon from '@/components/SvgIcon.vue'`)

    try{fs.mkdirSync(VUE_APP_SVG_FOLDERPATH)}catch{}
    if(path.isAbsolute(AllIconsFolderPath)){
        try{fs.mkdirSync(`${AllIconsFolderPath}`)}catch{}
    }else{
        try{fs.mkdirSync(`${api.resolve('')}/${AllIconsFolderPath}`)}catch{}
    }
    const starterIconsPath = api.resolve(`node_modules/${api.id}/starter_icons`)
    const starterIcons = fs.readdirSync(starterIconsPath,{encoding:'utf8', flag:'r'})
    if(starterIcons.length){
      for (const icon in starterIcons) {
        if (Object.hasOwnProperty.call(starterIcons, icon)) {
            const element = starterIcons[icon];
            if(!element.startsWith('.'))
            fs.copyFileSync(`${starterIconsPath}/${element}`, `${VUE_APP_SVG_FOLDERPATH}/${element}`)
        }
      }
    }


    
}

module.exports.hooks = (api, options) => {
  const IconFolderPath = options.IconFolderPath || defaults.IconFolderPath
  const ExtractSprite = options.ExtractSprite
  const AllIconsFolderPath = options.AllIconsFolderPath|| defaults.AllIconsFolderPath

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
        lines[renderIndex] +=`${EOL}const requireAll = requireContext => requireContext.keys().forEach(requireContext)`
        lines[renderIndex] +=`${EOL}requireAll(require.context('@/assets/${IconFolderPath}', true, /\.svg$/))`
      }
      fs.writeFileSync(api.resolve(api.entryFile), lines.join(EOL), { encoding: 'utf-8' })




    })

    api.onCreateComplete(() => {
        const ProjectTargetPath = api.resolve('')
        const SvgConfigPath = path.join(__dirname, '../svg-icon.config.js')
        fs.copyFileSync(SvgConfigPath, `${ProjectTargetPath}/svg-icon.config.js`, 0, (e)=>{})

        let env_contents =`VUE_APP_SVG_FOLDERPATH=${api.resolve('src/assets')}/${IconFolderPath}`
        env_contents+=`${EOL}VUE_APP_EXTRACT_SPRITE=${ExtractSprite}`

        if(path.isAbsolute(AllIconsFolderPath)){
          env_contents+=`${EOL}VUE_APP_ALL_ICONS_FOLDERPATH=${path.resolve(AllIconsFolderPath)}`
        }else{
          env_contents+=`${EOL}VUE_APP_ALL_ICONS_FOLDERPATH=${ProjectTargetPath}/${AllIconsFolderPath}`
        }
        publishEnvVars(`${ProjectTargetPath}/.env`, env_contents)
    })
    
  }

function publishEnvVars(location, updated_contents){
  let exist =  fs.existsSync(location)
  if (exist){
    const old_contents = fs.readFileSync(location, { encoding: 'utf-8' })
    let lines = old_contents.split(/\r?\n/g)
    const path_idx = lines.findIndex(line => line.match(/(VUE_APP_SVG_FOLDERPATH)/))   
    if(path_idx !== -1) lines.splice(path_idx, 1);
    const extract_idx = lines.findIndex(line => line.match(/(VUE_APP_EXTRACT_SPRITE)/))
    if(extract_idx !== -1) lines.splice(extract_idx, 1);
    const all_icons_idx = lines.findIndex(line => line.match(/(VUE_APP_ALL_ICONS_FOLDERPATH)/))
    if(all_icons_idx !== -1) lines.splice(all_icons_idx, 1);
    lines[lines.length] = updated_contents
    fs.writeFileSync(location, lines.join(EOL), { encoding: 'utf-8' , flag:'w'})
  }else{
    fs.writeFileSync(location, updated_contents, {flag: 'w+'}, err => {})
  }

}