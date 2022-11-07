const api = {
  getAuthUrlApi: '/wechat/third/auth/goto_auth_url', //获取授权的跳转链接
  getAuthApi: '/wechat/third/auth/callback/jump', //用code授权
  getMiniappInfoApi: '/wechat/third/auth/queryMiniAppInfo', //获取小程序信息

  pushCodeApi: '/wechat/third/auth/uploadProgram', //上传代码  设置小程序域名
  submitCodeApi: '/wechat/third/auth/commit', //提交审核
  verifyListApi: '/wechat/third/auth/getWxMiniProgramAuditList', //审核列表
  cancelSubmitApi: '/wechat/third/auth/undoCodeAudit', //撤销审核

  publishAppApi: '/wechat/third/auth/release', //发布上线
  // 手动回退已发布的小程序   /wechat/third/auth/revertCodeRelease  post
  // app_id

  getExperienceCodeApi: '/wechat/third/auth/getQrCode', //获取体验二维码

  bindTesterApi: '/wechat/third/auth/bindTester', //绑定体验人员
  unbindTesterApi: '/wechat/third/auth/unbindTester', //解绑体验成员
  getTesterApi: '/wechat/third/auth/getTesterList', //获取体验成员列表

  //模板
  getTemplateByCompanyApi: '/web/indexMode/get', //获取这个企业使用的模板 //staffCode,companyCode,token
  updateTemplateByCompanyApi: '/web/indexMode/update', //更新
}

export default api
