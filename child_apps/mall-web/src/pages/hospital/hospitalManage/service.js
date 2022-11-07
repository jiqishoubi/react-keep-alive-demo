import requestw from '@/utils/requestw'
import api_order from '@/services/api/order'

//创建医院
export async function creatInsertAjax(params) {
  return requestw({
    url: '/web/staff/medical/insert',
    data: params,
  })
}

//修改医院

export async function updateAjax(params) {
  return requestw({
    url: '/web/staff/medical/update',
    data: params,
  })
}
//删除医院
export async function deleteMedical(params) {
  return requestw({
    url: '/web/staff/medical/delete',
    data: params,
  })
}
//获取医院列表
export async function getMedical(params) {
  return requestw({
    url: '/web/staff/medical/getList',
    data: params,
  })
}
//获取科室列表
export async function getMedicalDepart(params) {
  return requestw({
    url: '/web/staff/medicalDepart/getList',
    data: params,
  })
}
//修改医生

export async function updateMedicalDoctor(params) {
  return requestw({
    url: '/web/staff/medicalDoctor/updateMedicalDoctor',
    data: params,
  })
}

//冻结医生
export async function updateMedicalDoctorStatus(params) {
  return requestw({
    url: '/web/staff/medicalDoctor/updateMedicalDoctorStatus',
    data: params,
  })
}

//获取医疗机构和科室
export async function queryMedicalListAjax(params) {
  return requestw({
    url: '/web/staff/medical/info',
    data: params,
  })
}
//创建科室
export async function MedicalInsertAjax(params) {
  return requestw({
    url: '/web/staff/medicalDepart/insert',
    data: params,
  })
}

//创建科室
export async function MedicalUpdateAjax(params) {
  return requestw({
    url: '/web/staff/medicalDepart/update',
    data: params,
  })
}

export async function queryListAjax(params) {
  return requestw({
    url: '/web/staff/medicalDoctor/queryPage',
    data: params,
  })
}

//访客记录数据
export async function getTradeCountReportInfo(params) {
  return requestw({
    url: '/web/staff/aiRadar/getBrowseNum',
    data: params,
  })
}

//访客记录分页
export async function getSeenMePersonList(params) {
  return requestw({
    url: '/web/staff/aiRadar/getSeenMePersonList',
    data: params,
  })
}

//导出三联
//导出点击排行

export async function exportTradeReport(params) {
  return requestw({
    url: '/web/staff/export/medicalDoctor/medicalExport',
    data: params,
  })
}

//轮循
export async function getExportInfo(params) {
  return requestw({
    url: '/web/staff/export/medicalDoctor/getExportInfo',
    data: params,
  })
}

//获取导出历史记录
export async function getPagingList(params) {
  return requestw({
    url: '/web/staff/export/medicalDoctor/getPagingList',
    data: params,
  })
}
