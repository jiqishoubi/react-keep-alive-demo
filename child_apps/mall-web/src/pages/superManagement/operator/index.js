/**
 * 操作员管理
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
//组件
import { Card, Breadcrumb, Form, Input, Button, Icon, Row, Col, Select, Tooltip, message, Table, Modal, Dropdown, Menu, TreeSelect } from 'antd'
import StaffAddEdit from './StaffAddEdit/StaffAddEdit'
import RightAddEdit from './RightAddEdit/RightAddEdit'
import { UndoOutlined, SearchOutlined } from '@ant-design/icons'
//变量方法
import { mConfirm, bindInputChange, cancelAutoComplete, downloadFilePostStream, streamToDownload } from '@/utils/utils'
import requestw from '@/utils/requestw'
// import api_system from '@/services/api/system'
// import allApiStr from '@/services/allApiStr'
//样式
import styles from './StaffMng.less'

const { Option } = Select
const { TextArea } = Input
const { TreeNode } = TreeSelect
const tabOldWidth = 1130
const formItemLayout = {
  labelCol: {
    xs: { span: 48 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 48 },
    sm: { span: 30 },
  },
}
// @connect(({ selectOptions, loading }) => ({
//   selectOptions,
//   loadingTree: loading.effects['selectOptions/getOrganizationTree'],
// }))
// @Form.create()
class StaffMng extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //表格
      tableWidth: tabOldWidth,
      tableInfo: null,
      page: 1,
      pageSize: 10,
      realQuery: null,

      //员工详情modal
      staffDetailModal: false,
      lookingStaff: {},
      isAdd: false, //是否新增

      //禁用原因modal
      showFreezeReason: false,
      freezeReason: '',

      //权限modal
      showRightModal: false,

      //loading
      loading_table: false,
      loading_export: false,

      deskHeight: document.body.clientHeight,
      setPasswordModal: false,
      setPasswordCode: {},
      companyList: [],
    }
    this.formRef = React.createRef()
  }
  //周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期期周期周期周期周期周期期周期周期周期周期周期期周期周期周期周期周期期周期周期周期周期周期
  componentDidMount() {
    this.setTableWidth()
    window.addEventListener('resize', this.setTableWidth)
    window.addEventListener('resizes', this.handleSize)
    this.getData()
    //取消autocomplete
    cancelAutoComplete(document.getElementsByClassName('antd-pro-pages-admin-company-merchant-staff-mng-staff-mng-adm_staff_mng')[0])
    this.getCompanyList()
  }
  componentWillUnmount() {
    // 移除监听事件
    window.removeEventListener('resizes', this.handleSize)
  }
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法法方法方法方法方法
  getCompanyList = async () => {
    let res = await requestw({
      url: '/web/company/queryList',
    })
    if (res && res.code == '0') {
      this.setState({
        companyList: res.data,
      })
    }
  }
  handleSize = () => {
    this.setState({
      deskHeight: document.body.clientHeight,
    })
  }
  //设置table width
  setTableWidth = () => {
    if (document.getElementById('table_1573535545629')) {
      this.setState({
        tableWidth: document.getElementById('table_1573535545629').clientWidth,
      })
    }
  }
  //重置搜索面板
  resetSearch = () => {
    const { form } = this.props
    this.formRef.current.resetFields()
  }
  //点击搜索按钮
  clickSearch = () => {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getData()
      }
    )
  }
  //表格状态变化
  tableChange = (pagination) => {
    this.setState(
      {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
      () => {
        this.getData()
      }
    )
  }
  //获取select
  getSelectOptions = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'selectOptions/getOrganizationTree',
    })
  }
  //获取表格数据
  getData = async () => {
    const { page, pageSize } = this.state
    const { form } = this.props

    let formData = (this.formRef.current && this.formRef.current.getFieldsValue()) || {}
    let formDataTemp = {}
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataTemp[key] = formData[key].trim()
      }
    }

    let postData = {
      page: page,
      rows: pageSize,
      ...formDataTemp,
    }
    this.setState({ realQuery: postData })
    this.setState({ loading_table: true })
    let res = await requestw({
      noCom: true,
      url: '/web/admin/staff/queryPage',
      data: postData,
    })
    this.setState({ loading_table: false })

    if (res && res.code != '0') {
      return false
    }
    if (res.data.data == null) {
      res.data = null
    } else {
      res.data.data.forEach((obj) => {
        obj.key = obj.staffCode
      })
    }
    this.setState({
      tableInfo: res.data,
    })
  }
  //点击禁用
  freezeStaff = (v) => {
    this.setState({
      lookingStaff: v,
    })
    // if (v.disabled === 0) {
    //   //去禁用
    //   this.openFreezeModal()
    // } else {
    //去启用
    this.freezeStaffAjax(v)
    // }
  }
  //禁用原因modal
  openFreezeModal = () => {
    this.setState({ showFreezeReason: true })
  }
  closeFreezeModal = () => {
    this.setState({
      lookingStaff: {},
      showFreezeReason: false,
      freezeReason: '', //清空禁用原因
    })
  }
  //禁用 员工
  freezeStaffAjax = (v) => {
    //验证
    // if (v.disabled === 0) {
    //   //是禁用
    //   const { freezeReason } = this.state
    //   if (freezeReason === '') {
    //     message.warning('请输入禁用原因')
    //     return false
    //   }
    // }
    //验证 end
    let confirmStr = v.status == 0 ? '确定禁用？' : '确定启用？'
    mConfirm(confirmStr, async () => {
      //ajax
      const { dispatch } = this.props
      let postData = {
        staffCode: v.staffCode,
        status: v.status == 0 ? 3 : 0, // disabled: 1, // 0:有效  1：无效
        // remark: v.disabled === 0 ? this.state.freezeReason : null,
      }

      this.setState({ loading_table: true })
      let res = await requestw({
        url: '/web/admin/staff/updateStatus',
        noCom: true,
        data: postData,
      })
      this.setState({ loading_table: false })

      // let namespace =
      //   v.disabled === 0 ? 'admin/freezeStaffAdmin' : 'admin/restoreStaffAdmin'
      // dispatch({
      //   type: namespace,
      //   payload: postData,
      //   success: (res) => {
      //     message.success('操作成功')
      if (res && res.code != '0') {
        return false
      }
      this.closeFreezeModal()
      this.getData()
      //     },
      //   })
    })
  }
  //点击重置密码
  resetPassword = (v) => {
    mConfirm('确定重置密码？', async () => {
      let postData = {
        staffCode: v.staffCode,
        // passwordType: 'LOGIN', //LOGIN登陆密码  PAY支付密码  //目前先写死 LOGIN
      }
      let res = await requestw({
        // url: allApiStr.resetAdminPsdApi,
        url: '/web/admin/staff/resetPassword',
        noCom: true,
        data: postData,
      })
      if ((res && res.code != '0') || !res.data) {
        message.warning(res.message ? res.message : '操作失败')
        return false
      }
      message.success('操作成功')
    })
  }
  //员工modal
  //打开
  openStaffModal = (v, isAdd) => {
    this.setState({
      lookingStaff: v,
      isAdd,
      staffDetailModal: true,
    })
  }
  //关闭
  closeStaffModal = () => {
    this.setState({
      lookingStaff: {},
      isAdd: false,
      staffDetailModal: false,
    })
  }
  onClickCancel = () => {
    this.closeStaffModal()
  }
  onClickCloseFresh = () => {
    this.closeStaffModal()
    this.getData()
  }
  //权限modal
  openRightModal = (record) => {
    this.setState({
      lookingStaff: record,
      showRightModal: true,
    })
  }
  closeRightModal = () => {
    this.setState({
      lookingStaff: {},
      showRightModal: false,
    })
  }
  onRightClickCancel = () => {
    this.closeRightModal()
  }
  onRightClickCloseFresh = () => {
    this.closeRightModal()
  }
  //树形控件
  renderTreeNodes = (data) => {
    if (!data) {
      return
    }
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode {...item} key={item.departRouteStr} title={item.title} value={item.departRouteStr}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} key={item.departRouteStr} title={item.title} value={item.departRouteStr} />
    })
  }

  //导出
  exportTable = async () => {
    const { tableInfo } = this.state
    if (tableInfo && tableInfo.data && tableInfo.data.length > 0) {
      const { realQuery } = this.state
      let { nowPage, rowsPage, ...realQueryTemp } = realQuery
      // downloadFilePostStream(api_system.exportAdminApi, realQueryTemp)
      this.setState({ loading_export: true })
      let res = await requestw({
        url: api_system.exportAdminApi,
        noCom: true,
        data: realQueryTemp,
        // responseType: 'blob',
      })

      this.setState({ loading_export: false })
      // streamToDownload({
      //   data: res,
      //   exportName: '操作员信息列表.xlsx',
      // })
      if (!res || res.code !== '0') {
        message.warning(res.message ? res.message : '操作失败')
        return
      }
      message.success('提交导出成功，请到预约下载列表查看')
    } else {
      message.warning('暂无数据')
    }
  }
  //渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染
  render() {
    const {
      dateRange,
      //表格
      tableInfo,
      page,
      pageSize,
      tableWidth,
      //多选
      selectedRowKeys,
      //员工modal
      staffDetailModal,
      isAdd,
      lookingStaff,
      //禁用原因modal
      showFreezeReason,
      freezeReason,
      //权限modal
      showRightModal,
      //loading
      loading_table,
      loading_export,
      deskHeight,
      setPasswordModal,
      setPasswordCode,
      companyList,
    } = this.state
    const {
      form,
      selectOptions,
      //loading
      loadingTree,
    } = this.props
    // const { getFieldDecorator } = form
    //搜索面板
    let panel = (
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Form ref={this.formRef} {...formItemLayout} style={{ marginBottom: '20px' }}>
          <Row gutter={10} type="flex" align="middle">
            {/* <Col span={3}>
              <Form.Item label={null} name="companyName" className={styles.margin0}>
                <Input placeholder="企业名称" allowClear />
              </Form.Item>
            </Col> */}

            <Col span={3}>
              <Form.Item label={null} name="staffName" className={styles.margin0}>
                <Input placeholder="员工姓名" allowClear />
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item label={null} name="loginName" className={styles.margin0}>
                <Input placeholder="登录账号" allowClear />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label={null} name="orgCode" className={styles.margin0}>
                <Select showArrow={true} placeholder="请选择企业" allowClear onChange={this.SelectChange}>
                  {companyList &&
                    companyList.map((item, ind) => {
                      return (
                        <Select.Option key={ind} value={item.orgCode}>
                          {item.orgName}
                        </Select.Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={3}>
              <Form.Item label={null} name="phoneNumber" className={styles.margin0}>
                <Input placeholder="手机号码" allowClear />
              </Form.Item>
            </Col> */}
            <Col span={6}>
              <Row type="flex" align="middle" justify="space-between">
                <div>
                  <Tooltip placement="top" title="重置搜索条件">
                    <Button type="primary" shape="circle" style={{ marginRight: 10 }} icon={<UndoOutlined />} onClick={this.resetSearch} />
                  </Tooltip>
                  <Button type="primary" icon={<SearchOutlined />} onClick={this.clickSearch} style={{ marginRight: 10 }}>
                    搜索
                  </Button>
                  {/* <Button
                    type="primary"
                    onClick={() => {
                      this.openStaffModal({}, true);
                    }}
                    style={{ marginRight: 10 }}
                  >
                    新建
                  </Button> */}
                  {/* <Button type="primary" onClick={this.exportTable} loading={loading_export}>
                    导出
                  </Button> */}
                </div>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    )
    //table colums
    let actionMenuCreator = (v) => {
      let menuClick = (item) => {
        switch (item.key) {
          case '1': //禁用' : '启用
            this.freezeStaff(v)
            break
          case '2': //重置密码
            this.resetPassword(v)
            break

          default:
            break
        }
      }
      return (
        <Menu onClick={menuClick}>
          <Menu.Item key="1">{v.status == 0 ? '禁用' : '启用'}</Menu.Item>

          <Menu.Item key="2">
            <span style={{ color: 'red' }}>重置密码</span>
          </Menu.Item>
        </Menu>
      )
    }
    let columns = [
      {
        align: 'center',
        title: '员工姓名',
        key: 'staffName',
        dataIndex: 'staffName',
        width: 150,
      },
      // {
      //   align: 'center',
      //   title: '员工编码',
      //   key: 'staffCode',
      //   dataIndex: 'staffCode',
      //   width: 170,
      // },
      {
        align: 'center',
        title: '登录账号',
        key: 'loginName',
        dataIndex: 'loginName',
        width: 120,
      },
      {
        align: 'center',
        title: '企业',
        key: 'orgName',
        dataIndex: 'orgName',
        width: 120,
      },
      // {
      //   align: 'center',
      //   title: '手机号码',
      //   key: 'phoneNumber',
      //   dataIndex: 'phoneNumber',
      //   width: 125,
      // },

      // {
      //   align: 'center',
      //   title: '企业名称',
      //   key: 'companyName',
      //   dataIndex: 'companyName',
      //   width: 300,
      // },

      // {
      //   align: 'center',
      //   title: '员工类型',
      //   key: 'staffKindName',
      //   dataIndex: 'staffKindName',
      //   width: 170,
      // },
      {
        align: 'center',
        title: '状态',
        key: '13',
        dataIndex: 'statusName',
        width: 100,
      },
      {
        align: 'center',
        title: '创建人',
        key: '9',
        dataIndex: 'createPerson',
        width: 120,
      },
      {
        align: 'center',
        title: '创建时间',
        key: '10',
        dataIndex: 'createDateStr',
        width: 180,
      },
      {
        align: 'center',
        title: '操作',
        key: '11',
        width: 250,
        fixed: tableWidth > tabOldWidth ? null : 'right',
        render: (v) => {
          return (
            <div>
              <a
                onClick={() => {
                  this.openRightModal(v)
                }}
                style={{ marginRight: 10 }}
              >
                权限管理
              </a>
              <Dropdown overlay={actionMenuCreator(v)}>
                <Button size="small">更多</Button>
              </Dropdown>
            </div>
          )
        },
      },
    ]
    //modal 宽高
    let modalHeight = window.innerHeight * 0.88
    //domdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomomdomdomdomdomdomdomdomomdomdomdomdomdomdomdomomdomdomdomdomdomdomdomomdomdomdomdomdomdomdom
    return (
      <Card title="">
        <div className={`${styles.card}`}>
          {panel}

          {/* 表格 */}
          <Table
            // id="table_1573535545629"
            bordered
            columns={columns}
            dataSource={tableInfo ? tableInfo.data : null}
            // scroll={{  y: deskHeight - 450 }}
            loading={loading_table}
            pagination={{
              current: page,
              pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: tableInfo && tableInfo.rowTop ? tableInfo.rowTop : null, //数据总数
              // size: 'small',
              showTotal: (total, range) => `第${range[0]}-${range[1]}条/共${total}条`,
            }}
            onChange={this.tableChange}
          />
          {/* 表格 end */}

          {/* =====================================模态框===================================== */}
          {/* 员工详情modal */}
          <Modal
            visible={staffDetailModal}
            title="操作员管理"
            footer={null}
            onCancel={this.closeStaffModal}
            maskClosable={false}
            width={750}
            centered={true}
            destroyOnClose={true}
            bodyStyle={{ maxHeight: modalHeight, overflowY: 'auto' }}
          >
            <div>
              <StaffAddEdit
                isAdd={isAdd}
                staff={lookingStaff}
                onClickCancel={this.onClickCancel} //新增的 取消
                onAddSuccessCallback={this.onClickCloseFresh} //新增成功的回调
                onEditSuccessCallback={this.onClickCloseFresh}
              />
            </div>
          </Modal>

          {/* 禁用原因modal */}
          <Modal
            visible={showFreezeReason}
            title="禁用原因"
            onCancel={this.closeFreezeModal}
            onOk={() => {
              this.freezeStaffAjax(lookingStaff)
            }}
            maskClosable={false}
            destroyOnClose={true}
          >
            <div>
              <TextArea
                placeholder="请输入禁用原因"
                value={freezeReason}
                onChange={(e) => {
                  bindInputChange(e, this, 'freezeReason')
                }}
                style={{ minHeight: '100px' }}
              />
            </div>
          </Modal>

          {/* 权限（角色）modal */}
          <Modal
            visible={showRightModal}
            title="角色管理"
            footer={null}
            onCancel={this.closeRightModal}
            maskClosable={false}
            width={750}
            centered={true}
            destroyOnClose={true}
            bodyStyle={{ maxHeight: modalHeight, overflowY: 'auto' }}
          >
            <div>
              <RightAddEdit
                staff={lookingStaff}
                userType="STAFF"
                onClickCancel={this.onRightClickCancel} //新增的 取消
                onAddSuccessCallback={this.onRightClickCloseFresh} //新增成功的回调
                onEditSuccessCallback={this.onRightClickCloseFresh}
              />
            </div>
          </Modal>
        </div>
      </Card>
    )
  }
}

export default StaffMng
