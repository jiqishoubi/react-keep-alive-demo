import requestw from '@/utils/requestw'
import api_goods from '../services/api/goods'
import { getOrgKind } from '@/utils/utils'

//查询一级类目分组
export async function getFirstGroupList(params) {
  return requestw({
    url: api_goods.getFirstGroupList,
    data: params,
  })
}
//查询二级类目分组
export async function getSecondGroupList(params) {
  return requestw({
    url: api_goods.getSecondGroupList,
    data: params,
  })
}

///创建分组
export async function createGroup(params) {
  return requestw({
    url: api_goods.createGroup,
    data: params,
  })
}

//禁用该类目按钮
export async function updateGroupStatus(params) {
  return requestw({
    url: api_goods.updateGroupStatus,
    data: params,
  })
}

//删除该类目按钮
export async function deleteGroup(params) {
  return requestw({
    url: api_goods.deleteGroup,
    data: params,
  })
}

//编辑分组updateGroup
export async function updateGroup(params) {
  return requestw({
    url: api_goods.updateGroup,
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

//商品导出三联
//商品导出点击
export async function supplierExportTradeReport(params) {
  let url = '/web/supplier/export/goodsListExport'

  return requestw({
    url,
    data: params,
  })
}

//轮循
export async function supplierGetExportInfo(params) {
  let url = '/web/supplier/export/goods/getExportInfo'

  return requestw({
    url,
    data: params,
    isNeedCheckResponse: true,
  })
}

//获取导出历史记录
export async function supplierGetPagingList(params) {
  let url = '/web/supplier/export/goods/getPagingList'
  return requestw({
    url,
    data: params,
  })
}
