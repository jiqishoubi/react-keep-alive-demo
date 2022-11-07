import request from '@/utils/request'
import dealMenu from '@/router/dealMenu'
import { getToken } from '../utils/utils'

// 获取全部的菜单 并处理
export function getAllMenuAjax() {
  let menuTreeObj = {
    allMenu: [],
    menuTree: [],
    rightsArr: [],
  }

  return new Promise(async (resolve) => {
    if (!getToken()) {
      return resolve(menuTreeObj)
    }

    const data = await request({
      url: '/web/menu/getAllMenuList',
      errMsg: false,
    })

    let dealResult = {}
    try {
      dealResult = dealMenu(data)
    } catch (e) {
      resolve(menuTreeObj)
    }
    resolve({
      allMenu: data,
      ...dealResult,
    })
  })
}

/**
 * 获取第一个菜单
 */
export function findFirstMenuUrl({ arr: arrArg, childrenkey = 'children', urlKey = 'menuUrl' }) {
  let url = ''
  const getFirst = (arr) => {
    if (arr && arr[0]) {
      if (arr[0][childrenkey]) {
        getFirst(arr[0][childrenkey])
      } else {
        url = arr[0][urlKey]
      }
    }
  }
  getFirst(arrArg)
  return url
}
