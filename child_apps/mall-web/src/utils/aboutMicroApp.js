import { connect } from 'dva'
import { getDvaApp } from 'umi'
/**
 * @description dispatchMicroApp的actions
 */
export const ActionTypes = {
  TOKEN_FAIL: 'TOKEN_FAIL',
}

// 当前系统是否是在微前端中
export function getIsInMicroApp() {
  return window.microApp && window.microApp.appName
}

// 主应用传过来的 全局数据
export function getMainAppGlobalData() {
  //首先返回基座应用全局状态 其次返回子应用状态
  const globalData = window.microApp?.getGlobalData() || window?.mall_global || {} // 返回全局数据
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
