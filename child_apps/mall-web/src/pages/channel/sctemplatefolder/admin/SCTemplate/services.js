import requestw from '@/utils/requestw'

//获取
export async function queryListAjax(params) {
  return requestw({
    url: '/web/admin/uiTemplateData/getUiTemplateDataPaging',
    data: params,
  })
}

//删除
export async function deleteTemplateDataAjax(params) {
  return requestw({
    url: '/web/admin/uiTemplateData/deleteTemplateData',
    data: params,
  })
}
// id   模板id
