import requestw from '@/utils/requestw'
import api_channel from './api/channel'
import api_client from '@/services/api/client'
import { getOrgKind } from '@/utils/utils'

//分销市场  获取商品列表
export async function getGoodsList(params) {
  let url = '/web/staff/goods/market/getGoodsList'
  return requestw({
    url,
    data: params,
  })
}

//分销市场  获取商品列表
export async function getUserRoles(params) {
  // let url = '/web/admin/supplier/getList';
  let url = '/web/staff/supplier/getList'
  return requestw({
    url,
    data: params,
  })
}

//分销市场  获取商品详情
export async function getGoodInfo(params) {
  let url = '/web/staff/goods/market/getGoodsInfo'
  return requestw({
    url,
    data: params,
  })
}

//分销市场  添加到仓库
export async function putGoodsIntoMarket(params) {
  let url = '/web/supplier/goods/createGoodsBySupplier'
  return requestw({
    url,
    data: params,
  })
}

//分销市场  查询商品是否添加
export async function checkGoodsExistInCompany(params) {
  let url = '/web/staff/goods/market/checkGoodsExistInCompany'
  return requestw({
    url,
    data: params,
  })
}
