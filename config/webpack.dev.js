const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const METADATA = webpackMerge(commonConfig({
  env: ENV
}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV
});

module.exports = function (options) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {
    devtool: 'cheap-module-eval-source-map',

    target: 'electron-renderer',

    output: {
      path: helpers.root('dist'),
      publicPath: '',
      filename: '[name].bundle.js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js'
    },

    plugins: [
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.VERSION': JSON.stringify(require("../package.json").version)
      }),
      new ExtractTextPlugin('[name].bundle.css'),
      new LoaderOptionsPlugin({
        debug: true,
        options: {
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src'
          }
        }
      })
    ],
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false,
      __dirname: true
    },
    externals: [
      nodeExternals({
        whitelist: [
          /@angular/,
          /core-js/,
          /zone.js/,
          /rxjs/,
          'material-design-icons',
          'roboto-fontface',
          'codemirror',
          'sudo-prompt',
          'ts-helpers',
          'sudo-prompt'
        ]
      })
    ]
  });
}
