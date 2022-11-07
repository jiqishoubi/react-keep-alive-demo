import routesAdmin from './routes.admin'
import routesSupplier from './routes.supplier'

const routes = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/user/login' },
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/blank',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/', redirect: '/blank/print' },
      {
        name: '面单打印',
        path: '/blank/print',
        component: './common/print',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      { path: '/', redirect: '/user/login' },
      //NoSideLayout 无侧边栏的layout
      {
        path: '/app',
        component: '../layouts/NoSideLayout',
        routes: [
          {
            name: '首页',
            path: '/app/home_yuzhi',
            component: './index/index',
          },
          { component: './404' },
        ],
      },
      //编辑器
      {
        path: '/diy/editorUsed',
        name: '主页装修',
        icon: 'smile',
        component: './miniapp/Editor/index.jsx',
      },
      {
        path: '/diy/activeEditorUsed',
        name: '活动页面装修',
        icon: 'smile',
        component: './miniapp/active/Editor/index.jsx',
      },

      //编辑器 end

      // //BasicLayout
      // {
      //   path: '/',
      //   component: '../layouts/BasicLayout',
      //   routes: [
      //     //小程序授权
      //     {
      //       path: '/web/company/miniapp/auth',
      //       name: '小程序授权',
      //       component: './miniapp/Auth',
      //     },

      //     ...routesAdmin,
      //     ...routesCompany,
      //     ...routesSupplier,

      //     { component: './404' },
      //   ],
      // },

      //小程序授权
      {
        path: '/web/company/miniapp/auth',
        name: '小程序授权',
        component: './miniapp/Auth',
      },

      ...routesAdmin,
      ...routesSupplier,

      { component: './404' },
    ],
  },
  { component: './404' },
]

export default routes
