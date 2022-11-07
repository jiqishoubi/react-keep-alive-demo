import requestw, { handleRes } from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'

//获取列表
export async function queryListAjax(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/account/getTradePriceList'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/account/getTradePriceList'
  }
  return requestw({
    url,
    data: params,
  })
}

//审核
export async function updateAuthTradeCompany(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/account/authTrade'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/account/authTrade'
  }

  return requestw({
    url,
    data: params,
  })
}

//批量审核
export async function getBatchTrade(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/account/togetherAuthTrade'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/account/togetherAuthTrade'
  }

  return requestw({
    url,
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

//删除推广公司
export async function deleteCompany(params) {
  return requestw({
    url: api.deleteCompany,
    data: params,
  })
}
