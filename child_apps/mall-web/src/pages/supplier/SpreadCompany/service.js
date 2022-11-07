import api from './api'
import requestw, { handleRes } from '@/utils/requestw'

//获取列表
export async function getSupplierInfo(params) {
  return requestw({
    url: api.getSupplierInfo,
    data: params,
  })
}
