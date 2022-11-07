import requestw from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/trade/getDistributeCompanyStatistics',
    data: params,
  })
}

//订单柱形图数据
export async function getTradeCountReportInfo(params) {
  return requestw({
    url: '/web/tradeReport/getTradeCountReportInfo',
    data: params,
  })
}

//商品销量数据
export async function getTradeGoodsSaleVolumeReport(params) {
  return requestw({
    url: '/web/tradeReport/getTradeGoodsSaleVolumeReport',
    data: params,
  })
}

//获取商品列表
export async function getChooseGoodsListPaging(params) {
  return requestw({
    url: api.getChooseGoodsListPaging,
    data: params,
  })
}

//导出三联
//导出点击
export async function exportTradeReport(params) {
  return requestw({
    url: '/web/export/distributeCompanyStatistics',
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  return requestw({
    url: '/web/export/exclusiveDistribute/getExportInfo',
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  return requestw({
    url: '/web/export/exclusiveDistribute/getPagingList',
    data: params,
  })
}

//商品导出三联
//商品导出点击
export async function goodsExportTradeReport(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/export/goodsListExport'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/goodsListExport'
  }

  return requestw({
    url,
    data: params,
  })
}

//轮循
export async function goodsGetExportInfo(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/export/goods/getExportInfo'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/goods/getExportInfo'
  }

  return requestw({
    url,
    data: params,
    isNeedCheckResponse: true,
  })
}

//获取导出历史记录
export async function goodsGetPagingList(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/export/goods/getPagingList'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/goods/getPagingList'
  }

  return requestw({
    url,
    data: params,
  })
}
