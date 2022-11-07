import dayjs from 'dayjs'

export function getDefaultSearchFormModel(meta) {
  const formModel = {
    dateType: 'ORDER',
    dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    orderNo: '',
    orgName: '',
    doctorName: '',
    productTitle: '',
    orderStatus: meta.config?.orderStatus ?? '', // 差异
    // 2022.0512新加筛选
    patientName: '',
    patientPhoneNumber: '',
    payStatus: '',
  }

  return formModel
}
