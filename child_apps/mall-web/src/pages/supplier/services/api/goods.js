import { getOrgKind } from '@/utils/utils'

const api = {
  //查询一级类目分组
  getFirstGroupList: '/web/supplier/goodsGroup/getGroupList',
  //查询二级类目分组
  getSecondGroupList: '/web/supplier/goodsGroup/getSecondGroupList',
  //创建分组
  createGroup: '/web/supplier/goodsGroup/createGroup',
  //禁用该类目按钮
  updateGroupStatus: '/web/supplier/goodsGroup/updateGroupStatus',
  //删除该类目按钮
  deleteGroup: '/web/supplier/goodsGroup/deleteGroup',
  //编辑分组
  updateGroup: '/web/supplier/goodsGroup/updateGroup',

  // 统计分组数量
  getGroupCount: '/web/goodsGroup/queryGroupCount',

  //获取商品列表
  getGoodsList: '/web/supplier/goods/getGoodsList',
  getSysCodeByParam: '/web/system/code/getSysCodeByParam', //获取商品类型列表
  getSysCodeByParamForCreateGoods: '/web/system/code/getSysCodeByParamForCreateGoods',
  //创建商品
  createGoods: '/web/supplier/goods/createGoods',
  //查询商品详情
  getGoodsInfo: '/web/supplier/goods/getGoodsInfo',
  //编辑商品
  updateGoods: '/web/supplier/goods/updateGoods',
  //商品上下架
  updateGoodsStatus: '/web/supplier/goods/updateGoodsStatus',
  //删除商品
  deleteGoods: '/web/supplier/goods/deleteGoods',

  getWareHouseList: '/web/goods/getWareHouseList', //保税仓列表

  // 跨境商品备案
  getChinaPortGoodsRecordPaging: '/web/chinaPortGoodsRecord/getChinaPortGoodsRecordPaging',
  getChinaPortGoodsRecordInfor: '/web/chinaPortGoodsRecord/getChinaPortGoodsRecordInfor',

  //模板中查询商品
  getUIGoodsListApi: '/web/staff/uiTemplateData/getUIGoodsList',
}

export default api
