type IPageTypeStr = '供应商端-交易订单-详情' | '平台端-交易订单-详情'

export function isPageType(str: IPageTypeStr): boolean {
  if (window.location.pathname.indexOf('/web/system/trade/trademgr/detail') > -1) {
    return str == '平台端-交易订单-详情'
  } else if (window.location.pathname.indexOf('/web/supplier/trade/trademgr/detail') > -1) {
    return str == '供应商端-交易订单-详情'
  }
  return false
}

/**
 *
 */

export function getTradeOrderInfoApi(): string {
  if (isPageType('供应商端-交易订单-详情')) {
    return '/web/supplier/trade/getTradeInfo'
  } else if (isPageType('平台端-交易订单-详情')) {
    return '/web/system/trade/getTradeInfo'
  }
  return ''
}
