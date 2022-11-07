import { getOrgKind } from '@/utils/utils'

const api = {
  initTradePage: '/web/supplier/trade/initTradePage', //订单查询页面初始化
  //订单查询
  getTradeList: '/web/supplier/trade/getTradeList', //订单查询

  getTradeInfo: '/web/supplier/trade/getTradeInfo', //获取交易订单详情
  updateTradeProcessNote: '/web/supplier/trade/updateTradeProcessNote', //记录订单运维备注

  expressTrade: '/web/supplier/trade/expressTrade', //发货
  cancelTrade: '/web/supplier/trade/cancelTrade', //取消

  expressQuery: '/web/express/expressQuery', //物流信息查询
  expressListQuery: '/web/express/expressListQuery', //查询快递

  updateTradeExpress: '/web/supplier/trade/updateTradeExpress', //更新物流
  //提交批量操作数据参数
  bulkDelivery1: '/web/trade/bulkDelivery1',

  //提交批量创建推广人数据(推广公司)
  togetherCreateMember: '/web/member/togetherCreateMember',
  //提交批量创建推广人数据(上药)

  togetherCreateSyMember: '/web/member/togetherCreateSyMember',

  //获取异步调用状态
  getImportStatus: '/web/trade/getImportStatus',
  //获取批量导入信息
  getImportData: '/web/trade/getImportData',

  //订单导出任务提交
  trade: '/web/supplier/export/trade',

  //导出任务查询
  getExportInfo: '/web/export/getExportInfo',

  //查询导出任务
  getPagingList: '/web/supplier/export/trade/getPagingList',

  //新订单导出

  //订单导出任务提交
  OrderTrade: '/web/supplier/export/trade/all',
  //导出任务查询
  getOrderExportInfo: '/web/export/trade/all/getExportInfo',
  //查询导出任务
  getOrderPagingList: '/web/supplier/export/trade/all/getPagingList',

  //12.11添加
  getTicketDetailByTradeNo: '/web/ticketDetail/getTicketDetailByTradeNo',
  //申请退款
  cancelTradeApproveApi: '/web/supplier/trade/cancelTradeApprove',
  //1.13
  exclusiveGoods: '/web/export/exclusiveGoods', //专营商品导出

  getGoodsPagingList: '/web/export/exclusiveGoods/getPagingList', //导出任务查询

  getGoodsExportInfo: '/web/export/exclusiveGoods/getExportInfo', //查询导出任务
}

export default api
