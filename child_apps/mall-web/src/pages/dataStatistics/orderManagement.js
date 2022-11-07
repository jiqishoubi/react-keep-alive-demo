import { Form, DatePicker, Input, Select, Space, Button, Table, message, Modal, Radio } from 'antd'
import moment from 'moment'
import { getToday, getMouth } from '@/utils/utils'
import React, { useEffect, useState } from 'react'
import { getSysCodeByParam } from '@/services/common'
import Upload from '@/components/T-Upload4'
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
} from '@/services/order'
import requestw from '@/utils/requestw'

import locale from 'antd/lib/date-picker/locale/zh_CN'
import debounce from 'lodash/debounce'
import { querySupplierList } from '@/services/channel'
import 'moment/locale/zh-cn'
import { useGetRow } from '@/hooks/useGetRow'

import Logistics from '@/components/order/Logistics'
import { CopyOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UploadImg from '@/components/T-Upload2'
import router from 'umi/router'

moment.locale('zh-cn')

function orderManage() {
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  }
  const { RangePicker } = DatePicker
  const { Option } = Select
  const { TextArea } = Input
  const [form] = Form.useForm()
  const [tradeList, settradeList] = useState([])
  //物流信息
  const [orderlogistics, setorderlogistics] = useState(false)
  //时间类型
  const [timeList, settimeList] = useState([])
  //订单状态
  const [tradeStatus, settradeStatus] = useState([])
  //支付状态
  const [payStatus, setpayStatus] = useState([])
  //物流状态
  const [expressStatus, setexpressStatus] = useState([])
  //expressCompany物流公司
  const [expressCompany, setexpressCompany] = useState([])
  //init
  const [init, setinit] = useState(true)
  //详情页面
  const [orderinit, setorderinit] = useState(false)
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
  ])
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  //supplierData供应商数据
  const [supplierData, setsupplierData] = useState([])
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState('')
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
  //s时间变化存储
  const [dates, setDates] = useState([])
  //订单类型
  const [orders, setorders] = useState([])
  //详情页table数据
  //duotable
  const [tableShow, settableShow] = useState(false)
  const [goodsList, setgoodsList] = useState([])
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

  const [educe, seteduce] = useState(false)

  const [myVar, setmyVar] = useState()
  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)
  const [visibleNumber, setVisibleNumber] = useState(false)
  //优惠券信息

  const [couponData, setCouponData] = useState()

  const orderlayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }
  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
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

  useEffect(() => {
    initTradePage_()
    //获取订单状态
    getSysCodeByParam_('TRADE_STATUS').then((res) => {
      if (res && res.code === '0') {
        settradeStatus(res.data)
      }
    })
    //支付状态
    getSysCodeByParam_('TRADE_PAY_STATUS').then((res) => {
      if (res && res.code === '0') {
        setpayStatus(res.data)
      }
    })
    // 物流状态
    getSysCodeByParam_('TRADE_EXPRESS_STATUS').then((res) => {
      if (res && res.code === '0') {
        res.data.shift()
        setexpressStatus(res.data)
      } else {
      }
    })

    // 物流公司
    getExpressQuery_()
    //供应商
    createSupplier_()
    //订单类型
    getSysCodeByParam_('TRADE_TYPE').then((res) => {
      if (res && res.code === '0') {
        setorders(res.data)
      } else {
      }
    })
    getPagingList_()
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

  function orderSubmitFunc(e) {
    chinaPortTrade({
      tradeNo: e.tradeNo || '',
    }).then((res) => {
      if (res && res.code === '0') {
        message.success('提交成功')
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }
  //表单数据
  async function onFinish(values) {
    if (!values['times']) {
      values['startDate'] = getMouth()
      values['endDate'] = getToday()
      delete values.times
    } else {
      values['startDate'] = values['times'][0].format('YYYY-MM-DD')
      values['endDate'] = values['times'][1].format('YYYY-MM-DD')
      delete values.times
    }

    delete values.page
    let news = JSON.stringify(values)

    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['page'] = 1
    } else {
      values['page'] = pageNum
    }

    if (values.address) {
      values[values.address.province] = values.address.street
      delete values.address
    }

    setloading(true)

    values['rows'] = pageSize
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
    let res = await requestw({
      url: '/web/trade/getSpecialTradeList',
      data: values,
    })
    if (res && res.code === '0') {
      settradeList(res.data.data)
      setloading(false)
      settableListTotalNum(res.data.rowTop)
    } else {
      settableListTotalNum(0)
      message.error(res.message)
      resetSearch()
    }
    setloading(false)
  }

  const [columns] = useState([
    {
      title: '商品图片',
      align: 'center',
      render: (v) => {
        return <>{v.tradeGoodsList && v.tradeGoodsList[0] ? <img style={{ width: '80px', height: '80px' }} src={v.tradeGoodsList[0].skuImg} /> : ''}</>
      },
    },
    {
      title: '商品名称',
      align: 'center',
      render: (v) => {
        return <>{v.tradeGoodsList[0] ? <div>{v.tradeGoodsList[0].goodsName}</div> : ''}</>
      },
    },

    {
      dataIndex: 'tradeTypeName',
      title: '订单类型',
      align: 'center',
      key: 'key',
    },

    {
      dataIndex: 'tradeNo',
      title: '订单号',
      align: 'center',
    },
    {
      dataIndex: 'tradeDateStr',
      title: '下单时间',
      align: 'center',
    },
    {
      align: 'center',

      title: '总价(元)',
      render: (e) => {
        return <>{e.tradeFeeStr ? e.tradeFeeStr : ''}</>
      },
    },
    {
      align: 'center',
      dataIndex: 'custName',
      title: '买家/收货人',
    },
    {
      align: 'center',
      dataIndex: 'custMobile',
      title: '手机号',
    },
    {
      align: 'center',
      dataIndex: 'tradeStatusName',
      title: '订单状态',
    },
    {
      align: 'center',
      title: '物流状态',
      render: (e) => {
        return e.tradeStatusName !== '交易关闭' ? (e.tradeStatusName !== '待发货' ? (e.tradeTypeName !== '主订单' ? (e.expressStatus === '3' ? '异常' : '正常') : '--') : '--') : '--'

        // e.tradeTypeName !== '主订单' || e.tradeStatusName!=='交易关闭'
      },
    },
    {
      align: 'center',
      dataIndex: 'tradeModeName',
      title: '商品类型',
    },
    {
      align: 'center',
      dataIndex: 'warehouseName',
      title: '保税仓',

      render: (v) => {
        let cang = '---'
        if (v) {
          cang = v
        }

        return <>{cang}</>
      },
    },

    {
      align: 'center',
      title: '操作',
      fixed: 'right',
      render: (e) => {
        return (
          <div>
            <div>
              <a
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  getTradeInfo_(e)
                }}
              >
                详情
              </a>
              {/* &nbsp;&nbsp;&nbsp;&nbsp;
              {e.tradeTypeName !== '主订单' ? (
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    remarlshow(e);
                  }}
                >
                  备注
                </a>
              ) : (
                ''
              )} */}
            </div>
            {/* {e.tradeStatusName === '待发货' && e.tradeTypeName !== '主订单' ? (
              <Button
                style={{ marginTop: 10 }}
                onClick={() => {
                  orderOnFinishow(e);
                }}
              >
                发货
              </Button>
            ) : (
              ''
            )} */}
            {/* {e.tradeMode === 'INTERNATION' &&
            e.tradeStatus === '50' &&
            e.chinaPortStatus === '0' ? (
              <Button
                style={{ marginTop: 10 }}
                type="link"
                onClick={() => {
                  orderSubmitEvent(e);
                }}
              >
                报关
              </Button>
            ) : (
              ''
            )} */}
            {/* {e.tradeStatusName === '已发货' &&
            e.tradeTypeName !== '主订单' &&
            e.expressStatus === '3' ? (
              <Button
                style={{ marginTop: 10 }}
                onClick={() => {
                  verifyLogisticsShow(e);
                }}
              >
                核实物流
              </Button>
            ) : (
              ''
            )} */}
          </div>
        )
      },
    },
  ])
  const [tablecolumns] = useState([
    {
      title: '商品图片',
      className: 'datumsShow',
      align: 'center',
      width: '14%',
      render: (v) => {
        return <>{v ? <img style={{ width: '80px', height: '80px', marginRight: '10px' }} src={v.skuImg} /> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '14%',
      title: '商品名称',
      align: 'center',
      render: (v) => {
        return <>{v ? <div>{v.goodsName}</div> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '14%',
      title: '商品规格',
      align: 'center',
      render: (v) => {
        return <>{v ? <div>{v.goodsPropertyStr}</div> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '14%',
      dataIndex: 'supplierName',
      title: '供应商',
      align: 'center',
      key: 'key',
    },
    {
      className: 'datumsShow',
      width: '14%',
      dataIndex: 'tradeModeName',
      title: '商品类型',
      align: 'center',
      key: 'key',
    },
    {
      className: 'datumsShow',
      width: '14%',
      dataIndex: 'warehouseName',
      title: '保税仓',
      align: 'center',
      key: 'key',
      render: (v) => {
        return <>{v ? v : '---'}</>
      },
    },
    {
      className: 'datumsShow',
      align: 'center',
      width: '14%',
      title: '单价(元)/数量',
      render: (e) => {
        return (
          <>
            {e.skuPriceStr ? e.skuPriceStr : ''}
            <span>/</span>
            {e ? e.skuCount : ''}
          </>
        )
      },
    },
  ])
  const [oldcolumns] = useState([
    {
      title: '商品图片',
      className: 'datumsShow',
      align: 'center',
      width: '20%',
      render: (v) => {
        return <>{v ? <img style={{ width: '80px', height: '80px', marginRight: '10px' }} src={v.skuImg} /> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '20%',
      title: '商品名称',
      align: 'center',
      render: (v) => {
        return <>{v ? <div>{v.goodsName}</div> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '20%',
      dataIndex: 'tradeNo',
      title: '订单号',
      align: 'center',
      key: 'key',
    },
    {
      className: 'datumsShow',
      width: '20%',
      dataIndex: 'supplierName',
      title: '供应商',
      align: 'center',
      key: 'key',
    },

    {
      className: 'datumsShow',
      align: 'center',
      width: '20%',
      title: '单价(元)/数量',
      render: (e) => {
        return (
          <>
            {e.skuPriceStr ? e.skuPriceStr : ''}
            <span>/</span>
            {e ? e.skuCount : ''}
          </>
        )
      },
    },
  ])

  //点击查看详情
  async function getTradeInfo_(e) {
    let tradeNo = e.tradeNo
    // let res = await getTradeInfo({ tradeNo: tradeNo });
    let res = await requestw({
      url: '/web/trade/getSpecialTradeInfo',
      data: {
        tradeNo: tradeNo,
      },
    })
    if (res && res.code === '0') {
      // subTradeList
      if (res.data.tradeStatusName === '交易完成' && res.data.tradeTypeName === '主订单') {
        setorderdata(res.data)
        settableShow(true)
        setinit(false)
        setorderinit(true)

        setgoodsList(res.data.subTradeList)
      } else {
        let data = res.data.tradeGoodsList.map((r) => {
          return { ...res.data, ...r }
        })
        setgoodsList(data)
        settableShow(false)
        setorderdata(res.data)
        setinit(false)
        setorderinit(true)
      }
    } else {
      message.error(res.message)
    }

    let couponRes = await getTicketDetailByTradeNo({ tradeNo: tradeNo })

    if (couponRes && couponRes.code === '0' && couponRes.data) {
      setCouponData(couponRes.data)
    }
  }

  //remarkshow
  function remarlshow(e) {
    setremark(true)

    setorderdata(e)
  }

  //remarkOnFinish添加备注

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

  //订单发货是否显示(2)
  function orderOnFinishows(e) {
    setconsignment(true)
  }

  //订单发货
  //
  async function orderOnFinish(values) {
    if (orderdata.tradeStatus === '50') {
      values['tradeNo'] = orderdata.tradeNo
      let res = await expressTrade(values)
      if (res && res.code === '0') {
        setconsignment(false)
        setinit(true)
        message.success('发货成功')
        setTimeout(() => {
          document.getElementById('orderManageinit').click()
        }, 100)
      } else {
        message.error(res.message)
      }
    } else {
      message.error('订单不可操作')
    }
  }

  //主动退款
  //
  async function orderOnFinishNO(values) {
    if (orderdata.tradeStatus === '50' || orderdata.tradeStatus === '10') {
      values['tradeNo'] = orderdata.tradeNo
      let res = await cancelTrade(values)
      if (res && res.code === '0') {
        setnoOrder(false)
        setorderinit(false)
        setinit(true)
        message.success(res.message)
        setTimeout(() => {
          document.getElementById('orderManageinit').click()
        }, 100)
      } else {
        message.error(res.message)
      }
    } else {
      message.error('订单不可操作')
    }
  }

  ///取消订单
  function calceorder() {
    setnoOrder(true)
  }
  //

  //主页面是否显示
  function initshow() {
    setinit(true)
    setorderinit(false)
  }
  //重置一下
  function resetSearch() {
    form.resetFields()
  }
  //点击改变页数
  useEffect(() => {
    document.getElementById('orderManageinit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  //点击查看物流
  function logidticsClick() {
    setorderlogistics(true), setorderinit(false)
  }
  //子组件回流
  function onlogistics() {
    setorderlogistics(false), setorderinit(true)
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

  //供应商查询
  async function createSupplier_(value) {
    let data = { orgName: value }
    let res = await querySupplierList(data)
    if (res && res.code === '0') {
      {
        res.data !== null ? setsupplierData(res.data) : setsupplierData([])
      }
    }
  }

  //供应商防抖
  const sudelayedChange = debounce(createSupplier_, 800)
  //供应商输入框改变
  const suhandleChange = (event) => {
    sudelayedChange(event)
  }

  //核实物流提交
  const logisticsFinish = async (values) => {
    values['tradeNo'] = verifyData.tradeNo
    let res = await updateTradeExpress(values)
    if (res && res.code === '0') {
      message.success(res.message)
      setverifyLogistics(false)
      onFinish({})
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

          setVisibleData(oldData)
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

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = JSON.parse(oldData)

    if (value.address) {
      value[value.address.province] = value.address.street
      delete value.address
    }

    let res = await getTrade(value)
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
  return (
    <div>
      {orderlogistics ? <Logistics onlogistics={onlogistics} orderValue={orderdata} /> : ''}

      {init ? (
        <div className="headBac">
          <div className="positionre" style={{ marginLeft: '20px' }}>
            <Form style={{ border: '1px solid #FEFFFE' }} form={form} name="basic" onFinish={onFinish}>
              <div>
                <div className="flexjss" style={{ border: '1px solid #FEFFFE', marginTop: '23px' }}>
                  <Form.Item initialValue="TRADE" name="dateType" style={{ width: 220, marginRight: '10px' }}>
                    <Select
                      showArrow={true}
                      // showArrow={true}
                      placeholder="时间类型"
                      allowClear={true}
                    >
                      {timeList.map((r) => (
                        <Option key={r.value} value={r.value}>
                          {r.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="times" initialValue={[moment(getMouth(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]} style={{ width: 260, marginRight: '10px' }}>
                    <RangePicker
                      onCalendarChange={(value) => {
                        setDates(value)
                      }}
                      showToday={true}
                      locale={locale}
                      allowClear={true}
                    />
                  </Form.Item>

                  <Form.Item name="tradeStatus" style={{ width: 220, marginRight: '10px' }}>
                    <Select showArrow={true} placeholder="订单状态" allowClear={true}>
                      {tradeStatus.map((r) => (
                        <Option key={r.codeKey} value={r.codeKey}>
                          {r.codeValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="expressStatus" style={{ width: 230, marginRight: '10px' }}>
                    <Select showArrow={true} placeholder="物流状态" allowClear={true}>
                      {expressStatus.map((r) => (
                        <Option key={r.codeKey} value={r.codeKey}>
                          {r.codeValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="custMobile" style={{ width: '220px', marginRight: '10px' }}>
                    <Input placeholder="手机号" style={{ width: '220px' }} />
                  </Form.Item>
                  <Form.Item name="custName" style={{ width: '220px', marginRight: '10px' }}>
                    <Input placeholder="收货人" style={{ width: '220px' }} />
                  </Form.Item>

                  <Form.Item name="tradeType" style={{ width: 220, marginRight: '10px' }}>
                    <Select
                      showArrow={true}
                      // showArrow={true}
                      placeholder="订单类型"
                      allowClear={true}
                    >
                      {orders.map((r) => (
                        <Option key={r.codeKey} value={r.codeKey}>
                          {r.codeValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="supplierCode" style={{ width: '220px', marginRight: '10px' }}>
                    <Select listItemHeight={10} listHeight={250} showArrow={true} placeholder="输入供应商关键字查询" allowClear={true} showSearch filterOption={false} onSearch={suhandleChange}>
                      {supplierData.map((r) => (
                        <Option key={r.orgCode} value={r.orgCode}>
                          {r.orgName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="tradeMode" style={{ width: '220px', marginRight: '10px' }}>
                    <Select
                      listItemHeight={10}
                      listHeight={250}
                      showArrow={true}
                      placeholder="订单商品类型"
                      allowClear={true}
                      showSearch
                      filterOption={false}
                      // onSearch={suhandleChange}
                    >
                      <Option value="GENERAL">一般贸易</Option>
                      <Option value="THIRD_PARTY">第三方商品</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="warehouseCode" style={{ width: '220px', marginRight: '10px' }}>
                    {/* <Input placeholder="请输入保税仓编号" style={{ width: '180px' }} /> */}
                    <Select
                      listItemHeight={10}
                      listHeight={250}
                      showArrow={true}
                      placeholder="请选择保税仓"
                      allowClear={true}
                      showSearch
                      filterOption={false}
                      // onSearch={suhandleChange}
                    >
                      <Option value="WHBEIJINGTIANZHU001">北京保税仓</Option>
                      <Option value="WHNINGBOYONG001">宁波保税仓</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ marginRight: '10px' }}>
                    <Input.Group compact>
                      <Form.Item initialValue="tradeNo" name={['address', 'province']} noStyle>
                        <Select
                          showArrow={true}
                          initialValues="tradeNo"
                          // initialValue=""
                          placeholder="订单搜索"
                          allowClear={true}
                        >
                          {orderTrade.map((r) => (
                            <Option key={r.value} value={r.value ? r.value : 'tradeNo'}>
                              {r.key}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name={['address', 'street']} style={{ width: '180px' }}>
                        <Input placeholder="请输入" style={{ width: '180px' }} />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                  <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                    重置
                  </Button>
                  <Button style={{ borderRadius: '4px' }} id="orderManageinit" type="primary" size="middle" htmlType="submit">
                    查询
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          <div>
            <Table
              style={{ margin: '23px  20px' }}
              rowClassName={useGetRow}
              pagination={paginationProps}
              onChange={pageChange}
              loading={loading}
              columns={columns}
              scroll={{ x: 1400 }}
              dataSource={tradeList}
            />
            {/*<div>{tableListTotalNum ? <p className="allNums_">共{tableListTotalNum}条</p> : ''}</div>*/}
          </div>
        </div>
      ) : (
        ''
      )}

      {orderinit ? (
        <div className="positionre">
          {/*<div style={{ fontSize: '14px', color: '#262626', background: '#F8F8F8' }}>基本信息</div>*/}
          <div className="fontMb">
            <div className="flexcolumnccc">
              <div style={{ marginRight: '40px', marginLeft: '18px' }}>
                <span style={{ marginRight: '2px' }}>订单编号：</span>
                <span>{orderdata ? orderdata.tradeNo : ''}</span>
              </div>
              <div style={{ marginRight: '40px' }}>
                <span style={{ marginRight: '2px' }}>下单时间：</span>
                <span>{orderdata ? orderdata.tradeDateStr : ''}</span>
              </div>
              <div style={{ marginRight: '40px' }}>
                <span style={{ marginRight: '2px' }}>完成时间：</span>
                <span>{orderdata ? orderdata.finishDateStr : ''}</span>
              </div>

              <div style={{ marginRight: '40px' }}>
                <span style={{ marginRight: '2px' }}>订单类型：</span>
                <span>{orderdata ? orderdata.tradeTypeName : ''}</span>
              </div>
              {orderdata && orderdata.tradeTypeName && orderdata.tradeTypeName === '子订单' ? (
                <div style={{ marginRight: '40px' }}>
                  <span style={{ marginRight: '2px' }}>父订单号：</span>
                  <span>{orderdata ? orderdata.batchNo : ''}</span>
                </div>
              ) : (
                ''
              )}

              <div className="rr20">
                {/* {orderdata && orderdata.tradeTypeName && orderdata.tradeTypeName !== '主订单' ? (
                  orderdata.tradeStatusName === '待发货' ? (
                    <Button
                      style={{ width: '100px', borderRadius: '4px', marginRight: 10 }}
                      onClick={orderOnFinishows}
                      type="primary"
                    >
                      发货
                    </Button>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )} */}

                {/* {orderdata && orderdata.tradeTypeName && orderdata.tradeTypeName !== '主订单' ? (
                  orderdata.tradeStatus === '50' || orderdata.tradeStatus === '10' ? (
                    <Button
                      style={{ width: '100px', borderRadius: '4px' }}
                      onClick={calceorder}
                      type="primary"
                    >
                      取消订单
                    </Button>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )} */}
              </div>
            </div>
          </div>
          <div className="fontMb">
            <div className="flexcolumncc  ">
              <div className="flex1jcc">
                <div className="marb10">
                  <span
                    style={{
                      fontSize: '14px',
                      marginLeft: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    收货人信息
                  </span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginLeft: '18px', width: '63px' }}>收&nbsp;&nbsp;货&nbsp;&nbsp;人:</span>
                  <span>{orderdata ? orderdata.custName : ''}</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginLeft: '18px', width: '63px' }}>联系电话:</span>
                  <span>{orderdata ? orderdata.custMobile : ''}</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginLeft: '18px', width: '63px' }}>收货地址:</span>
                  <div style={{ width: '210px' }}>{orderdata ? orderdata.provinceName + orderdata.eparchyName + orderdata.cityName + orderdata.address : ''}</div>
                </div>
              </div>

              <div className="flex1jcc">
                <div className="marb10">
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginRight: 10,
                    }}
                  >
                    配送信息
                  </span>
                  {orderdata ? orderdata.expressCompany ? <a onClick={logidticsClick}>查看物流详情</a> : '' : ''}
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>配送方式:</span>
                  <span>{orderdata ? orderdata.expressCompanyName : ''} </span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>物流单号:</span>
                  <span>{orderdata ? orderdata.expressNo : ''} </span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>配送时间:</span>
                  <span>{orderdata ? orderdata.expressDateStr : ''} </span>
                </div>
              </div>

              <div className="flex1jcc">
                <div className="marb10">
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>付款信息</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>实付金额:</span>
                  <span>{orderdata && (orderdata.payStatusName === '已支付' || orderdata.payStatusName === '已退费') ? orderdata.tradeFeeStr : ''}</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>付款状态:</span>
                  <span>{orderdata ? orderdata.payStatusName : ''}</span>
                </div>

                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>支付单号:</span>
                  <span>{orderdata ? orderdata.paymentNo : ''}</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>付款时间:</span>
                  <span>{orderdata ? orderdata.payDateStr : ''}</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>优惠券号:</span>
                  <span>{couponData ? couponData.ticketDetailNo : ''}</span>
                </div>
              </div>

              <div className="flex1jcc">
                <div className="marb10">
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>买家信息</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>买&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家:</span>
                  <span>{orderdata ? orderdata.custName : ''}</span>
                </div>
                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>买家留言:</span>
                  <span>{orderdata ? orderdata.remark : ''}</span>
                </div>

                <div className="marb5" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ marginRight: '6px', width: '63px' }}>订单说明:</span>
                  <span>{orderdata ? orderdata.resultNote : ''}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fefffe', margin: '0 20px' }}>
            {tableShow ? (
              goodsList.map((r) => {
                return (
                  <Table
                    footer={() => {
                      return (
                        <div className="flexjess">
                          <div style={{ width: '100%' }}>
                            <span style={{ marginRight: '6px' }}>商品总价:</span>
                            <span> {r.tradeFeeStr}</span>
                          </div>
                        </div>
                      )
                    }}
                    style={{ marginTop: '15px' }}
                    pagination={false}
                    columns={oldcolumns}
                    dataSource={r.tradeGoodsList}
                  />
                )
              })
            ) : (
              <Table
                style={{ marginTop: '15px' }}
                pagination={false}
                columns={tablecolumns}
                // dataSource={orderdata ? orderdata.tradeGoodsList ?orderdata.tradeGoodsList:[orderdata]: ''}
                dataSource={goodsList}
              />
            )}
          </div>

          {tableShow ? (
            ''
          ) : (
            <div className="flexjes">
              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>商品总价(元):</span>
                <span>{orderdata ? orderdata.tradeOriginalFeeStr : ''}</span>
              </div>

              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>优惠金额(元):</span>
                <span>{orderdata ? orderdata.tradeTicketFeeStr : '0.00'}</span>
              </div>

              {orderdata && (orderdata.payStatusName === '已支付' || orderdata.payStatusName === '已退费') ? (
                <div style={{ width: '100%' }}>
                  <span style={{ marginRight: '6px' }}>实付金额(元):</span>
                  <span>{orderdata.tradeFeeStr}</span>
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  <span style={{ marginRight: '6px' }}>待付金额(元):</span>
                  <span>{orderdata.tradeFeeStr}</span>
                </div>
              )}
            </div>
          )}
          <div>
            <Button
              style={{
                width: '100px',
                marginTop: '60px',
                marginLeft: 20,
                borderRadius: '4px',
              }}
              type="primary"
              onClick={initshow}
            >
              返回
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}

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
          {/*<div className="flex1jcc">*/}
          {/*  <div className="marb10" style={{ width: '444px' }}>*/}
          {/*    <span>配送信息</span>*/}
          {/*  </div>*/}
          {/*<div*/}
          {/*  style={{*/}
          {/*    width: '444px',*/}
          {/*    display: 'flex',*/}
          {/*    justifyContent: 'flex-start',*/}
          {/*    marginBottom: '10px',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <span style={{ width: '66px' }}>配送方式:</span>*/}
          {/*  <span>{orderdata ? orderdata.address : ''}</span>*/}
          {/*</div>*/}
          {/*  <div*/}
          {/*    style={{*/}
          {/*      width: '444px',*/}
          {/*      display: 'flex',*/}
          {/*      justifyContent: 'flex-start',*/}
          {/*      marginBottom: '10px',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <span style={{ width: '66px' }}>收货人:</span>*/}
          {/*    <span>{orderdata ? orderdata.custName : ''}</span>*/}
          {/*  </div>*/}
          {/*  <div*/}
          {/*    style={{*/}
          {/*      display: 'flex',*/}
          {/*      justifyContent: 'flex-start',*/}
          {/*      width: '444px',*/}
          {/*      marginBottom: '10px',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <span style={{ width: '66px' }}>收货地址:</span>*/}
          {/*    <span>*/}
          {/*      {orderdata*/}
          {/*        ? orderdata.provinceName +*/}
          {/*          orderdata.eparchyName +*/}
          {/*          orderdata.cityName +*/}
          {/*          orderdata.address*/}
          {/*        : ''}*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <Form {...orderlayout} name="basic" onFinish={orderOnFinish}>
            <Form.Item label="收货人" style={{ marginBottom: -0 }}>
              {orderdata ? orderdata.custName : ''}
            </Form.Item>

            <Form.Item label="收货地址" style={{ marginBottom: 8 }}>
              {orderdata ? orderdata.provinceName + orderdata.eparchyName + orderdata.cityName + orderdata.address : ''}
            </Form.Item>

            <Form.Item name="expressCompany" label="物流公司" rules={[{ required: true, message: '请选择物流公司' }]}>
              <Select
                showArrow={true}
                // showArrow={true}
                placeholder="请选择一个物流公司"
                allowClear={true}
                showSearch
                filterOption={false}
                onSearch={handleChange}
              >
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
                  <Select
                    showArrow={true}
                    // showArrow={true}
                    placeholder="请选择一个物流公司"
                    allowClear={true}
                    showSearch
                    filterOption={false}
                    onSearch={handleChange}
                  >
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
      {/*///批量发货*/}
      <Modal
        destroyOnClose={true}
        title="批量发货"
        onCancel={() => {
          setVisible(false)
          setVisibleResult(true)
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
          <Form {...layout} name="basic" onFinish={visibleFinish}>
            {visibleResult ? (
              <>
                <Form.Item wrapperCol={{ span: 8 }} label="批量发货信息模板">
                  <div
                    onClick={() => {
                      window.location.href = 'http://filedown.bld365.com/bld_mall/20180101010101/shangYao/批量发货模板.xls'
                    }}
                    className="formwork"
                  >
                    <DownloadOutlined />
                    模板下载
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
                      失败订单:
                    </div>
                    {visibleData.map((r) => {
                      return (
                        <>
                          <span>{r}</span>
                          <span>,</span>
                          <br />
                        </>
                      )
                    })}
                  </div>
                </Form.Item>
              </>
            )}

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={visibleLoding} disabled={visibleLoding} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                {visibleResult ? '确定' : '继续批量发货'}
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

      {/*导出*/}

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
              {/*<div>{tableListTotalNum ? <p className="allNums_">共{tableListTotalNum}条</p> : ''}</div>*/}
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

export default orderManage
