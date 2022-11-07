const api = {
  //用户管理
  exportTableUserApi: '/employee/export', //导出用户管理
  //任务管理
  appointMissionApi: '/staff/mission/appoint', //指派任务
  getMissonInfoApi: '/staff/mission/getInfo', //获取任务详情
  //提报审核
  exportReportTableApi: '/web/admin/reportAudit/export', //导出提报审核
  exportReportTableForVerifyApi: '/reportAudit/exportInAudit', //导出提报 为了审核
  importSubmitVerifyApi: '/reportAudit/import', //导入上传 审核
  //提现审核
  exportWithDrawTableApi: '/withDrawAudit/export', //导出提现记录
  updateWithDrawAuditApi: '/withDrawAudit/update', //审核

  getWithDrawSMSApi: '/provider/sms/withDrawAudit', //获取提现审核手机验证码 token
  validWithDrawSMSApi: '/withDrawAudit/smsCheck', //提现 验证码验证 phoneNumber captchaCode

  //新增提报记录 批量
  missionSelectApi: '/staff/mission/getMissionList', //任务下拉框
  copyReportApi: '/reportAudit/add/copy', //批量增加提报

  //11.24添加
  updateWithDrawAudit: '/web/payment/audit', //提现审核（新）
  exportQuery: '/web/payment/export', //导出提现记录
}

export default api
