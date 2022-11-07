type IPageTypeStr = '供应商端-交易订单' | '平台端-交易订单'

export function isPageType(str: IPageTypeStr): boolean {
  if (window.location.pathname.indexOf('/web/system/trade/trademgr') > -1) {
    return str == '平台端-交易订单'
  } else if (window.location.pathname.indexOf('/web/supplier/trade/trademgr') > -1) {
    return str == '供应商端-交易订单'
  }
  return false
}

/**
 *
 */

// 列表请求url
export function getTableUrl(): string {
  if (isPageType('供应商端-交易订单')) {
    return '/web/supplier/trade/queryPage'
  } else if (isPageType('平台端-交易订单')) {
    return '/web/system/trade/queryPage'
  }
  return ''
}

// 对应的详情页 path
export function getDetailPath() {
  if (isPageType('供应商端-交易订单')) {
    return '/web/supplier/trade/trademgr/detail'
  } else if (isPageType('平台端-交易订单')) {
    return '/web/system/trade/trademgr/detail'
  }
  return ''
}

// 确认收货api
export function apiConfirmTrade() {
  if (isPageType('供应商端-交易订单')) {
    return '/web/supplier/trade/confirmTrade'
  } else if (isPageType('平台端-交易订单')) {
    return '/web/system/trade/confirmTrade'
  }
  return ''
}
