import dayjs from 'dayjs'

export function getDefaultSearchFormModel(meta) {
  const formModel = {
    dateType: 'ORDER',
    dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    orderNo: '',
    orgName: '',
    doctorName: '',
    orderStatus: meta.config?.orderStatus ?? '', // 差异
    // 2022.0512需求 增加筛选条件
    orderType: '',
    patientName: '',
    patientPhoneNumber: '',
    payStatus: '',
  }

  return formModel
}
