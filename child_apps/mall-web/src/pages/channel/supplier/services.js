import request from '@/utils/requestw'

//--供应商管理
export function getList(params) {
  return request({
    url: '/web/system/supplier/getSupplierPaggingList',
    data: params,
    isNeedCheckResponse: true,
  })
}

export function getInfo(params) {
  return request({
    url: '/web/system/supplier/getSupplierInfo',
    data: params,
    isNeedCheckResponse: true,
  })
}

export function create(params) {
  return request({
    url: '/web/system/supplier/createSupplier',
    errMsg: true,
    isNeedCheckResponse: false,
    data: params,
  })
}

export function createWechatConfig(params) {
  return request({
    url: '/web/system/supplier/createWeChatInfo',
    errMsg: true,
    isNeedCheckResponse: false,
    data: params,
  })
}

export function update(params) {
  return request({
    url: '/web/system/supplier/updateSupplier',
    errMsg: true,
    isNeedCheckResponse: false,
    data: params,
  })
}
export function updateWechatConfig(params) {
  return request({
    url: '/web/system/supplier/updateWeChatInfo',
    errMsg: true,
    isNeedCheckResponse: false,
    data: params,
  })
}
