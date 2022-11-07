const routes = [
  /**
   * 商品订单
   */
  // 交易订单
  {
    name: '交易订单',
    path: '/web/system/trade/trademgr',
    component: './order/tradeOrderMng',
    meta: {
      keepAlive: {
        toPath: '/web/system/trade/trademgr/detail',
      },
    },
  },
  //平台端 退款订单
  {
    name: '售后管理（退款订单）',
    path: '/web/system/trade/disputeordermgr',
    component: './order/refundTradeOrderMng',
    meta: {
      keepAlive: {
        toPath: '/web/supplier/trade/trademgr/detail',
      },
    },
  },
  {
    name: '交易订单-详情',
    path: '/web/system/trade/trademgr/detail',
    component: './order/tradeOrderMng/detail',
  },
  // 互联网医院 用户管理
  {
    name: '代理商管理',
    path: '/web/system/org/promotionmgr',
    component: './crmMng/agentMng',
  },
  {
    name: '推广人管理',
    path: '/web/system/distribute/distributemgr',
    component: './crmMng/distributeMng',
  },
  {
    name: '推荐码管理',
    path: '/web/system/distribute/recommendemgr',
    component: './crmMng/recommendCodeMng',
  },
  {
    name: '访问排行',
    path: '/web/system/airadar/airadarmgr',
    component: './report/airadarmgr',
    meta: {
      keepAlive: {
        toPath: '/web/system/airadar/airadarmgr/minute',
      },
    },
  },
  {
    name: '访问排行-详情',
    path: '/web/system/airadar/airadarmgr/minute',
    component: './report/airadarmgr/minute',
  },

  /**
   * 商品 相关
   */
  {
    name: '商品类目',
    path: '/web/system/goods/goodsgroupmgr',
    component: './goods/goodsClass',
  },
  {
    name: '供货商管理',
    path: '/web/system/org/suppliermgr',
    component: './channel/supplier/index',
    title: '商品管理 / 供货商管理',
  },
  // 商城商品管理
  {
    name: '商城商品管理',
    path: '/web/system/goods/mallgoodsmgr',
    component: './admin/goods/goodsManage',
    meta: {
      keepAlive: {
        toPath: '/web/system/goods/mallgoodsmgr/detail',
      },
    },
  },
  {
    name: '商城商品管理-详情',
    path: '/web/system/goods/mallgoodsmgr/detail',
    component: './supplier/goods/goodsDetail',
  },
  // 商品管理
  {
    name: '商品管理',
    path: '/web/system/goods/goodsmgr',
    component: './admin/goods/goodsManage',
    meta: {
      keepAlive: {
        toPath: '/web/supplier/goods/goodsmgr/detail',
      },
    },
  },
  {
    name: '商品管理-详情',
    path: '/web/system/goods/goodsmgr/detail',
    component: './supplier/goods/goodsDetail',
  },
  {
    name: '商品审核',
    path: '/web/system/goods/goodsapprmgr',
    component: './goods/goodsApproval/index',
    meta: {
      keepAlive: {
        toPath: '/web/supplier/goods/goodsmgr/detail',
      },
    },
  },
  {
    name: '分销市场', // 医生-配置药房 选品
    path: '/web/system/goods/suppliergoodsmgrForStore',
    component: './distributionMarketForStore/index',
  },

  // 模板 等
  {
    name: '模板管理',
    path: '/web/system/template/templatemgr',
    component: './template',
  },
  {
    name: '文章管理',
    path: '/web/system/softtext/softtextmgr',
    component: './cmsManage/articleMng',
  },
  {
    name: '活动管理',
    path: '/web/system/active/activemgr',
    component: './cmsManage/customPageMng/index.jsx',
  },
  // 佣金管理
  {
    name: '账户管理',
    path: '/web/system/reward/accountmgr',
    component: './channel/userAccount',
  },
  // 消息通知
  {
    name: '消息通知',
    path: '/web/system/notice/noticemgr',
    component: './system/noticeMng',
  },

  // 企业报表
  {
    name: '结算报表',
    path: '/web/system/supplier/tradesettlemgr',
    component: './report/settleaccount',
  },

  /**
   * 原saas页面
   */

  //客户管理 /web/system/usermgr
  {
    path: '/web/system/usermgr',
    name: '客户管理',
    routes: [
      {
        name: '客户管理',
        path: '/web/system/usermgr/mallusermgr',
        component: './client/client',
      },
      {
        name: '白名单管理',
        path: '/web/system/usermgr/usermembermgr',
        component: './client/clientManage',
      },
    ],
  },

  // //订单管理 /web/system/trademgr
  // {
  //   path: '/web/system/trademgr',
  //   name: '订单管理',
  //   routes: [
  //     {
  //       name: '订单佣金',
  //       path: '/web/system/trademgr/tradeprofitmgr',
  //       component: './order/orderProfit',
  //     },
  //     {
  //       name: '申请审核 ',
  //       path: '/web/system/distributemgr/distributeuserapprovemgr',
  //       component: './channel/JoinAuthAdmin',
  //     },
  //     {
  //       name: '面单管理',
  //       path: '/web/system/trademgr/orderExportManagement',
  //       component: './order/orderExportManagement',
  //     },
  //     {
  //       name: '核销单管理',
  //       path: '/web/system/trademgr/verificationFormManagement',
  //       component: './order/verificationFormManagement',
  //     },
  //     {
  //       name: '批量导入', //tongzhou
  //       path: '/web/system/trademgr/batchimport',
  //       component: './order/BatchImportOrder',
  //     },

  //     {
  //       name: '售后管理', //tongzhou
  //       path: '/web/system/trademgr/disputeOrder',
  //       component: './order/orderAfterSales',
  //     },
  //     {
  //       name: '售后管理-详情', //tongzhou
  //       path: '/web/system/trademgr/disputeOrder/details',
  //       component: './order/orderAfterSales/details',
  //     },
  //   ],
  // },
  // {
  //   path: '/partnerOrder',
  //   name: '订单管理',
  //   desc: '商户服务端',
  //   routes: [
  //     {
  //       name: '订单数据查询',
  //       path: '/partnerOrder/order',
  //       component: './dataStatistics/orderManagement',
  //     },
  //     {
  //       name: '订单佣金',
  //       path: '/partnerOrder/commission',
  //       component: './partnerOrder/commission',
  //     },
  //   ],
  // },

  {
    path: '/web/system/dataStatistics',
    name: '数据统计-客户',
    routes: [
      {
        name: '客户数据查询',
        path: '/web/system/dataStatistics/customManagement',
        component: './dataStatistics/customManagement',
      },
    ],
  },

  //售后管理/web/system/dispute
  {
    path: '/web/system/dispute',
    name: '售后订单',
    routes: [
      {
        name: '售后订单',
        path: '/web/system/dispute/disputeordermgr',
        component: './afterSale/afterManege',
      },
    ],
  },

  //营销管理 /web/system/business
  {
    path: '/web/system/business',
    name: '营销管理',
    routes: [
      {
        name: '活动管理',
        path: '/web/system/business/activemgr',
        component: './marketing/movable/movable',
      },
      {
        name: '优惠券管理',
        path: '/web/system/business/ticketmgr',
        component: './marketing/coupon/couponManage',
      },
      {
        name: '发放统计',
        path: '/web/system/business/ticketdetailmgr',
        component: './marketing/couponQuery',
      },
      {
        name: '活动数据查询',
        path: '/web/system/business/activedataqry',
        component: './marketing/movableData',
      },
    ],
  },
  //渠道管理
  {
    name: '分销用户',
    path: '/web/system/distributemgr/distributeusermgr',
    component: './channel/user',
  },
  {
    name: '提现记录',
    path: '/web/system/distributemgr/paymentmgr',
    component: './channel/Withdraw',
    title: '分润管理 / 提现记录',
  },
  {
    name: '推广公司管理',
    path: '/web/system/distributemgr/promotioncompanymgr',
    component: './channel/SpreadCompany',
  },
  {
    name: '推广公司-信息',
    path: '/web/system/distributemgr/spreadcompany/detail',
    component: './channel/SpreadCompany/detail',
  },
  {
    name: '推广公司-信息',
    path: '/web/system/distributemgr/spreadcompany/formWork',
    component: './channel/SpreadCompany/formwork',
  },
  {
    name: '营销工具',
    path: '/web/system/distributemgr/channeltool',
    component: './channel/ChannelTool',
  },
  {
    name: '预售管理',
    path: '/web/system/distributemgr/channeltool/minute',
    component: './channel/ChannelTool/minute',
  },
  {
    path: '/web/company/saleMarket',
    name: '分销市场',
    desc: '企业端',
    routes: [
      {
        name: '分销市场',
        path: '/web/company/saleMarket/list',
        component: './distributionMarket/market',
      },
      {
        name: '分销商品',
        path: '/web/company/distribution/detail',
        component: './distributionMarket/detail',
      },
      // {
      //   name: '分销市场上架商品',
      //   path: '/distribution/Add',
      //   component: './distribution/Add',
      // },
      // {
      //   name: '账户提现',
      //   path: '/distribution/withdraw',
      //   component: './distributionMarket/withdraw',
      // },
    ],
  },
  {
    path: '/partnerChannel',
    name: '渠道管理',
    desc: '商户服务端',
    routes: [
      {
        name: '成员管理',
        path: '/partnerChannel/user',
        component: './partnerChannel/user',
      },
      {
        name: '成员账户',
        path: '/partnerChannel/userAccount',
        component: './partnerChannel/userAccount',
      },
      {
        name: '账户提现',
        path: '/partnerChannel/withdraw',
        component: './partnerChannel/withdraw',
      },
    ],
  },
  {
    path: '/partnerSettle',
    name: '结算管理',
    desc: '商户服务端',
    routes: [
      {
        name: '账户查询',
        path: '/partnerSettle/account',
        component: './partnerSettle/account',
      },
    ],
  },

  //CMS管理 /web/system/cmsmgr
  {
    path: '/web/system/cmsmgr',
    name: 'CMS管理',
    routes: [
      {
        name: '轮播管理',
        path: '/web/system/cmsmgr/bannermgr',
        component: './cmsManage/advertiseSpace',
        title: '模板管理 / 轮播管理',
      },
      {
        name: '活动页面',
        path: '/web/system/cmsact',
        component: './cmsManage/customPageMng/index.jsx',
        title: '模板管理 / 活动页面',
      },
      {
        name: '模板市场',
        path: '/web/system/cmsmgr/customindexmng',
        component: './channel/sctemplatefolder/admin/SCTemplateWrap',
        title: '模板管理/首页模板',
      },
      {
        name: '专营商品',
        path: '/web/system/cmsmgr/SCSpecGoods',
        component: './channel/SCSpecGoods',
        title: '渠道管理/专营商品',
      },
      {
        name: '专营商品修改',
        path: '/web/system/cmsmgr/goods',
        component: './channel/SCSpecGoods',
        title: '渠道管理/专营商品修改',
      },
      {
        name: '文章管理',
        path: '/web/system/cmsmgr/articleMng',
        component: './cmsManage/articleMng',
        title: '模板管理 / 文章管理',
      },
      {
        name: '渠道价格管理',
        path: '/web/system/cmsmgr/goodsPrice',
        component: './channel/goodsPrice',
        title: '渠道管理 / 渠道价格管理',
      },
      {
        name: '渠道专营价格修改',
        path: '/web/system/cmsmgr/goodsPrice/revamp',
        component: './channel/goodsPrice/detail',
      },
    ],
  },

  //商学院管理/web/system/school
  {
    path: '/web/system/school/',
    name: '学院管理',
    routes: [
      {
        name: '资料分类',
        path: '/web/system/school/dataType',
        component: './datum/datum',
      },
      {
        name: '学院资料',
        path: '/web/system/school/datamgr',
        component: './datum/datumManage',
      },
    ],
  },
  {
    path: '/web/system/system/',
    name: '系统管理',
    routes: [
      {
        name: '账号管理',
        path: '/web/system/system/operator',
        component: './operator/index',
      },
      {
        name: '服务管理',
        path: '/web/system/service/servicemgr',
        component: './serviceManager/serviceManager/index',
      },
      {
        name: '角色管理',
        path: '/web/system/system/application',
        component: './application/index',
      },
      {
        name: '高级操作员管理',
        path: '/web/system/system/superOperator',
        component: './superManagement/operator/index',
      },
    ],
  },

  {
    path: '/web/system/pricemgr',
    name: '分润管理',
    routes: [
      {
        name: '入账审核',
        path: '/web/system/pricemgr/priceAuth',
        component: './order/Brokerage',
      },

      {
        name: '入账审核—详情',
        path: '/web/system/pricemgr/priceAuth/detail',
        component: './order/Brokerage/detail',
      },
    ],
  },

  {
    path: '/web/system/statistics',
    name: '数据统计',
    routes: [
      {
        name: '订单报表',
        path: '/web/system/statistics/tradeForm',
        component: './statistics/orderStatistics/index',
      },
      {
        name: '推广公司数据',
        path: '/web/system/statistics/distributeCompany',
        component: './statistics/spread/index',
      },
      {
        name: '对账报表',
        path: '/web/system/supplier/platStatementStatistics',
        component: './report/bld',
      },
    ],
  },
  {
    path: '/web/system/companyStatistic',
    name: '企业报表',
    routes: [
      {
        name: '商品报表',
        path: '/web/system/goodsStatistic',
        component: './report/reportForms',
      },
    ],
  },
]

export default routes
