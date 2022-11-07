import { getOrgKind } from '@/utils/utils'

const api = {
  //订单查询页面初始化
  initTradePage: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/initTradePage'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/initTradePage'
    }
  },

  //订单查询
  getTradeList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/getTradeList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/getTradeList'
    }
  },
  //获取交易订单详情
  getTradeInfo: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/getTradeInfo'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/getTradeInfo'
    }
  },

  //记录订单运维备注
  updateTradeProcessNote: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/updateTradeProcessNote'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/updateTradeProcessNote'
    }
  },

  //发货
  expressTrade: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/expressTrade'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/expressTrade'
    }
  },
  //取消
  cancelTrade: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/cancelTrade'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/cancelTrade'
    }
  },

  expressQuery: '/web/express/expressQuery', //物流信息查询
  expressListQuery: '/web/express/expressListQuery', //查询快递

  //更新物流
  updateTradeExpress: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/updateTradeExpress'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/updateTradeExpress'
    }
  },

  confirmTrade: () => {
    return '/web/admin/trade/confirmTrade'
  },

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
  trade: () => {
    if (getOrgKind().isAdmin) {
      return '/web/export/admin/trade'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/export/trade'
    }
  },

  //导出任务查询
  getExportInfo: '/web/export/getExportInfo',

  //查询导出任务
  getPagingList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/export/admin/trade/getPagingList'
    } else if (getOrgKind().isCompany) {
      return '/web/export/staff/trade/getPagingList'
    }
  },

  //新订单导出

  //订单导出任务提交
  OrderTrade: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/export/trade/all'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/export/trade/all'
    }
  },

  //导出任务查询
  getOrderExportInfo: '/web/export/trade/all/getExportInfo',
  //查询导出任务
  getOrderPagingList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/export/trade/all/getPagingList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/export/trade/all/getPagingList'
    }
  },

  //12.11添加
  getTicketDetailByTradeNo: '/web/ticketDetail/getTicketDetailByTradeNo',
  //申请退款
  cancelTradeApproveApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/trade/cancelTradeApprove'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/trade/cancelTradeApprove'
    }
  },
  //1.13
  exclusiveGoods: '/web/export/exclusiveGoods', //专营商品导出

  getGoodsPagingList: '/web/export/exclusiveGoods/getPagingList', //导出任务查询

  getGoodsExportInfo: '/web/export/exclusiveGoods/getExportInfo', //查询导出任务
}

export default api
