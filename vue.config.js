const path = require('path')
const configureAPI = require('./server/configure')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  publicPath: '',
  pages: {
    index: {
      entry: 'client/src/main.js',
      template: 'client/public/index.html',
    },
  },
  devServer: {
    before: configureAPI,
    hot: process.env.development,
    port: process.env.development ? 8080 : 80
  },
  outputDir: 'client/dist',
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'client/src/')
      }
    },
    externals: {
      "mathjax": "MathJax"
    },
    plugins: [
      new MonacoWebpackPlugin({'languages': ['markdown']})
    ],
  },
}
