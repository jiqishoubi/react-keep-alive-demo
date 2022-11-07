import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, globalHost } from './utils'
import store from '@/store'
import { ActionTypes, dispatchMicroApp } from './aboutMicroApp'

const ERROR_MESSAGE = '网络异常'

// data过滤一下 null undefined
function haveValue(v) {
  if (v === null || v === undefined) {
    return false
  }
  return true
}

/**
 *
 * @param {object} options
 * @param {string} options.url
 * @param {any} options.data
 * @param {('get'|'post')} [options.method='post']
 * @param {object} [options.headers={}]
 * @param {boolean} [options.errMsg=true]
 * @returns
 */
function request(options = {}) {
  const { url, data = {}, method = 'post', headers = {}, errMsg = true, ...restOptions } = options

  const token = getToken()

  const formData = new FormData()
  let params = {}
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const v = data[key]
      if (haveValue(v)) {
        formData.append(key, v)
        params[key] = data[key]
      }
    }
  }

  let postUrl = url.indexOf('http:') > -1 || url.indexOf('https:') > -1 ? url : globalHost() + url
  if (token) {
    postUrl = `${postUrl}?sessionId=${token}`
  }

  return new Promise((resolve, reject) => {
    return axios
      .request({
        method,
        url: postUrl,
        data: method == 'post' ? formData : {},
        params: method == 'get' ? params : {},
        headers: {
          // "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
          'Content-Type': 'multipart/form-data',
          ...headers,
        },
        timeout: 60 * 1000,
        ...restOptions,
      })
      .then((response) => {
        if (response.data) {
          const res = response.data
          if (res.code == '0') {
            // 业务成功
            return resolve(res.data)
          } else if (res.code === '9999') {
            // 登录失效
            if (errMsg) {
              ElMessage.closeAll()
              ElMessage.warning(res.message || '登录失效')
            }
            dispatchMicroApp({ type: ActionTypes.TOKEN_FAIL }) // 通知主应用
            return reject(res)
          } else {
            // 业务失败
            if (errMsg) ElMessage.warning(res.message || ERROR_MESSAGE)
            return reject(res)
          }
        } else {
          // 网络没通
          if (errMsg) ElMessage.error(ERROR_MESSAGE)
          return reject(response)
        }
      })
      .catch((err) => {
        // 网络没通
        if (errMsg) ElMessage.error(ERROR_MESSAGE)
        reject(err)
      })
  })
}

export default request
