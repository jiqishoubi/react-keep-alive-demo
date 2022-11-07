import { getOrgKind } from '@/utils/utils'

const api = {
  //活动管理
  //活动查询
  ActiveList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/active/getActiveList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/active/getActiveList'
    }
  },
  SysCodeByParam: '/web/system/code/getSysCodeByParam', //活动类型下拉框接口路径
  createActive: '/web/staff/active/createActive', //企业端创建接口路径

  updateActive: '/web/staff/active/updateActive', //企业端编辑接口路径
  ActiveInfo: '/web/active/getActiveInfo', //  查询活动详情
  updateActiveStatus: '/web/staff/active/updateActiveStatus', //修改状态（下线）
  //获取类目
  AllSecondGoodsGroupForActive: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goodsGroup/queryPageSecondGoodsGroup'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goodsGroup/queryPageSecondGoodsGroup'
    }
  },

  //获取商品
  GoodsList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/goods/getGoodsList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/goods/getGoodsList'
    }
  },
  //sku查询
  SkuList: '/web/sku/getSkuList',
  DuserListPaging: '/web/user/getDuserListPaging', //发放人查询

  //优惠券管理
  ValidTicketList: '/web/staff/ticket/getValidTicketList', //有效优惠券查询
  //查询
  TicketList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/ticket/getTicketList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/ticket/getTicketList'
    }
  },
  invalidTicket: '/web/ticket/invalidTicket', //失效
  //详情
  TicketDetail: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/ticket/getTicketDetail'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/ticket/getTicketDetail'
    }
  },
  //创建优惠券
  createTicket: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/ticket/createTicket'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/ticket/createTicket'
    }
  },
  //客户优惠券统计
  //统计
  statistics: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/ticketDetail/statistics'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/ticketDetail/statistics'
    }
  },
  // 获取客户优惠券
  PersonTicketDetailList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/ticketDetail/getPersonTicketDetailList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/ticketDetail/getPersonTicketDetailList'
    }
  },
}
export default api
