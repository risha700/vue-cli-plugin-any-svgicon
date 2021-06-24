const SpriteLoaderPlugin = require(`svg-sprite-loader/plugin`)
const path = require('path')

  // Options used by svgo-loader to optimize SVG files
  // https://github.com/svg/svgo#what-it-can-do
  const SVGOoptions = {
    "plugins": [

      { "cleanupAttrs": true },
      { "cleanupEnableBackground": true },
      { "cleanupIDs": true },
      { "cleanupListOfValues": true },
      { "cleanupNumericValues": true },
      { "collapseGroups": true },
      { "convertColors": true },
      { "convertPathData": true },
      { "convertShapeToPath": true },
      { "convertStyleToAttrs": true },
      { "convertTransform": true },
      { "mergePaths": true },
      { "removeComments": true },
      { "removeDesc": true },
      { "removeDimensions": true },
      { "removeDoctype": true },
      { "removeEditorsNSData": true },
      { "removeEmptyAttrs": true },
      { "removeEmptyContainers": true },
      { "removeEmptyText": true },
      { "removeHiddenElems": true },
      { "removeMetadata": true },
      { "removeNonInheritableGroupAttrs": true },
      { "removeRasterImages": true },
      { "removeTitle": true },
      { "removeUnknownsAndDefaults": true },
      { "removeUselessDefs": true },
      { "removeUnusedNS": true },
      { "removeUselessStrokeAndFill": true },
      {
        "removeAttrs": { "attrs": ["fill","stroke","stoke-width"]}
      },
      { "removeXMLProcInst": true },
      { "removeStyleElement": true },
      { "removeUnknownsAndDefaults": true},
      { "sortAttrs": true },
    ]
  };

  
function configSVGIcon(config, iconsFolder, extract) {
  // Exclude SVG sprite directory from default svg rule
  config.module
    .rule('svg')
    .exclude.add(path.resolve(__dirname, iconsFolder))
    .end();
    
   config.plugin('SpriteLoaderPlugin')
    .use(new SpriteLoaderPlugin({plainSprite: true})).end()
  // Include only SVG sprite directory for new svg-icon rule
  // Use svg-sprite-loader to build SVG sprite
  // Use svgo-loader to optimize SVG files
  config.module
    .rule('svg-icon')
    .test(/\.(svg)(\?.*)?$/)
    .include.add(path.resolve(__dirname, iconsFolder))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]',
      extract:JSON.parse(extract), 
      // runtimeGenerator:path.resolve('./runtimeGenerator'),
      // runtimeOptions:{
      //   iconModule:'./src/components/SvgIcon.vue'
      // }
      // spriteFilename: 'sprite[hash].svg',
      // publicPath:'/dist/'
    })
    .end()
    .use('svgo-loader')
    .loader('svgo-loader')
    .options(SVGOoptions)// turn it on and off as neededs
    .end();
}



module.exports = {configSVGIcon}