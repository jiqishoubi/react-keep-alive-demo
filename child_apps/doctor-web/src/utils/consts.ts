const origin = window.location.origin || ''

// 请求域名
export const allHostObj = {
  devHost: {
    text: '测试',
    host: 'https://lyapi.bld365.com', // 资质版 就这一个环境
    // host: 'http://1.2.4.222:8088', // 雪婷
  },
  proHost: { text: '生产', host: 'https://lyapi.bld365.com' },
}

// 前端代码部署的生产域名
export const prodHostArr = ['https://ly.bld365.com']

export const LOGIN_TOKEN_KEY = origin + '_LOGIN_TOKEN_KEY'
export const loginPath = '/user/login'

export const firstMenuUrl = '/web/system/doctororder/ordermgr'
