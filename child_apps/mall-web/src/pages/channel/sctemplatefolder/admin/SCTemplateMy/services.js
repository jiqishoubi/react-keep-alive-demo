import requestw from '@/utils/requestw'

//获取
export async function queryListAjax(params) {
  return requestw({
    url: '/web/admin/uiTemplateData/getCompanyUiTemplate',
    data: params,
  })
}
// templateDataName,  模板名称
// orgCode,  企业编码  必填
// page,  当前页  必填
// rows,   条数  必填
