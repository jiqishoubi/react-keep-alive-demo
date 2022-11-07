import requestw from '@/utils/requestw'
import api_order from '@/services/api/order'
import { getOrgKind } from '@/utils/utils'
import FetchSelect from '@/components/FetchSelect'
import React from 'react'
//获取列表
export async function queryListAjax(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/aiRadar/getRankList') : (url = '/web/staff/aiRadar/getRankList')
  return requestw({
    url,
    data: params,
  })
}

//获取列表查询

export async function queryPage(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/serviceTask/queryPage') : (url = '/web/staff/serviceTask/queryPage')
  return requestw({
    url,
    data: params,
  })
}

//访客记录数据
export async function getServiceTaskDetail(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/serviceTask/getServiceTaskDetail') : (url = '/web/staff/serviceTask/getServiceTaskDetail')
  return requestw({
    url,
    data: params,
  })
}

//访客记录分页
export async function getSeenMePersonList(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/aiRadar/getSeenMePersonList') : (url = '/web/staff/aiRadar/getSeenMePersonList')

  return requestw({
    url,
    data: params,
  })
}

//获取医生列表
export async function getMedicalList(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/medical/getList') : (url = '/web/staff/medical/getList')
  return requestw({
    url,
    data: params,
  })
}
//获取科室
export async function getMedicalDepartList(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/staff/medicalDepart/getList') : (url = '/web/staff/medicalDepart/getList')
  return requestw({
    url,
    data: params,
  })
}
//获取医生

export async function doctorQueryList(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/staff/medicalDoctor/queryList') : (url = '/web/staff/medicalDoctor/queryList')
  return requestw({
    url,
    data: params,
  })
}

//导出三联
//导出点击排行

export async function exportTradeReport(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/staff/export/serviceTask/serviceExport') : (url = '/web/staff/export/serviceTask/serviceExport')
  return requestw({
    url,
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/export/serviceTask/getExportInfo') : (url = '/web/staff/export/serviceTask/getExportInfo')
  return requestw({
    url,
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/export/serviceTask/getPagingList') : (url = '/web/staff/export/serviceTask/getPagingList')
  return requestw({
    url,
    data: params,
  })
}

//导出 详细

export async function seenMePersonReport(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/export/aiRadar/seenMePerson') : (url = '/web/staff/export/aiRadar/seenMePerson')
  return requestw({
    url,
    data: params,
  })
}

//获取导出历史记录
export async function seenMePersonList(params) {
  let url = ''
  getOrgKind().isAdmin ? (url = '/web/admin/export/aiRadar/seenMePerson/getPagingList') : (url = '/web/staff/export/aiRadar/seenMePerson/getPagingList')
  return requestw({
    url,
    data: params,
  })
}
