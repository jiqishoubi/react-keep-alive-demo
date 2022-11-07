import { getOrgKind } from '@/utils/utils'

const api = {
  //获取列表
  getBannerListPaging: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/banner/getBannerListPaging'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/banner/getBannerListPaging'
    }
  },
  //创建广告
  createBanner: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/banner/createBanner'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/banner/createBanner'
    }
  },
  //修改广告
  updateBanner: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/banner/updateBanner'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/banner/updateBanner'
    }
  },
  //删除广告
  deleteBanner: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/banner/deleteBanner'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/banner/deleteBanner'
    }
  },
}

export default api
