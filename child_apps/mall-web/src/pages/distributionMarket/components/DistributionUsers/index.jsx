// 分销用户
import React, { useEffect, useState, Fragment, useRef } from 'react'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
import lodash from 'lodash'
import debounce from 'lodash/debounce'
import { Button, DatePicker, Form, Input, message, Select, Table, Modal, Dropdown, Menu, Row, Col } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import FetchSelect from '@/components/FetchSelect'
import ShowItemList from '@/pages/miniapp/Editor/components/ShowItemList'
import Upload from '@/components/T-Upload4'
import Revamp from '@/pages/channel/components/DistributionUsers/revamp'
import { useGetRow } from '@/hooks/useGetRow'
import { getToday, haveCtrlElementRight, mConfirm, getOrgKind } from '@/utils/utils'
import {
  getDistributeMemberList,
  createDistributeMember,
  queryPromotionCompanyList,
  deleteDistributeMember,
  exportTradeReport,
  getExportInfo,
  getPagingList,
  getProfitConfigList,
  updateMpUserStatus,
} from '@/services/channel'
import { getSysCodeByParam } from '@/services/common'
import { togetherCreateSyMember, getImportData, getImportStatus } from '@/services/order'
import requestw from '@/utils/requestw'
import api_channel from '@/services/api/channel'

moment.locale('zh-cn')

const configTemplateDataModalFormLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
}

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
}

const Index = (props) => {
  const { RangePicker } = DatePicker
  const { Option } = Select
  const [form] = Form.useForm()
  const [creatForm] = Form.useForm()
  //init
  const [init, setinit] = useState(true)
  //table loding 展示
  const [loading, setloading] = useState(false)

  //user状态
  const [userStatus, setuserStatus] = useState([])
  //userlist
  const [userlist, setuserlist] = useState([
    { name: '推广人', value: 'DISTRIBUTE_HEAD' },
    { name: '合伙人', value: 'SALE_PERSON' },
    { name: '合伙人分身', value: 'SALE_PERSON_SHADOW' },
  ])
  //userdata
  const [userdata, setuserdata] = useState([])
  //创建是否显示
  const [noOrder, setnoOrder] = useState(false)
  const [addModalLoading, setAddModalLoading] = useState(false)

  //only数据e
  const [onlydata, setonlydata] = useState({})
  //only数据e
  const [onlyinit, setonlyinit] = useState(false)

  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState()

  //推广公司数据
  const [supplierData, setsupplierData] = useState([])

  const [querysupplierData, setquerysupplierData] = useState([])

  const [deleteShow, setDeleteShow] = useState(false)
  //批量model展示
  const [visible, setVisible] = useState(false)
  //批量结果model展示
  const [visibleResult, setVisibleResult] = useState(true)

  const [visibleLoding, setVisibleLoding] = useState(false)

  const [visibleData, setVisibleData] = useState([])

  const [myVar, setmyVar] = useState()

  const [visibleNumber, setVisibleNumber] = useState(false)

  //配置样板modal
  const [isShowConfigTemplateDataModal, setIsShowConfigTemplateDataModal] = useState(false)
  const [configTemplateDataModalForm] = Form.useForm()
  const [loadingConfigTemplate, setLoadingConfigTemplate] = useState(false)

  //导出数据
  const [educe, seteduce] = useState(false)
  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)
  const [pagingLoading, setPagingLoading] = useState(false)
  //分润配置数据
  const [revampShow, setRevampShow] = useState(false)
  //唯一数据
  const [soleCode, setSoleCode] = useState()
  const [soleDistributeOrgCode, setSoleCodeDistributeOrgCode] = useState()
  const [soleData, setSoleData] = useState([])
  //样板预览
  const [templateData, setTemplateData] = useState({
    pageConfig: {},
    itemList: [],
  })

  const [selectList, setselectList] = useState([])

  const [relationModal, setRelationModal] = useState(false)
  const [relationInfo, setRelationInfo] = useState({})
  // const [personInfo, setPersonInfo] = useState({});
  const [groupType, setgroupType] = useState('')

  const [optionArr, setOptionArr] = useState([])

  const orgCode = props.orgCode
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)

  // 封装获取订单状态
  async function getSysCodeByParam_(codeParam, inCode, notCode) {
    let cs = {
      codeParam,
      inCode,
      notCode,
    }
    let res = await getSysCodeByParam(cs)
    return res
  }

  useEffect(() => {
    getOptions()
    getSysCodeByParam_('DISTRIBUTE_STATUS').then((res) => {
      if (res && res.code === '0') {
        setuserStatus(res.data)
      } else {
      }
    })
    getSysCodeByParam_('GROUP_TYPE').then((res) => {
      if (res && res.code === '0') {
        setselectList(res.data)
      } else {
      }
    })
    querycreateSupplier_()
    createSupplier_()
    onFinish()
  }, [])
  const getOptions = async () => {
    setLoading(true)
    const res = await requestw({
      url: '/web/staff/uiTemplateData/getList',
      data: {
        page: 1,
        rows: 900,
      },
    })
    setLoading(false)
    let arr = []
    if (res && res.code == '0' && res.data) {
      arr = res.data
    }
    setOptionArr(arr)
  }
  useEffect(() => {
    if (props.disabled) {
      form.setFieldsValue({
        distributeOrgCode: props.orgcode,
      })
    }
  }, [querysupplierData])

  async function onFinish() {
    pageRef.current = 1
    getTableList()
  }

  async function creaetonFinish(values) {
    for (let key in values) {
      if (values[key] instanceof Array) {
        values[key] = values[key].join(',')
      }
    }
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }
    setAddModalLoading(true)
    let res = await createDistributeMember(values)
    setAddModalLoading(false)
    if (res && res.code === '0') {
      setnoOrder(false)
      message.success(res.message)
      form.resetFields()
      onFinish()
    } else {
      message.error(res.message)
    }
  }

  let actionMenuCreator = (v) => {
    let menuClick = (item) => {
      switch (item.key) {
        case '1': //禁用' : '启用
          frostClick(v)
          break
        case '2': //重置密码
          openConfigTemplateDataModal(v)
          break

        default:
          break
      }
    }
    return (
      <Menu onClick={menuClick}>
        {v.distributeType === 'DISTRIBUTE_HEAD' ? (
          <>
            <Menu.Item key="1">
              <span style={{ color: 'red' }}>{v.loginStatus === '有效' ? '冻结' : '解冻'} </span>
            </Menu.Item>
          </>
        ) : null}
        <Menu.Item key="2">配置样板</Menu.Item>
      </Menu>
    )
  }
  //解冻弹窗
  const freezeStaffAjax = async (v) => {
    let confirmStr = v.loginStatus == '有效' ? '是否确定冻结？' : '是否确定解冻？'
    mConfirm(confirmStr, async () => {
      let postData = {
        userCode: v.personCode,
        status: v.loginStatus == '有效' ? 3 : 0,
      }
      let res = await updateMpUserStatus(postData)
      if (res && res.code === 'ok') {
        message.success(res.message)
        getTableList()
      }
    })
  }

  const [columns] = useState([
    {
      align: 'center',
      dataIndex: 'personPhoneNumber',
      title: '账号',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'personName',
      title: '姓名/名称',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'distributeTypeName',
      title: '类型',
      key: 'key',
    },
    {
      dataIndex: 'createDateStr',
      title: '加入时间',
      align: 'center',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'developPersonAllName',
      title: '所属推广人',
      render: (e) => {
        return e ? e : '--'
      },
    },
    {
      align: 'center',
      dataIndex: 'orgName',
      title: '所属推广公司',
      render: (e) => {
        return e ? e : '--'
      },
    },
    {
      dataIndex: 'statusName',
      title: '状态',
      align: 'center',
      render: (r) => {
        return r || '--'
      },
    },
    {
      dataIndex: 'parentPersonName',
      title: '上级合伙人',
      align: 'center',
      key: 'key',
    },
    {
      dataIndex: 'templateDataName',
      title: '样板',
      align: 'center',
      key: 'templateDataName',
    },
    // {
    //   align: 'center',
    //   title: '操作',
    //   render: e => {
    //     return (
    //       <div>
    //         <Dropdown overlay={actionMenuCreator(e)}>
    //           <Button size="small">操作</Button>
    //         </Dropdown>
    //       </div>
    //     );
    //   },
    // },
  ])
  //点击分润设置
  const revampInstall = async (e) => {
    setSoleCode(e.distributeCode)
    setSoleCodeDistributeOrgCode(e.distributeOrgCode)
    getProfitConfigList_(e.distributeCode)
  }
  //获取初始分润数据
  const getProfitConfigList_ = async (e) => {
    let res = await getProfitConfigList({ distributeCode: e })
    if (res && res.code === '0') {
      if (res.data) {
        setSoleData(res.data)
      } else {
        setSoleData([])
      }
      setRevampShow(true)
    } else {
      message.error(res.message)
    }
  }

  const closeModal = (e) => {
    setRevampShow(false)
    if (e) {
      getTableList()
    }
  }

  //重置一下
  function resetSearch() {
    let data = form.getFieldsValue()
    let code = data.distributeOrgCode
    form.resetFields()
    if (props.disabled) {
      form.setFieldsValue({
        distributeOrgCode: code,
      })
    }
  }
  //详情被点击
  function miutionClick(e) {
    setonlydata(e)
    setonlyinit(true)
    setinit(false)
    window.scroll(0, 0)
  }
  const deleteClick = (e) => {
    setonlydata(e)
    setDeleteShow(true)
  }

  const deleteClickEnsure = async () => {
    let res = await deleteDistributeMember({
      distributeCode: onlydata.distributeCode,
    })
    if (res && res.code === '0') {
      message.success(res.message)
      setDeleteShow(false)
    } else {
      message.warning(res.message)
      setDeleteShow(false)
    }

    getTableList()
  }

  //推广公司查询
  async function querycreateSupplier_(value) {
    let data = { companyName: value }
    let res = await queryPromotionCompanyList(data)
    if (res && res.code === '0') {
      {
        res.data !== null ? setquerysupplierData(res.data) : setquerysupplierData([])
      }
    }
  }

  //推广公司防抖
  const querysudelayedChange = debounce(querycreateSupplier_, 800)
  //推广公司输入框改变
  const querysuhandleChange = (event) => {
    querysudelayedChange(event)
  }

  //创建推广公司查询
  async function createSupplier_(value) {
    let data = { companyName: value }
    let res = await queryPromotionCompanyList(data)
    if (res && res.code === '0') {
      {
        res.data !== null ? setsupplierData(res.data) : setsupplierData([])
      }
    }
  }

  //创建推广公司防抖
  const sudelayedChange = debounce(createSupplier_, 800)
  //创建推广公司输入框改变
  const suhandleChange = (event) => {
    sudelayedChange(event)
  }

  //批量创建
  const visibleFinish = async (values) => {
    if (!visibleResult) {
      setVisibleResult(true)

      return
    }
    setVisibleLoding(true)
    let code = values.expressNo[0].code

    let res = await togetherCreateSyMember({
      operDataKey: code,
      orgCode: values.orgCode,
    })

    if (res && res.code === '0') {
      creatForm.setFieldsValue({ expressNo: '' })
      let oper = res.data.OPER_CODE

      let myVars = setInterval(async () => {
        let data = await getImportStatus({ operCode: oper })

        if (data.data === '2') {
          clearInterval(myVars)
          clearInterval(myVar)
          let oldData = await getImportData({ operCode: oper })

          setVisibleNumber(oldData.data[oldData.data.length - 1].SUCCESS_COUNT)
          let x = oldData.data.slice(0, oldData.data.length - 1)
          let y = []
          x.map((r) => {
            y.push(r)
          })
          setVisibleData(y)
          setVisibleLoding(false)
          setVisibleResult(false)
        }
      }, 1000)

      setmyVar(myVars)
    } else {
      message.error(res.message)
      setVisibleLoding(false)
    }
  }
  //冻结账户
  const frostClick = async (e) => {
    freezeStaffAjax(e)
  }
  //配置样板
  const openConfigTemplateDataModal = (record) => {
    setonlydata(record)
    setIsShowConfigTemplateDataModal(true)
    //set form
    configTemplateDataModalForm.setFieldsValue({
      personName: record.personName,
      templateDataId: record.templateDataId && Number(record.templateDataId),
    })
  }
  const closeConfigTemplateDataModal = () => {
    setonlydata({})
    setIsShowConfigTemplateDataModal(false)
  }
  const configTemplateDataModalOk = () => {
    const postData = {
      id: configTemplateDataModalForm.getFieldValue('templateDataId'),
      distributeCode: onlydata.distributeCode,
    }
    setLoadingConfigTemplate(true)
    requestw({
      url: '/web/uiTemplateData/setDistributePersonUi',
      data: postData,
    }).then((res) => {
      setLoadingConfigTemplate(false)
      if (!res || res.code !== '0') {
        message.warning((res && res.message) || '网络异常')
        return
      }
      //成功
      setonlydata({})
      setIsShowConfigTemplateDataModal(false)
      onFinish()
    })
  }

  const copy = (id) => {
    let copyDOM = document.getElementById(id) //需要复制文字的节点
    let range = document.createRange() //创建一个range
    window.getSelection().removeAllRanges() //清楚页面中已有的selection
    range.selectNode(copyDOM) // 选中需要复制的节点
    window.getSelection().addRange(range) // 执行选中元素
    let successful = document.execCommand('copy') // 执行 copy 操作
    if (successful) {
      message.success('复制成功！')
    } else {
      message.error('复制失败，请手动复制！')
    }
    // 移除选中的元素
    window.getSelection().removeAllRanges()
  }

  //切换模板
  const onTemplateChange = (key, row) => {
    if (!row) {
      setTemplateData({
        pageConfig: {},
        itemList: [],
      })
      return
    }
    let jsonStr = row.templateData
    let json
    try {
      json = JSON.parse(jsonStr)
    } catch (e) {}
    let templateData = {}
    if (Array.isArray(json)) {
      //数组
      templateData = {
        pageConfig: {},
        itemList: json,
      }
    } else if (Object.prototype.toString.call(json) === '[object Object]') {
      //对象
      templateData = json
    }
    setTemplateData(lodash.cloneDeep(templateData))
  }

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = JSON.parse(JSON.stringify(oldData))

    let res = await exportTradeReport(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getExportInfo({ exportCode: code })
        if (res2.code === '0' && res2.data.status === '90') {
          clearInterval(interTimes)

          getPagingList_()
          setPagingLoading(false)
        }
      }, 1000)
      setinterTime(interTimes)
      clearInterval(interTime)
    } else {
      clearInterval(interTime)
      message.error(res.message)
      setPagingLoading(false)
    }
  }

  //导出表头
  const pagingColumns = [
    {
      title: '导出任务编码',
      align: 'center',
      dataIndex: 'exportCode',
    },
    {
      title: '导出时间',
      align: 'center',
      dataIndex: 'exportDateStr',
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishDateStr',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'statusName',
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return e.status === '90' ? (
          <a
            onClick={() => {
              window.location.href = e.exportFileUrl
            }}
          >
            下载Excel
          </a>
        ) : (
          ''
        )
      },
    },
  ]

  //导出历史订单获取
  const getPagingList_ = async (value) => {
    setpagingShow(true)
    let res = await getPagingList(value)
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  const getTableList = async () => {
    setloading(true)
    let values = form.getFieldsValue()
    if (values['times']) {
      values['startDate'] = values['times'][0].format('YYYY-MM-DD')
      values['endDate'] = values['times'][1].format('YYYY-MM-DD')
    }
    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }

    setoldData(data)
    let res = await getDistributeMemberList(data)
    if (res && res.code === '0') {
      settableListTotalNum(res.data.rowTop)
      setuserdata(res.data.data)
    } else {
      settableListTotalNum(0)
      message.error(res.message)
    }
    setloading(false)
  }

  getSelectList = async () => {
    let res = await requestw({
      url: '/web/staff/group/getGroupList',
    })
    if (res.code == '0') {
      this.setState({
        selectList: res.data,
      })
    }
  }

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <Row type="flex" gutter={10}>
                <Col span={8}>
                  <Form.Item name="times">
                    <RangePicker showToday={true} locale={locale} allowClear={true} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="distributeType">
                    <Select showArrow={true} placeholder="成员类型" allowClear={true}>
                      {userlist.map((r) => (
                        <Option key={r.value} value={r.value}>
                          {r.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status">
                    <Select showArrow={true} placeholder="成员状态" allowClear={true}>
                      {userStatus.map((r) => (
                        <Option key={r.codeKey} value={r.codeKey}>
                          {r.codeValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="personPhoneNumber">
                    <Input placeholder="联系电话" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="personName">
                    <Input placeholder="成员名称" />
                  </Form.Item>
                </Col>
                {getOrgKind().isAdmin && (
                  <Col span={4}>
                    <Form.Item name="distributeOrgCode" initialValue={props?.orgcode}>
                      <FetchSelect
                        placeholder="推广公司"
                        api={api_channel.queryPromotionCompanyList}
                        valueKey="orgCode"
                        textKey="orgName"
                        //搜索
                        showSearch
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        disabled={props.disabled}
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col>
                  <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                    重置
                  </Button>
                  <Button style={{ borderRadius: '4px' }} type="primary" size="middle" htmlType="submit">
                    查询
                  </Button>
                </Col>
                <Col>
                  <Button
                    style={{ borderRadius: '4px' }}
                    type="primary"
                    onClick={() => {
                      setnoOrder(true)
                    }}
                  >
                    创建推广人
                  </Button>
                </Col>
                <Col>
                  {haveCtrlElementRight('fxyh-add-btn') && (
                    <Button onClick={() => setVisible(true)} style={{ borderRadius: '4px' }} className="buttonNoSize" size="middle">
                      批量创建
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          </Form>

          <div>
            <Table
              rowKey="id"
              rowClassName={useGetRow}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                current: pageRef.current,
                pageSize: pageSizeRef.current,
                total: tableListTotalNum,
                showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
                onChange: onPageChange,
              }}
              loading={loading}
              columns={columns}
              dataSource={userdata}
              style={{ margin: '23px  20px' }}
            />
          </div>
        </div>
      ) : (
        ''
      )}

      {/* <Revamp
        visible={revampShow}
        closeModal={closeModal}
        soleData={soleData}
        soleCode={soleCode}
        soleDistributeOrgCode={soleDistributeOrgCode}
        getProfitConfigList_={getProfitConfigList_}
      /> */}

      {onlyinit ? (
        <div>
          <Form>
            <div className="fontMb">
              <Form.Item>
                <div className="marginlr20">基本信息</div>
              </Form.Item>
              <div style={{ marginLeft: '100px' }}>
                <div className="flexjs">
                  <Form.Item
                    label="账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.personPhoneNumber : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.personAllName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.distributeTypeName : ''}</span>
                  </Form.Item>
                  <Form.Item
                    label="账号状态"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.statusName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="加入时间"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.createDateStr : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="样板信息"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.templateDataName : ''}</span>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="fontMb">
              <Form.Item>
                <div className="marginlr20">渠道信息</div>
              </Form.Item>

              <div style={{ marginLeft: '100px' }}>
                <div className="flexjs">
                  <Form.Item
                    label="下一级数量"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '12px' }}>{onlydata ? onlydata.childrenCount : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="上级合伙人"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.parentPersonName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="所属推广公司"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span>{onlydata ? onlydata.orgName : ''}</span>
                  </Form.Item>
                  <Form.Item
                    label="所属推广人"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '12px' }}>{onlydata ? onlydata.developPersonAllName : ''}</span>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div style={{ margin: '20px  20px' }}>
              <Button
                style={{ width: '100px', borderRadius: '4px' }}
                onClick={() => {
                  setonlyinit(false)
                  setinit(true)
                }}
                type="primary"
                htmlType="submit"
              >
                返回
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        ''
      )}

      <Modal destroyOnClose={true} centered={true} title="创建推广人" visible={noOrder} onCancel={() => setnoOrder(false)} width="500px" footer={null}>
        <>
          <div className="positionre">
            <Form onFinish={creaetonFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
              <Form.Item label="推广人手机号" rules={[{ required: true, message: '推广人手机号不能为空' }]} name="phoneNumber">
                <Input placeholder="请输入推广人手机号" />
              </Form.Item>

              <Form.Item name="personName" label="推广人姓名" rules={[{ required: true, message: '推广人姓名不能为空' }]}>
                <Input placeholder="请输入推广人姓名" />
              </Form.Item>
              {getOrgKind().isAdmin && (
                <Form.Item label="推广公司" name="orgCode" initialValue={props?.orgcode}>
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
              )}

              <Form.Item label="密码" name="initPassword">
                <Input placeholder="初始默认密码(123456)" />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 6 }}>
                <Button type="primary" htmlType="submit" loading={addModalLoading}>
                  确定
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      </Modal>

      <Modal centered={true} title="提示" visible={deleteShow} onCancel={() => setDeleteShow(false)} onOk={deleteClickEnsure} cancelText="取消" okText="确定">
        <p>是否确认删除该用户?</p>
      </Modal>

      {/*///批量创建*/}
      <Modal
        destroyOnClose={true}
        title="批量创建推广人"
        onCancel={() => {
          creatForm.setFieldsValue({ expressNo: '', orgCode: '' })
          setVisible(false)
          setVisibleResult(true)
          setVisibleLoding(false)
          clearInterval(myVar)
          if (!visibleResult) {
            onFinish({})
          }
        }}
        visible={visible}
        width="600px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form {...layout} preserve={false} form={creatForm} name="basic" onFinish={visibleFinish}>
            {visibleResult ? (
              <>
                <Form.Item wrapperCol={{ span: 8 }} label="创建推广人信息模板">
                  <div
                    onClick={() => {
                      window.location.href = 'https://filedown.bld365.com/bldmall/template/批量创建推广人.xls'
                    }}
                    className="formwork"
                  >
                    <DownloadOutlined />
                    模板下载
                  </div>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 8 }} name="expressNo" label="批量推广人信息" rules={[{ required: true, message: '请上传批量信息' }]}>
                  <Upload type="CREATE_MEMBER" length={1} />
                </Form.Item>

                {getOrgKind().isAdmin && (
                  <Form.Item name="orgCode" label="推广公司" rules={[{ required: true, message: '推广公司不能为空' }]} style={{ width: '440px' }}>
                    <Select style={{ width: '140px' }} showArrow={true} placeholder="输入关键字查询" allowClear={true} showSearch filterOption={false} onSearch={suhandleChange}>
                      {supplierData.map((r) => (
                        <Option key={r.orgCode} value={r.orgCode}>
                          {r.orgName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </>
            ) : (
              <>
                <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                  <div>本次批量创建成功{visibleNumber}条!</div>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                  <div id="lose">
                    {visibleData.length ? (
                      <div
                        onClick={() => {
                          copy('lose')
                        }}
                      >
                        失败:
                      </div>
                    ) : null}
                    {visibleData.map((r, idx) => {
                      return (
                        <Fragment key={idx}>
                          <span>{r.DATA_COL1}</span>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <span>{r.RESULT_NOTE}</span>
                          <span>,</span>
                          <br />
                        </Fragment>
                      )
                    })}
                  </div>
                </Form.Item>
              </>
            )}

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={visibleLoding} disabled={visibleLoding} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                {visibleResult ? '确定' : '继续批量创建'}
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 80 }}
                onClick={() => {
                  setVisible(false)
                  setVisibleResult(true)
                  clearInterval(myVar)
                  if (!visibleResult) {
                    onFinish({})
                  }
                }}
                type="primary"
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      {/* 配置样板 */}
      <Modal
        key="config_templateData"
        title="配置样板"
        visible={isShowConfigTemplateDataModal}
        onCancel={closeConfigTemplateDataModal}
        onOk={configTemplateDataModalOk}
        confirmLoading={loadingConfigTemplate}
        destroyOnClose={true}
        bodyStyle={{
          height: 720,
          overflow: 'hidden',
        }}
      >
        <Form form={configTemplateDataModalForm} {...configTemplateDataModalFormLayout}>
          <Form.Item label="合伙人" name="personName" initialValue={onlydata.personName || ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="商城首页样板" name="templateDataId" initialValue={undefined}>
            <FetchSelect
              api="/web/uiTemplateData/getUiTemplateDataPaging"
              formData={{
                orgCode: onlydata.distributeOrgCode,
                page: 1,
                rows: 200,
              }}
              valueKey="id"
              textKey="templateDataName"
              placeholder="商城首页样板"
              dealResFunc={(data) => data?.data ?? []}
              onChange={onTemplateChange}
            />
          </Form.Item>
          {/* 展示 */}
          <Form.Item label="预览">
            <div
              style={{
                transformOrigin: '0% 0%',
                transform: 'scale(0.9)',
              }}
            >
              <ShowItemList templateData={templateData} />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnClose={true}
        title="导出"
        onCancel={() => {
          seteduce(false)
          setPagingLoading(false)
          clearInterval(interTime)
        }}
        visible={educe}
        width="800px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form name="basic" onFinish={educeFinish}>
            <Form.Item wrapperCol={{ span: 3, offset: 21 }}>
              <Button
                onClick={() => {
                  getPagingList_()
                }}
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
              >
                刷新
              </Button>
            </Form.Item>

            <div>
              <Table loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={pagingColumns} dataSource={pagingList} />
            </div>

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={pagingLoading} disabled={pagingLoading} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定导出
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 130 }}
                onClick={() => {
                  clearInterval(interTime)
                  setPagingLoading(false)
                  seteduce(false)
                }}
                type="primary"
              >
                关闭
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </div>
  )
}
export default Index
