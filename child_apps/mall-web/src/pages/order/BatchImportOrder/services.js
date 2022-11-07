import requestw from '@/utils/requestw'

//获取
export async function queryListAjax(params) {
  return requestw({
    url: '/web/trade/importTradeDataByExcel/getTradeDataInforListPaging',
    data: params,
  })
}
// operCode操作编码
// status(2成功,3失败)进度
// finishDate完成时间
// operDate提交时间
// page
// rows

// 选择合伙人下拉框
export async function getDistributePersonListAjax(params) {
  return requestw({
    url: '/web/trade/importTradeDataByExcel/getDistributePersonList',
    data: params,
  })
}
// userName(名称非必传)

// 选择商品下拉框
export async function getGoodsListAjax(params) {
  return requestw({
    url: '/web/trade/importTradeDataByExcel/getGoodsList',
    data: params,
  })
}
// goodsName(名称非必传)

//批量订单提交
export async function submitBatchAjax(params) {
  return requestw({
    url: '/web/trade/togetherCreateTrade',
    data: params,
  })
}
//tradeDataStr

//详情 列表
export async function getTradeBatchOperDataPagingAjax(params) {
  return requestw({
    url: '/web/trade/getTradeBatchOperDataPaging',
    data: params,
  })
}
// page
// rows
// operCode:操作编码必传
// status(2成功3失败)
