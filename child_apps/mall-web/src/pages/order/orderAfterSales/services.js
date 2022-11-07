import requestw from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'

//获取列表
export async function queryPageAjax(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/disputeOrder/queryPage'
  } else {
    url = '/web/staff/disputeOrder/queryPage'
  }

  return requestw({
    url,
    data: params,
  })
}
//获取列表
export async function updateDisputeOrderStatus(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/disputeOrder/auditDisputeOrderStatus'
  } else {
    url = '/web/staff/disputeOrder/auditDisputeOrderStatus'
  }
  return requestw({
    url,
    data: params,
  })
}
//获取订单详情
export async function getTradeInfo(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/trade/getTradeInfo'
  } else {
    url = '/web/staff/trade/getTradeInfo'
  }
  return requestw({
    url,
    data: params,
  })
}
