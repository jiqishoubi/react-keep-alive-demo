import requestw, { handleRes } from '@/utils/requestw'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/sku/getSkuListPaging',
    data: params,
  })
}

//修改专营商品
export async function updatePromotionCompany(params) {
  return requestw({
    url: '/web/skuDiy/updateSkuDiy',
    data: params,
  })
}
