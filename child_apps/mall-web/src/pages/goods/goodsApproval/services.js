import request from '@/utils/requestw'

//--商品审核管理

export function getList(params) {
  return request({
    url: '/web/system/sku/getSupplierGoodsSkuList',
    data: params,
    isNeedCheckResponse: true,
  })
}

export function approvalStatusUpdate(params) {
  return request({
    url: '/web/system/sku/updateSkuApprStatus',
    isNeedCheckResponse: true,
    errMsg: true,
    isNeedSuccessNotice: true,
    data: params,
  })
}
