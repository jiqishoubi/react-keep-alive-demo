type IPageTypeStr = '平台端-商品管理' | '平台端-商城商品管理' // 商品管理 页面类型

export function isPageType(str: IPageTypeStr): boolean {
  if (window.location.pathname.indexOf('/web/system/goods/mallgoodsmgr') > -1) {
    return str == '平台端-商城商品管理'
  } else if (window.location.pathname.indexOf('/web/system/goods/goodsmgr') > -1) {
    return str == '平台端-商品管理'
  }
  return false
}

/**
 *
 */

// 列表请求url
export function getTableUrl(): string {
  if (isPageType('平台端-商城商品管理')) {
    return '/web/system/mallGoods/getMallGoodsListPaging'
  } else if (isPageType('平台端-商品管理')) {
    return '/web/system/goods/getSupplierGoodsListPaging'
  }
  return ''
}

// 对应的详情页 path
export function getDetailPath() {
  if (isPageType('平台端-商城商品管理')) {
    return '/web/system/goods/mallgoodsmgr/detail'
  } else if (isPageType('平台端-商品管理')) {
    return '/web/system/goods/goodsmgr/detail'
  }
  return ''
}
