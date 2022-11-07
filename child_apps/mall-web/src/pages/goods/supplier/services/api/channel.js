import { getOrgKind } from '@/utils/utils'

const api = {
  getOrgProfitRule: '/web/profix/getProfitConfig', //获取商家默认分润规则配置信息
  submitProfitRule: 'web/profix/submitProfitConfig', //提交分润规则配置修改

  //渠道成员管理
  initDistributeMemberPage: '/web/member/initDistributeMemberPage', //渠道成员管理页面初始化
  //分销用户
  getDistributeMemberList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/distribute/member/getDistributeMemberList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/distribute/member/getDistributeMemberList'
    }
  },
  //创建推广人信息
  createDistributeMember: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/distribute/member/createDistributeMember'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/distribute/member/createDistributeMember'
    }
  },
  //删除用户
  deleteDistributeMember: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/distribute/member/deleteDistributeMember'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/distribute/member/deleteDistributeMember'
    }
  },

  //账户余额
  getUserAccountListPaging: '/web/staff/profit/distribution',

  //提现记录
  getUserPaymentListPaging: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/profit/catchOut'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/profit/catchOut'
    }
  },
  approval: '/web/userPayment/approval', //提现审核通过
  cancelPayment: '/web/userPayment/cancelPayment', //提现审核驳回
  getUserPaymentInfoApi: '/web/profit/getUserCatch', //提现记录详情

  //供应商查询
  querySupplierPaging: '/web/admin/supplier/search',
  //创建供货商
  createSupplier: '/web/admin/supplier/create',
  //供应商直查（无分页）
  querySupplierList: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/supplier/getList'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/supplier/getList'
    }
  },
  //供货商更新
  updateSupplierr: '/web/admin/supplier/update',
  //供货商详情
  querySupplierInfo: '/web/supplier/querySupplierInfor',

  //推广公司无分页
  queryPromotionCompanyList: '/web/admin/company/queryCompanyList',
  //供应商无分页查询
  getSupplierList: '/web/admin/supplier/getList',
  //用户佣金
  getUserAccountListPagingApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/account/getUserAccountListPaging'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/account/getUserAccountListPaging'
    }
  },

  //管理端
  getAllDistributeCompanyListApi: '/web/admin/staff/getDistributeCompanyList',

  //操作员管理
  //查询操作员
  getStaffListApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/staff/queryPage'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/queryPage'
    }
  },
  //创建操作员
  createStaffApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/staff/create'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/create'
    }
  },
  //编辑操作员
  updateStaffApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/staff/update'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/update'
    }
  },
  //修改操作员状态
  updateStaffStatusApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/staff/updateStatus'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/updateStatus'
    }
  },
  //重置操作员密码
  resetStaffPasswordApi: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/staff/resetPassword'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/resetPassword'
    }
  },
}

export default api
