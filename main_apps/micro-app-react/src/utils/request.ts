import { handleTokenFail } from '@/services/login'
import { message } from 'antd'
import axios, { Method } from 'axios'
import { ENV_CONFIG, getToken } from './consts'

const ERROR_MESSAGE = '网络异常'

// data过滤一下 null undefined
function haveValue(v: any) {
  if (v === null || v === undefined) {
    return false
  }
  return true
}

interface RequestOptionsType {
  url: string
  data?: object
  method?: Method
  headers?: object
  errMsg?: boolean
}

function request<T>(options: RequestOptionsType): Promise<T> {
  const { url, data = {}, method = 'post', headers = {}, errMsg = true, ...restOptions } = options
  const token = getToken()

  // postData
  const formData = new FormData()
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const v = data[key]
      if (haveValue(v)) {
        formData.append(key, v)
      }
    }
  }

  // postUrl
  let postUrl = url.indexOf('http:') > -1 || url.indexOf('https:') > -1 ? url : ENV_CONFIG.apiPath + url
  if (token) {
    postUrl = `${postUrl}?sessionId=${token}`
  }

  return new Promise<T>((resolve, reject) => {
    return axios
      .request({
        url: postUrl,
        method,
        headers: {
          // 'Content-Type': 'application/json',
          // "Content-Type": "application/x-www-form-urlencoded",
          'Content-Type': 'multipart/form-data',
          ...headers,
        },
        data: formData,
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
              try {
                message.destroy()
              } catch (e) {
                console.log('request err', e)
              }
              message.warning(res.message || '登录失效')
            }
            handleTokenFail()
            return reject(res)
          } else {
            // 业务失败
            if (errMsg) message.warning(res.message || ERROR_MESSAGE)
            return reject(res)
          }
        } else {
          // 网络没通
          if (errMsg) message.warning(ERROR_MESSAGE)
          return reject(response)
        }
      })
      .catch((err) => {
        // 网络没通
        if (errMsg) message.warning(ERROR_MESSAGE)
        reject(err)
      })
  })
}

export default request
