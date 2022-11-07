import requestw from '@/utils/requestw'
import api_client from './api/client'

//客户查询
export async function getClientQuery(params) {
  return requestw({
    url: api_client.clientQuery,
    data: params,
  })
}

//客户详情查询
export async function getqueryCustomerInfor(params) {
  return requestw({
    url: api_client.queryCustomerInfor,
    data: params,
  })
}
////////////////客户管理

//查询
export async function getMemberListPaging(params) {
  return requestw({
    url: api_client.MemberListPaging,
    data: params,
  })
}
//新建

export async function getcreateMember(params) {
  return requestw({
    url: api_client.createMember,
    data: params,
  })
}

//删除

export async function getdeleteMember(params) {
  return requestw({
    url: api_client.deleteMember,
    data: params,
  })
}

//导出三联
//导出点击

export async function exportTradeReport(params) {
  return requestw({
    url: '/web/export/userManagerExport',
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  return requestw({
    url: '/web/export/exclusiveUser/getExportInfo',
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  return requestw({
    url: '/web/export/exclusiveUser/getPagingList',
    data: params,
  })
}
