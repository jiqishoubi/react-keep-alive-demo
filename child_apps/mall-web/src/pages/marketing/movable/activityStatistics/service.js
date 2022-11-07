import requestw from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'

//商品导出点击
export async function getUserAndTicket(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/active/getUserAndTicket'
  } else if (getOrgKind().isCompany) {
    url = '/web/active/getUserAndTicket'
  }
  return requestw({
    url,
    data: params,
  })
}

//导出三联
//导出点击
export async function exportTradeReport(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/staff/export/activeStatisticsExport'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/activeStatisticsExport'
  }

  return requestw({
    url,
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/staff/export/activeStatistics/getExportInfo'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/activeStatistics/getExportInfo'
  }

  return requestw({
    url,
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/staff/export/activeStatistics/getPagingList'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/activeStatistics/getPagingList'
  }

  return requestw({
    url,
    data: params,
  })
}
