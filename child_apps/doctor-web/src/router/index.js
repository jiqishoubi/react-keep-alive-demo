import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const route404 = {
  path: '/:catchAll(.*)',
  component: () => import('@/views/common/404/index.vue'),
}

const routes = [
  // // UserLayout
  // {
  //   path: '/user',
  //   component: () => import('@/layouts/UserLayout/index.vue'),
  //   children: [
  //     {
  //       path: '/user/login',
  //       component: () => import('@/views/login/index.vue'),
  //     },
  //   ],
  // },
  // BasicLayout
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout/index.vue'),
    children: [
      // 系统管理
      {
        path: '/web/system/staff/staffmgr',
        name: '员工管理',
        component: () => import('@/views/system/staffMng/index.vue'),
      },
      {
        path: '/web/system/role/rolemgr',
        name: '角色管理',
        component: () => import('@/views/system/roleMng/index.vue'),
      },
      // 医生集团
      {
        path: '/web/system/company/companymgr',
        name: '医生集团管理',
        component: () => import('@/views/dr/companyMng/index.vue'),
      },
      // 医院管理
      {
        path: '/web/system/hospital/hospitalmgr',
        name: '医院管理',
        component: () => import('@/views/dr/hospitalMng/index.vue'),
      },
      // 科室管理
      {
        path: '/web/system/depart/departmgr',
        name: '科室管理',
        component: () => import('@/views/dr/departMng/index.vue'),
      },
      // 诊疗科目
      {
        path: '/web/system/departclass/departclassmgr',
        name: '诊疗科目',
        component: () => import('@/views/dr/departClassMng/index.vue'),
      },
      // 医生管理
      {
        path: '/web/system/doctor/doctormgr',
        name: '医生管理',
        component: () => import('@/views/dr/doctorMng/index.vue'),
        meta: {
          keepAlive: {
            to: '/web/system/doctor/doctormgr/detail', // 去详情的时候 keep alive进行缓存
          },
        },
      },
      {
        path: '/web/system/doctor/doctormgr/detail',
        name: '医生管理-详情',
        component: () => import('@/views/dr/doctorMng/detail/index.vue'),
      },
      /**
       * 订单管理
       */
      // 全部订单
      {
        path: '/web/system/doctororder/ordermgr',
        name: '订单管理',
        component: () => import('@/views/order/orderMngWrap/normall.vue'),
        meta: {
          keepAlive: {
            to: '/web/system/doctororder/ordermgr/detail', // 去详情的时候 keep alive进行缓存
          },
          config: {},
        },
      },
      // 待办订单
      {
        path: '/web/system/doctororder/undoordermgr',
        name: '待办订单',
        component: () => import('@/views/order/orderMngWrap/undo.vue'),
        meta: {
          keepAlive: {
            to: '/web/system/doctororder/ordermgr/detail', // 去详情的时候 keep alive进行缓存
          },
          config: {
            orderStatus: '40,50', // 咨询中 的订单  2022.06.09再加一个 40 待接诊
          },
        },
      },
      // 订单详情
      {
        path: '/web/system/doctororder/ordermgr/detail',
        name: '订单管理-详情',
        component: () => import('@/views/order/orderMng/detail/index.vue'),
      },

      /**
       * product订单管理
       */
      // 全部product订单
      {
        path: '/web/system/serviceorder/ordermgr',
        name: '服务订单管理',
        component: () => import('@/views/productOrder/orderMngWrap/normall.vue'),
        meta: {
          keepAlive: {
            to: '/web/system/serviceorder/ordermgr/detail', // 去详情的时候 keep alive进行缓存
          },
          config: {},
        },
      },
      // 待办product订单
      {
        path: '/web/system/serviceorder/undoordermgr',
        name: '待办服务订单',
        component: () => import('@/views/productOrder/orderMngWrap/undo.vue'),
        meta: {
          keepAlive: {
            to: '/web/system/serviceorder/ordermgr/detail', // 去详情的时候 keep alive进行缓存
          },
          config: {
            orderStatus: '50', // 咨询中 的订单
          },
        },
      },
      // product订单详情
      {
        path: '/web/system/serviceorder/ordermgr/detail',
        name: '服务订单管理-详情',
        component: () => import('@/views/productOrder/orderMng/detail/index.vue'),
      },

      /**
       * 商品管理
       */
      {
        path: '/web/system/goods/goodsmgr',
        name: '商品管理',
        component: () => import('@/views/goods/goodsMng/index.vue'),
        meta: {
          keepAlive: {
            to: '/web/system/goods/goodsmgr/detail', // 去详情的时候 keep alive进行缓存
          },
        },
      },
      // 商品详情
      {
        path: '/web/system/goods/goodsmgr/detail',
        name: '商品管理-详情',
        component: () => import('@/views/goods/goodsMng/detail/index.vue'),
      },
      // 提现
      {
        path: '/web/system/doctor/doctorbalancemgr',
        name: '账户管理',
        component: () => import('@/views/feeAccountMng/index.vue'),
      },
      {
        path: '/web/system/doctor/paymentmgr',
        name: '提现管理',
        component: () => import('@/views/withdraw/index.vue'),
      },
      // 客户服务
      // 投诉举报
      {
        path: '/web/system/complaint/complaintmgr',
        name: '投诉举报',
        component: () => import('@/views/complaint/complaintMng/index.vue'),
      },
      {
        path: '/web/system/order/appraisemgr',
        name: '评价管理',
        component: () => import('@/views/dr/appraiseMng/index.vue'),
      },
      {
        path: '/web/system/user/usermgr',
        name: '用户管理',
        component: () => import('@/views/system/userMng/index.vue'),
      },
      {
        path: '/web/system/patient/patientmgr',
        name: '患者管理',
        component: () => import('@/views/system/patientMng/index.vue'),
      },
      // 处方管理
      {
        path: '/web/system/prescription/prescriptionmgr',
        name: '处方管理',
        component: () => import('@/views/order/prescriptionMng/index.vue'),
      },
      // 处方交易订单
      {
        path: '/web/system/trade/trademgr',
        name: '交易订单',
        component: () => import('@/views/order/tradeOrderMng/index.vue'),
      },

      // {
      //   path: '/web/test',
      //   name: '开发页面',
      //   component: () => import('@/views/patientMng/index.vue'),
      // },
      route404,
    ],
  },

  route404,
]

console.log('window.__MICRO_APP_BASE_ROUTE__', window.__MICRO_APP_BASE_ROUTE__)
const router = createRouter({
  // 微前端
  // 👇 __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL),

  routes,
  // keepalive滚动
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0,
      }
    }
  },
})

export default router
