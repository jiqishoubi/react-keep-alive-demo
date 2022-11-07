import requestw from '@/utils/requestw'
import api_marketing from './api/marketing'
import { getOrgKind } from '@/utils/utils'

//活动查询
export async function getActiveList(params) {
  return requestw({
    url: api_marketing.ActiveList(),
    data: params,
  })
}
//查看详情
export async function getActiveInfo(params) {
  return requestw({
    url: api_marketing.ActiveInfo,
    data: params,
  })
}
//活动类型查询
export async function getSysCodeByParam(params) {
  return requestw({
    url: api_marketing.SysCodeByParam,
    data: params,
  })
}

//活动下线
export async function getupdateActiveStatus(params) {
  return requestw({
    url: api_marketing.updateActiveStatus,
    data: params,
  })
}
//新建活动createActive
export async function getcreateActive(params) {
  return requestw({
    url: api_marketing.createActive,
    data: params,
  })
}
//编辑活动createActive
export async function updateActive(params) {
  return requestw({
    url: api_marketing.updateActive,
    data: params,
  })
}

//获取类目
export async function getAllSecondGoodsGroupForActive(params) {
  return requestw({
    url: api_marketing.AllSecondGoodsGroupForActive(),
    data: params,
  })
}
//获取商品
export async function getGoodsList(params) {
  return requestw({
    url: api_marketing.GoodsList(),
    data: params,
  })
}
//sku查询
export async function getSkuList(params) {
  return requestw({
    url: api_marketing.SkuList,
    data: params,
  })
}
//发放人查询

export async function getuserListPaging(params) {
  return requestw({
    url: api_marketing.DuserListPaging,
    data: params,
  })
}
////////////////优惠券管理
//有效优惠券
export async function getValidTicketList(params) {
  return requestw({
    url: api_marketing.ValidTicketList,
    data: params,
  })
}
//优惠券查询
export async function getTicketList(params) {
  return requestw({
    url: api_marketing.TicketList(),
    data: params,
  })
}
//失效

export async function getinvalidTicket(params) {
  return requestw({
    url: api_marketing.invalidTicket,
    data: params,
  })
}
//详情

export async function getTicketDetail(params) {
  return requestw({
    url: api_marketing.TicketDetail(),
    data: params,
  })
}
//新建createTicket

export async function getcreateTicket(params) {
  return requestw({
    url: api_marketing.createTicket(),
    data: params,
  })
}
//客户优惠券查询

//初始化查询
export async function getstatistics(params) {
  return requestw({
    url: api_marketing.statistics(),
    data: params,
  })
}

//详情查询
export async function getPersonTicketDetailList(params) {
  return requestw({
    url: api_marketing.PersonTicketDetailList(),
    data: params,
  })
}

//导出三联
//导出点击
export async function exportTradeReport(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/export/activeListExport'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/activeListExport'
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
    url = '/web/admin/export/active/getExportInfo'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/active/getExportInfo'
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
    url = '/web/admin/export/active/getPagingList'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/export/active/getPagingList'
  }

  return requestw({
    url,
    data: params,
  })
}
