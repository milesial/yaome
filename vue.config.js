const path = require('path')
const configureAPI = require('./server/configure')

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
    hot: true,
    port: 8080
  },
  outputDir: 'client/dist',
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'client/src/')
      }
    }
  }
}
