import requestw from '@/utils/requestw'

//获取列表
export async function queryPageAjax(params) {
  return requestw({
    url: '/web/supplier/disputeOrder/queryPage',
    data: params,
  })
}
//获取列表
export async function updateDisputeOrderStatus(params) {
  return requestw({
    url: '/web/supplier/disputeOrder/auditDisputeOrderStatus',
    data: params,
  })
}
//获取订单详情
export async function getTradeInfo(params) {
  return requestw({
    url: '/web/supplier/disputeOrder/getTradeInfo',
    data: params,
  })
}
