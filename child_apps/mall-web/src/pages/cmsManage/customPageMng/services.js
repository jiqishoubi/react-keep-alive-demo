import requestw from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'

//获取列表
export async function fetchAjax(params) {
  return requestw({
    url: getOrgKind().isAdmin ? '/web/system/uiTemplate/getUiTemplateList' : '/web/supplier/uiTemplate/getUiTemplateList',
    data: params,
    isNeedCheckResponse: true,
  })
}
// nowPage 当前页
// rowsPage 每页记录数
// templateName 名称
// templateCode 编码

//创建页面
export async function addAjax(params) {
  return requestw({
    url: getOrgKind().isAdmin ? '/web/system/uiTemplate/createUiTemplate' : '/web/supplier/uiTemplate/createUiTemplate',
    data: params,
  })
}
// templateName:模板名称
// templateConfig:模板数据

//编辑
export async function updateAjax(params) {
  return requestw({
    // url: '/web/system/uiTemplate/updateUiTemplate',
    url: getOrgKind().isAdmin ? '/web/system/uiTemplate/updateUiTemplate' : '/web/supplier/uiTemplate/updateUiTemplate',
    data: params,
  })
}
// templateName 模板名称
// templateCode 要修改的模板编码
// templateConfig 模板数据

//删除
export async function deleteCustomPageAjax(params) {
  return requestw({
    url: getOrgKind().isAdmin ? '/web/system/uiTemplate/deleteUiTemplate' : '/web/supplier/uiTemplate/deleteUiTemplate',
    data: params,
    isNeedCheckResponse: true,
    isNeedSuccessNotice: true,
  })
}
// templateCode要删除的模板编码

//获取详情
export async function getCustomPageInfoAjax(params) {
  return new Promise(async (resove) => {
    const res = await requestw({
      // url: '/web/system/uiTemplate/getUiTemplateListInfor',
      url: getOrgKind().isAdmin ? '/web/system/uiTemplate/getUiTemplateListInfor' : '/web/supplier/uiTemplate/getUiTemplateListInfor',
      data: params,
    })
    let obj = {
      templateData: res.templateConfig,
      remark: res.remark,
      templateName: res.templateName,
    }
    resove(obj)
  })
}
//templateCode
