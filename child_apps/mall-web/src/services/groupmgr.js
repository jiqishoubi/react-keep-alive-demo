// 获取码表列表(下拉框列表)
import requestw from '@/utils/requestw'
import api_datum from '@/services/api/datum'
//查询资料

export async function getSelectedListPaging(params) {
  return requestw({
    // type: 'get',
    url: '/web/staff/group/getGroupRelationListPaging',
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
    url: '/web/staff/group/removeRelation',
    data: params,
  })
}

//新增类目
export async function createLearnGroup(params) {
  return requestw({
    type: 'post',
    url: '/web/staff/group/create',
    data: params,
  })
}
//编辑类目
export async function updateLearnGroup(params) {
  return requestw({
    type: 'get',
    url: '/web/staff/group/update',
    data: params,
  })
}
///查询类目
export async function getLearnGroupListPaging(params) {
  return requestw({
    type: 'get',
    url: '/web/staff/group/queryPaging',
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

// 获取码表列表(下拉框列表)
export async function getSysCodeByParam(params) {
  return requestw({
    type: 'get',
    url: '/web/system/code/getSysCodeByParam',
    // url: '/web/staff/group/getGroupList',
    data: params,
  })
}

// 获取商品列表
export async function getMonopolyGoodsList(params) {
  return requestw({
    url: api_datum.getMonopolyGoodsList,

    data: params,
  })
}
// 设置专营
export async function addGroupMonopolyGoods(params) {
  return requestw({
    url: api_datum.addGroupMonopolyGoods,

    data: params,
  })
}
// 取消专营
export async function delGroupMonopolyGoods(params) {
  return requestw({
    url: api_datum.delGroupMonopolyGoods,

    data: params,
  })
}
