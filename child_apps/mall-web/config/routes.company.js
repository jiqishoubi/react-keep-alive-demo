const routes = [
  //商品管理 /web/company/goodsmgr
  {
    path: '/web/company/goodsmgr',
    name: '商品管理',
    routes: [
      {
        name: '商品类目',
        path: '/web/company/goodsmgr/goodsgroupmgr',
        component: './goods/goodsClass',
      },
      {
        name: '商品管理',
        path: '/web/company/goodsmgr/goodsskumgr',
        component: './goods/goodsManage',
      },
      {
        name: '商品价格',
        path: '/web/company/goodsmgr/skupricemgr',
        component: './goodsPrice/sku/index',
      },
      {
        path: '/web/company/goodsmgr/batchImport',
        name: '文件导入',
        component: './goodsPrice/batchImport',
      },
      {
        name: '商品操作',
        path: '/web/company/goodsmgr/goodsDetail',
        component: './goods/goodsDetail/index.jsx',
      },
      {
        name: '商品备案信息',
        path: '/web/company/goodsmgr/goodsRecordeMgr',
        component: './goods/keepOnRecord/keepOnRecord',
      },
      // // goodsRecordeMgr
      // {
      //   name: '商品操作',
      //   path: '/web/company/goodsmgr/goodsRecordeMgr/goodsDetail',
      //   component: './goods/goodsRecordeMgr/goodsDetail/index.jsx',
      // },
      //
    ],
  },

  //首页 /web/company/indexmgr
  {
    path: '/web/company/indexmgr/',
    name: '首页',
    routes: [
      {
        name: '首页',
        path: '/web/company/indexmgr/index',
        component: './statistics/homeData',
      },
      {
        name: '分组模板',
        path: '/web/company/indexmgr/template/revamp',
        component: './statistics/homeData/revamp/index',
      },
      {
        name: '小程序发布',
        path: '/web/deploy',
        component: './deploy/index',
      },
    ],
  },
  //客户管理 /web/company/usermgr
  {
    path: '/web/company/usermgr',
    name: '客户管理',
    routes: [
      {
        name: '客户管理',
        path: '/web/company/usermgr/mallusermgr',
        component: './client/client',
      },
      {
        name: '白名单管理',
        path: '/web/company/usermgr/usermembermgr',
        component: './client/clientManage',
      },
    ],
  },

  //订单管理 /web/company/trademgr
  {
    path: '/web/company/trademgr',
    name: '订单管理',
    routes: [
      {
        name: '订单管理',
        path: '/web/company/trademgr/trademgr',
        component: './order/orderManage/index',
        title: '订单管理 / 订单管理',
      },
      {
        name: '订单管理-详情',
        path: '/web/company/trademgr/trademgr/details',
        component: './order/orderManage/details',
        title: '订单管理 / 订单管理-详情',
      },

      //
      {
        name: '订单佣金',
        path: '/web/company/trademgr/tradeprofitmgr',
        component: './order/orderProfit',
      },
      {
        name: '面单管理',
        path: '/web/company/trademgr/orderExportManagement',
        component: './order/orderExportManagement',
      },
      {
        name: '核销单管理',
        path: '/web/company/trademgr/verificationFormManagement',
        component: './order/verificationFormManagement',
      },
      {
        name: '批量导入', //tongzhou
        path: '/web/company/trademgr/batchimport',
        component: './order/BatchImportOrder',
      },
      {
        name: '售后管理', //tongzhou
        path: '/web/company/trademgr/disputeOrder',
        component: './order/orderAfterSales',
      },
      {
        name: '售后管理-详情', //tongzhou
        path: '/web/company/trademgr/disputeOrder/details',
        component: './order/orderAfterSales/details',
      },
    ],
  },
  {
    path: '/partnerOrder',
    name: '订单管理',
    desc: '商户服务端',
    routes: [
      {
        name: '订单数据查询',
        path: '/partnerOrder/order',
        component: './dataStatistics/orderManagement',
      },
      {
        name: '订单佣金',
        path: '/partnerOrder/commission',
        component: './partnerOrder/commission',
      },
    ],
  },

  {
    path: '/web/company/dataStatistics',
    name: '数据统计-客户',
    routes: [
      {
        name: '客户数据查询',
        path: '/web/company/dataStatistics/customManagement',
        component: './dataStatistics/customManagement',
      },
    ],
  },

  //售后管理/web/company/dispute
  {
    path: '/web/company/dispute',
    name: '售后订单',
    routes: [
      {
        name: '售后订单',
        path: '/web/company/dispute/disputeordermgr',
        component: './afterSale/afterManege',
      },
    ],
  },
  //报表管理
  {
    path: '/web/company/report',
    name: '报表管理',
    routes: [
      {
        name: '访问排行',
        path: '/web/company/report/airadarmgr',
        component: './report/airadarmgr',
      },
      {
        name: '访问排行-详情',
        path: '/web/company/report/airadarmgr/minute',
        component: './report/airadarmgr/minute',
      },
    ],
  },
  {
    path: '/web/company/companyStatistic',
    name: '企业报表',
    routes: [
      {
        name: '商品报表',
        path: '/web/company/goodsStatistic',
        component: './report/reportForms',
      },
    ],
  },
  // //医院管理 /web/system/usermgr
  {
    path: '/web/company/medical',
    name: '医院管理',
    routes: [
      {
        name: '医院管理',
        path: '/web/company/medical/medicalmgr',
        component: './hospital/hospitalManage/index',
      },
    ],
  },
  // //服务管理 /web/company/service
  {
    path: '/web/company/service',
    name: '服务管理',
    routes: [
      {
        name: '服务管理',
        path: '/web/company/service/servicemgr',
        component: './serviceManager/serviceManager/index',
      },
    ],
  },

  //营销管理 /web/company/business
  {
    path: '/web/company/business',
    name: '营销管理',
    routes: [
      {
        name: '活动管理',
        path: '/web/company/business/activemgr',
        component: './marketing/movable/movable',
      },
      {
        name: '新建活动',
        path: '/web/company/business/activemgr/create',
        component: './marketing/movable/createMovable',
      },
      {
        name: '活动统计',
        path: '/web/company/business/activityStatistics',
        component: './marketing/movable/activityStatistics',
      },
      {
        name: '优惠券管理',
        path: '/web/company/business/ticketmgr',
        component: './marketing/coupon/couponManage',
      },
      {
        name: '新建优惠券',
        path: '/web/company/business/ticketmgr/creater',
        component: './marketing/coupon/createrCoupon',
      },
      {
        name: '发放统计',
        path: '/web/company/business/ticketdetailmgr',
        component: './marketing/couponQuery',
      },
      {
        name: '活动数据查询',
        path: '/web/company/business/activedataqry',
        component: './marketing/movableData',
      },
    ],
  },
  //渠道管理 /web/company/distributemgr
  {
    path: '/web/company/distributemgr',
    name: '渠道管理',
    routes: [
      {
        name: '分销用户',
        path: '/web/company/distributemgr/distributeusermgr',
        component: './channel/user',
      },
      {
        name: '核销人员',
        path: '/web/company/verfication',
        component: './channel/verification',
      },
      {
        name: '用户佣金',
        path: '/web/company/distributemgr/distributeaccountmgr',
        component: './channel/userAccount',
      },
      {
        name: '提现记录',
        path: '/web/company/distributemgr/paymentmgr',
        component: './channel/Withdraw',
      },
      {
        name: '分润规则',
        path: '/web/company/distributemgr/profitrulemgr',
        component: './channel/profitSharing',
      },
      {
        name: '营销工具',
        path: '/web/company/distributemgr/channeltool',
        component: './channel/ChannelTool',
      },
      {
        name: '预售管理',
        path: '/web/company/distributemgr/channeltool/minute',
        component: './channel/ChannelTool/minute',
      },
      {
        name: '申请审核',
        path: '/web/company/distributemgr/distributeuserapprovemgr',
        component: './channel/JoinAuth',
      },
      {
        name: '合伙人分组',
        path: '/web/company/distributemgr/groupmgr',
        component: './groupmgr/groupmgr',
      },
      {
        name: '分组详情',
        path: '/web/company/distributemgr/groupmgrdetail',
        component: './groupmgr/groupmgrdetail',
      },
      {
        name: '推广人分组',
        path: '/web/company/distributemgr/groupheadmgr',
        component: './groupmgr/promoter/index',
      },
      {
        name: '推广人分组详情',
        path: '/web/company/distributemgr/groupheadmgr/detail',
        component: './groupmgr/promoter/detail',
      },
      {
        name: '自定义菜单',
        path: '/web/company/menuConfig',
        component: './publicMenu/index',
      },
      {
        name: '二级菜单',
        path: '/web/company/menuConfig/addMenu',
        component: './publicMenu/addMenu/addMenu',
      },
      {
        name: '自定义回复',
        path: '/web/company/menuConfig/revert',
        component: './publicMenu/revert/index',
      },
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
        name: '会员管理',
        path: '/web/company/usermembership',
        component: './operator/member/index',
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

  //CMS管理 /web/company/cmsmgr
  {
    path: '/web/company/cmsmgr',
    name: 'CMS管理',
    routes: [
      {
        name: '轮播管理',
        path: '/web/company/cmsmgr/bannermgr',
        component: './cmsManage/advertiseSpace',
        title: '模板管理 / 轮播管理',
      },
      {
        name: '活动页面',
        path: '/web/company/cmsact',
        component: './cmsManage/customPageMng/index.jsx',
        title: '模板管理 / 活动页面',
      },
      {
        name: '模板市场',
        path: '/web/company/cmsmgr/customindexmng',
        component: './channel/sctemplatefolder/company/SCTemplateWrapCom',
        title: '模板管理/首页模板',
      },
      {
        name: '专营商品',
        path: '/web/company/cmsmgr/SCSpecGoods',
        component: './channel/SCSpecGoods',
        title: '渠道管理/专营商品',
      },
      {
        name: '专营商品修改',
        path: '/web/company/cmsmgr/goods',
        component: './channel/SCSpecGoods',
        title: '渠道管理/专营商品修改',
      },
      {
        name: '文章管理',
        path: '/web/company/cmsmgr/articleMng',
        component: './cmsManage/articleMng',
        title: '模板管理 / 文章管理',
      },
      {
        name: '渠道价格管理',
        path: '/web/company/cmsmgr/goodsPrice',
        component: './channel/goodsPrice',
        title: '渠道管理 / 渠道价格管理',
      },
      {
        name: '渠道专营价格修改',
        path: '/web/company/cmsmgr/goodsPrice/revamp',
        component: './channel/goodsPrice/detail',
      },
    ],
  },

  //商学院管理/web/company/school
  {
    path: '/web/company/school/',
    name: '学院管理',
    routes: [
      {
        name: '资料分类',
        path: '/web/company/school/dataType',
        component: './datum/datum',
      },
      {
        name: '学院资料',
        path: '/web/company/school/datamgr',
        component: './datum/datumManage',
      },
    ],
  },
  {
    path: '/web/company/system/',
    name: '系统管理',
    routes: [
      {
        name: '操作员管理',
        path: '/web/company/system/operator',
        component: './operator/index',
      },
      {
        name: '角色管理',
        path: '/web/company/system/application',
        component: './application/index',
      },
      {
        name: '高级操作员管理',
        path: '/web/company/system/superOperator',
        component: './superManagement/operator/index',
      },
      {
        name: '企业信息',
        path: '/web/company/distributemgr/promotioncompanymgr',
        component: './channel/SpreadCompany/StaffCompanyInfo',
      },
    ],
  },
  {
    path: '/web/company/pricemgr',
    name: '分润管理',
    routes: [
      {
        name: '入账审核',
        path: '/web/company/pricemgr/priceAuth',
        component: './order/Brokerage',
      },
      {
        name: '入账审核—详情',
        path: '/web/company/pricemgr/priceAuth/detail',
        component: './order/Brokerage/detail',
      },
    ],
  },
  {
    path: '/web/company/statistics',
    name: '数据统计',
    routes: [
      {
        name: '订单报表',
        path: '/web/company/statistics/tradeForm',
        component: './statistics/orderStatistics/index',
      },
      {
        name: '推广公司数据',
        path: '/web/company/statistics/distributeCompany',
        component: './statistics/spread/index',
      },
    ],
  },
  {
    path: '/web/company/productShare',
    name: '产品分享',
    routes: [
      {
        name: '产品分享分类',
        path: '/web/company/meansGroup',
        component: './sufferer/sufferer',
      },
      {
        name: '产品分享资料',
        path: '/web/company/means',
        component: './sufferer/suffererManage',
      },
    ],
  },
]

export default routes
