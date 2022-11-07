type IPageTypeStr = '平台端-访问排行' | '供应商端-访问排行'

export function isPageType(str: IPageTypeStr): boolean {
  if (window.location.pathname.indexOf('/web/system/airadar/airadarmgr') > -1) {
    return str == '平台端-访问排行'
  } else if (window.location.pathname.indexOf('/web/supplier/airadar/airadarmgr') > -1) {
    return str == '供应商端-访问排行'
  }
  return false
}

/**
 *
 */

// 列表请求url
export function getTableUrl(): string {
  if (isPageType('平台端-访问排行')) {
    return '/web/system/aiRadar/getRankList'
  } else if (isPageType('供应商端-访问排行')) {
    return '/web/supplier/aiRadar/getRankList'
  }
  return ''
}

// 对应的详情页 path
export function getDetailPath() {
  if (isPageType('平台端-访问排行')) {
    return '/web/system/airadar/airadarmgr/minute'
  } else if (isPageType('供应商端-访问排行')) {
    return '/web/supplier/airadar/airadarmgr/minute'
  }
  return ''
}

export function getTableUrlExportApi() {
  if (isPageType('平台端-访问排行')) {
    return '/web/system/aiRadar/exportRankList'
  } else if (isPageType('供应商端-访问排行')) {
    return '/web/supplier/aiRadar/exportRankList'
  }
  return ''
}
