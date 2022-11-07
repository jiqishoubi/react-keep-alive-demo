import requestw from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'

//获取列表
export async function queryListAjax(params) {
  let url
  if (getOrgKind().isAdmin) {
    url = '/web/admin/goods/statisticsQueryPage'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/goods/statisticsQueryPage'
  }
  return requestw({
    url,
    data: params,
  })
}
//合计
export async function getSkuFeeStatisticAjax(params) {
  let url
  if (getOrgKind().isAdmin) {
    url = '/web/admin/goods/getSkuFeeStatistic'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/goods/getSkuFeeStatistic'
  }
  return requestw({
    url,
    data: params,
  })
}
