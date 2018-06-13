/**
 * @file babel-loader.js
 * @author clark-t (clarktanglei@163.com)
 */

const {resolveModule, pathFormat} = require('../../../utils/helper')
const fs = require('fs')

let externals = {
  [resolveModule('babel-runtime/regenerator')]: 'babelRuntimeHelpers.regenerator'
}

fs.readdirSync(resolveModule('babel-runtime/helpers'))
  .forEach(filename => {
    let key = pathFormat(filename, false)
    key = resolveModule(`babel-runtime/helpers/${key}`)
    externals[key.slice(0, -3)] = `babelRuntimeHelpers.${pathFormat(filename)}`
  })

module.exports = {
  babelLoader: {
    loader: resolveModule('babel-loader'),
    options: {
      babelrc: false,
      presets: [
        [
          resolveModule('babel-preset-env'),
          {
            modules: false,
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }
        ],
        resolveModule('babel-preset-stage-2')
      ],
      plugins: [
        require('./babel-plugin-sandbox'),
        [
          require('babel-plugin-transform-runtime'),
          {
            helpers: true,
            polyfill: true,
            regenerator: true,
            moduleName: resolveModule('babel-runtime')
          }
        ]
      ]
    }
  },
  babelExternals: externals
}
