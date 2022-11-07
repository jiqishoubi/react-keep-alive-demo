import requestw from '@/utils/requestw'

//获取
export async function queryListAjax(params) {
  return requestw({
    url: '/web/admin/member/getDistributeMemberList',
    data: params,
  })
}

//审核申请
export async function approveDistributeAjax(params) {
  return requestw({
    url: '/web/staff/member/approveDistribute',
    data: params,
  })
}
// distributeCode 分销节点编码 必填. 批量 使用英文逗号分隔
// developCode 推广人编码 必填。--》 接口6 推广人列表获取的 distributeCode 字段
// approveFlag 审核状态  必填 同意:Y, 审核失败：其他
// approveNote 审核备注

//删除
export async function deleteDistributeAjax(params) {
  return requestw({
    url: '/web/staff/member/deleteDistribute',
    data: params,
  })
}
// @param distributeCode 分销节点编码 必填.
