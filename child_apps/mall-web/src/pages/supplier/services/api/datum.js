/**
 * 学习资料
 */
import { getOrgKind } from '@/utils/utils'

const api = {
  //学院
  //资料查询
  getLearnListPaging: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/learn/getLearnListPaging'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/learn/getLearnListPaging'
    }
  },
  createLearn: '/web/staff/learn/createLearn', //新建资料
  updateLearn: '/web/staff/learn/updateLearn', //编辑资料
  deleteLearn: '/web/admin/learn/deleteLearn', //删除资料

  //类目
  createLearnGroup: '/web/staff/learnGroup/createLearnGroup', //添加类目
  updateLearnGroup: '/web/staff/learnGroup/updateLearnGroup', //修改类目
  //类目查询
  getLearnGroupListPaging: () => {
    if (getOrgKind().isAdmin) {
      return '/web/admin/learnGroup/getLearnGroupListPaging'
    } else if (getOrgKind().isCompany) {
      return '/web/staff/learnGroup/getLearnGroupListPaging'
    }
  },
  getLearnGroupList: '/web/staff/learnGroup/getLearnGroupList', //联动类目查询 //全部
  deleteLearnGroup: '/web/staff/learnGroup/deleteLearnGroup', //删除类目
}
export default api
