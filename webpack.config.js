const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const autoprefixer = require('autoprefixer')

module.exports = {
  entry: './app/js/frontend',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'frontend.js'
  },
  devtool: 'source-map',
  devServer: {
    index: 'frontend.html'
  },
  resolve: {
    extensions: ['*', '.webpack.js', '.web.js', '.ts', '.js', '.scss', '.css', '.ejs']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'SchunterKino Fernbedienung',
      template: 'app/html/frontend',
      favicon: 'app/favicon.gif',
      filename: 'frontend.html'
    }),
    new WebpackPwaManifest({
      name: 'SchunterKino Fernbedienung',
      short_name: 'Kino Fernbedienung',
      fingerprints: false,
      description: 'Webapp zur Bedienung der Kinotechnik',
      theme_color: '#fef400',
      background_color: '#fef400',
      start_url: 'frontend.html',
      ios: true,
      icons: [{
        src: path.resolve('app/ic_launcher.png'),
        sizes: [48, 96, 256, 512]
      }]
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'app/js/notify/sw.js'),
      publicPath: ''
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new ExtractTextPlugin('styles.css'),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: { loader: 'tslint-loader' }
      },
      {
        test: /\.ts$/,
        use: { loader: 'ts-loader' }
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [autoprefixer] } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
          fallback: [
            { loader: 'style-loader', options: { sourceMap: true } }
          ]
        })
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff2?|ttf|eot|svg)$/,
        use: { loader: 'url-loader' }
      }]
  }
}
