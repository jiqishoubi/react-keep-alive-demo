import { prodHostArr, allHostObj, LOGIN_TOKEN_KEY } from './consts'
import store from '@/store/index.ts'
import { getIsInMicroApp, getMainAppGlobalData } from './aboutMicroApp'

/**
 * @description 生成随机字符串
 * @param {number} [num=7]
 */
export const randomStrKey = (num = 7) => {
  return Math.random().toString(36).substr(2, num)
}

export function getIsProd() {
  // const url = window.location.href
  // let isProd = false
  // for (let i = 0; i < prodHostArr.length; i++) {
  //   if (url.indexOf(prodHostArr[i]) > -1) {
  //     isProd = true
  //     break
  //   }
  // }
  // return isProd
  return true
}

// 获取当前的globalHost
export const globalHost = () => {
  return getIsProd() ? allHostObj.proHost.host : allHostObj.devHost.host
}

export function getToken() {
  if (getIsInMicroApp()) {
    return getMainAppGlobalData().token || ''
  } else {
    return localStorage.getItem(LOGIN_TOKEN_KEY) || ''
  }
}

function isObjectOrArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]' || Object.prototype.toString.call(obj) === '[object Array]'
}

export function cloneDeep(obj) {
  if (isObjectOrArray(obj)) {
    var objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = cloneDeep(obj[key])
          } else {
            objClone[key] = obj[key]
          }
        }
      }
    }
    return objClone
  }
  return obj
}

/**
 *
 * @param {*} url
 * @param {*} [allMenu]
 * @returns {boolean}
 */
export function useHaveRight(url, allMenu) {
  let allRights = []
  if (allMenu) {
    allRights = allMenu
  } else {
    allRights = store.state?.user?.allMenu || []
  }
  let isHave = false
  for (let i = 0; i < allRights.length; i++) {
    if (url == allRights[i].menuUrl) {
      isHave = true
      break
    }
  }
  return isHave
}

// 获取后缀
export function getFileNameSuffix(str) {
  if (!str) return ''
  let dotIndex = str.lastIndexOf('.')
  let suffix = str.slice(dotIndex + 1)
  suffix.toLowerCase()
  return suffix
}

//ajax post 获取流，下载file文件
export const downloadFileNetwork = (urlStr) => {
  const body = document.body || document.getElementsByTagName('body')[0]
  const form = document.createElement('form')
  form.className = 'myDownloadForm'
  form.setAttribute('action', urlStr)
  form.setAttribute('method', 'post')
  form.setAttribute('name', 'downloadForm')
  form.setAttribute('target', '_blank')
  body.appendChild(form)
  form.submit()
  setTimeout(() => {
    body.removeChild(form)
  }, 50)
}

export function delayTime(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve()
    }, ms)
  })
}
