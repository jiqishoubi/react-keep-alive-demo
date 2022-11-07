import request from './request'
import { globalHost, localDB } from './utils'
import { allHostObj, getToken, loginStateKey } from './consts'
import { message } from 'antd'
import { router } from 'umi'
import xss from 'xss' //防止xss注入攻击

/**
 * 错误处理
 */
export const handleRes = (res) => {
  if (res && res.code + '' !== '0') {
    message.warning(res.message || '网络异常')
    return false
  }
  return true
}

/**
 *
 * @param {object} options
 * @param {('post'|'get'|'formdata')} [options.type='post']
 * @param {string} options.url
 * @param {object} options.data
 * @param {object} [options.headers]
 * @param {string} [options.requestType='form']
 * @param {boolean} [options.isDaoRu=false]
 * @param {boolean} [options.isNeedCheckResponse=false]
 * @param {boolean} [options.isNeedSuccessNotice=false]
 * @param {boolean} [options.errMsg=false]
 * @returns
 */
const requestw = ({
  type = 'post',
  url,
  data,
  headers,
  requestType = 'form', //json form
  timeout = 1000 * 120,
  isDaoRu = false, // formData
  isNeedCheckResponse = false,
  isNeedSuccessNotice = false,
  errMsg = false,
}) => {
  const token = getToken()

  let postUrl = ''
  if (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) {
    postUrl = url
  } else {
    postUrl = globalHost() + url
  }
  if (token) postUrl = postUrl + '?sessionId=' + token

  let postData = {}
  if (type !== 'formdata') {
    postData = {
      ...data,
    }
    for (let key in postData) {
      if (postData.hasOwnProperty(key)) {
        if (postData[key] == undefined || postData[key] == null) {
          delete postData[key]
        }
      }
    }
  } else {
    // type == 'formdata'
    if (isDaoRu) {
      let formData = new FormData()
      for (let key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          let typeStr = typeof data[key]
          formData.append(key, typeStr === 'object' ? data[key] : xss(data[key]))
        }
      }
      postData = formData
    } else {
      postData = data
    }
  }

  //请求
  return new Promise((resolve, reject) => {
    function getMethod() {
      if (type == 'formdata') {
        return 'post'
      }
      return type
    }

    function getParams() {
      if (type == 'get') {
        return postData
      }
      return null
    }

    return request(postUrl, {
      method: getMethod(),
      params: getParams(),
      data: postData,
      headers: {
        // 'Content-Type':'application/json',
        // 'Content-Type':'application/x-www-form-urlencoded',
        ...headers,
      },
      timeout,
      requestType,
    })
      .then(function (res) {
        if (!isNeedCheckResponse) {
          // 原来的
          return resolve(res)
        } else {
          if (res?.code == '0') {
            // 业务成功
            isNeedSuccessNotice && message.success(res.message || '操作成功')
            return resolve(res.data)
          } else if (res?.code == '9999') {
            message.warning('登录失效，请重新登录')
          } else {
            // 业务失败
            if (errMsg) message.warning(res.message || '网络异常')
            return reject(res)
          }
        }
      })
      .catch(function (error) {
        return isNeedCheckResponse ? reject(error) : resolve(false)
      })
  })
}

export default requestw
