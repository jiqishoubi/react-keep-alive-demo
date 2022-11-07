import requestw from '@/utils/requestw'

//获取
export async function queryListAjax(params) {
  return requestw({
    url: '/web/staff/uiTemplateData/getUiTemplateDataPaging',
    data: params,
  })
}
