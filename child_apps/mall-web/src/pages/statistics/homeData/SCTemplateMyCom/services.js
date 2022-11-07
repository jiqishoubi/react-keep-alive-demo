import requestw from '@/utils/requestw'

//获取
export async function queryListAjax(params) {
  return requestw({
    url: '/web/supplier/index/getUiTemplateDataList',
    data: params,
  })
}
// id   模板id
