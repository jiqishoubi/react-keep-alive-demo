import requestw from '@/utils/requestw'
import api_after from '@/services/api/afterSale'
//查询一级类目分组
export async function getDisputeOrderListPaging(params) {
  return requestw({
    url: api_after.DisputeOrderListPaging,
    data: params,
  })
}
//查看详情

export async function getDisputeTradeGoodsList(params) {
  return requestw({
    url: api_after.DisputeTradeGoodsList,
    data: params,
  })
}
//审核disputeOrderExamine

export async function getDisputeOrderExamine(params) {
  return requestw({
    url: api_after.disputeOrderExamine,
    data: params,
  })
}
//省

export async function getProvinceList(params) {
  return requestw({
    url: api_after.provinceList,
    data: params,
  })
}
//市

export async function getparchyListByProvince(params) {
  return requestw({
    url: api_after.eparchyListByProvince,
    data: params,
  })
}

//区cityListByEparchy
export async function getCityListByEparchy(params) {
  return requestw({
    url: api_after.cityListByEparchy,
    data: params,
  })
}

//选择订单

export async function getDisputeTradeList(params) {
  return requestw({
    url: api_after.disputeTradeList,
    data: params,
  })
}
//子订单详情

export async function getTradeGoodsList(params) {
  return requestw({
    url: api_after.disputeTradeGoodsList,
    data: params,
  })
}
//新建

export async function getCreateDisputeOrder(params) {
  return requestw({
    url: api_after.createDisputeOrder,
    data: params,
  })
}
