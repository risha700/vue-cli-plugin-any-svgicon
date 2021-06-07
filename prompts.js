const defaults = require('./defaults')

const prompts = [
    {
      name: 'IconFolderPath',
      type: 'string',
      message: 'Name of folder where you will placed SVGs for processing',
      default: defaults.IconFolderPath,
      validate: opt => opt && opt.length >= 0
    }
]

module.exports = prompts