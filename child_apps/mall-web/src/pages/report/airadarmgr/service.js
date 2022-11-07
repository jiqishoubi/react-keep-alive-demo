import requestw from '@/utils/requestw'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/staff/aiRadar/getRankList',
    data: params,
  })
}

//访客记录数据
export async function getTradeCountReportInfo(params) {
  return requestw({
    url: '/web/staff/aiRadar/getBrowseNum',
    data: params,
  })
}

//访客记录分页
export async function getSeenMePersonList(params) {
  return requestw({
    url: '/web/staff/aiRadar/getSeenMePersonList',
    data: params,
  })
}

//导出三联
//导出点击排行

export async function exportTradeReport(params) {
  return requestw({
    url: '/web/staff/export/aiRadar',
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  return requestw({
    url: '/web/export/getExportInfo',
    data: params,
    isNeedCheckResponse: true,
  })
}

//导出 详细
export async function seenMePersonReport(params) {
  return requestw({
    url: '/web/staff/export/aiRadar/seenMePerson',
    data: params,
  })
}

//获取导出历史记录
export async function seenMePersonList(params) {
  return requestw({
    url: '/web/staff/export/aiRadar/seenMePerson/getPagingList',
    data: params,
  })
}
