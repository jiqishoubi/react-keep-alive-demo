import { getOrgKind } from '@/utils/utils'

const api = {
  //文章列表 分页
  getSoftTextPagingApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/system/softText/getSoftTextPaging'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/softText/getSoftTextPaging'
    }
  },
  //创建文章
  createSoftTextApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/system/softText/createSoftText'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/softText/createSoftText'
    }
  },
  //修改文章
  updateSoftTextApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/system/softText/updateSoftText'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/softText/updateSoftText'
    }
  },
  //删除文章
  deleteSoftTextApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/system/softText/deleteSoftText'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/softText/deleteSoftText'
    }
  },
  //文章详情
  getSoftTextInfoApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/system/softText/getSoftTextInfo'
    } else if (getOrgKind().isCompany) {
      return '/web/supplier/softText/getSoftTextInfo'
    }
  },
}

export default api
