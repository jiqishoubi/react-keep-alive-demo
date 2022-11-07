import requestw from '@/utils/requestw'
import api_order from '@/services/api/order'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/tradeReport/getTradeList',
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

//导出三联
//导出点击
export async function exportTradeReport(params) {
  return requestw({
    url: '/web/export/exportTradeReport',
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  return requestw({
    url: api_order.getExportInfo,
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  return requestw({
    url: '/web/export/tradeReport/getPagingList',
    data: params,
  })
}
