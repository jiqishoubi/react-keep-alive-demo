import { BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from '@/router'
import './global.less'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

// // 渲染路由
// function RouteElement() {
//   const element = useRoutes(routes)
//   return element
// }

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Switch>{renderRoutes(routes)}</Switch>
      </BrowserRouter>
    </ConfigProvider>
  )
}
export default App
