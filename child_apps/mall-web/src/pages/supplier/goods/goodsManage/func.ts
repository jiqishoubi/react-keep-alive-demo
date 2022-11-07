type IPageTypeStr = '供应商端-商品管理' | '供应商端-商城商品' // 商品管理 页面类型

export function isPageType(str: IPageTypeStr): boolean {
  if (window.location.pathname.indexOf('/web/supplier/goods/goodsmgr') > -1) {
    return str == '供应商端-商品管理'
  } else if (window.location.pathname.indexOf('/web/supplier/goods/mallgoodsmgr') > -1) {
    return str == '供应商端-商城商品'
  }
  return false
}

/**
 *
 */

// 列表请求url
export function getTableUrl(): string {
  if (isPageType('供应商端-商品管理')) {
    return '/web/supplier/goods/getSupplierGoodsListPaging'
  } else if (isPageType('供应商端-商城商品')) {
    return '/web/mall/goods/getGoodsList'
  }
  return ''
}

// 对应的详情页 path
export function getDetailPath() {
  if (isPageType('供应商端-商品管理')) {
    return '/web/supplier/goods/goodsmgr/detail'
  } else if (isPageType('供应商端-商城商品')) {
    return '/web/supplier/goods/mallgoodsmgr/detail'
  }
  return ''
}
