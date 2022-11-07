import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import router from 'umi/router'
import { Form, Input, Radio, Select, Button, message, Modal, Row, Col, Card, Tooltip, Table, Tree, Upload, DatePicker } from 'antd'
import { UndoOutlined, PlusCircleOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import TSku from '@/components/goods/SkuInput'
import { mConfirm, pathimgHeader, localDB, getOrgKind } from '@/utils/utils'
import { getProductsAjax, updateProductAjax, addProductAjax } from '@/services/goods'
import requestw from '@/utils/requestw'
import api_channel from '@/services/api/channel'
import styles from './index.less'
import './index.less'
import FetchSelect from '@/components/FetchSelect'
import { getSysCodeByParam } from '@/services/common'

const { confirm } = Modal
const { TextArea } = Input
const { TreeNode } = Tree

const label = 4
const total = 23
const formLayoutTail = {
  wrapperCol: { offset: label, span: total - label },
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      productObj: {},
      lookingRecord: null,
      dateRange: [moment(new Date().getTime() - 30 * 86400 * 1000), moment(new Date())],

      // form
      typeId: '',
      page: 1,
      pageSize: 10,
      showSetCollegeModal: false,
      setCollCode: {},
      UserModal: false,
      fileSubTypeMap: null,
      typeList: [],
      AppLicationModal: false,
      showMenuRightListModal: false,
      // 菜单分级列表modal
      allNode: [], //所有的
      treeData: [],
      allNoChildNode: [], //所有最里面的子节点，1子节点 2无子集

      allMenuCheckedKeys: [], //保存所有选择的node，包括half check
      menuCheckedKeysObj: {
        checked: [],
        halfChecked: [],
      }, //受控 选中的菜单分级 //这里是为了受控 //完全受控 obj
      menuExpandedKeys: [], //受控 展开的菜单
      lookingApplication: {},
      isAdd: true,
      ComPanyList: [],
      orgKindList: [],
    }
    this.formRef = React.createRef()
    this.tSku = React.createRef()
  }

  /**
   * 周期
   */
  componentDidMount() {
    this.getData()
    this.getComPanyList()
    this.getOrgKindList()
  }

  /**
   * 方法
   */

  getAllMenu = async (e) => {
    let res = await requestw({
      url: '/web/menu/getRoleMenuList',
      data: { orgCode: e.orgCode },
    })
    if ((res && res.code != '0') || !res.data) {
      return false
    }
    let list = res.data
    list.forEach((obj) => {
      obj.key = obj.menuCode
      obj.title = obj.menuTitle
    })

    let arrJI = []
    for (let i = 0; i < 10; i++) {
      let filterArr = list.filter((obj) => {
        return obj.menuLevel == i
      })
      if (filterArr.length > 0) {
        arrJI.push(filterArr)
      }
    }

    for (let i = arrJI.length - 1; i >= 0; i--) {
      let index = i
      let preIndex = i - 1
      let arr = arrJI[index]
      let preArr = arrJI[preIndex]
      if (!preArr) continue
      arr.forEach((obj) => {
        preArr.forEach((preObj) => {
          if (preObj.menuCode == obj.parentCode) {
            if (!preObj.children) {
              preObj.children = []
            }
            preObj.children.push(obj)
          }
        })
      })
    }

    let treeData = arrJI[0]
    this.setState({
      treeData,
    })
    this.getAllNoChildNode(treeData) //获得所有最子的子节点
  }

  //保存 所有最里面的子节点
  getAllNoChildNode = (list) => {
    //方法
    let getNode = (inList) => {
      inList.forEach((obj) => {
        if (obj.children && obj.children.length > 0) {
          //还有子集
          getNode(obj.children)
        } else {
          let { allNoChildNode } = this.state
          allNoChildNode.push(obj)
          this.setState({ allNoChildNode })
        }
      })
    }
    //执行
    this.setState({ allNoChildNode: [] }, () => {
      if (list) {
        getNode(list)
      }
    })
  }

  // 获取文件类型字典
  queryWikiDic() {
    requestw({
      url: '/wiki/queryWikiDic',
      type: 'post',
      data: {},
    })
      .then((res) => {
        let map = {}
        res.data.forEach((item) => {
          if (map[item.TYPE_CODE]) {
            map[item.TYPE_CODE].map[item.SUB_TYPE_CODE] = item
          } else {
            map[item.TYPE_CODE] = {
              ...item,
              map: {},
            }
          }
        })
        let typeList = []
        res.data.forEach((item) => {
          if (item.SUB_TYPE_CODE !== '0') typeList.push(item)
        })
        this.setState({
          fileSubTypeMap: map,
          typeList,
        })
        this.getData()
      })
      .catch((err) => {
        console.error(err)
      })
  }
  //获取数据方法
  getData = async () => {
    const { dateRange, page, pageSize } = this.state
    let dateTime = dateRange

    let formData = (this.formRef.current && this.formRef.current.getFieldsValue()) || {}
    this.setState({ selectedRowKeys: [] })
    let postData = {
      ...formData,
      page: page,
      rows: pageSize,
    }
    this.setState({
      loading_table: true,
      realQuery: postData,
    })
    let res = await requestw({
      url: '/web/role/getRoles',
      type: 'post',
      data: postData,
    })
    this.setState({ loading_table: false })
    if (res && res.code == '0') {
      this.setState({
        tableInfo: res.data,
        dateRange: dateTime,
      })
    }
  }

  //选择搜索的日期
  onDateRangeChange = (value) => {
    //value moment数组
    this.setState({ dateRange: value })
  }

  //重置搜索面板
  resetSearch = () => {
    this.setState({
      dateRange: [moment(new Date().getTime() - 30 * 86400 * 1000), moment(new Date())],
    })
    this.formRef.current.resetFields()
  }

  //点击搜索按钮
  clickSearch = () => {
    this.setState(
      {
        page: 1,
        selectedKeys: [],
      },
      () => {
        this.getData()
      }
    )
  }

  SetCollegeModal = (e) => {
    this.setState({
      AppLicationModal: true,
      isAdd: false,
      setCollCode: {
        ...e,
        fileSubType: e.typeId ? e.typeId + '-' + e.subTypeId : null,
      },
    })
  }

  SetModalOk = async () => {
    const { roleName, roleDesc, orgCode } = this.formRef.current.getFieldsValue()
    const { setCollCode } = this.state
    if (!orgCode) {
      message.warning('请选择企业')
      return
    }
    if (!roleName) {
      message.warning('请填写角色名称')
      return
    }

    let url = '/web/role/insertRole'
    let postdata = {
      roleName,
      roleDesc,
      orgCode,
    }
    if (setCollCode.roleName) {
      postdata.roleCode = setCollCode.roleCode
      url = '/web/role/updateRole'
    }
    let res = await requestw({
      url,
      data: postdata,
    })
    if (res && res.code == '0') {
      message.success(res.message ? res.message : '操作成功')
      this.formRef.current.setFieldsValue({ fileName: '' })
      this.getData()
      this.setState({
        AppLicationModal: false,
      })
    } else {
      message.warning(res.message ? res.message : '操作失败')
    }
  }

  cloesSetModal = () => {
    this.setState({
      AppLicationModal: false,
      setCollCode: {},
    })
  }

  setFileState = (e) => {
    let that = this
    confirm({
      title: `确定要${e.fileStatus == 1 ? '下架' : '上架'}么？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        let res = await requestw({
          url: '/wiki/updateStatus',
          data: {
            fileUrl: e.fileUrl,
            companyCode: that.props.login.loginInfo.COMPANY_CODE,
          },
        })
        if (res && res.code == '0') {
          that.getData()
        }
      },
      onCancel() {},
    })
  }

  tableOnChange = (current) => {
    this.setState(
      {
        page: current.current,
        pageSize: current.pageSize,
      },
      () => {
        this.getData()
      }
    )
  }

  // 2020年11月2日17:08:57
  addAppLication = () => {
    this.setState({
      AppLicationModal: true,
      isAdd: true,
    })
  }

  setMenuList = async (e) => {
    this.getAllMenu(e)

    this.setState({
      showMenuRightListModal: true,
      lookingApplication: e,
    })
    let res = await requestw({
      url: '/web/role/getRights',
      data: {
        roleCode: e.roleCode,
        orgCode: e.orgCode,
      },
    })
    if ((res && res.code != '0') || !res.data) {
      return false
    }
    let rightCodeArr = res.data.map((obj) => {
      return obj.rightCode
    })
    this.setState({
      menuCheckedKeysObj: {
        checked: rightCodeArr,
        halfChecked: [],
      },
      menuExpandedKeys: rightCodeArr,
    })
  }

  //渲染树形控件
  renderTreeNodes = (data) => {
    return data.map((item) => {
      //是否可勾选
      let checkable = false
      if (item.menuUrl && (item.menuUrl.indexOf('/') > -1 || item.menuUrl.indexOf('_') > -1)) {
        checkable = true
      }
      //是否可勾选 end
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} checkable={checkable}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} {...item} checkable={checkable} />
    })
  }
  //关闭
  closeMenuRightListModal = () => {
    this.setState({
      showMenuRightListModal: false,
      //重置
      lookingApplication: {},
      menuCheckedKeysObj: {
        checked: [],
        halfChecked: [],
      },
      allMenuCheckedKeys: [],
    })
  }

  //勾选菜单分级
  onMenuCheck = (e, node) => {
    this.setState({
      menuCheckedKeysObj: e, //用于受控
      allMenuCheckedKeys: [...e.checked, ...e.halfChecked], //保存全部勾选
    })
  }
  //展开菜单 受控
  onMenuExpand = (expandedKeys) => {
    this.setState({ menuExpandedKeys: expandedKeys })
  }
  //新增/编辑=========================================================
  //修改应用权限 菜单权限
  clickMenuRightListModalOk = () => {
    const { menuCheckedKeysObj } = this.state
    //验证
    if (menuCheckedKeysObj.checked.length == 0 && menuCheckedKeysObj.halfChecked.length == 0) {
      message.warning('请选择菜单权限')
      return
    }

    mConfirm('确认修改？', () => {
      this.roleBindMenu()
    })
  }

  //角色绑定菜单
  roleBindMenu = async () => {
    const { lookingApplication, menuCheckedKeysObj } = this.state

    let rights = menuCheckedKeysObj.checked.map((menuCode) => {
      return {
        rightType: 'MENU',
        rightCode: menuCode,
      }
    })
    let postData = {
      roleCode: lookingApplication.roleCode,
      rightListStr: JSON.stringify(rights),
    }
    let res = await requestw({
      url: '/web/role/associateRight',
      data: postData,
    })
    if ((res && res.code != '0') || !res.data) {
      message.warning(res.message ? res.message : '')
      return false
    }
    message.success('操作成功')
    this.closeMenuRightListModal()
  }
  getComPanyList = async () => {
    let res = await requestw({
      url: api_channel.getAllDistributeCompanyListApi,
      noCom: true,
    })
    if (res && res.code === '0') {
      this.setState({
        ComPanyList: res.data,
      })
    }
  }

  // 封装获取订单状态
  getSysCodeByParam_ = async (codeParam, inCode, notCode) => {
    let cs = {
      codeParam,
      inCode,
      notCode,
    }
    let res = await getSysCodeByParam(cs)
    return res
  }
  //获取角色类型

  getOrgKindList = async () => {
    let res = await this.getSysCodeByParam_('ORG_KIND')
    if (res && res.code === '0') {
      this.setState({
        orgKindList: res.data,
      })
    }
  }

  //重置一下
  resetSearch = () => {
    this.formRef.resetFields()
  }
  /**
   * 渲染
   */
  render() {
    const {
      // form
      typeId,
      dateRange,
      showSetCollegeModal,
      tableInfo,
      setCollCode,
      UserModal,
      fileSubTypeMap,
      typeList,
      AppLicationModal,
      showMenuRightListModal,
      treeData,
      menuCheckedKeysObj,
      menuExpandedKeys,
      loading_table,
      ComPanyList,
      orgKindList,
    } = this.state

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

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        align: 'center',
        width: '100px',
      },
      {
        title: '角色类型',
        dataIndex: 'orgKindName',
        key: 'orgKindName',
        align: 'center',
        width: '100px',
      },

      {
        title: '所属公司',
        dataIndex: 'orgName',
        key: 'orgName',
        align: 'center',
        width: '100px',
      },

      {
        title: '角色说明',
        dataIndex: 'roleDesc',
        key: 'roleDesc',
        align: 'center',
        width: '300px',
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        width: 100,
        align: 'center',
        render: (text, record) => (
          <>
            <a
              style={{ marginRight: '5px' }}
              onClick={() => {
                this.SetCollegeModal(text)
              }}
            >
              编辑
            </a>
            <a
              style={{ marginRight: '5px' }}
              onClick={() => {
                this.setMenuList(text)
              }}
            >
              菜单权限
            </a>
          </>
        ),
      },
    ]

    return (
      <>
        <Form ref={this.formRef} {...formItemLayout} style={{ marginBottom: 40, padding: '20px 40px 0 40px' }} onFinish={this.getData}>
          <Row gutter={10} justify="start">
            <Col span={3}>
              <Form.Item name="roleName" style={{ marginBottom: 10 }}>
                <Input placeholder="角色名称" allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="orgCode" style={{ marginBottom: 10 }}>
                <Select placeholder="企业名称" allowClear={true}>
                  {ComPanyList.map((r) => (
                    <Select.Option key={r.orgCode} value={r.orgCode}>
                      {r.orgName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="orgKind" style={{ marginBottom: 10 }}>
                <Select placeholder="角色类型" allowClear={true}>
                  {orgKindList.map((r) => (
                    <Option key={r.codeKey} value={r.codeKey}>
                      {r.codeValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Button style={{ borderRadius: 8 }} className="buttonNoSize" size="middle" onClick={this.resetSearch}>
                重置
              </Button>
              <Button style={{ borderRadius: 8, marginLeft: 10 }} type="primary" size="middle" htmlType="submit">
                查询
              </Button>
              <Button type="primary" style={{ borderRadius: 8, marginLeft: 10 }} onClick={this.addAppLication}>
                创建角色
              </Button>
            </Col>
          </Row>
        </Form>

        <Table
          columns={columns}
          loading={loading_table}
          rowKey="roleCode"
          dataSource={this.state.tableInfo && this.state.tableInfo.data}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: this.state.page,
            pageSize: this.state.pageSize,
            total: this.state.tableInfo && this.state.tableInfo.rowTop ? this.state.tableInfo.rowTop : 0,
            showTotal: (total, range) => `第${range[0]}-${range[1]}条/共${total}条`,
          }}
          onChange={(current) => this.tableOnChange(current)}
          style={{ padding: '0 40px' }}
        />

        <Modal
          title="菜单权限"
          visible={showMenuRightListModal}
          onCancel={this.closeMenuRightListModal}
          onOk={this.clickMenuRightListModalOk}
          maskClosable={false}
          centered={true}
          destroyOnClose={true}
        >
          <div>
            <Tree
              treeData={treeData}
              autoExpandParent
              selectable={false}
              checkable
              checkStrictly
              checkedKeys={menuCheckedKeysObj}
              onCheck={this.onMenuCheck}
              expandedKeys={menuExpandedKeys}
              onExpand={this.onMenuExpand}
            ></Tree>
          </div>
        </Modal>
        <Modal
          title={this.state.isAdd ? '创建角色' : '编辑角色'}
          visible={this.state.AppLicationModal}
          onOk={this.SetModalOk}
          onCancel={this.cloesSetModal}
          destroyOnClose
          okText="确定"
          cancelText="取消"
        >
          <Form ref={this.formRef} {...formItemLayout} style={{ marginBottom: '10px' }}>
            {/* 基本信息 */}
            <Form.Item name="orgCode" label="企业名称" initialValue={this.state.setCollCode.orgCode} rules={[{ required: true, message: '请输入企业名称' }]}>
              <Select placeholder="企业名称" allowClear style={{ marginRight: '10px' }}>
                {ComPanyList.map((r) => (
                  <Select.Option key={r.orgCode} value={r.orgCode}>
                    {r.orgName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]} initialValue={this.state.setCollCode.roleName} name="roleName">
              <Input placeholder="角色名称" maxLength="25" />
            </Form.Item>

            <Form.Item style={{ marginBottom: '0' }} label="角色描述" initialValue={this.state.setCollCode.roleDesc} name="roleDesc">
              <TextArea placeholder="角色描述" />
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }
}

export default connect(({ goods, login }) => ({
  goods,
  login,
}))(Index)
