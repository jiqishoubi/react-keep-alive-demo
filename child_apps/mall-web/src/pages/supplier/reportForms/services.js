import requestw from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/supplier/goods/statisticsQueryPage',
    data: params,
  })
}
//合计
export async function getSkuFeeStatisticAjax(params) {
  return requestw({
    url: '/web/supplier/goods/getSkuFeeStatistic',
    data: params,
  })
}
