var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackPwaManifest = require('webpack-pwa-manifest')


module.exports = {
  entry: './app/js/frontend',
  output: {
    path: __dirname + '/dist',
    filename: 'frontend.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'SchunterKino Fernbedienung',
      template: './app/html/frontend.ejs',
      favicon: './app/favicon.gif',
      filename: 'frontend.html'
    }),
    new ExtractTextPlugin("styles.css"),
    new WebpackPwaManifest({
      name: 'SchunterKino Fernbedienung',
      short_name: 'Kino Fernbedienung',
      fingerprints: false,
      description: 'Webapp zur Bedienung der Kinotechnik',
      theme_color: '#fef400',
      background_color: '#fef400',
      start_url: "frontend.html",
      ios: true,
      icons: [{
        src: path.resolve('app/ic_launcher.png'),
        sizes: [48, 96, 256, 512]
      }]
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
  ],
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?importLoaders=1!',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')]
              }
            }
          ]
        })
      },
      {
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$|.svg$/,
        loader: 'url-loader'
      }
    ]
  }
};
