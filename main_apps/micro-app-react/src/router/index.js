import { lazy, Suspense } from 'react'
import { Redirect } from 'react-router-dom'
import LazyLoading from '@/components/LazyLoading'
// layouts
import UserLayout from '@/layouts/UserLayout'
import SecurityLayout from '@/layouts/SecurityLayout'
import BasicLayout from '@/layouts/BasicLayout'
// pages
import Page404 from '@/pages/common/404'
import Login from '@/pages/login'
// childApps
import DoctorApp from '@/pages/childAppPages/app1'
import MallApp from '@/pages/childAppPages/app2'

const route404 = {
  path: '*',
  component: Page404,
}

let routes = [
  // UserLayout
  {
    path: '/user',
    component: UserLayout,
    routes: [
      {
        path: '/user/login',
        component: Login,
      },
      route404,
    ],
  },
  // 应用
  // SecurityLayout
  {
    path: '/',
    component: SecurityLayout,
    routes: [
      {
        path: '/',
        component: BasicLayout,
        routes: [
          {
            path: '/',
            exact: true,
            render: () => <Redirect to="/user/login" />,
          },
          // 在线问诊应用
          {
            path: '/doctorApp',
            component: DoctorApp,
          },
          // 商城应用
          {
            path: '/mallApp',
            component: MallApp,
          },
          route404,
        ],
      },
      route404,
    ],
  },
  route404,
]

// function Lazycomponent(props) {
//   const { importFunc } = props
//   const LazyComponent = lazy(importFunc)
//   return (
//     <Suspense fallback={<LazyLoading />}>
//       <LazyComponent />
//     </Suspense>
//   )
// }

// // 处理routes 如果component是懒加载，要包裹Suspense
// function dealRoutes(routesArr) {
//   if (routesArr && Array.isArray(routesArr) && routesArr.length > 0) {
//     routesArr.forEach((route) => {
//       if (route.component && typeof route.component == 'function') {
//         const importFunc = route.component
//         route.component = <Lazycomponent importFunc={importFunc} />
//       }
//       if (route.routes) {
//         dealRoutes(route.routes)
//       }
//     })
//   }
// }
// dealRoutes(routes)

export default routes
