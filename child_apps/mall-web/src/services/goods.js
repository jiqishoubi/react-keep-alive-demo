import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'
import { getOrgKind } from '@/utils/utils'

//查询一级类目分组
export async function getFirstGroupList(params) {
  return requestw({
    url: api_goods.getFirstGroupList(),
    data: params,
  })
}
//查询二级类目分组
export async function getSecondGroupList(params) {
  return requestw({
    url: api_goods.getSecondGroupList(),
    data: params,
  })
}

//查询一级类目分组
export async function queryFirstGroupListForSelect(params) {
  return requestw({
    url: api_goods.queryFirstGroupListForSelect(),
    data: params,
  })
}
//查询二级类目分组
export async function querySecondGroupListForSelect(params) {
  return requestw({
    url: api_goods.querySecondGroupListForSelect(),
    data: params,
  })
}

///创建分组
export async function createGroup(params) {
  return requestw({
    url: api_goods.createGroup(),
    data: params,
  })
}

//禁用该类目按钮
export async function updateGroupStatus(params) {
  return requestw({
    url: api_goods.updateGroupStatus(),
    data: params,
  })
}

//删除该类目按钮
export async function deleteGroup(params) {
  return requestw({
    url: api_goods.deleteGroup(),
    data: params,
  })
}

//编辑分组updateGroup
export async function updateGroup(params) {
  return requestw({
    url: api_goods.updateGroup(),
    data: params,
  })
}

// 统计分组数量
export async function getGroupCount(params) {
  return requestw({
    url: api_goods.getGroupCount,
    data: params,
  })
}

// 跨境商品备案信息分页
export async function getChinaPortGoodsRecordPaging(params) {
  return requestw({
    url: api_goods.getChinaPortGoodsRecordPaging,
    data: params,
  })
}

//跨境商品备案信息详情
export async function getChinaPortGoodsRecordInfor(params) {
  return requestw({
    url: api_goods.getChinaPortGoodsRecordInfor,
    data: params,
  })
}
export async function batchUpdateGoodsStatus(params) {
  let url = ''

  if (getOrgKind().isAdmin) {
    url = '/web/admin/goods/batchUpdateGoodsStatus'
  } else if (getOrgKind().isCompany) {
    url = '/web/staff/goods/batchUpdateGoodsStatus'
  } else {
    url = '/web/supplier/goods/batchUpdateGoodsStatus'
  }
  return requestw({
    url,
    data: params,
  })
}

// 入参：goodsCodes，status
//
