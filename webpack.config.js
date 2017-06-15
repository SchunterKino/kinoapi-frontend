var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

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
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
                loader: 'url-loader'
            },
        ]
    }
};
