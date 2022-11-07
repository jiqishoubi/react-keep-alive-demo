import requestw, { handleRes } from '@/utils/requestw'

//获取列表
export async function queryListAjax(params) {
  return requestw({
    url: '/web/verification/queryUserListPage',
    data: params,
  })
}

// 创建 /web/verification/createUser
export async function createUserAjax(params) {
  return requestw({
    url: '/web/verification/createUser',
    data: params,
  })
}

// 重置 /web/verification/resetUserPassword
export async function resetUserPasswordAjax(params) {
  return requestw({
    url: '/web/verification/resetUserPassword',
    data: params,
  })
}

// 失效 /web/verification/updateUserStatus
export async function updateUserStatusAjax(params) {
  return requestw({
    url: '/web/verification/updateUserStatus',
    data: params,
  })
}
