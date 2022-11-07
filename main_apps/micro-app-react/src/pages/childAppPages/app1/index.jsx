import { ENV_CONFIG } from '@/utils/consts'
/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'

function Index() {
  // name(必传)：应用名称
  // url(必传)：应用地址，会被自动补全为http://localhost:3000/index.html
  // baseroute(可选)：基座应用分配给子应用的基础路由，就是上面的 `/my-page`
  return (
    <div>
      <micro-app
        name={ENV_CONFIG.doctor.name}
        url={`${ENV_CONFIG.doctor.origin}${ENV_CONFIG.doctor.childWebRoute}`}
        baseroute={ENV_CONFIG.doctor.baseroute}
      ></micro-app>
    </div>
  )
}
export default Index
