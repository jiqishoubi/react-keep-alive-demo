const api = {
  //售后订单
  DisputeOrderListPaging: '/web/disputeOrder/getDisputeOrderListPaging', //初始化

  DisputeTradeGoodsList: '/web/trade/getDisputeTradeInfor', //详情
  disputeOrderExamine: '/web/trade/disputeOrderExamine', //审核

  provinceList: '/mp/system/region/getProvinceList', //省
  eparchyListByProvince: '/mp/system/region/getEparchyListByProvince', //市
  cityListByEparchy: '/mp/system/region/getCityListByEparchy', //区
  disputeTradeList: '/web/trade/getDisputeTradeList', //选择订单
  disputeTradeGoodsList: '/web/trade/getDisputeTradeGoodsList', //子订单详情
  createDisputeOrder: '/web/disputeOrder/createDisputeOrder', //新建
}
export default api
