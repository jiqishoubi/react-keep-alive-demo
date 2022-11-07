const api = {
  createLearnGroup: '/web/staff/meansGroup/createMeansGroup', //添加一级分类
  updateLearnGroup: '/web/staff/meansGroup/updateMeansGroup', //编辑一级分类
  //分类分页查询
  getLearnPatientGroupListPaging: '/web/staff/meansGroup/queryPage',
  deleteLearnGroup: '/web/staff/meansGroup/delMeansGroup', //删除一级分类

  //添加患者分类资料
  createLearnPatient: '/web/staff/means/createMeans',
  //活动直查无分页
  getSoftTextList: '/web/uiTemplate/queryList',
  //文章列表
  getSoftTextPaging: '/web/staff/softText/queryList',
  //无分页分类列表
  getLearnGroupList: '/web/staff/meansGroup/queryList',
  //编辑患者教育资料
  updateLearnPatient: '/web/staff/means/updateMeans',
  //患者资料分页查询
  getLearnListPagingPatient: '/web/staff/means/queryPage',
  //删除资料
  deleteLearnPatient: '/web/staff/means/delMeans',
}
export default api
