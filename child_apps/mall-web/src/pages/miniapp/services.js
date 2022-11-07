/**
 * 模板
 */
import api_goods from '@/services/api/goods'
import requestw from '@/utils/requestw'

//获取商品详情
export const getGoodsInfoAjax = (goodsCode) => {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: api_goods.getGoodsInfo(),
      data: { goodsCode },
    })
    resolve(res?.data || null)
  })
}

//模板详情-管理
export const getUiTemplateInfoAjax = (params) => {
  return new Promise(async (resolve) => {
    const res = await requestw({
      // url: '/web/uiTemplateData/getUiTemplateInfo',
      url: '/web/system/uiTemplateData/getUiTemplateInfo',
      data: params,
      isNeedCheckResponse: true,
    })
    resolve(res || null)
  })
}
// id 模板id   必填

/**
 * 模板-管理端
 */

//创建-管理
export const createUiTemplateDataAjax = (params) => {
  return requestw({
    // url: '/web/system/uiTemplate/createUiTemplate',
    url: '/web/system/uiTemplateData/createUiTemplateData',
    data: params,
    isNeedCheckResponse: true,
    errMsg: true,
    isNeedSuccessNotice: true,
  })
}

//编辑-管理
export const updateUiTemplateDataAjax = (params) => {
  return requestw({
    // url: '/web/system/uiTemplateData/updateUiTemplateData',
    url: '/web/system/uiTemplateData/updateUiTemplateData',
    data: params,
    isNeedCheckResponse: true,
    errMsg: true,
    isNeedSuccessNotice: true,
  })
}
// 入参
// id,  模板id  必填
// templateDataName,  模板名称
// templateDataImg,    模板图片
// ifDefault,   是否是默认模板
// templateData,    模板数据
// sessionId  必填

/**
 * 企业的模板-企业端
 */

//创建-企业
export const createUiTemplateDataStaffAjax = (params) => {
  return requestw({
    // url: '/web/staff/uiTemplateData/createUiTemplateData',
    url: '/web/supplier/uiTemplateData/createUiTemplateData',
    data: params,
  })
}
// 入参
// templateCode,  模板编码
// templateData,   模板数据    必填
// templateName,    模板名称    必填
// templateDataImg,    模板图片   必填
// ifDefault,     是否是默认模板   必填
// orgCode,    企业编码  必填
// sessionId    必填

//编辑-企业
export const updateUiTemplateDataStaffAjax = (params) => {
  return requestw({
    // url: '/web/staff/uiTemplateData/updateUiTemplateData',
    url: '/web/supplier/uiTemplateData/updateUiTemplateData',
    data: params,
  })
}
// id,  模板id  必填
// templateDataName,  模板名称
// templateDataImg,    模板图片
// ifDefault,   是否是默认模板
// templateData,    模板数据
// sessionId  必填

////////////////////////////////////////////////////////////////////////////////////////

//删除样板
export const deleteTemplateDataAjax = (params) => {
  return requestw({
    url: '/web/uiTemplateData/deleteTemplateData',
    data: params,
  })
}
