// 获取码表列表(下拉框列表)
import requestw from '@/utils/requestw'
import api_datum from '@/services/api/datum'
//查询资料
export async function getLearnListPaging(params) {
  return requestw({
    type: 'get',
    url: api_datum.getLearnListPaging(),
    data: params,
  })
}

//新建资料
export async function createLearn(params) {
  return requestw({
    type: 'post',
    url: api_datum.createLearn,
    data: params,
  })
}

//编辑资料
export async function updateLearn(params) {
  return requestw({
    type: 'get',
    url: api_datum.updateLearn,
    data: params,
  })
}

//删除资料
export async function deleteLearn(params) {
  return requestw({
    type: 'get',
    url: api_datum.deleteLearn,
    data: params,
  })
}

//新增类目
export async function createLearnGroup(params) {
  return requestw({
    type: 'post',
    url: api_datum.createLearnGroup,
    data: params,
  })
}
//编辑类目
export async function updateLearnGroup(params) {
  return requestw({
    type: 'get',
    url: api_datum.updateLearnGroup,
    data: params,
  })
}
///查询类目
export async function getLearnGroupListPaging(params) {
  return requestw({
    type: 'get',
    url: api_datum.getLearnGroupListPaging(),
    data: params,
  })
}

///联动查询类目
export async function getLearnGroupList(params) {
  return requestw({
    type: 'get',
    url: api_datum.getLearnGroupList,
    data: params,
  })
}

///删除类目
export async function deleteLearnGroup(params) {
  return requestw({
    type: 'get',
    url: api_datum.deleteLearnGroup,
    data: params,
  })
}
