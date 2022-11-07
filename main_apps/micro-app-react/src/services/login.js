import login from '@/store/login'
import { ENV_CONFIG } from '@/utils/consts'

// 处理token失效的情况
export function handleTokenFail() {
  login.logout()

  // 跳转到登录页
  if (window.location.pathname !== '/user/login') {
    window.location.href = `${ENV_CONFIG.urlHost}/user/login`
  }
}
