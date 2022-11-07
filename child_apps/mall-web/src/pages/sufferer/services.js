import api from './api'
import requestw, { handleRes } from '@/utils/requestw'

//添加一级分类
export async function createLearnGroup(params) {
  return requestw({
    url: api.createLearnGroup,
    data: params,
  })
}

//编辑一级分类
export async function updateLearnGroup(params) {
  return requestw({
    url: api.updateLearnGroup,
    data: params,
  })
}

//分类分页查询
export async function getLearnPatientGroupListPaging(params) {
  return requestw({
    url: api.getLearnPatientGroupListPaging,
    data: params,
  })
}

//删除一级分类
export async function deleteLearnGroup(params) {
  return requestw({
    url: api.deleteLearnGroup,
    data: params,
  })
}

//添加患者分类资料
export async function createLearnPatient(params) {
  return requestw({
    url: api.createLearnPatient,
    data: params,
  })
}

//软文列表
export async function getSoftTextList(params) {
  return requestw({
    url: api.getSoftTextList,
    data: params,
  })
}
//文章列表
export async function getSoftTextPaging(params) {
  return requestw({
    url: api.getSoftTextPaging,
    data: params,
  })
}

//编辑患者教育资料
export async function updateLearnPatient(params) {
  return requestw({
    url: api.updateLearnPatient,
    data: params,
  })
}

//患者资料分页查询
export async function getLearnListPagingPatient(params) {
  return requestw({
    url: api.getLearnListPagingPatient,
    data: params,
  })
}

//删除资料
export async function deleteLearnPatient(params) {
  return requestw({
    url: api.deleteLearnPatient,
    data: params,
  })
}
export async function getLearnGroupList(params) {
  return requestw({
    url: api.getLearnGroupList,
    data: params,
  })
}
