/**
 * @description dispatchMicroApp的actions
 */
export const ActionTypes = {
  TOKEN_FAIL: 'TOKEN_FAIL',
  // 路由跳转
  ROUTER_PUSH: 'ROUTER_PUSH',
  ROUTER_PUSH_NEW: 'ROUTER_PUSH_NEW',
}

// 当前系统是否是在微前端中
export function getIsInMicroApp() {
  return window.microApp && window.microApp.appName
}

// 主应用传过来的 全局数据
export function getMainAppGlobalData() {
  const globalData = window.microApp?.getGlobalData() ?? {} // 返回全局数据
  return globalData
}

/**
 * @description 给主应用发送事件
 * @param {{
 *  type: string
 *  payload: any
 * }} action
 */
export function dispatchMicroApp(action) {
  if (window.microApp && action.type) {
    window.microApp.dispatch(action)
  }
}
