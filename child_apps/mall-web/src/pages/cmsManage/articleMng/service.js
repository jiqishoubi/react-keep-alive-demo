import requestw from '@/utils/requestw'
import api_article from '@/services/api/article'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: api_article.getSoftTextPagingApi(),
    data: params,
    isNeedCheckResponse: true,
  })
}

//增
export async function addAjax(params) {
  return requestw({
    url: api_article.createSoftTextApi(),
    data: params,
  })
}

//删
export async function deleteAjax(params) {
  return requestw({
    url: api_article.deleteSoftTextApi(),
    data: params,
    isNeedCheckResponse: true,
    errMsg: true,
  })
}

//改
export async function updateAjax(params) {
  return requestw({
    url: api_article.updateSoftTextApi(),
    data: params,
  })
}

//修改状态
export async function toggleStatusAjax(params) {
  return requestw({
    url: '/card/updateStatus',
    data: params,
  })
}
