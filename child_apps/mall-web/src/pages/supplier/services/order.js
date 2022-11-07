import requestw from '@/utils/requestw'
import api_order from './api/order'
import { getOrgKind } from '@/utils/utils'

//订单查询页面初始化
export async function initTradePage(params) {
  return requestw({
    url: api_order.initTradePage,
    data: params,
  })
}

//订单查询
export async function getTradeList(params) {
  return requestw({
    url: api_order.getTradeList,
    data: params,
  })
}

//获取交易订单详情
export async function getTradeInfo(params) {
  return requestw({
    url: api_order.getTradeInfo,
    data: params,
  })
}

//获取订单优惠券信息
export async function getTicketDetailByTradeNo(params) {
  // return requestw({
  //   url: api_order.getTicketDetailByTradeNo,
  //   data: params,
  // });
}

//记录订单运维备注
export async function updateTradeProcessNote(params) {
  return requestw({
    url: api_order.updateTradeProcessNote,
    data: params,
  })
}

//.订单发货和订单取消
export async function expressTrade(params) {
  return requestw({
    url: api_order.expressTrade,
    data: params,
  })
}

//订单取消
export async function cancelTrade(params) {
  return requestw({
    url: api_order.cancelTrade,
    data: params,
  })
}
//物流信息查询
export async function getExpressQuery(params) {
  return requestw({
    url: api_order.expressQuery,
    data: params,
  })
}
//快递查询
export async function getExpressListQuery(params) {
  return requestw({
    url: api_order.expressListQuery,
    data: params,
  })
}
//更新物流
export async function updateTradeExpress(params) {
  return requestw({
    url: api_order.updateTradeExpress,
    data: params,
  })
}

//提交批量操作数据参数
export async function bulkDelivery(params) {
  return requestw({
    url: api_order.bulkDelivery1,
    data: params,
  })
}

//提交批量推广人操作数据参数(推广公司)
export async function togetherCreateMember(params) {
  return requestw({
    url: api_order.togetherCreateMember,
    data: params,
  })
}

//提交批量推广人操作数据参数（上药web）
export async function togetherCreateSyMember(params) {
  return requestw({
    url: api_order.togetherCreateSyMember,
    data: params,
  })
}

//获取异步调用状态
export async function getImportStatus(params) {
  return requestw({
    url: api_order.getImportStatus,
    data: params,
    isNeedCheckResponse: true,
  })
}

//获取批量导入信息

export async function getImportData(params) {
  return requestw({
    url: api_order.getImportData,
    data: params,
    isNeedCheckResponse: true,
  })
}

//订单导出任务提交

export async function getTrade(params) {
  return requestw({
    url: api_order.trade,
    data: params,
  })
}
//导出任务查询

export async function getExportInfo(params) {
  return requestw({
    url: api_order.getExportInfo,
    data: params,
  })
}

//查询导出任务

export async function getPagingList(params) {
  return requestw({
    url: api_order.getPagingList,
    data: params,
  })
}

//订单导出任务提交

export async function getOrderTrade(params) {
  return requestw({
    url: api_order.OrderTrade,
    data: params,
  })
}
//导出任务查询

export async function getOrderExportInfo(params) {
  return requestw({
    url: api_order.getExportInfo,
    data: params,
  })
}

//查询导出任务

export async function getOrderPagingList(params) {
  return requestw({
    url: api_order.getOrderPagingList,
    data: params,
  })
}

//专营商品导出任务提交

export async function exclusiveGoods(params) {
  return requestw({
    url: api_order.exclusiveGoods,
    data: params,
  })
}

//导出任务查询

export async function getGoodsPagingList(params) {
  return requestw({
    url: api_order.getGoodsPagingList,
    data: params,
  })
}

//查询导出任务

export async function getGoodsExportInfo(params) {
  return requestw({
    url: api_order.getGoodsExportInfo,
    data: params,
  })
}

// 面单批量打印
export async function batchGetExpressOrder(params) {
  return requestw({
    url: '/web/expressOrder/batchGetExpressOrder',
    data: params,
  })
}

// 核销单下载
export async function verificationFormDownload(params) {
  return requestw({
    url: '/web/hgTrade/export',
    data: params,
  })
}

// 人工提交报单
export async function chinaPortTrade(params) {
  return requestw({
    url: '/web/trade/chinaPortTrade',
    data: params,
  })
}
//海关查验
export async function orderCustom(params) {
  return requestw({
    url: '/web/trade/chinaPortTradePass',
    data: params,
  })
}

// 审核退款
export async function cancelTradeApprove(params) {
  return requestw({
    url: api_order.cancelTradeApproveApi,
    data: params,
  })
}

//核销订单
export async function chinaPortTradeCheck(params) {
  return requestw({
    url: '/web/trade/chinaPortTradeCheck',
    data: params,
  })
}

//订单佣金导出三联
//导出点击
export async function exportTradeReportOrder(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/export/admin/tradeCommission'
  } else if (getOrgKind().isCompany) {
    url = '/web/export/staff/tradeCommission'
  }

  return requestw({
    url,
    data: params,
  })
}

//轮循
export async function getExportInfoOrder(params) {
  return requestw({
    url: '/web/export/getExportInfo',
    data: params,
  })
}

//获取导出历史记录
export async function getPagingListOrder(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/export/admin/tradeCommission/getPagingList'
  } else if (getOrgKind().isCompany) {
    url = '/web/export/staff/tradeCommission/getPagingList'
  }

  return requestw({
    url,
    data: params,
  })
}

//订单分账详情
export async function getSpiltBillOrderList(params) {
  return requestw({
    url: '/web/staff/order/getSpiltBillOrderList',
    data: params,
  })
}
