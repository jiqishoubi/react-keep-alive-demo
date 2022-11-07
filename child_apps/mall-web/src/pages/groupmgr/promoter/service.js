import requestw from '@/utils/requestw'
//查询分组
export async function getLearnGroupListPaging(params) {
  return requestw({
    url: '/web/staff/group/distributeHead/queryPaging',
    data: params,
  })
}

//移除推广人
export async function deleteLearn(params) {
  return requestw({
    url: '/web/staff/group/removeRelation',
    data: params,
  })
}
//详情列表查询
export async function getSelectedListPaging(params) {
  return requestw({
    url: '/web/staff/group/getGroupRelationListPaging',
    data: params,
  })
}

//创建分组
export async function createLearnGroup(params) {
  return requestw({
    url: '/web/staff/group/create',
    data: params,
  })
}

//更新分组
export async function updateLearnGroup(params) {
  return requestw({
    url: '/web/staff/group/update',
    data: params,
  })
}
