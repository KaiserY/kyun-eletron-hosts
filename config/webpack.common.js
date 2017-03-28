const webpack = require('webpack');
const helpers = require('./helpers');

const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const ngcWebpack = require('ngc-webpack');

const METADATA = {
  title: 'Kyun Electron Hosts',
  baseUrl: '/'
};

module.exports = function (options) {

  isProd = options.env === 'production';
  isAOT = process.env.AOT === true || process.env.AOT === "true"

  return {
    entry: {
      'polyfills': './src/polyfills.browser.ts',
      'vendor': './src/vendor.browser.ts',
      'app': isAOT ? './src/main.browser.aot.ts' : './src/main.browser.ts'
    },

    resolve: {
      extensions: ['.ts', '.js', '.json'],
      modules: [
        helpers.root('src'),
        'node_modules'
      ]
    },

    module: {
      rules: [{
        test: /\.ts$/,
        use: isAOT ? [{
          loader: '@ngtools/webpack'
        }] : [{
          loader: 'awesome-typescript-loader'
        }, {
          loader: 'angular2-template-loader'
        }],
        exclude: [/\.(spec|e2e)\.ts$/]
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: [helpers.root('src/index.html')]
      }, {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[hash].[ext]'
          }
        }]
      }, {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: ['css-loader']
        })
      }, {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw-loader'
      }]
    },

    plugins: [
      new CheckerPlugin(),
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: module => /node_modules\//.test(module.resource)
      }),
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        helpers.root('src') // location of your src
      ),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        chunksSortMode: 'dependency',
        metadata: METADATA,
        inject: 'head'
      }),
      new CopyWebpackPlugin([{
        from: 'src/electron.js'
      }]),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),
      new LoaderOptionsPlugin({}),
      // new AotPlugin({
      //   tsConfigPath: './tsconfig.webpack.json',
      //   entryModule: 'src/app/app.module#AppModule'
      // })
    ],

    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false,
      __dirname: true
    }
  };
}
