import requestw from '@/utils/requestw'
//创建活动
export async function createPreActive(params) {
  return requestw({
    url: '/web/active/createPreActive',
    data: params,
  })
}
//查询活动
export async function getPreActieInfo(params) {
  return requestw({
    url: '/web/active/getPreActieInfo',
    data: params,
  })
}

//查询活动商品
export async function getAllGoodsList(params) {
  return requestw({
    url: '/web/goods/getAllGoodsList',
    data: params,
  })
}

//查询添加的活动商品
export async function addPreActiveGoods(params) {
  return requestw({
    url: '/web/active/addPreActiveGoods',
    data: params,
  })
}

//查询已添加活动商品
export async function getPreActiveGoodsList(params) {
  return requestw({
    url: '/web/active/getPreActiveGoodsList',
    data: params,
  })
}

//删除已添加活动商品
export async function deletePreActiveGoods(params) {
  return requestw({
    url: '/web/active/deletePreActiveGoods',
    data: params,
  })
}

//已添加活动商品进行设置
export async function updatePreActiveScope(params) {
  return requestw({
    url: '/web/active/updatePreActiveScope',
    data: params,
  })
}

//编辑活动第一步
export async function updatePreActive(params) {
  return requestw({
    url: '/web/active/updatePreActive',
    data: params,
  })
}
