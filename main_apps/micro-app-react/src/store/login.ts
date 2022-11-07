import { autorun, makeAutoObservable, runInAction } from 'mobx'
import request from '@/utils/request'
import dealMenu from '@/utils/dealMenu'
import { LOGIN_TOKEN_KEY, getToken } from '@/utils/consts'
import microApp from '@micro-zoe/micro-app'

class Login {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  userInfo: any | null = null // userInfo.pharmacistInfoDTO 默认是null，查到了就是是对象，没查到也给一个空对象{}
  allMenu: MenuItemType[] = []
  menuTree: MenuItemType[] = []
  rightsArr: MenuItemType[] = []

  loading = {
    getMenuTree: false,
  }

  // actions
  async initInfo() {
    this.getUserInfo()
    return await this.getMenuTree()
  }
  async getUserInfo() {
    const data = await request<object | null>({
      url: '/web/getLoginStaffInfo',
    })
    if (data) {
      runInAction(() => {
        this.userInfo = data

        this.getPharmacistInfo()

        // 如果是供应商 还需要查一下 供应商的详情
        if (this.userInfo.orgKind !== 'SYSTEM') {
          this.getSupplierInfo(this.userInfo.orgCode)
        }
      })
    }
  }
  // 供应商
  async getSupplierInfo(orgCode: string) {
    const data = await request<object | null>({
      url: '/web/supplier/supplier/getSupplierInfo',
      data: { supplierCode: orgCode },
    })
    if (data) {
      runInAction(() => {
        this.userInfo.supplierInfoDTO = data
      })
    }
  }
  async getMenuTree() {
    this.loading.getMenuTree = true
    const data = await request<MenuType[]>({
      url: '/web/menu/getAllMenuList',
    })
    // 这里要加一个return
    return runInAction(() => {
      this.loading.getMenuTree = false

      const menuRes = dealMenu(data)
      this.allMenu = menuRes.allMenu ?? []
      this.menuTree = menuRes.menuTree ?? []
      this.rightsArr = menuRes.rightsArr ?? []

      return this.menuTree
    })
  }
  // 获取药剂师信息
  async getPharmacistInfo() {
    const data = await request<object | null>({
      url: '/web/staff/getPharmacistInfo',
      errMsg: false,
    })
    console.log('登录人 药剂师info', data)
    if (data) {
      runInAction(() => {
        this.userInfo.pharmacistInfoDTO = data || {}
      })
    }
  }
  logout() {
    localStorage.removeItem(LOGIN_TOKEN_KEY)

    this.userInfo = null
    this.allMenu = []
    this.menuTree = []
    this.rightsArr = []
  }
}

const login = new Login()

autorun(() => {
  const token = getToken()
  const globalData = {
    token,
    userInfo: login.userInfo,
    rightsArr: login.rightsArr,
  }
  console.log('基座 setGlobalData', globalData)
  microApp.setGlobalData(globalData)
})

export default login
