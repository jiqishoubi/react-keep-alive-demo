import requestw from '@/utils/requestw'
import api_channel from './api/channel'
import api_client from '@/services/api/client'
import { getOrgKind } from '@/utils/utils'

//获取商家默认分润规则配置信息
export async function getOrgProfitRule(params) {
  return requestw({
    url: api_channel.getOrgProfitRule,
    data: params,
  })
}
//.提交分润规则配置修改
export async function submitProfitRule(params) {
  return requestw({
    url: api_channel.submitProfitRule,
    data: params,
  })
}

//渠道成员管理页面初始化
export async function initDistributeMemberPage(params) {
  return requestw({
    url: api_channel.initDistributeMemberPage,
    data: params,
  })
}

//获取渠道成员信息列表(分页)
export async function getDistributeMemberList(params) {
  return requestw({
    url: api_channel.getDistributeMemberList(),
    data: params,
  })
}

//创建推广人信息
export async function createDistributeMember(params) {
  return requestw({
    url: api_channel.createDistributeMember(),
    data: params,
  })
}

//账户余额
export async function getUserAccountListPaging(params) {
  return requestw({
    url: api_channel.getUserAccountListPagingApi(),
    data: params,
  })
}

//账户余额 总的统计
export async function getUserAccountTotalAjax(params) {
  let url = ''
  if (getOrgKind().isAdmin) {
    url = '/web/admin/account/getUserTotalAccount'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/account/getUserTotalAccount'
  }

  return requestw({
    url,
    data: params,
  })
}

//提现记录
export async function getUserPaymentListPaging(params) {
  return requestw({
    url: api_channel.getUserPaymentListPaging(),
    data: params,
  })
}

//提现记录 详情
export async function getUserPaymentInfoAjax(params) {
  return requestw({
    url: api_channel.getUserPaymentInfoApi,
    data: params,
  })
}

/**
 * 供应商
 */

//供应商查询
export async function getSupplierPaging(params) {
  return requestw({
    url: api_channel.querySupplierPaging,
    data: params,
  })
}

//创建供货商
export async function createSupplier(params) {
  return requestw({
    url: api_channel.createSupplier,
    data: params,
  })
}

//供应商无分页
export async function querySupplierList(params) {
  return requestw({
    url: api_channel.querySupplierList,
    data: params,
  })
}

//供应商详情
export async function querySupplierInfo(params) {
  return requestw({
    url: api_channel.querySupplierInfo,
    data: params,
  })
}

//供应商更新
export async function updateSupplierr(params) {
  return requestw({
    url: api_channel.updateSupplierr,
    data: params,
  })
}

//推广公司无分页
export async function queryPromotionCompanyList(params) {
  return requestw({
    url: api_channel.queryPromotionCompanyList,
    data: params,
  })
}
//删除用户
export async function deleteDistributeMember(params) {
  return requestw({
    url: api_channel.deleteDistributeMember(),
    data: params,
  })
}

//提现审核通过
export async function approval(params) {
  return requestw({
    url: api_channel.approval,
    data: params,
  })
}

//提现审核驳回
export async function cancelPayment(params) {
  return requestw({
    url: api_channel.cancelPayment,
    data: params,
  })
}

//导出点击
export async function exportTradeReport(params) {
  return requestw({
    url: '/web/export/distributeMemberStatistics',
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  return requestw({
    url: '/web/export/distributeMemberStatistics/getExportInfo',
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  return requestw({
    url: '/web/export/distributeMemberStatistics/getPagingList',
    data: params,
  })
}

//提现记录导出 三联

//导出点击
export async function exportTradeReportWith(params) {
  return requestw({
    url: '/web/export/userPaymentListExport',
    data: params,
  })
}

//轮循
export async function getExportInfoWith(params) {
  return requestw({
    url: '/web/export/userPayment/getExportInfo',
    data: params,
  })
}

//获取导出历史记录
export async function getPagingListWith(params) {
  return requestw({
    url: '/web/export/userPayment/getPagingList',
    data: params,
  })
}

//获取分销成员分润配置信息（分销用户）
export async function getProfitConfigList(params) {
  return requestw({
    url: '/web/member/getProfitConfigList',
    data: params,
  })
}

//提交分销成员分润规则配置
export async function submitProfitConfig(params) {
  return requestw({
    url: '/web/member/submitProfitConfig',
    data: params,
  })
}

//分销成员冻结
export async function updateMpUserStatus(params) {
  return requestw({
    url: '/web/user/updateMpUserStatus',
    data: params,
  })
}
