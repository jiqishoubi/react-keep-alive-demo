const api = {
  //活动管理
  ActiveList: '/web/active/getActiveList', //活动查询
  SysCodeByParam: '/web/system/code/getSysCodeByParam', //活动类型下拉框接口路径
  createActive: '/web/active/createActive', //创建接口路径
  ActiveInfo: '/web/active/getActiveInfo', //  查询活动详情
  updateActiveStatus: '/web/active/updateActiveStatus', //修改状态（下线）
  AllSecondGoodsGroupForActive: '/web/goodsGroup/getAllSecondGoodsGroupForActive', //获取类目
  GoodsList: '/web/goods/getGoodsList', //获取商品
  SkuList: '/web/sku/getSkuList', //sku查询
  DuserListPaging: '/web/user/getDuserListPaging', //发放人查询

  //优惠券管理
  ValidTicketList: '/web/ticket/getValidTicketList', //有效优惠券查询
  TicketList: '/web/ticket/getTicketList', //查询
  invalidTicket: '/web/ticket/invalidTicket', //失效
  TicketDetail: '/web/ticket/getTicketDetail', //详情
  createTicket: '/web/ticket/createTicket', //

  //客户优惠券统计

  statistics: '/web/ticketDetail/statistics', //统计
  PersonTicketDetailList: '/web/ticketDetail/getPersonTicketDetailList', // 获取客户优惠券
}
export default api
