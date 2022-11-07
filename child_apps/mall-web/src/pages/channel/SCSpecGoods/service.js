import requestw, { handleRes } from '@/utils/requestw'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/goods/getGoodsList',
    data: params,
  })
}

//取消专营商品
export async function deleteGoodsRightdata(params) {
  return requestw({
    url: '/web/goodsRightdata/batchDeleteGoodsRightdata',
    data: params,
  })
}

//添加专营商品
export async function createGoodsRightdata(params) {
  return requestw({
    url: '/web/goodsRightdata/createGoodsRightdata',
    data: params,
  })
}

//渠道价批量取消
export async function batchDeleteSkuDiy(params) {
  return requestw({
    url: '/web/skuDiy/batchDeleteSkuDiy',
    data: params,
  })
}

//渠道价展示接口
export async function getSkuListPaging(params) {
  return requestw({
    url: '/web/sku/getSkuListPaging',
    data: params,
  })
}

//渠道价设置接口
export async function batchOperateSkuDiy(params) {
  return requestw({
    url: '/web/skuDiy/batchOperateSkuDiy',
    data: params,
  })
}
//渠道价取消接口
export async function deleteSkuDiy(params) {
  return requestw({
    url: '/web/skuDiy/deleteSkuDiy',
    data: params,
  })
}
//获取商品渠道价的设置状态
export async function ifHaveDiySkuPrice(params) {
  return requestw({
    url: '/web/skuDiy/ifHaveDiySkuPrice',
    data: params,
  })
}
