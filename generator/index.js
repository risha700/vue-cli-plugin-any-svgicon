

module.exports = (api) => {
    api.extendPackage({
        devDependencies:{
            "svg-sprite-loader": "^5.0.0",
            "svgo-loader": "^2.2.1",
            "node-sass": "^4.12.0",
            "sass-loader": "^8.0.2"
        },
        scripts:{},
        vue:{}
    })

    api.render('./template')
    api.injectImports(api.entryFile, `import SvgIcon from '@/components/SvgIcon.vue'`)

}

module.exports.hooks = (api) => {
    api.afterInvoke(() => {
      const { EOL } = require('os')
      const fs = require('fs')
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

    
  }

