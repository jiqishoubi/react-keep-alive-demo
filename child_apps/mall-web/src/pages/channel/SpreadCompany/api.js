import { getOrgKind } from '@/utils/utils'

const api = {
  queryListApi: '/web/admin/company/search', //获取列表
  //创建推广公司
  createPromotionCompany: '/web/admin/company/insert',
  //编辑推广公司
  updatePromotionCompany: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/company/update'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/company/update'
    }
  },
  //查看详情
  getPromotionCompanyInfor: '/web/staff/company/info',
  //获取商品列表
  getChooseGoodsListPaging: '/web/promotionCompany/getChooseGoodsListPaging',

  //创建模板库
  createUiTemplateData: '/web/uiTemplateData/createUiTemplateData',
  //通用模板查询
  getUiTemplateList: '/web/promotionCompany/getUiTemplateList',

  //删除推广公司
  deleteCompany: '/web/promotionCompany/deleteCompany',

  //取消专营商品
  deleteGoodsRightdata: '/web/goodsRightdata/deleteGoodsRightdata',

  //推广公司分润设置
  submitProfitConfig: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/company/profit/submit'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/company/profit/submit'
    }
  },

  //获取推广公司分润规则
  getProfitConfig: '/web/promotionCompany/getProfitConfig',
  //获取供应商列表（无分页）
  supplierGetList: '/web/admin/supplier/getList',

  getInfo: '/web/admin/org/getInfo', //查询企业信息
  insertBase: '/web/admin/org/insertBase', //企业基本信息保存
  updateBase: '/web/admin/org/updateBase', //企业基本信息修改
  updateMchBase: '/web/admin/org/updateMchBase', //企业商户信息
  updateWxBase: '/web/admin/org/updateWxBase', //企业小程序信息
  getWXMchList: '/web/system/param/getWXMchList', //获取特约商户下拉框
}

export default api
