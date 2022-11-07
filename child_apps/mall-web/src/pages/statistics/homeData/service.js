import requestw from '@/utils/requestw'

//获取销售数据和订单提醒
export async function getTradeSaleNum(params) {
  return requestw({
    url: '/web/supplier/index/getTradeSaleNum',
    data: params,
    isNeedCheckResponse: true,
  })
}
//近几日折线图统计
export async function getTradeCurveList(params) {
  return requestw({
    url: '/web/supplier/index/getTradeCurveList',
    data: params,
    isNeedCheckResponse: true,
  })
}
//本店热售商品
export async function getOrgHotSaleGoodsList(params) {
  return requestw({
    url: '/web/supplier/index/getOrgHotSaleGoodsList',
    data: params,
    isNeedCheckResponse: true,
  })
}

//供货商热售商品
export async function getSupplierHotSaleGoodsList(params) {
  return requestw({
    url: '/web/supplier/index/getSupplierHotSaleGoodsList',
    data: params,
    isNeedCheckResponse: true,
  })
}

//用id换取分组
export async function getSelectedListPaging(params) {
  return requestw({
    url: '/web/supplier/group/getGroupRelationPaging',
    data: params,
  })
}

//移除分组
export async function deleteLearn(params) {
  return requestw({
    url: '/web/staff/group/removeRelation',
    data: params,
  })
}

//更新样板
export async function updateGroupTemplateData(params) {
  return requestw({
    url: '/web/staff/group/updateGroupTemplateData',
    data: params,
  })
}
