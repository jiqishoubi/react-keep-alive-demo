import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import debounce from 'lodash/debounce'
import 'moment/locale/zh-cn'
import { Form, DatePicker, Input, Select, Space, Button, Table, message, Modal, Radio, Row, Col, Dropdown, Menu, Badge } from 'antd'
import { CopyOutlined, DownloadOutlined, ExclamationCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import Upload from '@/components/T-Upload4'
import { useGetRow } from '@/hooks/useGetRow'
import { downloadFilePostStream, getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import {
  initTradePage,
  getTradeList,
  getTradeInfo,
  updateTradeProcessNote,
  expressTrade,
  cancelTrade,
  getExpressListQuery,
  updateTradeExpress,
  bulkDelivery,
  getImportStatus,
  getImportData,
  getPagingList,
  getExportInfo,
  getTrade,
  getTicketDetailByTradeNo,
  chinaPortTrade,
  cancelTradeApprove,
  orderCustom,
  getOrderTrade,
  getOrderExportInfo,
  getOrderPagingList,
  getSpiltBillOrderList,
} from '../../services/order'
import api_common from '@/services/api/common'
import requestw from '@/utils/requestw'
import api_goods from '../../services/api/goods'
import './index_localName.less'
import { router } from 'umi'

moment.locale('zh-cn')

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
}

const { Option } = Select
const { TextArea } = Input

const ctrlBtnAStyle = {
  paddingBottom: 7,
  marginLeft: 7,
}

function orderManage() {
  const [form] = Form.useForm()
  const [accountForm] = Form.useForm()
  const [tradeList, settradeList] = useState([])

  //时间类型
  const [timeList, settimeList] = useState([])
  //订单状态
  const [tradeStatus, settradeStatus] = useState([])
  //物流状态
  const [expressStatus, setexpressStatus] = useState([])
  //expressCompany物流公司
  const [expressCompany, setexpressCompany] = useState([])
  //唯一数据
  const [orderdata, setorderdata] = useState()
  //备注remark
  const [remark, setremark] = useState(false)

  //consignment发货状态
  const [consignment, setconsignment] = useState(false)
  //table loding 展示
  const [loading, setloading] = useState(false)
  //t取消订单 展示
  const [noOrder, setnoOrder] = useState(false)
  //订单搜索
  const [orderTrade] = useState([
    { key: '订单号', value: 'tradeNo' },
    { key: '支付单号', value: 'paymentNo' },
    { key: '配送单号', value: 'expressNo' },
    { key: '微信支付单号', value: 'paymentId' },
  ])
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)

  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState('')

  //订单类型
  const [orders, setorders] = useState([])
  //详情页table数据
  //核实物流model
  const [verifyLogistics, setverifyLogistics] = useState(false)
  //核实订单数据
  const [verifyData, setverifyData] = useState()

  //核实订单数据
  const [logisticsShow, setLogisticsShow] = useState(true)

  //批量发货model展示
  const [visible, setVisible] = useState(false)
  //批量结果model展示
  const [visibleResult, setVisibleResult] = useState(true)

  const [visibleLoding, setVisibleLoding] = useState(false)
  const [visibleData, setVisibleData] = useState([])

  //导出modal
  const [isShowExportModal, setIsShowExportModal] = useState(false)
  const [exportType, setExportType] = useState(null) //1 导出 2 订单导出

  const [myVar, setmyVar] = useState()
  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const [visibleNumber, setVisibleNumber] = useState(false)

  // 是否展示退款modal

  const [isRefund, setIsRefund] = useState()
  const [refundData, setRefundData] = useState()

  //退款按钮loding
  const [refundLoading, setRefundLoading] = useState(false)

  const [provinceList, setProvinceList] = useState([])
  const [eparchyListByProvinceList, setEparchyListByProvinceList] = useState([])
  const [cityListByEparchyList, setCityListByEparchyList] = useState([])
  const [goodsTypeList, setGoodsTypeList] = useState([])
  const [goodsTypeList2, setGoodsTypeList2] = useState([])

  const [isShow, setIsShow] = useState(true)

  //分账所需
  const [accountShow, setAccountShow] = useState(false)
  const [accountType, setAccountType] = useState([])
  const [accountData, setAccountData] = useState([])

  const accountColumns = [
    {
      dataIndex: 'name',
      title: '商户名称',
      align: 'center',
    },
    {
      dataIndex: 'number',
      title: '商户号',
      align: 'center',
    },
    {
      dataIndex: 'money',
      title: '分账金额',
      align: 'center',
    },
  ]

  const orderlayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }

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

  async function initTradePage_() {
    let res = await initTradePage()
    if (res && res.code === '0') {
      settimeList(res.data.dateTypeList)
    } else {
      message.error(res.message)
    }
  }
  //导出历史订单获取
  const getPagingList_ = async (type) => {
    setpagingShow(true)
    const typeTemp = type || exportType
    const ajax = typeTemp == 1 ? getPagingList : getOrderPagingList
    const res = await ajax()
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data
      setPagingList(data)
    }
    setpagingShow(false)
  }

  useEffect(() => {
    initTradePage_()
    //获取订单状态
    getSysCodeByParam_('TRADE_STATUS').then((res) => {
      if (res && res.code === '0') {
        settradeStatus(res.data)
      }
    })

    // 物流状态
    getSysCodeByParam_('TRADE_EXPRESS_STATUS').then((res) => {
      if (res && res.code === '0') {
        res.data.shift()
        setexpressStatus(res.data)
      }
    })
    //分账类型
    getSysCodeByParam_('TRADE_SPLIT_BILL_TYPE').then((res) => {
      if (res && res.code === '0') {
        setAccountType(res.data)
      }
    })

    // 物流公司
    getExpressQuery_()
    //订单类型
    getSysCodeByParam_('TRADE_TYPE').then((res) => {
      if (res && res.code === '0') {
        setorders(res.data)
      }
    })
    getPagingList_()

    onFinish()
    getProvinceList()
    getSelect1()
  }, [])

  // 人工提交报单
  function orderSubmitEvent(e) {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `确认要人工提交报单？`,
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        orderSubmitFunc(e)
      },
      onCancel() {},
    })
  }

  // 人工提交报单
  function orderCustomEvent(e) {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `确认要海关查验吗？`,
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        orderCustomFunc(e)
      },
      onCancel() {},
    })
  }

  function orderCustomFunc(e) {
    orderCustom({
      tradeNo: e.tradeNo || '',
    }).then((res) => {
      if (res && res.code === '0') {
        message.success('提交成功')
        onFinish()
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }

  function orderSubmitFunc(e) {
    chinaPortTrade({
      tradeNo: e.tradeNo || '',
    }).then((res) => {
      if (res && res.code === '0') {
        message.success('提交成功')
        onFinish()
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }

  const getSelect1 = async () => {
    const res = await requestw({
      url: api_goods.getFirstGroupList,
    })
    if (res && res.code == '0' && res.data && res.data.data) {
      setGoodsTypeList(res.data.data)
    }
  }

  const typeIdChange = async (typeId) => {
    setGoodsTypeList2([])
    form.setFieldsValue({ secondGroupCode: undefined })

    const res = await requestw({
      url: api_goods.getSecondGroupList,
      data: {
        groupCode: typeId,
      },
    })
    if (res && res.code == '0' && res.data) {
      setGoodsTypeList2(res.data)
    }
  }

  //点击查询
  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }

  //获取查询数据
  const getTableList = async () => {
    let values = form.getFieldsValue()

    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    values['page'] = pageRef.current
    values['rows'] = pageSizeRef.current

    //noType 和 no
    if (values.noType == 'tradeNo') {
      values.tradeNo = values.no
    } else if (values.noType == 'paymentNo') {
      values.paymentNo = values.no && values.no.trim()
    } else if (values.noType == 'expressNo') {
      values.expressNo = values.no && values.no.trim()
    } else if (values.noType == 'paymentId') {
      values.paymentId = values.no && values.no.trim()
    }

    delete values.noType
    delete values.no

    //activeType activeName
    if (values.activeType && values.activeName) {
    } else {
      delete values.activeType
      delete values.activeName
    }

    setloading(true)
    setoldData(values)
    let res = await getTradeList(values)
    if (res && res.code === '0') {
      settradeList(res.data.data)
      setloading(false)
      settableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setloading(false)
  }

  // 分页点击
  const onPageChange = (newPage, newPageSize) => {
    pageRef.current = newPage
    pageSizeRef.current = newPageSize
    getTableList()
  }

  const columns = [
    {
      dataIndex: 'none',
      title: '',
      key: 'none',
      width: 0,
      fixed: 'left',
    },
    {
      dataIndex: 'tradeNo',
      title: '订单号',
      align: 'center',
      key: 'key',
      width: 160,
    },
    {
      dataIndex: 'tradeDateStr',
      title: '下单时间',
      align: 'center',
      key: 'key',
      width: 200,
    },
    {
      dataIndex: 'tradeTypeName',
      title: '订单类型',
      align: 'center',
      key: 'key',
      width: 100,
    },
    {
      align: 'center',
      dataIndex: 'orgName',
      title: '企业名称',
      width: 200,
      ellipsis: true,
    },
    {
      align: 'center',
      dataIndex: 'custName',
      title: '收货人',
      key: 'key',
      width: 90,
    },
    {
      align: 'center',
      dataIndex: 'custMobile',
      title: '手机号',
      key: 'key',
      width: 130,
    },
    {
      align: 'center',
      title: '收货地址',
      dataIndex: 'allAddress',
      key: 'allAddress',
      width: 220,
      ellipsis: true,
    },
    {
      align: 'center',
      title: '总价(元)',
      render: (e) => {
        return <>{e.tradeFeeStr ? e.tradeFeeStr : ''}</>
      },
      width: 100,
    },
    {
      align: 'center',
      dataIndex: 'ifPrescription',
      title: '是否为处方药',
      width: 130,
      render: (e) => {
        return e === '1' ? '是' : '否'
      },
    },

    {
      align: 'center',
      title: '订单状态',
      dataIndex: 'tradeStatusName',
      key: 'tradeStatusName',
      width: 90,
      fixed: 'right',
    },
    {
      align: 'center',
      title: '操作',
      fixed: 'right',
      width: 150,
      render: (e) => {
        return (
          <div>
            <a
              onClick={(event) => {
                event.stopPropagation()
                getTradeInfo_(e)
              }}
              style={ctrlBtnAStyle}
            >
              详情
            </a>
            {e.tradeTypeName !== '主订单' && (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  remarlshow(e)
                }}
                style={ctrlBtnAStyle}
              >
                备注
              </a>
            )}
            {e.tradeStatusName === '待发货' && e.tradeTypeName !== '主订单' && e.tradeMode != 'INTERNATION' && e.ifSupplierExpress === true && haveCtrlElementRight('ddgl-fahuo-btn') && (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  orderOnFinishow(e)
                }}
                style={ctrlBtnAStyle}
              >
                发货
              </a>
            )}
            {/* {e.tradeMode === 'INTERNATION' &&
              e.tradeStatus === '50' &&
              e.chinaPortStatus === '0' &&
              haveCtrlElementRight('ddgl-baoguan-btn') && (
                <a
                  onClick={event => {
                    event.stopPropagation();
                    orderSubmitEvent(e);
                  }}
                  style={ctrlBtnAStyle}
                >
                  报关
                </a>
              )} */}
            {e.tradeStatus === '50' && e.chinaPortStatus === '80' && haveCtrlElementRight('ddgl-baoguan-btn') && (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  orderCustomEvent(e)
                }}
                style={ctrlBtnAStyle}
              >
                检验通过
              </a>
            )}

            {e.tradeStatusName === '已发货' && e.tradeTypeName !== '主订单' && e.expressStatus === '3' && e.ifSupplierExpress === true && haveCtrlElementRight('ddgl-hswl-btn') && (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  verifyLogisticsShow(e)
                }}
                style={ctrlBtnAStyle}
              >
                核实物流
              </a>
            )}
            {e.ifSplitBill == '1' && (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  splitAccount(e)
                }}
                style={ctrlBtnAStyle}
              >
                分账明细
              </a>
            )}
          </div>
        )
      },
    },
  ]

  //点击分账
  const splitAccount = async (e) => {
    setAccountShow(true)
    let res = await getSpiltBillOrderList({ tradeNo: e.tradeNo })
    if (res && res.code === '0') {
      let viceData = []
      let resData = res.data
      let vice1 = {
        name: resData.receiverName,
        number: resData.receiverAccount,
        money: resData.amountStr,
      }
      let vice2 = {
        name: resData.orgName,
        number: resData.subMchId,
        money: resData.splitBillFeeStr,
      }
      viceData = [vice1, vice2]

      setAccountData(viceData)
      accountForm.setFieldsValue(res.data)
    }
  }

  //点击查看详情
  async function getTradeInfo_(e) {
    const tradeNo = e.tradeNo
    let pathname = '/web/supplier/trademgr/trademgr/details'
    router.push({
      pathname,
      query: { tradeNo },
    })
  }

  //remarkshow
  function remarlshow(e) {
    setremark(true)
    setorderdata(e)
  }

  async function remarkOnFinish(values) {
    values['tradeNo'] = orderdata.tradeNo

    let res = await updateTradeProcessNote(values)

    if (res && res.code === '0') {
      setremark(false)
      message.success('添加成功')
    } else {
      message.error(res.message)
    }
  }
  //订单发货是否显示
  function orderOnFinishow(e) {
    setorderdata(e)
    setconsignment(true)
  }
  //物流状态展示

  const verifyLogisticsShow = (e) => {
    setverifyLogistics(true)
    setverifyData(e)
  }

  //订单发货
  async function orderOnFinish(values) {
    if (orderdata.tradeStatus === '50') {
      values['tradeNo'] = orderdata.tradeNo
      let res = await expressTrade(values)
      if (res && res.code === '0') {
        setconsignment(false)

        message.success('发货成功')
        getTableList()
      } else {
        message.error(res.message)
      }
    } else {
      message.error('订单不可操作')
    }
  }

  //主动退款
  async function orderOnFinishNO(values) {
    if (orderdata.tradeStatus === '50' || orderdata.tradeStatus === '10') {
      values['tradeNo'] = orderdata.tradeNo
      let res = await cancelTrade(values)
      if (res && res.code === '0') {
        setnoOrder(false)

        message.success(res.message)
        getTableList()
      } else {
        message.error(res.message)
      }
    } else {
      message.error('订单不可操作')
    }
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //实现复制id
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

  //物流公司查询
  async function getExpressQuery_(value) {
    let data = { expressName: value }
    let res = await getExpressListQuery(data)
    if (res && res.code === '0') {
      let resData = JSON.parse(JSON.stringify(res.data))
      setexpressCompany(resData)
    }
  }
  //防抖
  const delayedChange = debounce(getExpressQuery_, 800)
  //快递查询输入框改变
  const handleChange = (event) => {
    delayedChange(event)
  }

  //核实物流提交
  const logisticsFinish = async (values) => {
    values['tradeNo'] = verifyData.tradeNo
    let res = await updateTradeExpress(values)
    if (res && res.code === '0') {
      message.success(res.message)
      setverifyLogistics(false)
      onFinish()
    } else {
      message.error(res.message)
    }
  }

  //批量发货
  const visibleFinish = async (values) => {
    if (!visibleResult) {
      setVisibleResult(true)
      return
    }
    setVisibleLoding(true)
    let code = values.expressNo[0].code
    let res = await bulkDelivery({ operDataKey: code })

    if (res && res.code === '0') {
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
            y.push(r.DATA_COL1)
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

  //导出modal
  //打开导出modal
  const clickExport = (type) => {
    setIsShowExportModal(true)
    setExportType(type)
    getPagingList_(type)
  }
  //关闭导出modal
  const closeExportModal = () => {
    setIsShowExportModal(false)
    setPagingLoading(false)
    clearInterval(interTime)
  }
  //提交导出
  const exportFinish = async () => {
    setPagingLoading(true)
    let code
    let value = oldData
    if (value.address) {
      value[value.address.province] = value.address.street
      delete value.address
    }

    const ajax1 = exportType == 1 ? getTrade : getOrderTrade
    const res = await ajax1(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        const ajax2 = exportType == 1 ? getExportInfo : getOrderExportInfo
        const res2 = await ajax2({ exportCode: code })
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

  //待发货导出
  const pendingExport = async () => {
    downloadFilePostStream('/web/supplier/express/export/trade', oldData)
  }

  const toggleSearch = () => {
    setIsShow(!isShow)
  }

  const getProvinceList = async () => {
    let res = await requestw({
      url: '/web/system/region/getProvinceList',
    })
    if (res && res.code == '0') {
      setProvinceList(res.data)
    }
  }

  const getEparchyListByProvince = async (e) => {
    setEparchyListByProvinceList([])
    setCityListByEparchyList([])
    form.setFieldsValue({
      eparchyCode: undefined,
      cityCode: undefined,
    })

    let res = await requestw({
      url: '/web/system/region/getEparchyListByProvince',
      data: { provinceCode: e },
    })
    if (res && res.code == '0') {
      setEparchyListByProvinceList(res.data)
    }
  }

  const getCityListByEparchy = async (e) => {
    setCityListByEparchyList([])
    form.setFieldsValue({ cityCode: undefined })

    let res = await requestw({
      url: '/web/system/region/getCityListByEparchy',
      data: { eparchyCode: e },
    })
    if (res && res.code == '0') {
      setCityListByEparchyList(res.data)
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

  const expandedRowRender = (e) => {
    const columns = [
      {
        title: '商品图片',
        align: 'center',
        dataIndex: 'goodsImg',
        key: 'skuImg',
        width: '12.5%',
        render: (v) => {
          return <>{v ? <img style={{ width: '40px', height: '40px', marginRight: '10px' }} src={v} /> : ''}</>
        },
      },
      {
        title: '商品名称',
        align: 'center',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '商品类型',
        key: 'tradeModeName',
        dataIndex: 'tradeModeName',
        align: 'center',
      },
      {
        title: '商品数量',
        align: 'center',
        dataIndex: 'skuCount',
        key: 'skuCount',
      },
      {
        title: '单价（元）',
        align: 'center',
        dataIndex: 'skuPriceStr',
        key: 'skuPriceStr',
        render(v) {
          return <>{v ? v : '---'}</>
        },
      },
    ]

    const data = []
    e.tradeGoodsList?.map((item, ind) => {
      data.push({
        key: item.id,
        goodsName: item.goodsName,
        goodsImg: item.skuImg,
        tradeModeName: e.tradeModeName,
        skuCount: item.skuCount,
        skuPriceStr: item.skuPriceStr,
        warehouseName: e.warehouseName,
      })
    })

    return <Table columns={columns} dataSource={data} pagination={false} bordered />
  }

  return (
    <div>
      <div className="headBac">
        <div className="positionre" style={{ marginLeft: '20px' }}>
          <Form style={{ border: '1px solid #FEFFFE', marginTop: 23 }} form={form} name="basic" onFinish={onFinish}>
            <div>
              <Row gutter={10} justify="start">
                <Col span={3}>
                  <Form.Item initialValue="TRADE" name="dateType" style={{ marginBottom: 10 }}>
                    <Select placeholder="时间类型" allowClear={true}>
                      {timeList.map((r) => (
                        <Option key={r.value} value={r.value}>
                          {r.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="startDate" initialValue={moment().add(-30, 'days')} style={{ marginBottom: 10 }}>
                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期" allowClear={true}></DatePicker>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="endDate" initialValue={moment()} style={{ marginBottom: 10 }}>
                    <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期" allowClear={true}></DatePicker>
                  </Form.Item>
                </Col>
                {/* no类型 */}
                <Col span={3}>
                  <Form.Item initialValue="tradeNo" name="noType" style={{ marginBottom: 10 }}>
                    <Select placeholder="订单搜索" allowClear={true}>
                      {orderTrade.map((r) => (
                        <Option key={r.value} value={r.value}>
                          {r.key}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* no */}
                <Col span={3}>
                  <Form.Item name="no" style={{ marginBottom: 10 }}>
                    <Input placeholder="请输入..." allowClear={true} />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="orgName" style={{ marginBottom: 10 }}>
                    <Input placeholder="企业名称" allowClear={true} />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="custName" style={{ marginBottom: 10 }}>
                    <Input placeholder="收货人" allowClear={true} />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="custMobile" style={{ marginBottom: 10 }}>
                    <Input placeholder="手机号" allowClear={true} />
                  </Form.Item>
                </Col>
                {isShow ? (
                  <>
                    <Col span={3}>
                      <Form.Item style={{ marginBottom: 10 }} name="provinceCode">
                        <Select
                          placeholder="请选择省"
                          showSearch
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onChange={getEparchyListByProvince}
                          allowClear={true}
                        >
                          {provinceList &&
                            provinceList.map((item, ind) => {
                              return (
                                <Option key={ind} value={item.regionCode}>
                                  {item.regionName}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item style={{ marginBottom: 10 }} name="eparchyCode">
                        <Select
                          placeholder="请选择市"
                          showSearch
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onChange={getCityListByEparchy}
                          allowClear={true}
                        >
                          {eparchyListByProvinceList &&
                            eparchyListByProvinceList.map((item, ind) => {
                              return (
                                <Option key={ind} value={item.regionCode}>
                                  {item.regionName}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item style={{ marginBottom: 10 }} name="cityCode">
                        <Select placeholder="请选择区" allowClear={true}>
                          {cityListByEparchyList &&
                            cityListByEparchyList.map((item, ind) => {
                              return (
                                <Option key={ind} value={item.regionCode}>
                                  {item.regionName}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="address" style={{ marginBottom: 10 }}>
                        <Input placeholder="详细地址" allowClear={true} />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="goodsName" style={{ marginBottom: 10 }}>
                        <Input placeholder="商品名称" allowClear={true} />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="tradeMode" style={{ marginBottom: 10 }}>
                        <Select placeholder="商品类型" allowClear={true}>
                          <Option value="GENERAL">一般贸易</Option>
                          <Option value="THIRD_PARTY">第三方商品</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="firstGroupCode" style={{ marginBottom: 10 }}>
                        <Select placeholder="商品一级分类" onChange={typeIdChange} allowClear={true}>
                          {goodsTypeList &&
                            goodsTypeList.length > 0 &&
                            goodsTypeList.map((obj) => (
                              <Select.Option key={obj.id} value={obj.groupCode}>
                                {obj.groupName}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="secondGroupCode" style={{ marginBottom: 10 }}>
                        <Select placeholder="商品二级分类" allowClear={true}>
                          {goodsTypeList2 &&
                            goodsTypeList2.length > 0 &&
                            goodsTypeList2.map((obj) => (
                              <Select.Option key={obj.id} value={obj.groupCode}>
                                {obj.groupName}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="tradeType" style={{ marginBottom: 10 }}>
                        <Select placeholder="订单类型" allowClear={true}>
                          {orders &&
                            orders.length > 0 &&
                            orders.map((r) => (
                              <Option key={r.codeKey} value={r.codeKey}>
                                {r.codeValue}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="activeType" style={{ marginBottom: 10 }}>
                        <Select placeholder="活动类型" allowClear={true}>
                          <Option value="PRE_SALE_ACTIVE">商品预售</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="activeName" style={{ marginBottom: 10 }}>
                        <Input placeholder="活动名称" allowClear={true} />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="tradeSplitBillType" style={{ marginBottom: 10 }}>
                        <Select placeholder="订单分账" allowClear={true}>
                          {accountType.map((r) => (
                            <Option key={r.codeKey} value={r.codeKey}>
                              {r.codeValue}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="expressStatus" style={{ marginBottom: 10 }}>
                        <Select placeholder="物流状态" allowClear={true}>
                          {expressStatus.map((r) => (
                            <Option key={r.codeKey} value={r.codeKey}>
                              {r.codeValue}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name="tradeStatus" style={{ marginBottom: 10 }}>
                        <Select placeholder="订单状态" allowClear={true} mode="multiple">
                          {tradeStatus.map((r) => (
                            <Option key={r.codeKey} value={r.codeKey}>
                              {r.codeValue}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                ) : null}

                <Col>
                  <Button style={{ borderRadius: 8 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                    重置
                  </Button>
                  <Button style={{ borderRadius: 8, marginLeft: 10 }} type="primary" size="middle" htmlType="submit">
                    查询
                  </Button>
                </Col>
                <Col>
                  <Button
                    style={{ borderRadius: 8 }}
                    onClick={() => {
                      clickExport(1)
                    }}
                    className="buttonNoSize"
                    size="middle"
                  >
                    导出
                  </Button>
                </Col>
                {haveCtrlElementRight('ddgl-piliangfahuo-btn') && (
                  <Col>
                    <Button onClick={() => setVisible(true)} style={{ borderRadius: 8 }} className="buttonNoSize" size="middle">
                      批量发货
                    </Button>
                  </Col>
                )}
                {haveCtrlElementRight('ddgl-tradeExport-btn') && (
                  <Col>
                    <Button
                      style={{ borderRadius: 8 }}
                      onClick={() => {
                        clickExport(2)
                      }}
                      className="buttonNoSize"
                      size="middle"
                    >
                      订单导出
                    </Button>
                  </Col>
                )}
                {haveCtrlElementRight('ddgl-tradeExport-btn') && (
                  <Col>
                    <Button
                      style={{ borderRadius: 8 }}
                      onClick={() => {
                        pendingExport()
                      }}
                      className="buttonNoSize"
                      size="middle"
                    >
                      待发货订单导出
                    </Button>
                  </Col>
                )}
                <a onClick={toggleSearch} style={{ margin: '6px 5px 0' }}>
                  {isShow ? '精简模式' : '精确模式'}
                  {isShow ? <UpOutlined /> : <DownOutlined />}
                </a>
              </Row>
            </div>
          </Form>
        </div>

        <Table
          style={{ margin: '23px  20px' }}
          rowClassName={useGetRow}
          className="components-table-demo-nested"
          rowKey="id"
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
          bordered
          columns={columns}
          scroll={{ x: 1800 }}
          dataSource={tradeList}
          expandable={{
            expandedRowRender,
          }}
        />
      </div>

      {/*//备注界面*/}
      <Modal destroyOnClose={true} centered={true} title="买家备注" visible={remark} onCancel={() => setremark(false)} width="600px" footer={null} className="positionre">
        <>
          <Form name="basic" onFinish={remarkOnFinish}>
            <Form.Item name="processNote" rules={[{ required: true, message: '请输入备注' }]}>
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button style={{ borderRadius: '4px' }} className="rr10" type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      {/*//取消订单*/}
      <Modal destroyOnClose={true} centered={true} title="取消订单" visible={noOrder} onCancel={() => setnoOrder(false)} width="600px" footer={null} className="positionre">
        <>
          <Form name="basic" onFinish={orderOnFinishNO}>
            <Form.Item name="resultNote" rules={[{ required: true, message: '请输入取消原因' }]}>
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button style={{ borderRadius: '4px' }} className="rr10" type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      {/*///发货界面*/}
      <Modal destroyOnClose={true} title="订单发货" visible={consignment} onCancel={() => setconsignment(false)} width="600px" footer={null} className="positionre">
        <>
          <Form {...orderlayout} name="basic" onFinish={orderOnFinish}>
            <Form.Item label="收货人" style={{ marginBottom: -0 }}>
              {orderdata ? orderdata.custName : ''}
            </Form.Item>

            <Form.Item label="收货地址" style={{ marginBottom: 8 }}>
              {orderdata ? orderdata.provinceName + orderdata.eparchyName + orderdata.cityName + orderdata.address : ''}
            </Form.Item>

            <Form.Item name="expressCompany" label="物流公司" rules={[{ required: true, message: '请选择物流公司' }]}>
              <Select placeholder="请选择一个物流公司" allowClear={true} showSearch filterOption={false} onSearch={handleChange}>
                {expressCompany.map((r) => (
                  <Option key={r.expressNo} value={r.expressNo}>
                    {r.expressName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="expressNo" label="物流单号" rules={[{ required: true, message: '请输入物流单号' }]}>
              <Input placeholder="请输入真实的物流单号" />
            </Form.Item>

            <Form.Item>
              <Button style={{ borderRadius: '4px' }} className="rr10" type="primary" htmlType="submit">
                发货
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      {/*///核实物流*/}
      <Modal destroyOnClose={true} title="核实物流" visible={verifyLogistics} onCancel={() => setverifyLogistics(false)} width="600px" footer={null} className="positionre">
        <>
          <Form {...layout} name="basic" onFinish={logisticsFinish}>
            <Form.Item label="物流公司">{verifyData ? verifyData.expressCompanyName : ''}</Form.Item>

            <Form.Item label="物流单号">
              <span
                id="logistics"
                onClick={() => {
                  copy('logistics')
                }}
              >
                {verifyData ? verifyData.expressNo : ''}
                <span>
                  <CopyOutlined style={{ width: 40 }} />
                </span>
              </span>
            </Form.Item>
            <Form.Item label="物流状态">{verifyData ? verifyData.tradeStatusName : ''}</Form.Item>

            <Form.Item name="expressStatus" label="操&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作" initialValue={3}>
              <Radio.Group>
                <Radio
                  onClick={() => {
                    setLogisticsShow(false)
                  }}
                  value={2}
                >
                  置为正常状态
                </Radio>
                <Radio
                  onClick={() => {
                    setLogisticsShow(true)
                  }}
                  value={3}
                >
                  更新物流信息
                </Radio>
              </Radio.Group>
            </Form.Item>

            {logisticsShow ? (
              <>
                <Form.Item name="expressCompany" label="物流公司" wrapperCol={{ span: 8 }} rules={[{ required: true, message: '请选择物流公司' }]}>
                  <Select placeholder="请选择一个物流公司" allowClear={true} showSearch filterOption={false} onSearch={handleChange}>
                    {expressCompany.map((r) => (
                      <Option key={r.expressNo} value={r.expressNo}>
                        {r.expressName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 8 }} name="expressNo" label="物流单号" rules={[{ required: true, message: '请输入物流单号' }]}>
                  <Input placeholder="请输入真实的物流单号" />
                </Form.Item>
              </>
            ) : (
              ''
            )}

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{ borderRadius: '4px', marginLeft: 130 }} onClick={() => setverifyLogistics(false)} type="primary">
                取消
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      {/*批量发货*/}
      <Modal
        destroyOnClose={true}
        title="批量发货"
        onCancel={() => {
          setVisible(false)
          setVisibleResult(true)
          setVisibleLoding(false)
          clearInterval(myVar)
          if (!visibleResult) {
            onFinish()
          }
        }}
        visible={visible}
        width="600px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form {...layout} name="basic" onFinish={visibleFinish}>
            {visibleResult ? (
              <>
                <Form.Item wrapperCol={{ span: 8 }} label="物流公司编码表">
                  <div
                    onClick={() => {
                      window.location.href = 'https://filedown.bld365.com/saas/%E7%89%A9%E6%B5%81%E5%85%AC%E5%8F%B8%E7%BC%96%E7%A0%81%E5%8F%82%E7%85%A7%E8%A1%A8.xlsx'
                    }}
                    className="formwork"
                  >
                    <DownloadOutlined />
                    下载
                  </div>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 8 }} name="expressNo" label="批 &nbsp;量&nbsp;发&nbsp;货&nbsp;信&nbsp;息" rules={[{ required: true, message: '请上传批量发货信息' }]}>
                  <Upload type="EXPRESS_TRADE" length={1} />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item wrapperCol={{ span: 10, offset: 6 }}>
                  <div>本次订单批量发货成功操作{visibleNumber}笔订单!</div>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 10, offset: 6 }}>
                  <div id="lose">
                    <div
                      onClick={() => {
                        copy('lose')
                      }}
                    >
                      失败订单:<a>点击复制</a>
                    </div>
                    <div
                      style={{
                        overflowY: 'auto',
                        height: 200,
                        marginLeft: 48,
                        marginTop: 12,
                      }}
                    >
                      {visibleData.map((r) => {
                        return (
                          <pre>
                            {' '}
                            <span>{r}</span>
                          </pre>
                        )
                      })}
                    </div>
                  </div>
                </Form.Item>
              </>
            )}

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Form.Item
                shouldUpdate={(prevValues, curValues) => {
                  return !!prevValues && !!curValues && curValues?.expressNo && curValues?.expressNo.length && curValues.expressNo[0]?.status === 'done'
                }}
              >
                {({ getFieldValue }) => {
                  const expressNo = getFieldValue('expressNo')
                  return (
                    <>
                      <Button
                        loading={visibleLoding}
                        disabled={visibleLoding || !(expressNo && expressNo.length && expressNo[0]?.status === 'done')}
                        style={{ borderRadius: '4px' }}
                        type="primary"
                        htmlType="submit"
                      >
                        {visibleResult ? '确定' : '继续批量发货'}
                      </Button>
                      <Button
                        style={{ borderRadius: '4px', marginLeft: 80 }}
                        onClick={() => {
                          setVisible(false)
                          setVisibleResult(true)
                          clearInterval(myVar)
                          if (!visibleResult) {
                            onFinish()
                          }
                        }}
                        type="primary"
                      >
                        取消
                      </Button>
                    </>
                  )
                }}
              </Form.Item>
            </Form.Item>
          </Form>
        </>
      </Modal>

      {/*导出*/}
      <Modal className="positionre" title="导出" visible={isShowExportModal} destroyOnClose={true} onCancel={closeExportModal} width="800px" height="600px" footer={null}>
        <>
          <Form name="basic" onFinish={exportFinish}>
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
              <Button style={{ borderRadius: '4px', marginLeft: 130 }} onClick={closeExportModal} type="primary">
                关闭
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      <Modal
        destroyOnClose={true}
        title="分账明细"
        onCancel={() => {
          setAccountShow(false)
        }}
        visible={accountShow}
        // width="500px"
        // height="500px"
        footer={null}
        className="positionre"
      >
        <>
          <Form form={accountForm}>
            <Row>
              <Col span={16} offset={1}>
                <Form.Item label="订单金额" name="payFeeStr" style={{ marginBottom: 8 }}>
                  <Input bordered={false} readOnly={true} />
                </Form.Item>
              </Col>
              <Col span={16} offset={1}>
                <Form.Item label="平台服务费(%)" name="splitBillPct" style={{ marginBottom: 8 }}>
                  <Input bordered={false} readOnly={true} />
                </Form.Item>
              </Col>
              <Col span={16} offset={1}>
                <Form.Item label="分账状态" name="statusName" style={{ marginBottom: 8 }}>
                  <Input bordered={false} readOnly={true} />
                </Form.Item>
              </Col>
              <Col span={16} offset={1}>
                <Form.Item label="分账结果说明" name="resultNote" style={{ marginBottom: 8 }}>
                  <Input bordered={false} readOnly={true} />
                </Form.Item>
              </Col>
              <Col span={16} offset={1}>
                <Form.Item label="回退单状态名称" name="statusNameReturn" style={{ marginBottom: 8 }}>
                  <Input bordered={false} readOnly={true} />
                </Form.Item>
              </Col>
              <Col span={16} offset={1}>
                <Form.Item label="回退结果说明" name="resultNoteReturn" style={{ marginBottom: 8 }}>
                  <Input bordered={false} readOnly={true} />
                </Form.Item>
              </Col>

              <Table
                style={{ margin: '23px  20px', width: '100%' }}
                rowClassName={useGetRow}
                className="components-table-demo-nested"
                pagination={false}
                bordered
                columns={accountColumns}
                dataSource={accountData}
              />
            </Row>
          </Form>
        </>
      </Modal>
    </div>
  )
}

export default orderManage
