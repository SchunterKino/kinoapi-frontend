const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const autoprefixer = require('autoprefixer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
  mode: 'production',
  entry: './app/js/frontend.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  devServer: {
    index: 'frontend.html'
  },
  resolve: {
    extensions: ['*', '.webpack.js', '.web.js', '.ts', '.js', '.scss', '.css', '.ejs']
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
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
      entry: path.join(__dirname, 'app/js/notify/sw.ts'),
      publicPath: ''
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
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
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [autoprefixer] } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ],
      },
      {
        test: /\.(jpe?g|gif|png|woff2?(\?v=[0-9]\.[0-9]\.[0-9])?)$/,
        use: { loader: 'url-loader' }
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: { loader: 'file-loader' }
},
    ]
  }
}
