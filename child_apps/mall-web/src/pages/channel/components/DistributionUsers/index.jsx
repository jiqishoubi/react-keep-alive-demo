// 分销用户
import React, { useEffect, useState, Fragment, useRef } from 'react'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
import lodash from 'lodash'
import debounce from 'lodash/debounce'
import { Button, DatePicker, Form, Input, message, Select, Table, Modal, Dropdown, Menu, Row, Col } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
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
  const [remarkForm] = Form.useForm()

  const [loading, setLoading] = useState(false)

  const [userStatus, setUserStatus] = useState([])

  const [userlist, setuserlist] = useState([
    { name: '推广人', value: 'DISTRIBUTE_HEAD' },
    { name: '合伙人', value: 'SALE_PERSON' },
  ])
  //userdata
  const [userdata, setuserdata] = useState([])
  //创建是否显示
  const [noOrder, setnoOrder] = useState(false)
  const [addModalLoading, setAddModalLoading] = useState(false)

  //only数据e
  const [onlydata, setonlydata] = useState({})
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

  // 修改modal
  // setupdateDistributePhoneModal
  const [updateDistributePhoneModal, setupdateDistributePhoneModal] = useState(false)
  const [updateDistributePhoneModalForm] = Form.useForm()
  const [phoneData, setPhoneData] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [updateDistributePhoneLoading, setUpdateDistributePhoneLoading] = useState(false)
  // setPhoneData;
  //导出数据
  const [educe, seteduce] = useState(false)
  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)
  const [pagingLoading, setPagingLoading] = useState(false)
  //样板预览
  const [templateData, setTemplateData] = useState({
    pageConfig: {},
    itemList: [],
  })

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  // const [selectList, setselectList] = useState([]);

  const [relationModal, setRelationModal] = useState(false)
  const [relationInfo, setRelationInfo] = useState({})
  // const [personInfo, setPersonInfo] = useState({});
  const [groupType, setgroupType] = useState('')
  const [selectList, setselectList] = useState([])
  const [selectList2, setselectList2] = useState([])
  const [optionArr, setOptionArr] = useState([])

  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [templateDataId, setTemplateDataId] = useState('')
  const [qrCode, setQrcode] = useState([])

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
    // getOptions();
    getSysCodeByParam_('DISTRIBUTE_STATUS').then((res) => {
      if (res && res.code === '0') {
        setUserStatus(res.data)
      } else {
      }
    })
    getSysCodeByParam_('GROUP_TYPE').then((res) => {
      if (res && res.code === '0') {
        setselectList2(res.data)
      } else {
      }
    })
    querycreateSupplier_()
    createSupplier_()
    onFinish()
    getSelectList()
  }, [])
  const getOptions = async (e) => {
    const res = await requestw({
      url: '/web/staff/group/queryPaging',
      data: {
        page: 1,
        rows: 9999,
        groupType: e,
      },
    })

    let arr = []

    if (res && res.code == '0' && res.data) {
      arr = res.data.data
    }

    let groupCodeArr = []
    let ishave
    let groupCode = ''
    if (relationInfo.groupCode) {
      groupCodeArr = relationInfo.groupCode.split(',')
      groupCodeArr.map((item) => {
        ishave = functiontofindIndexByKeyValue(arr, 'groupCode', item)
        if (ishave == '0' || ishave) {
          groupCode = item
        }
      })
      if (ishave == '0' || ishave) {
        form.setFieldsValue({
          groupCodes: groupCode,
        })
      } else {
        form.setFieldsValue({
          groupCodes: '',
        })
      }
    }
    // }
    setOptionArr(arr)
  }

  const functiontofindIndexByKeyValue = (arraytosearch, key, valuetosearch) => {
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i
      }
    }
    return null
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

  const columns = [
    {
      align: 'center',
      dataIndex: 'personLoginName',
      title: '账号',
      key: 'personLoginName',
    },
    {
      align: 'center',
      dataIndex: 'personName',
      title: '姓名/名称',
      key: 'personName',
    },
    {
      align: 'center',
      dataIndex: 'healthVisitor',
      title: '健康顾问',
      key: 'healthVisitor',
    },

    {
      align: 'center',
      dataIndex: 'personPhoneNumber',
      title: '手机号',
      key: 'personPhoneNumber',
      width: 140,
    },
    {
      align: 'center',
      dataIndex: 'distributeTypeName',
      title: '类型',
      key: 'distributeTypeName',
      width: 100,
    },
    {
      align: 'center',
      dataIndex: 'distributeCode',
      title: '编码',
      key: 'distributeCode',
      width: 100,
    },
    {
      align: 'center',
      dataIndex: 'distributeLevelName',
      title: '合伙人类型',
      render: (e) => {
        return e ? e : '--'
      },
      width: 120,
    },
    {
      dataIndex: 'createDateStr',
      title: '加入时间',
      align: 'center',
      key: 'createDateStr',
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
      width: 130,
    },

    {
      dataIndex: 'statusName',
      title: '状态',
      align: 'center',
      render: (r) => {
        return r || '--'
      },
      width: 100,
    },
    {
      dataIndex: 'parentPersonName',
      title: '上级合伙人',
      align: 'center',
      key: 'parentPersonName',
      width: 120,
    },
    {
      dataIndex: 'groupName',
      title: '分组名称',
      align: 'center',
      key: 'groupName',
    },
    {
      align: 'center',
      title: '操作',
      width: 120,
      render: (e) => {
        return (
          <>
            {e.distributeType == 'DISTRIBUTE_HEAD' ? (
              <Button type="link" onClick={() => openupdateDistributePhoneModal(e)}>
                {getOrgKind().isAdmin ? '修改' : ''}
              </Button>
            ) : getOrgKind().isAdmin ? (
              ''
            ) : (
              <Button type="link" onClick={() => openRelationModal(e)}>
                {' '}
                选择分组
              </Button>
            )}
            {e.distributeType == 'SALE_PERSON' ? (
              <Button type="link" onClick={() => addRemark(e)}>
                添加备注
              </Button>
            ) : null}

            <br />
            {e.distributeLevelName && !getOrgKind().isAdmin ? (
              <a
                onClick={() => {
                  qrCodeClick(e)
                }}
              >
                公众号二维码
              </a>
            ) : null}
          </>
        )
      },
    },
  ]

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

  const closeConfigTemplateDataModal = () => {
    setonlydata({})
    setIsShowConfigTemplateDataModal(false)
    setTemplateData({ pageConfig: {}, itemList: [] })
  }
  const configTemplateDataModalOk = () => {
    const postData = {
      id: templateDataId,
      distributeCode: onlydata.distributeCode,
    }
    if (!templateDataId && !templateDataId == 0) {
      message.warn('请选择模板')
      return
    }
    setLoadingConfigTemplate(true)
    requestw({
      url: '/web/staff/uiTemplateData/setDistributePersonUi',
      data: postData,
    }).then((res) => {
      setLoadingConfigTemplate(false)
      if (!res || res.code !== '0') {
        message.warning((res && res.message) || '网络异常')
        return
      }
      //成功
      setonlydata({})
      setTemplateDataId('')
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
    let jsonStr = row.key
    setTemplateDataId(row?.value)
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

  const openupdateDistributePhoneModal = (record) => {
    setPhoneData(record)
    getUserInfo(record)
  }
  const getUserInfo = (record) => {
    requestw({
      url: '/web/user/getUserInfo',
      data: {
        userCode: record.personCode,
      },
    }).then((res) => {
      if (!res || res.code !== '0') {
        message.warning((res && res.message) || '网络异常')
        return
      } else {
        setUserInfo(res.data)
        setTimeout(() => {
          setupdateDistributePhoneModal(true)
        }, 200)
      }
    })
  }

  const closeUpdateDistributePhoneModal = () => {
    setPhoneData({})
    setupdateDistributePhoneModal(false)
    setTemplateData({ pageConfig: {}, itemList: [] })
  }
  const updateDistributePhoneModalOk = () => {
    let value = updateDistributePhoneModalForm.getFieldsValue()
    if (phoneData.distributeType == 'DISTRIBUTE_HEAD') {
      if (!value.phoneNumber) {
        message.warning('请填写完整')
        return
      }
    } else if (phoneData.distributeType == 'SALE_PERSON') {
      if (!value.phoneNumber) {
        message.warning('请填写完整')
        return
      }
    }
    const postData = {
      ...value,
      id: templateDataId,
      distributeCode: phoneData.distributeCode,
    }

    setUpdateDistributePhoneLoading(true)
    requestw({
      url: '/web/admin/distribute/member/updateDistributePhone',
      data: postData,
    }).then((res) => {
      setUpdateDistributePhoneLoading(false)
      if (!res || res.code !== '0') {
        message.warning((res && res.message) || '网络异常')
        return
      }
      //成功
      setPhoneData({})
      // setTemplateDataId('');
      setUserInfo({})
      setupdateDistributePhoneModal(false)
      onFinish()
    })
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
    setLoading(true)
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
    setLoading(false)
  }

  const getSelectList = async () => {
    let res = await requestw({
      url: '/web/staff/group/getGroupList',
      data: {
        groupType: '',
      },
    })
    if (res.code == '0') {
      // this.setState({
      setselectList(res.data)
      // });
    }
  }

  const openRelationModal = (v) => {
    setRelationModal(true)
    setRelationInfo(v)
  }

  const suhandleChanges = (e) => {
    // TEMPLATE
    setgroupType(e)
    getOptions(e)
  }

  const createRelation = async () => {
    let formData = form.getFieldsValue()
    let res = await requestw({
      url: '/web/staff/group/createRelation',
      data: {
        groupCode: formData.groupCodes,
        personCode: relationInfo.personCode,
      },
    })
    if (res.code == '0') {
      message.success('操作成功')
      setRelationModal(false)
      setRelationInfo({})
      form.resetFields()
      onFinish()
    } else {
      message.success(res.message ? res.message : '操作失败')
    }
  }
  //公众号二维码弹窗
  const qrCodeClick = async (e) => {
    let res = await requestw({
      url: '/wechat/qrcode/get',
      data: {
        distributeCode: e.distributeCode,
      },
    })
    if (res && res.code === '0') {
      Modal.confirm({
        title: '微信公众号二维码',
        icon: null,
        content: <img style={{ margin: '20px 20%', width: 200, height: 200 }} src={res.data} alt="" />,
        cancelText: '关闭',
        okText: '下载',
        width: 400,
        height: 400,
        onOk: () => {
          ;((imgsrc, name) => {
            //下载图片地址和图片名
            let image = new Image()
            // 解决跨域 Canvas 污染问题
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function () {
              let canvas = document.createElement('canvas')
              canvas.width = image.width
              canvas.height = image.height
              let context = canvas.getContext('2d')
              context.drawImage(image, 0, 0, image.width, image.height)
              let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
              let a = document.createElement('a') // 生成一个a元素
              let event = new MouseEvent('click') // 创建一个单击事件
              a.download = name || 'photo' // 设置图片名称
              a.href = url // 将生成的URL设置为a.href属性
              a.dispatchEvent(event) // 触发a的单击事件
            }
            image.src = imgsrc
          })(res.data, e.personName)
        },
        onCancel() {},
      })
    }
  }

  const addRemark = (e) => {
    remarkForm.setFieldsValue({ healthVisitor: e.healthVisitor })
    Modal.confirm({
      title: '添加备注',
      icon: null,
      content: (
        <Form form={remarkForm} style={{ marginTop: 30 }}>
          <Form.Item label="健康顾问备注" rules={[{ required: true, message: '请填写健康顾问备注' }]} name="healthVisitor">
            <Input placeholder="请填写健康顾问备注" />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        remarkForm
          .validateFields()
          .then(async () => {
            const values = remarkForm.getFieldsValue()
            values['distributeCode'] = e.distributeCode

            const url = getOrgKind().isAdmin ? '/web/admin/distribute/member/updateHealthVisitorName' : '/web/staff/distribute/member/updateHealthVisitorName'
            const res = await requestw({
              url,
              data: values,
            })
            if (res && res.code === '0') {
              message.success(res.message || '成功')
              remarkForm.resetFields()
              onFinish()
            } else message.warn(res.message || '失败')
          })
          .catch(() => {})
      },
      onCancel: () => {
        remarkForm.resetFields()
      },
    })
  }

  return (
    <div>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row type="flex" gutter={10}>
              <Col span={6}>
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
              <Col span={3}>
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
              <Col span={3}>
                <Form.Item name="personPhoneNumber">
                  <Input placeholder="联系电话" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="personName">
                  <Input placeholder="成员名称" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item required name="groupCode">
                  <Select placeholder="请选择分组">
                    {selectList &&
                      selectList.map((obj, index) => (
                        <Option key={index} value={obj.groupCode}>
                          {obj.groupName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              {getOrgKind().isAdmin && (
                <Col span={3}>
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

      {relationModal && (
        <Modal
          title={'选择分组'}
          footer={null}
          visible={relationModal}
          onCancel={() => {
            setRelationModal(false)
            setRelationInfo({})
            setOptionArr([])
            form.resetFields()
          }}
        >
          <>
            <Form form={form} {...layout} onFinish={createRelation} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} preserve={false}>
              <Form.Item name="groupType" label="分组类型" rules={[{ required: true, message: '请选择分组类型' }]}>
                <Select showArrow={true} placeholder="请选择" allowClear={true} filterOption={false} onChange={suhandleChanges}>
                  {selectList2 &&
                    selectList2.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              {/* {groupType == 'TEMPLATE' ? ( */}
              <Form.Item label="样板" name="groupCodes" rules={[{ required: true, message: '请选择样板' }]}>
                <Select showArrow={true} placeholder="请选择" allowClear={true} filterOption={false}>
                  {optionArr &&
                    optionArr.map((obj) => (
                      <Option key={obj.groupCode} value={obj.groupCode}>
                        {obj.groupName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item {...tailLayout} style={{ marginTop: 40 }}>
                <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                  确定
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginLeft: 88 }}
                  onClick={() => {
                    // setnewSupplier(false);
                    setRelationInfo({})
                    setRelationModal(false)
                    setOptionArr([])
                    form.resetFields()
                  }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </>
        </Modal>
      )}

      <Modal destroyOnClose={true} centered={true} title="创建推广人" visible={noOrder} onCancel={() => setnoOrder(false)} width="500px" footer={null}>
        <>
          <div className="positionre">
            <Form onFinish={creaetonFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
              <Form.Item name="loginName" label="推广人账号" rules={[{ required: true, message: '推广人账号不能为空' }]}>
                <Input placeholder="请输入推广人账号" />
              </Form.Item>
              <Form.Item label="推广人手机号" name="phoneNumber">
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
                      window.location.href = 'https://filedown.bld365.com/saas_mall_platform/2021121600001/batchCreateDistributeMember/批量创建推广人.xls'
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

      {/* updateDistributePhoneModal */}
      {/* 修改分销人员登录账号 */}
      <Modal
        destroyOnClose={true}
        key="config_templateDatas"
        title="登录账号"
        visible={updateDistributePhoneModal}
        onCancel={closeUpdateDistributePhoneModal}
        onOk={updateDistributePhoneModalOk}
        confirmLoading={updateDistributePhoneLoading}
        bodyStyle={{
          // height: 720,
          overflow: 'hidden',
        }}
      >
        <Form preserve={false} form={updateDistributePhoneModalForm} {...configTemplateDataModalFormLayout}>
          <Form.Item name="loginName" label="推广人账号" rules={[{ required: true, message: '推广人账号不能为空' }]} initialValue={userInfo?.loginName || ''}>
            <Input placeholder="请输入推广人账号" />
          </Form.Item>
          <Form.Item label="手机号" name="phoneNumber" initialValue={userInfo?.phoneNumber || ''}>
            <Input placeholder="请输入手机号" />
          </Form.Item>

          {phoneData.distributeType == 'DISTRIBUTE_HEAD' ? null : (
            <>
              <Form.Item
                label="微信openId"
                rules={phoneData.distributeType == 'SALE_PERSON' ? null : [{ required: true, message: '请输入微信openId' }]}
                name="weChatMpOpenId"
                initialValue={userInfo?.weChatMpOpenId || ''}
              >
                <Input placeholder="请输入微信openId" />
              </Form.Item>
              <Form.Item label="unionId" name="weChatUnionId" initialValue={userInfo?.weChatUnionId || ''}>
                <Input placeholder="请输入微信unionId" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      {/* 配置样板 */}
      <Modal
        destroyOnClose={true}
        key="config_templateData"
        title="配置样板"
        visible={isShowConfigTemplateDataModal}
        onCancel={closeConfigTemplateDataModal}
        onOk={configTemplateDataModalOk}
        confirmLoading={loadingConfigTemplate}
        bodyStyle={{
          height: 720,
          overflow: 'hidden',
        }}
      >
        <Form preserve={false} form={configTemplateDataModalForm} {...configTemplateDataModalFormLayout}>
          <Form.Item label="合伙人" name="personName" initialValue={onlydata.personName || ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="商城首页样板" name="templateDataId" initialValue={undefined}>
            <FetchSelect
              api="/web/staff/uiTemplateData/getList"
              formData={{
                orgCode: onlydata.distributeOrgCode,
                page: 1,
                rows: 200,
              }}
              valueKey="id"
              textKey="templateDataName"
              placeholder="商城首页样板"
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
