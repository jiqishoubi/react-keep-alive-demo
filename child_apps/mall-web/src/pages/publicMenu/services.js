import requestw from '@/utils/requestw'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/staff/wechatMenu/queryList',
    data: params,
  })
}

//创建菜单
export async function createWechatMenu(params) {
  return requestw({
    url: '/web/staff/wechatMenu/createWechatMenu',
    data: params,
  })
}

//更新菜单
export async function updateWechatMenu(params) {
  return requestw({
    url: '/web/staff/wechatMenu/updateWechatMenu',
    data: params,
  })
}

//发布菜单
export async function submitMenu(params) {
  return requestw({
    url: '/web/staff/wechatMenu/submitMenu',
    data: params,
  })
}

//日志
export async function querySubmitLog(params) {
  return requestw({
    url: '/web/staff/wechatMenu/querySubmitLog',
    data: params,
  })
}

//删除
export async function deleteWechatMenu(params) {
  return requestw({
    url: '/web/staff/wechatMenu/deleteWechatMenu',
    data: params,
  })
}

// 获取图文消息
export async function queryNewsPage(params) {
  return requestw({
    url: '/web/staff/media/queryNewsPage',
    data: params,
  })
}
// 获取非图文消息
export async function queryOtherMaterialPage(params) {
  return requestw({
    url: '/web/staff/media/queryOtherMaterialPage',
    data: params,
  })
}
// 上传素材
export async function uploadPermanentOtherNews(params) {
  return requestw({
    url: '/web/staff/media/uploadPermanentOtherNews',
    data: params,
  })
}
//获取菜单详情
export async function getMenuInfoAjax(params) {
  return requestw({
    url: '/web/staff/wechatMenu/getMenuInfo',
    data: params,
  })
}
