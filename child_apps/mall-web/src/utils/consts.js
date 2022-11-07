import { getIsInMicroApp, getMainAppGlobalData } from './aboutMicroApp'
import { localDB } from './utils'

const host = 'https://lyapi.bld365.com' // 现在资质只有这一个域名

// 请求域名
export const allHostObj = {
  devHost: {
    text: '测试',
    // host: 'https://lyapit.bld365.com', // 开发
    // host: 'https://lyapi.lnszly.com', // 生产
    // host: 'http://1.2.4.222:8088', // 雪婷
    host,
  },
  proHost: {
    text: '生产',
    // host: 'https://lyapi.lnszly.com', //
    host,
  },
}

// 前端代码部署的生产域名
export const prodHostArr = ['https://ly.lnszly.com']

export const UPLOAD_FILE_TYPE = 'interholpital_mall_web'

// loginState在localStorage的key
export const loginStateKey = 'loginState_antdpro_react'

export function getToken() {
  if (getIsInMicroApp()) {
    return getMainAppGlobalData().token || ''
  } else {
    const loginObj = localDB.getItem(loginStateKey)
    // 开发
    // return 'LSID4752F6952543F9EC9A64A4D03FC2DA94' // 平台端 sysadmin
    // return 'LSID383BBB8DF72DEBB1624C44D00E7A1013' // 供应商 佟舟1
    return loginObj?.loginInfo?.token
  }
}

export function getLoginUserInfo(props = null) {
  if (getIsInMicroApp()) {
    return getMainAppGlobalData().userInfo || props?.login?.loginInfo
  } else {
    const loginObj = localDB.getItem(loginStateKey)
    return loginObj?.loginInfo || null
  }
}
