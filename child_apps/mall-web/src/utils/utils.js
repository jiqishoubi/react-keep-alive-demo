import React from 'react'
import { parse } from 'querystring'
import pathRegexp from 'path-to-regexp'
import md5 from 'md5'
import { Base64 } from 'js-base64'
import { allHostObj, getToken, loginStateKey } from './consts'
import { message, Modal } from 'antd'
import { ConsoleSqlOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
export const isUrl = (path) => reg.test(path)
export const pathimgHeader = 'https://greecardcrmt.bld365.com/static/img/'
export const pathVideoHeader = 'https://greecardcrmt.bld365.com/static/mp4/'
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true
  }
  return window.location.hostname === 'preview.pro.ant.design'
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env
  if (NODE_ENV === 'development') {
    return true
  }
  return isAntDesignPro()
}

export const getPageQuery = () => parse(window.location.href.split('?')[1])

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = (router, pathname) => {
  const authority = router.find(({ routes, path = '/', target = '_self' }) => (path && target !== '_blank' && pathRegexp(path).exec(pathname)) || (routes && getAuthorityFromRouter(routes, pathname)))
  if (authority) return authority
  return undefined
}

export const getRouteAuthority = (path, routeData) => {
  let authorities
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities
      }
    }
  })
  return authorities
}

/**
 * 自定义***************************************************************************************
 */

// 获取当前的globalHost
export const globalHost = () => {
  if (window.isProd) {
    // 生产《域名》
    return allHostObj.proHost.host
  }
  // 测试环境《域名》
  return allHostObj.devHost.host
}

// 封装的localStorage setItem getItem
/**
 * 注册一下localStorage的key，目前有：
 */
export const localDB = {
  // key md5加密  value base64加密
  setItem: (keyStr, item) => {
    const { localStorage } = window
    // key
    const keyMd5 = md5(keyStr)
    // value
    const itemJsonStr = JSON.stringify(item)
    const itemBase64 = Base64.encode(itemJsonStr)
    localStorage.setItem(keyMd5, itemBase64)
  },
  getItem: (keyStr) => {
    const { localStorage } = window
    const keyMd5 = md5(keyStr)
    const itemBase64 = localStorage.getItem(keyMd5)
    if (!itemBase64) {
      return undefined
    }
    const itemJsonStr = Base64.decode(itemBase64)
    if (!itemJsonStr || itemJsonStr == 'null' || itemJsonStr == 'undefined') {
      return undefined
    }
    let item = undefined
    try {
      item = JSON.parse(itemJsonStr)
    } catch (e) {}
    return item
  },
  deleteItem: (keyStr) => {
    const { localStorage } = window
    const keyMd5 = md5(keyStr)
    localStorage.removeItem(keyMd5)
  },
}

// 格式化金钱
export const toMoney = (val) => {
  // 数字
  const str = `${((val / 100) * 100).toFixed(2)}`
  const intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',') // 取到整数部分
  const dot = str.substring(str.length, str.indexOf('.')) // 取到小数部分搜索
  const ret = intSum + dot
  return ret
}

// 金钱变回数字number
export const moneyToNum = (str) => {
  // 数字
  if (str) {
    const strTemp = str.replace(',', '')
    return Number(strTemp)
  }
  return str
}

/**
 * @description 用aa替换汉字 并返回
 * @param { string } value
 */
export const wordLengthTrans = (value) => {
  return value ? value.replace(/[\u4e00-\u9fa5|，|。]/g, 'aa') : ''
}

// 获得文件名 去除后缀
export const getFileNameStr = (name) => {
  // name 完整文件名
  const dotIndex = name.lastIndexOf('.')
  const nameStr = name.slice(0, dotIndex)
  return nameStr
}

/**
 * @description 获得后缀
 * @param { string } name
 */
export const getFileNameTypeStr = (name) => {
  // name 完整文件名
  const dotIndex = name.lastIndexOf('.')
  const nameStr = name.slice(dotIndex + 1)
  return nameStr
}

//是否img
export const isIMG = (name) => {
  let suffix = getFileNameTypeStr(name)
  if (
    [
      'bmp',
      'jpg',
      'jpeg',
      'png',
      'tif',
      'gif',
      'pcx',
      'tga',
      'exif',
      'fpx',
      'svg',
      'psd',
      'cdr',
      'pcd',
      'dxf',
      'ufo',
      'eps',
      'ai',
      'raw',
      'wmf',
      'webp',
      'BMP',
      'JPG',
      'JPEG',
      'PNG',
      'TIF',
      'GIF',
      'PCX',
      'TGA',
      'EXIF',
      'FPX',
      'SVG',
      'PSD',
      'CDR',
      'PCD',
      'DXF',
      'UFO',
      'EPS',
      'AI',
      'RAW',
      'WMF',
      'WEBP',
    ].indexOf(suffix) > -1
  ) {
    return true
  } else {
    return false
  }
}

//是否video
export const isVIDEO = (name) => {
  let suffix = getFileNameTypeStr(name)
  if (
    [
      'mp3',
      'mp4',
      'avi',
      'MP3',
      'MP4',
      'AVI',
      'm4v',
      'mov',
      '3gp',
      'mpeg1',
      'mpeg4',
      'flv',
      'mjpeg',
      'rmvb',
      'wmv',
      'f4v',
      'mkv',
      'rm',
      'M4V',
      'MOV',
      '3GP',
      'MPEG1',
      'MPEG4',
      'FLV',
      'MJPEG',
      'RMVB',
      'WMV',
      'F4V',
      'MKV',
      'RM',
      'asf',
      'asx',
      'dat',
      'vob',
      'mpeg',
      'mpg',
      'navi',
      'ASF',
      'ASX',
      'DAT',
      'VOB',
      'MPEG',
      'MPG',
      'NAVI',
    ].indexOf(suffix) > -1
  ) {
    return true
  } else {
    return false
  }
}

// ajax post 获取流，下载file文件
export const downloadFilePostStream = (apiStr, option) => {
  const token = getToken()
  const body = document.body || document.getElementsByTagName('body')[0]
  const form = document.createElement('form')
  form.className = 'myDownloadForm'
  form.setAttribute('action', `${globalHost()}${apiStr}`)
  form.setAttribute('method', 'post')
  form.setAttribute('name', 'downloadForm')
  form.setAttribute('target', '_blank')
  const inputToken = document.createElement('input')
  inputToken.setAttribute('name', 'sessionId')
  inputToken.value = token
  form.appendChild(inputToken)
  // eslint-disable-next-line no-restricted-syntax
  for (const key in option) {
    if (option[key] !== undefined && option[key] !== null) {
      // form表单的形式传undefined 会被转成字符串'undefined'，干脆直接不传了
      const input = document.createElement('input')
      input.setAttribute('name', key)
      input.value = option[key]
      form.appendChild(input)
    }
  }
  body.appendChild(form)
  form.submit()
  setTimeout(() => {
    body.removeChild(form)
  }, 50)
}

/**
 * 取得url参数
 */
export const getUrlParam = (key) => {
  const url = window.location.href
  if (url.indexOf(`${key}=`) > -1) {
    const strBack = url.split(`${key}=`)[1] // key=后面的str
    if (strBack.indexOf('&') > -1) {
      // 后面还有参数
      const value = strBack.split('&')[0]
      return value
    }
    // 后面没参数了
    return strBack
  }
  return null
}

// 根据img大小和容器的宽高比，设置img的css，注：img初始不能设置固定宽高
// 方式一
export const setImgCssByBox = (img, num) => {
  // img元素 num box宽高比 widht/height
  const imgW = img.width
  const imgH = img.height
  if (imgW / imgH > num) {
    // width更大  很长
    img.style.width = '100%'
    img.style.height = 'auto'
  } else {
    img.style.width = 'auto'
    img.style.height = '100%'
  }
}

// 方式二 充满，填满，和方式一相反
export const setImgCssByBoxFull = (img, num) => {
  // img元素 num box宽高比 widht/height
  const imgW = img.width
  const imgH = img.height
  if (imgW / imgH > num) {
    // width更大  很长
    img.style.width = 'auto'
    img.style.height = '100%'
  } else {
    img.style.width = '100%'
    img.style.height = 'auto'
  }
}

// 公共方法，判断是否是数组
export const isArrayFn = (o) => {
  return Object.prototype.toString.call(o) === '[object Array]'
}

/**
 * 控制'元素'权限
 * 是否有这个rightsCode 元素权限！
 */
export const haveCtrlElementRight = (rightsCode) => {
  const rightsArr = getMainAppGlobalData()?.rightsArr ?? []

  let flag = false
  for (let i = 0; i < rightsArr.length; i++) {
    if (rightsArr[i].menuUrl == rightsCode) {
      flag = true
      break
    }
  }
  return flag

  // if (localDB.getItem(loginStateKey)) {
  //   const loginObj = localDB.getItem(loginStateKey)
  //   const { rightsArr } = loginObj
  //   let flag = false
  //   for (let i = 0; i < rightsArr.length; i++) {
  //     if (rightsArr[i].menuUrl == rightsCode) {
  //       flag = true
  //       break
  //     }
  //   }
  //   return flag
  // }
}

// 生成随机字符串
export const randomStrKey = (num = 7) => {
  // num 位数，默认7
  return Math.random().toString(36).substr(2, num)
}

/**
 * 把后端返回的流 转换为下载
 */
export const streamToDownload = ({
  data,
  exportName = '导出结果.xlsx', // 下载文件的名称
}) => {
  const href = window.URL.createObjectURL(new Blob([data]))
  let a = document.createElement('a')
  a.style.display = 'none'
  a.href = href
  a.setAttribute('download', exportName)
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
  }, 20)
}

export const mConfirm = (str, callback) => {
  Modal.confirm({
    title: '提示',
    icon: <ExclamationCircleOutlined />,
    content: str,
    cancelText: '取消',
    okText: '确定',
    onOk() {
      if (callback) {
        return callback()
      }
    },
    onCancel() {},
  })
}

//input 绑定 state (必须是input)
export const bindInputChange = (e, self, key) => {
  //key : state的属性，input的onChange里是e
  self.setState({
    [key]: e.target.value,
  })
}

//select 绑定 state
export const bindSelectChange = (val, self, key) => {
  //key : state的属性，select的onChange里是val
  self.setState({
    [key]: val,
  })
}
// 获得今天日期
export const getToday = (arr) => {
  let day2 = new Date()
  day2.setTime(day2.getTime())
  let s2 = day2.getFullYear() + '-' + (day2.getMonth() + 1) + '-' + day2.getDate()
  return s2
}
//获取上个月
export const getMouth = (arr) => {
  let y = new Date(parseInt(new Date().getTime() - 30 * 86400000)).toLocaleString().split(' ')
  y = y[0]
  let t = y.split('/')
  let year = t[0]
  let month = t[1] > 9 ? t[1] : '0' + t[1]
  let day = t[2] > 9 ? t[2] : '0' + t[2]
  let s2 = year + '-' + month + '-' + day
  return s2
}
// 获得昨天日期
export const getYesterday = () => {
  let day1 = new Date()
  day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000)
  let s1 = day1.getFullYear() + '-' + (day1.getMonth() + 1 < 10 ? '0' + (day1.getMonth() + 1) : day1.getMonth() + 1) + '-' + (day1.getDate() < 10 ? '0' + day1.getDate() : day1.getDate())
  //  let s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
  return s1
}

//列表页 跳页 保存 page
export const keepAlivePage = {
  getUrlKey: () => {
    let url = window.location.href
    let urlKey = ''
    let startIndex = 0
    let endIndex
    if (url.indexOf('#') > -1) {
      startIndex = url.indexOf('#') + 1
    }
    endIndex = url.indexOf('?')
    if (endIndex == -1) {
      urlKey = url.substring(startIndex)
    } else {
      urlKey = url.substring(startIndex, endIndex)
    }
    return urlKey
  },
  set: (options) => {
    let urlKey = keepAlivePage.getUrlKey()
    localDB.setItem(urlKey, {
      ...options,
    })
  },
  get: () => {
    let urlKey = keepAlivePage.getUrlKey()
    return localDB.getItem(urlKey)
  },
  delete: () => {
    let urlKey = keepAlivePage.getUrlKey()
    localDB.deleteItem(urlKey)
  },
}
//实现点击复制  10.28
export const copy = (id) => {
  let copyDOM = document.getElementById(id) //需要复制文字的节点
  let range = document.createRange() //创建一个range
  window.getSelection().removeAllRanges() //清楚页面中已有的selection
  range.selectNode(copyDOM) // 选中需要复制的节点
  window.getSelection().addRange(range) // 执行选中元素
  let successful = document.execCommand('copy') // 执行 copy 操作
  if (successful) {
    message.success('复制成功！')
  } else {
    message.error('复制失败，请手动复制！')
  }
  // 移除选中的元素
  window.getSelection().removeAllRanges()
}

/**
 * 让元素（主要是input）不自动填充，使用网易大神的方法！autocomplete='new-password'
 * 这个方法 要在mounted之后执行吧~
 * 参数o有两种，
 * 1，直接传一个元素ele进来，这个元素里面的所有都取消autocomplete
 * 2，传idStr的数组，根据id，让元素取消autocomplete
 */
export const cancelAutoComplete = (o) => {
  if (isArrayFn(o)) {
    // idStrArr
    const idStrArr = o
    for (let i = 0; i < idStrArr.length; i++) {
      const idStr = idStrArr[i]
      const ele = document.getElementById(idStr)
      ele.setAttribute('autocomplete', 'new-password')
    }
  } else {
    // wrapEle
    // eslint-disable-next-line no-lonely-if
    if (o) {
      const wrapEle = o
      const inputs = wrapEle.getElementsByTagName('input')
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        input.setAttribute('autocomplete', 'new-password')
      }
    }
  }
}

/**
 * @returns {{
 *  isAdmin:boolean,
 *  isCompany:boolean
 * }}
 */
export const getOrgKind = () => {
  // const orgKind = (localDB.getItem(loginStateKey) && localDB.getItem(loginStateKey).loginInfo.orgKind) || ''
  const globaldata = getMainAppGlobalData()
  const userInfo = globaldata?.userInfo || localDB.getItem(loginStateKey)?.loginInfo
  const orgKind = userInfo?.orgKind
  let isAdmin = false
  let isCompany = false

  if (orgKind == 'SYSTEM') {
    isAdmin = true
  }
  if (orgKind == 'SUPPLIER') {
    isCompany = true
  }

  return {
    isAdmin,
    isCompany,
  }
}

export function tryJSONParse(jsonStr, defaultValue = {}) {
  let jsonObj = defaultValue
  try {
    const o = JSON.parse(jsonStr)
    if (['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(o))) {
      jsonObj = o
    }
  } catch (err) {}
  return jsonObj
}
