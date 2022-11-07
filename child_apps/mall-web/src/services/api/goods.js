import { getOrgKind } from '@/utils/utils'

const api = {
  //查询一级类目分组
  getFirstGroupList: () => {
    return '/web/system/goodsGroup/getFirstGroupList'
    if (getOrgKind().isAdmin) {
      return '/web/system/goodsGroup/getFirstGroupList'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/goodsGroup/getFirstGroupList'
    }
  },
  //查询二级类目分组
  getSecondGroupList: () => {
    return '/web/system/goodsGroup/getSecondGroupList'
    if (getOrgKind().isAdmin) {
      return '/web/system/goodsGroup/getSecondGroupList'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/goodsGroup/getSecondGroupList'
    }
  },
  ///

  //查询一级类目分组
  queryFirstGroupListForSelect: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goodsGroup/getGroupList'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/goodsGroup/getFirstGroupList'
    }
  },
  //查询二级类目分组
  querySecondGroupListForSelect: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goodsGroup/getSecondGroupList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goodsGroup/querySecondGroupListForSelect'
    } else {
      return '/web/supplier/goodsGroup/getSecondGroupList'
    }
  },

  //创建分组
  createGroup: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goodsGroup/createGroup'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goodsGroup/createGroup'
    }
  },
  //禁用该类目按钮
  updateGroupStatus: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goodsGroup/updateGroupStatus'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goodsGroup/updateGroupStatus'
    }
  },
  //删除该类目按钮
  deleteGroup: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goodsGroup/deleteGroup'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goodsGroup/deleteGroup'
    }
  },
  //编辑分组
  updateGroup: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goodsGroup/updateGroup'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goodsGroup/updateGroup'
    }
  },
  // 统计分组数量
  getGroupCount: '/web/goodsGroup/queryGroupCount',

  //获取商品列表
  getGoodsList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goods/getGoodsList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goods/getGoodsList'
    }
  },
  getSysCodeByParam: '/web/sys/code/getSysCodeByParamm', //获取商品类型列表
  //创建商品
  createGoods: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goods/createGoods'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goods/createGoods'
    }
  },
  //查询商品详情
  getGoodsInfo: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goods/getGoodsInfo'
    } else {
      return '/web/mall/goods/getGoodsInfo'
    }
  },
  //编辑商品
  updateGoods: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goods/updateGoods'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goods/updateGoods'
    }
  },
  //商品上下架
  updateGoodsStatus: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goods/updateGoodsStatus'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goods/updateGoodsStatus'
    }
  },
  //删除商品
  deleteGoods: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goods/deleteGoods'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goods/deleteGoods'
    }
  },

  getWareHouseList: '/web/goods/getWareHouseList', //保税仓列表

  // 跨境商品备案
  getChinaPortGoodsRecordPaging: '/web/chinaPortGoodsRecord/getChinaPortGoodsRecordPaging',
  getChinaPortGoodsRecordInfor: '/web/chinaPortGoodsRecord/getChinaPortGoodsRecordInfor',

  //模板中查询商品
  getUIGoodsListApi: () => '/web/mall/goods/getGoodsList',
  // getUIGoodsListApi: () => {
  //   if (getOrgKind().isAdmin) {
  //     return '/web/admin/uiTemplateData/getUIGoodsList'
  //   } else if (getOrgKind().isCompany) {
  //     return '/web/staff/uiTemplateData/getUIGoodsList'
  //   }
  // },
  queryIfCrossRight: '/web/staff/goods/queryIfCrossRight', // 查看是否能跨境
}

export default api
