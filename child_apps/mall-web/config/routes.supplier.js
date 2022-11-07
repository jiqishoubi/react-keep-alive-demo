// 供货商
const routes = [
  {
    name: '首页',
    path: '/web/supplier/home/homemgr',
    component: './statistics/homeData',
  },
  /**
   * 供应商 退款订单
   */
  {
    name: '售后管理（退款订单）',
    path: '/web/supplier/trade/disputeordermgr',
    component: './order/refundTradeOrderMng',
    meta: {
      keepAlive: {
        toPath: '/web/supplier/trade/trademgr/detail',
      },
    },
  },
  {
    name: '交易订单',
    path: '/web/supplier/trade/trademgr',
    component: './order/tradeOrderMng',
    meta: {
      keepAlive: {
        toPath: '/web/supplier/trade/trademgr/detail',
      },
    },
  },
  {
    name: '交易订单-详情',
    path: '/web/supplier/trade/trademgr/detail',
    component: './order/tradeOrderMng/detail',
  },
  /**
   * 商品管理
   */
  // 商品管理（初次创建商品）
  {
    name: '商品管理（初次创建商品）',
    path: '/web/supplier/goods/goodsmgr',
    component: './supplier/goods/goodsManage', // 公用商品列表
    meta: {
      keepAlive: {
        toPath: '/web/supplier/goods/goodsmgr/detail', // 公用商品详情
      },
    },
  },
  {
    name: '商品管理（初次创建商品）-商品详情',
    path: '/web/supplier/goods/goodsmgr/detail',
    component: './supplier/goods/goodsDetail/index', // 这个商品详情页面是所有公用的！！！！！
  },
  // 商品管理（商城商品）
  {
    name: '商品管理（商城商品）',
    path: '/web/supplier/goods/mallgoodsmgr',
    component: './supplier/goods/goodsManage',
    meta: {
      keepAlive: {
        toPath: '/web/supplier/goods/mallgoodsmgr/detail',
      },
    },
  },
  {
    name: '商品管理（商城商品）-商品详情',
    path: '/web/supplier/goods/mallgoodsmgr/detail',
    component: './supplier/goods/goodsDetail/index',
  },
  {
    name: '分销市场',
    path: '/web/supplier/goods/suppliergoodsmgr',
    component: './distributionMarket/market',
    meta: {
      keepAlive: {
        toPath: '/web/supplier/goods/suppliergoodsmgr/detail',
      },
    },
  },
  {
    name: '分销市场-商品详情',
    path: '/web/supplier/goods/suppliergoodsmgr/detail',
    component: './distributionMarket/detail',
  },
  {
    name: '商城管理-模板市场',
    path: 'web/supplier/template/templatemgr',
    component: './template/market',
  },
  {
    name: '文章管理',
    path: '/web/supplier/softtext/softtextmgr',
    component: './cmsManage/articleMng',
  },
  {
    name: '活动管理',
    path: '/web/supplier/active/activemgr',
    component: './cmsManage/customPageMng/index.jsx',
  },
  {
    name: '轮播管理',
    path: '/web/supplier/banner/bannermgr',
    component: './template',
  },
  {
    name: '供应商信息编辑',
    path: '/web/supplier/org/suppliermgr',
    component: './channel/supplier/configEdit',
  },

  /**
   * 原saas页面
   */

  //订单管理 /web/company/trademgr
  {
    path: '/web/supplier/trademgr',
    name: '订单管理',
    routes: [
      {
        name: '售后管理', //tongzhousss
        path: '/web/supplier/trademgr/disputeOrder',
        component: './supplier/order/orderAfterSales',
      },
      {
        name: '售后管理-详情', //tongzhou
        path: '/web/supplier/trademgr/disputeOrder/details',
        component: './supplier/order/orderAfterSales/details',
      },
    ],
  },
  //供应商信息
  {
    path: '/web/supplier/system',
    name: '系统设置',
    routes: [
      {
        name: '企业信息',
        path: '/web/supplier/systemmgr/suppliermgr',
        component: './supplier/SpreadCompany/index',
        title: '系统设置/企业信息',
      },
    ],
  },
  {
    path: '/web/supplier/companyStatistic',
    name: '企业报表',
    routes: [
      {
        name: '商品报表',
        path: '/web/supplier/goodsStatistic',
        component: './supplier/reportForms',
      },
    ],
  },
]

export default routes
