import request from '@/utils/requestw'

//--商品分类管理
export const api = {
  getGoodsGroupPaggingList: '/web/system/goods/getGoodsGroupPaggingList',
}

export function getList(params) {
  return request({
    url: '/web/system/goods/getGoodsGroupPaggingList',
    data: params,
    isNeedCheckResponse: true,
  })
}

export function getAllList(params) {
  return request({
    url: '/web/system/goods/getGoodsGroupPaggingList',
    data: params,
  })
}

export function getInfo(params) {
  return request({
    url: '/web/system/goods/getGoodsGroupInfo',
    data: params,
  })
}

export function create(params) {
  return request({
    url: '/web/system/goods/createGoodsGroup',
    isNeedCheckResponse: true,
    errMsg: true,
    isNeedSuccessNotice: true,
    data: params,
  })
}

export function remove(params) {
  return request({
    url: '/web/system/goodsGroup/deleteGroup',
    isNeedCheckResponse: true,
    errMsg: true,
    isNeedSuccessNotice: true,
    data: params,
  })
}

export function update(params) {
  return request({
    url: '/web/system/goods/updateGoodsGroup',
    isNeedCheckResponse: true,
    errMsg: true,
    isNeedSuccessNotice: true,
    data: params,
  })
}

export function updateStatus(params) {
  return request({
    url: '/web/system/goods/updateGoodsGroupStatus',
    isNeedCheckResponse: true,
    errMsg: true,
    isNeedSuccessNotice: true,
    data: params,
  })
}
