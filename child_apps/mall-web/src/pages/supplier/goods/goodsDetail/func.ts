type IPageTypeStr = '供应商端-商品管理-详情' | '供应商端-商城商品-详情' | '平台端-商品管理-详情' | '平台端-商城商品-详情'

export function isPageType(str: IPageTypeStr): boolean {
  if (window.location.pathname.indexOf('/web/supplier/goods/goodsmgr/detail') > -1) {
    return str == '供应商端-商品管理-详情'
  } else if (window.location.pathname.indexOf('/web/supplier/goods/mallgoodsmgr/detail') > -1) {
    return str == '供应商端-商城商品-详情'
  } else if (window.location.pathname.indexOf('/web/system/goods/mallgoodsmgr/detail') > -1) {
    return str == '平台端-商城商品-详情'
  } else if (window.location.pathname.indexOf('/web/system/goods/goodsmgr/detail') > -1) {
    return str == '平台端-商品管理-详情'
  }
  return false
}

/**
 *
 */

// 获取商品信息
export function getGetGoodsInfoApi(): string {
  if (isPageType('供应商端-商品管理-详情')) {
    return '/web/supplier/goods/getSupplierGoodsInfo'
  } else if (isPageType('供应商端-商城商品-详情')) {
    return '/web/mall/goods/getGoodsInfo'
  } else if (isPageType('平台端-商城商品-详情')) {
    return '/web/system/mallGoods/getMallGoodsInfo'
  } else if (isPageType('平台端-商品管理-详情')) {
    return '/web/system/goods/getSupplierGoodsInfo'
  }
  return ''
}

export function getDisabledByPageType() {
  if (isPageType('供应商端-商城商品-详情')) return true
  return false
}

export function getEditApi() {
  if (isPageType('供应商端-商品管理-详情')) {
    return '/web/supplier/goods/updateSupplierGoods'
  } else if (isPageType('供应商端-商城商品-详情')) {
    return '/web/mall/goods/updateGoods'
  }
  return ''
}
