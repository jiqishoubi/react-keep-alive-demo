import { getOrgKind } from '@/utils/utils'

const api = {
  //文章列表 分页
  getSoftTextPagingApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/softText/getSoftTextPaging'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/softText/getSoftTextPaging'
    }
  },
  //创建文章
  createSoftTextApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/softText/createSoftText'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/softText/createSoftText'
    }
  },
  //修改文章
  updateSoftTextApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/softText/updateSoftText'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/softText/updateSoftText'
    }
  },
  //删除文章
  deleteSoftTextApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/softText/deleteSoftText'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/softText/deleteSoftText'
    }
  },
  //文章详情
  getSoftTextInfoApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/softText/getSoftTextInfo'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/softText/getSoftTextInfo'
    }
  },
}

export default api
