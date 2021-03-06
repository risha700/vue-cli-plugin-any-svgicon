const path = require('path');
const pascalCase = require('pascal-case');
const { stringifyRequest } = require('loader-utils');
const { stringifySymbol, stringify } = require('svg-sprite-loader/lib/utils')

module.exports = function runtimeGenerator({ symbol, config, context, loaderContext }) {
  const { spriteModule, symbolModule, runtimeOptions } = config;
  const compilerContext = loaderContext._compiler.context;

  const iconModulePath = path.resolve(compilerContext, runtimeOptions.iconModule);
  const iconModuleRequest = stringify(
    path.relative(path.dirname(symbol.request.file), iconModulePath)
  );

  const spriteRequest = stringifyRequest({ context }, spriteModule);
  const symbolRequest = stringifyRequest({ context }, symbolModule);
  const parentComponentDisplayName = 'SvgIcon';
  const displayName = `${pascalCase(symbol.id)}${parentComponentDisplayName}`;

  return `
    import SpriteSymbol from ${symbolRequest};
    import sprite from ${spriteRequest};
    import ${parentComponentDisplayName} from ${iconModuleRequest};
    import {computed, h, ref, resolveComponent} from "vue";

    const symbol = new SpriteSymbol(${stringifySymbol(symbol)});
    sprite.add(symbol);
    
    export default {
        name: "${displayName}",
        components:"${parentComponentDisplayName}",
          render(h) {
            h(<${parentComponentDisplayName} iconName="${symbol.id}" />);
          } 
        
      }
    }
  `;
};