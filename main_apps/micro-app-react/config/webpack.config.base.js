const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // html模板
const CopyWebpackPlugin = require('copy-webpack-plugin')

const cssLoader = {
  loader: 'css-loader',
  options: {
    // 启动css modules // antd为global，less文件以.global.less为后缀时为global
    modules: {
      localIdentName: '[path][name]__[local]__',
      mode: (resourcePath) => {
        if (
          resourcePath.indexOf(`/node_modules/antd/`) > -1 || // mac 是 /
          resourcePath.indexOf(`\\node_modules\\antd\\`) > -1 || // windows 是 \ 真是太坑了
          resourcePath.indexOf('.global.less') > -1 // global.less
        ) {
          return 'global'
        }
        return 'local'
      },
    },
  },
}

const lessLoader = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      // 定制antd样式
      // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
      modifyVars: {
        'primary-color': '#1D7BFF',
        'border-radius-base': '4px', // 为了和doctor-web一样
      },
      javascriptEnabled: true,
    },
  },
}

/**
 *
 * config
 */
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/', // history路由
    filename: '[name].[contenthash].js',
    clean: true, // 每次构建清理dist
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', cssLoader, lessLoader],
      },
      // 编译文件 // url-loader是为了把文件转换成base64，当设置limit之后一定要安装file-loader，因为大的文件要去走file-loader了
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'url-loader', // 小的文件转成base64
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'], // 引入组件的时候可以省略这些后缀
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  devServer: {
    compress: true,
    hot: true,
    port: 9103,
    historyApiFallback: true, // history路由
  },
  devtool: 'eval-source-map',
  // 代码分离
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    // index.html 模板
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico', // 配置favicon
    }),
    // 全局自动引入react // 不用每个文件都 import React from 'react'
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    // 把编译时的变量设置到项目里
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(process.env.ENV),
      },
    }),
    // 增加静态资源文件夹 把public文件夹的东西 复制到 dist
    new CopyWebpackPlugin({
      patterns: [
        {
          // 从public中复制文件
          from: path.resolve(__dirname, '../public'),
          // 把复制的文件存放到dis里面
          to: path.resolve(__dirname, '../dist'),
        },
      ],
    }),
  ],
}
