import requestw from '@/utils/requestw'

//获取
export async function queryListAjax(params) {
  return requestw({
    url: '/web/staff/uiTemplateData/getCompanyUiTemplateData',
    data: params,
  })
}

//删除
export async function deleteTemplateDataAjax(params) {
  return requestw({
    url: '/web/staff/uiTemplateData/deleteTemplateData',
    data: params,
  })
}
// id   模板id
export async function copyCompanyUiTemplateAjax(params) {
  return requestw({
    url: '/web/staff/uiTemplateData/copyCompanyUiTemplate',
    data: params,
  })
}
