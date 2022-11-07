import microApp from '@micro-zoe/micro-app'
import { handleTokenFail } from './services/login'
import { ENV_CONFIG, childAppKeyStrArr } from './utils/consts'

/**
 * @description dispatchMicroApp的actions
 */
export const ActionTypes = {
  TOKEN_FAIL: 'TOKEN_FAIL',
  // 路由跳转
  ROUTER_PUSH: 'ROUTER_PUSH',
  ROUTER_PUSH_NEW: 'ROUTER_PUSH_NEW',
}

let modules = {}
let preFetchApps = [] // 预加载

childAppKeyStrArr.forEach((keyStr) => {
  const appConfigBox = ENV_CONFIG[keyStr]

  modules[appConfigBox.name] = [
    {
      loader(code) {
        if (process.env.NODE_ENV === 'development' && code.indexOf('sockjs-node') > -1) {
          code = code.replace('window.location.port', appConfigBox.devPort)
        }
        return code
      },
    },
  ]

  preFetchApps.push({
    name: appConfigBox.name,
    url: appConfigBox.origin + appConfigBox.childWebRoute, // 不确定需不需要放childWebRoute呢。。
  })
})

microApp.start({
  // sockjs-node报错 要不然会一直刷新
  plugins: {
    modules: modules,
  },
  // 生命周期 对应子应用
  lifeCycles: {
    created(e) {
      console.log('created')
    },
    beforemount(e) {
      console.log('beforemount')
    },
    mounted(e) {
      console.log('mounted')
    },
    unmount(e) {
      console.log('unmount')
    },
    error(e) {
      console.log('error')
    },
  },
  // 2022.05.06
  // 预加载
  preFetchApps,
})

// 子应用触发的事件
/**
 *
 * @param {{
 *  type: string
 *  payload: any
 * }} action
 */
function dataListener(action) {
  const { payload } = action
  console.log('来自子应用my-app的数据', action)

  // token 失效
  if (action.type == ActionTypes.TOKEN_FAIL) {
    console.log('子应用 告诉 主应用：token失效了')
    handleTokenFail()
  }
  // 路由跳转
  else if (action.type == ActionTypes.ROUTER_PUSH) {
    console.log('子应用 告诉 主应用：路由跳转')
    window.HISTORY?.push(payload)
  }
  // 路由跳转-新页面
  else if (action.type == ActionTypes.ROUTER_PUSH_NEW) {
    console.log('子应用 告诉 主应用：路由跳转 新页面')
    window.open(`${window.location.origin}${payload}`, '_blank')
  }
}

/**
 * 绑定监听函数
 * appName: 应用名称
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
childAppKeyStrArr.forEach((keyStr) => {
  microApp.addDataListener(ENV_CONFIG[keyStr].name, dataListener)
})

// // 解绑监听my-app子应用的函数
// microApp.removeDataListener(appName: string, dataListener: Function)

// // 清空所有监听appName子应用的函数
// microApp.clearDataListener(appName: string)
