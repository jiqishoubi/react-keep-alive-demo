module.exports = {
  publicPath: '/childdoctor/',
  productionSourceMap: false,
  lintOnSave: false, // 编译时 关闭eslint
  // 微前端
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}
