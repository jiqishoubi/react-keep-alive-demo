/**
 * 小程序授权
 */
import requestw from '@/utils/requestw'

/**
 * 授权
 */

// 获取授权跳转url
export async function getAuthUrlAjax(postData) {
  return requestw({
    type: 'post',
    url: '/wechat/third/auth/goto_auth_url',
    data: postData,
  })
}

// 用auth code授权
export async function getAuthAjax(postData) {
  return requestw({
    type: 'get',
    url: '/wechat/third/auth/callback/jump', //用code授权
    data: postData,
  })
}

// 获取小程序信息
export async function getMiniappInfoAjax() {
  return requestw({
    type: 'get',
    url: '/wechat/third/auth/queryMiniAppInfo',
  })
}

// ------------------------------------------------------------------------------------
/**
 * 代码管理
 */

//上传代码
export async function pushCodeAjax(postData) {
  return requestw({
    url: '/wechat/third/auth/uploadProgram',
    data: postData,
  })
}

// ------------------------------------------------------------------------------------
/**
 * 审核 发布
 */

//提交审核
export async function submitCodeAjax(appid) {
  return requestw({
    url: '/wechat/third/auth/commit',
    data: { app_id: appid },
  })
}

//撤销审核
export async function cancelSubmitAjax(appid) {
  return requestw({
    url: '/wechat/third/auth/undoCodeAudit',
    data: { app_id: appid },
  })
}

//发布上线
export async function publishAppAjax(appid) {
  return requestw({
    url: '/wechat/third/auth/release',
    data: { app_id: appid },
  })
}

//审核列表
export async function verifyListAjax(appid) {
  return requestw({
    type: 'get',
    url: '/wechat/third/auth/getWxMiniProgramAuditList',
    data: { app_id: appid },
  })
}

// ------------------------------------------------------------------------------------
/**
 * 体验成员
 */

//获取体验版 二维码
export async function getExperienceCodeAjax(params) {
  return requestw({
    url: '/wechat/third/auth/getQrCode',
    data: params,
  })
}
// app_id path

//获取体验人员
export async function getTesterAjax(appid) {
  return requestw({
    url: '/wechat/third/auth/getTesterList',
    data: { app_id: appid },
  })
}
// app_id

//绑定体验人员
export async function bindTesterAjax(params) {
  return requestw({
    url: '/wechat/third/auth/bindTester',
    data: params,
  })
}
// app_id wechatid

//解绑体验人员
export async function unbindTesterAjax(params) {
  return requestw({
    url: '',
    data: params,
  })
}
// app_id
// wechatid
// userstr
