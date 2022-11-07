import api from './api'
import requestw, { handleRes } from '@/utils/requestw'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: api.queryListApi,
    data: params,
  })
}

//创建推广公司
export async function createPromotionCompany(params) {
  return requestw({
    url: api.createPromotionCompany,
    data: params,
  })
}

//编辑推广公司
export async function updatePromotionCompany(params) {
  return requestw({
    url: api.updatePromotionCompany(),
    data: params,
  })
}
//查看详情
export async function getPromotionCompanyInfor(params) {
  return requestw({
    url: api.getPromotionCompanyInfor,
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

//通用模板查询
export async function getUiTemplateList(params) {
  return requestw({
    url: api.getUiTemplateList,
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

//推广公司分润设置
export async function submitProfitConfig(params) {
  return requestw({
    url: api.submitProfitConfig(),
    data: params,
  })
}
//推广公司分润获取
export async function getProfitConfig(params) {
  return requestw({
    url: api.getProfitConfig,
    data: params,
  })
}

//获取供应商列表（无分页）
export async function supplierGetList(params) {
  return requestw({
    url: api.supplierGetList,
    data: params,
  })
}
//
//获取企业信息（无分页）
export async function getOrgInfo(params) {
  return requestw({
    url: api.getInfo,
    data: params,
  })
}
//企业基本信息保存
export async function insertBase(params) {
  return requestw({
    url: api.insertBase,
    data: params,
  })
}

//企业基本信息修改
export async function updateBase(params) {
  return requestw({
    url: api.updateBase,
    data: params,
  })
}

//企业商户信息
export async function updateMchBase(params) {
  return requestw({
    url: api.updateMchBase,
    data: params,
  })
}

//企业小程序信息
export async function updateWxBase(params) {
  return requestw({
    url: api.updateWxBase,
    data: params,
  })
}

//获取特约商户下拉框
export async function getWXMchList(params) {
  return requestw({
    url: api.getWXMchList,
    data: params,
  })
}
