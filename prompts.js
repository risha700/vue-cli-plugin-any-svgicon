const defaults = require('./defaults')

const prompts = [
    {
      name: 'IconFolderPath',
      type: 'string',
      message: 'Name of folder where you will place SVGs for processing',
      default: defaults.IconFolderPath,
      validate: opt => opt && opt.length >= 0
    },
    {
      name: 'AllIconsFolderPath',
      type: 'string',
      message: 'Absolute or relative from project root path for icons backup folder you will add as source',
      default: defaults.AllIconsFolderPath,
      validate: opt => opt && opt.length >= 0
    },
    {
      name: 'ExtractSprite',
      type: 'confirm',
      message: 'Extract sprite sheet? IF NOT will be bundled to js file automatically',
      default: defaults.ExtractSprite
    }
]

module.exports = prompts