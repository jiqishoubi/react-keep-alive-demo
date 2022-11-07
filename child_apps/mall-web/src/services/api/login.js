const api = {
  getCaptchaApi: '/captcha?key=', //获取图形验证码
  loginApi: '/web/doLogin', //登录
  getMenuApi: '/web/menu/getAllMenuList', //获取菜单
  retreat: '/web/doLogout',
  updatePassword: '/web/updatePassword',
  newUpdatePassword: '/web/staff/updatePassword',
}

export default api
