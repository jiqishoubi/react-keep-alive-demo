import requestw from '@/utils/requestw'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'

//平台获取模板列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/system/uiTemplateData/getUiTemplateDataPaging',
    data: params,
  })
}

//平台删除
export async function deleteTemplateDataAjax(params) {
  return requestw({
    url: '/web/system/uiTemplateData/deleteTemplateData',
    data: params,
    isNeedCheckResponse: true,
    isNeedSuccessNotice: true,
  })
}

//供应商获取模板市场列表
export async function supplierQueryListAjax(params) {
  return requestw({
    url: '/web/supplier/uiTemplateData/getUiTemplateDataPaging',
    data: params,
  })
}
//供应商获取我的模板列表
export async function supplierSelfQueryListAjax(params) {
  return requestw({
    url: '/web/supplier/uiTemplateData/getCompanyUiTemplate',
    data: params,
  })
}
//供应商 添加到我的模板
export async function useTemplate(params) {
  return requestw({
    url: '/web/supplier/uiTemplateData/getUiTemplateDataPaging',
    data: params,
  })
}
