import request from '@/utils/requestw'

//--供应商管理
export function getInfo(params) {
  return request({
    url: '/web/supplier/supplier/getSupplierInfo',
    data: params,
    isNeedCheckResponse: true,
  })
}

export function updateBaseConfig(params) {
  return request({
    url: '/web/supplier/supplier/updateSupplier',
    errMsg: true,
    isNeedCheckResponse: false,
    data: params,
  })
}
export function updateWechatConfig(params) {
  return request({
    url: '/web/supplier/supplier/updateWeChatInfo',
    errMsg: true,
    isNeedCheckResponse: false,
    data: params,
  })
}
