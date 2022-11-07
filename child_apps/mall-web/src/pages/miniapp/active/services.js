import api_goods from '@/services/api/goods'
import requestw from '@/utils/requestw'

//获取商品详情
export const getGoodsInfoAjax = (goodsCode) => {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: api_goods.getGoodsInfo(),
      data: { goodsCode },
    })
    let productObj = null
    if (res && res.code == '0' && res.data) {
      productObj = res.data
    }
    resolve(productObj)
  })
}

/**
 * 模板
 */
//获取模板详情 根据templateCode查template
export const getTemplateAjax = (params) => {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: '/web/promotionCompany/getUiTemplateList',
      data: params,
    })
    console.log('模板', res)
    let obj = null
    if (res && res.code == '0' && res.data && res.data[0]) {
      obj = {
        templateData: res.data[0].templateConfig,
      }
    }
    resolve(obj)
  })
}

/**
 * 样板
 */
//获取样板详情
export const getTemplateDataAjax = (params) => {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: '/web/uiTemplateData/getUiTemplateInfor',
      data: params,
    })
    console.log('样板', res)
    let obj = null
    if (res && res.code == '0' && res.data) {
      obj = res.data
    }
    resolve(obj)
  })
}

//创建样板
export const createTemplateDataAjax = (params) => {
  return requestw({
    url: '/web/uiTemplateData/createUiTemplateData',
    data: params,
  })
}

//编辑样板
export const updateTemplateDataAjax = (params) => {
  return requestw({
    url: '/web/uiTemplateData/updateUiTemplateData',
    data: params,
  })
}

//删除样板
export const deleteTemplateDataAjax = (params) => {
  return requestw({
    url: '/web/uiTemplateData/deleteTemplateData',
    data: params,
  })
}
