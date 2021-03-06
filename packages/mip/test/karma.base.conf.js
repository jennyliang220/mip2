const webpack = require('webpack')
const alias = require('../build/alias')
const version = process.env.VERSION || require('../package.json').version

const webpackConfig = {
  resolve: {
    alias
  },
  module: {
    rules: [{
      test: /\.(css|less)$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            insertAt: 'top'
          }
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'less-loader'
      ]
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: ('fonts/[name].[hash:7].[ext]')
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__VERSION__': JSON.stringify(version.toString())
    })
  ],
  devtool: '#inline-source-map'
}

module.exports = {
  files: [
    'index.js'
  ],

  frameworks: ['mocha', 'chai'],

  preprocessors: {
    'index.js': ['webpack']
  },

  reporters: ['mocha'],

  webpack: webpackConfig,

  plugins: [
    'karma-webpack',
    'karma-mocha',
    'karma-chai',
    'karma-mocha-reporter',
    'karma-sourcemap-loader'
  ],
  browsers: ['Chrome'],
  concurrency: Infinity
}
