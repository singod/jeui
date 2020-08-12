const path = require('path')
const posixJoin = _path => path.posix.join('/', _path)
module.exports = {
  // 修改 src 为 examples
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  productionSourceMap: false,
  // 强制内联CSS
  css: {
    extract: {
      filename: posixJoin(`css/jeui.css`),
      chunkFilename: posixJoin(`css/jeui.css`)
    },
    sourceMap: false,
    modules: false
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {

  },
  // 第三方插件的选项
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './packages/style/variable.less')  // 引入全局样式变量
      ]
    }
  }
}
