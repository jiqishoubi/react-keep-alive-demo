import requestw from '@/utils/requestw'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/staff/skuPrice/queryPage',
    data: params,
  })
}
//删除
export async function removeAjax(params) {
  return requestw({
    url: '/web/staff/skuPrice/remove',
    data: params,
  })
}
//修改
export async function revampAjax(params) {
  return requestw({
    url: '/web/staff/skuPrice/update',
    data: params,
  })
}

export async function exportTradeReport(params) {
  return requestw({
    url: '/web/staff/export/skuPrice',
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  return requestw({
    url: '/web/export/getExportInfo',
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  return requestw({
    url: '/web/staff/export/skuPrice/getPagingList',
    data: params,
  })
}
