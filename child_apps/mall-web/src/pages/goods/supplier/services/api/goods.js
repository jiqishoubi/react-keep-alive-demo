const api = {
  //查询一级类目分组
  getFirstGroupList: '/web/supplier/goodsGroup/getGroupList',
  //查询二级类目分组
  getSecondGroupList: '/web/supplier/goodsGroup/getSecondGroupList',
  //获取商品列表
  getGoodsList: '/web/admin/supplier/goods/getGoodsList',
  getSysCodeByParam: '/web/system/code/getSysCodeByParam', //获取商品类型列表
  //创建商品
  createGoods: '/web/admin/supplier/goods/createGoods',
  //查询商品详情
  getGoodsInfo: '/web/admin/supplier/goods/getGoodsInfo',
  //编辑商品
  updateGoods: '/web/admin/supplier/goods/updateGoods',
  //商品上下架
  updateGoodsStatus: '/web/admin/supplier/goods/updateGoodsStatus',
  //删除商品
  deleteGoods: '/web/admin/supplier/goods/deleteGoods',

  getWareHouseList: '/web/goods/getWareHouseList', //保税仓列表

  // 跨境商品备案
  getChinaPortGoodsRecordPaging: '/web/chinaPortGoodsRecord/getChinaPortGoodsRecordPaging',
  getChinaPortGoodsRecordInfor: '/web/chinaPortGoodsRecord/getChinaPortGoodsRecordInfor',

  //模板中查询商品
  getUIGoodsListApi: '/web/staff/uiTemplateData/getUIGoodsList',
}

export default api
