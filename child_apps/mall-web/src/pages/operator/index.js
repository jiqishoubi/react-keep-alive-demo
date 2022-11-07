import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Card, Breadcrumb, Form, Input, Button, Icon, Row, Col, Select, Tooltip, message, Table, Modal, Dropdown, Menu, TreeSelect } from 'antd'
import StaffAddEdit from './StaffAddEdit/StaffAddEdit'
import RightAddEdit from './RightAddEdit/RightAddEdit'
import { UndoOutlined, SearchOutlined } from '@ant-design/icons'
import { mConfirm, bindInputChange, cancelAutoComplete, downloadFilePostStream, streamToDownload, getOrgKind } from '@/utils/utils'
import requestw from '@/utils/requestw'
import api_channel from '@/services/api/channel'
import styles from './StaffMng.less'
import FetchSelect from '@/components/FetchSelect'

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
  }
  componentWillUnmount() {
    // 移除监听事件
    window.removeEventListener('resizes', this.handleSize)
  }
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法法方法方法方法方法

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
    formData['orgCode'] = formData.orgCode ? (formData.supplierOrgCode ? formData.orgCode + ',' + formData.supplierOrgCode : formData.orgCode) : formData.supplierOrgCode
    let formDataTemp = {}
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataTemp[key] = formData[key].trim()
      }
    }

    const postData = {
      page: page,
      rows: pageSize,
      ...formDataTemp,
    }
    this.setState({ realQuery: postData })
    this.setState({ loading_table: true })
    const res = await requestw({
      noCom: true,
      url: api_channel.getStaffListApi(),
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
    let confirmStr = v.status == 0 ? '确定禁用？' : '确定启用？'
    mConfirm(confirmStr, async () => {
      //ajax
      const { dispatch } = this.props
      let postData = {
        staffCode: v.staffCode,
        status: v.status == 0 ? 3 : 0, // disabled: 1, // 0:有效  1：无效
      }

      this.setState({ loading_table: true })
      const res = await requestw({
        url: api_channel.updateStaffStatusApi(),
        noCom: true,
        data: postData,
      })
      this.setState({ loading_table: false })

      if (res && res.code != '0') {
        return false
      }
      this.closeFreezeModal()
      this.getData()
    })
  }
  //点击重置密码
  resetPassword = (v) => {
    mConfirm('确定重置密码？', async () => {
      const postData = {
        staffCode: v.staffCode,
      }
      const res = await requestw({
        url: api_channel.resetStaffPasswordApi(),
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
      this.setState({ loading_export: true })
      let res = await requestw({
        url: api_system.exportAdminApi,
        noCom: true,
        data: realQueryTemp,
      })

      this.setState({ loading_export: false })
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
            {getOrgKind().isAdmin && (
              <>
                <Col span={3}>
                  <Form.Item name="orgCode" className={styles.margin0}>
                    <FetchSelect
                      placeholder="推广公司"
                      api={api_channel.queryPromotionCompanyList}
                      valueKey="orgCode"
                      textKey="orgName"
                      //搜索
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="supplierOrgCode" label="" className={styles.margin0}>
                    <FetchSelect api="/web/admin/supplier/getList" valueKey="orgCode" textKey="orgName" placeholder="供货商" />
                  </Form.Item>
                </Col>
              </>
            )}

            <Col span={6}>
              <Row type="flex" align="middle" justify="space-between">
                <div>
                  <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={this.resetSearch}>
                    重置
                  </Button>
                  <Button type="primary" icon={<SearchOutlined />} onClick={this.clickSearch} style={{ marginRight: 10, borderRadius: '4px' }}>
                    查询
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.openStaffModal({}, true)
                    }}
                    style={{ marginRight: 10, borderRadius: '4px' }}
                  >
                    新建
                  </Button>
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
      {
        align: 'center',
        title: '所属公司',
        key: 'orgName',
        dataIndex: 'orgName',
        width: 170,
      },
      {
        align: 'center',
        title: '登录账号',
        key: 'loginName',
        dataIndex: 'loginName',
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
                  this.openStaffModal(v, false)
                }}
                style={{ marginRight: 10 }}
              >
                编辑
              </a>
              {v.staffKind == 'STAFF' && (
                <a
                  onClick={() => {
                    this.openRightModal(v)
                  }}
                  style={{ marginRight: 10 }}
                >
                  权限管理
                </a>
              )}

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
      <div className={`${styles.card}`} style={{ padding: '20px 40px' }}>
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
    )
  }
}

export default StaffMng
