const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false,
                                useBuiltIns: 'usage',
                                corejs: 3,
                            },
                        ],
                        '@babel/preset-react',
                    ],
                    plugins: [
                        // ['import', { libraryName: 'antd', style: true }],
                        '@babel/plugin-transform-runtime',
                        '@babel/plugin-syntax-dynamic-import',
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        '@babel/plugin-syntax-async-generators',
                        [
                            '@babel/plugin-proposal-class-properties',
                            { loose: false },
                        ],
                        '@babel/plugin-proposal-object-rest-spread',
                        'react-hot-loader/babel',
                        'dynamic-import-webpack',
                    ],
                },
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    publicPath: './',
                    name: 'fonts/[hash].[ext]',
                    limit: 10000,
                },
            },
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    priority: 20,
                },
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true,
                },
            },
        },
    },
    // index.html 로 의존성 파일들 inject해주는 플러그인
    plugins: [
        new HtmlWebpackPlugin({
            title: process.env.TITLE,
            template: './src/index.html',
        }),
    ],
    node: {
        net: 'empty',
        fs: 'empty',
        tls: 'empty',
    },
}
