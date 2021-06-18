require('dotenv').config()

const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.common.js')

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        bundle: [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://${process.env.DEV_HOST}:${process.env.DEV_PORT}`,
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, 'src/index.js'),
        ],
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: '[name].[hash:16].js',
        chunkFilename: '[id].[hash:16].js',
    },
    devServer: {
        inline: true,
        port: process.env.DEV_PORT,
        contentBase: path.resolve(__dirname, 'public'),
        hot: true,
        publicPath: '/',
        historyApiFallback: true,
        host: process.env.DEV_HOST,
        proxy: {
            '/api': {
                target: process.env.DEV_PROXY_HTTP,
                secure: false,
            },
            '/api/ws': {
                target: process.env.DEV_PROXY_WS,
                ws: true,
                secure: false,
            },
        },
        headers: {
            'X-Frame-Options': 'sameorigin', // used iframe
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // HMR을 사용하기 위한 플러그인
    ],
})
