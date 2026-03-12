'use strict'

process.env.BABEL_ENV = 'web'

const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

let webConfig = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: '#cheap-module-eval-source-map',
    entry: {
        web: path.join(__dirname, '../src/renderer/main.js')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.html$/,
                use: 'vue-html-loader'
            }, {
                test: /\.js$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, '../src/renderer')],
                exclude: /node_modules/
            }, {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            less: 'vue-style-loader!less!less-loader'
                        }
                    }
                }
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'imgs/[name].[ext]'
                    }
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: false
        }),
        new webpack.DefinePlugin({'process.env.IS_WEB': 'true'})
    ],
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist/web')
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src/renderer'),
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue', '.json', '.css']
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
        __dirname: false,
        __filename: false
    },
    target: 'web'
}

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    webConfig.devtool = ''

    webConfig.plugins.push(new CopyWebpackPlugin([
        {
            from: path.join(__dirname, '../static'),
            to: path.join(__dirname, '../dist/web/static'),
            ignore: ['.*']
        }
    ]))

    webConfig.optimization = {
        minimizer: [new TerserPlugin()]
    }
} else {
    webConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = webConfig
