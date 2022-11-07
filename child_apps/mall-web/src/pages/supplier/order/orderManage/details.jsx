import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import debounce from 'lodash/debounce'
import 'moment/locale/zh-cn'
import { Form, Input, Select, Button, Table, message, Modal } from 'antd'
import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import { getTradeInfo, expressTrade, cancelTrade, getExpressListQuery, getTicketDetailByTradeNo } from '../../services/order'
import './index_localName.less'
import Logistics from '@/components/order/Logistics'
import { router } from 'umi'
moment.locale('zh-cn')

const { Option } = Select
const { TextArea } = Input

const Details = (props) => {
  const { tradeNo } = props.location.query

  //expressCompany物流公司
  const [expressCompany, setexpressCompany] = useState([])
  //唯一数据
  const [orderdata, setorderdata] = useState({})
  //consignment发货状态
  const [consignment, setconsignment] = useState(false)
  //t取消订单 展示
  const [noOrder, setnoOrder] = useState(false)
  //详情页table数据
  //duotable
  const [tableShow, settableShow] = useState(false)
  const [goodsList, setgoodsList] = useState([])

  //优惠券信息
  const [couponData, setCouponData] = useState()

  const [logisticsModal, setLogisticsModal] = useState(false)

  const orderlayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }

  useEffect(() => {
    if (tradeNo) {
      getTradeInfo_()
      // 物流公司
      getExpressQuery_()
    }
  }, [props.location.query])

  const tablecolumns = [
    {
      title: '商品图片',
      className: 'datumsShow',
      align: 'center',
      width: '12.5%',
      render: (v) => {
        return <>{v ? <img style={{ width: '80px', height: '80px', marginRight: '10px' }} src={v.skuImg} /> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '12.5%',
      title: '商品名称',
      align: 'center',
      render: (v) => {
        return <>{v ? <div>{v.goodsName}</div> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '12.5%',
      title: '商品规格',
      align: 'center',
      render: (v) => {
        return <>{v ? <div>{v.goodsPropertyStr}</div> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      width: '12.5%',
      dataIndex: 'tradeModeName',
      title: '商品类型',
      align: 'center',
      key: 'key',
    },
    {
      className: 'datumsShow',
      align: 'center',
      width: '12.5%',
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
  ]

  const oldcolumns = [
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
      width: '12%',
      title: '产品编码',
      align: 'center',
      dataIndex: 'skuProductId',
    },

    {
      className: 'datumsShow',
      width: '12.5%',
      title: '二级分类',
      align: 'center',
      dataIndex: 'secondGroupName',
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
  ]

  //点击查看详情
  async function getTradeInfo_() {
    const res = await getTradeInfo({ tradeNo: tradeNo })
    if (res && res.code === '0') {
      if (res.data.tradeStatusName === '交易完成' && res.data.tradeTypeName === '主订单') {
        setorderdata(res.data)
        settableShow(true)
        setgoodsList(res.data.subTradeList)
      } else {
        let data = res.data.tradeGoodsList?.map((r) => {
          return { ...res.data, ...r }
        })
        setgoodsList(data)
        settableShow(false)
        setorderdata(res.data)
      }
    } else {
      message.error(res.message)
    }

    let couponRes = await getTicketDetailByTradeNo({ tradeNo: tradeNo })

    if (couponRes && couponRes.code === '0' && couponRes.data) {
      setCouponData(couponRes.data)
    }
  }

  //订单发货
  async function orderOnFinish(values) {
    if (orderdata.tradeStatus === '50') {
      values['tradeNo'] = orderdata.tradeNo
      let res = await expressTrade(values)
      if (res && res.code === '0') {
        setconsignment(false)
        setinit(true)
        message.success('发货成功')
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
        setorderinit(false)
        setinit(true)
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    } else {
      message.error('订单不可操作')
    }
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

  /* 返回*/
  const goBack = () => {
    let pathname = '/web/supplier/trademgr/trademgr'

    router.push(pathname)
  }
  return (
    <div>
      <div className="positionre">
        <div className="fontMb">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {orderdata && orderdata.tradeTypeName && orderdata.tradeTypeName !== '主订单' ? (
              orderdata.tradeStatusName === '待发货' && haveCtrlElementRight('ddgl-fahuo-btn') ? (
                orderdata.tradeMode == 'INTERNATION' ? null : (
                  <Button style={{ width: 100, borderRadius: 8 }} onClick={() => setconsignment(true)} type="primary">
                    发货
                  </Button>
                )
              ) : null
            ) : null}
            {orderdata && orderdata.tradeTypeName && orderdata.tradeTypeName !== '主订单' ? (
              orderdata.tradeStatus === '50' || orderdata.tradeStatus === '10' ? (
                haveCtrlElementRight('ddgl-cancel-btn') ? (
                  <Button style={{ width: 100, borderRadius: 8, marginLeft: 10 }} onClick={() => setnoOrder(true)} type="primary">
                    取消订单
                  </Button>
                ) : null
              ) : null
            ) : null}
            <Button style={{ width: 100, borderRadius: 8, marginLeft: 10 }} type="primary" onClick={goBack}>
              返回
            </Button>
          </div>

          <div className="flex1jcc" style={{ height: 107 }}>
            <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ height: '66%', width: 5, background: '#519bf7' }}></div>
              <span
                style={{
                  fontSize: '14px',
                  marginLeft: '18px',
                  fontWeight: 'bold',
                }}
              >
                订单信息
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0 28px',
                borderBottom: '1px solid #D9D9D9',
              }}
            >
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>订单编号：</span>
                <span>{orderdata ? orderdata.tradeNo : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>清单编号：</span>
                <span>{orderdata ? orderdata.chinaPortInvtNo : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>订单类型：</span>
                <span>{orderdata ? orderdata.tradeTypeName : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>下单时间：</span>
                <span>{orderdata ? orderdata.tradeDateStr : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>完成时间：</span>
                <span>{orderdata ? orderdata.finishDateStr : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>订单状态：</span>
                <span>{orderdata ? orderdata.tradeStatusName : '---'}</span>
              </div>
              {orderdata && orderdata.tradeTypeName && orderdata.tradeTypeName === '子订单' ? (
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 2 }}>父订单号：</span>
                  <span>{orderdata ? orderdata.batchNo : '---'}</span>
                </div>
              ) : null}
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>退款原因：</span>
                <span>{orderdata ? orderdata.payResult : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>审核原因：</span>
                <span>{orderdata ? orderdata.processNote : '---'}</span>
              </div>
            </div>
          </div>
          {orderdata.ifDelivery === '0' ? null : (
            <>
              <div className="flex1jcc" style={{ height: 107 }}>
                <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ height: '66%', width: 5, background: '#519bf7' }}></div>
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

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: '0 28px',
                    borderBottom: '1px solid #D9D9D9',
                  }}
                >
                  <div className="marb10" style={{ display: 'flex', width: '25%' }}>
                    <span style={{ marginRight: 6 }}>收货人:</span>
                    {orderdata ? orderdata.custName : '---'}
                  </div>

                  <div className="marb10" style={{ display: 'flex', width: '25%' }}>
                    <span style={{ marginRight: 6 }}>联系电话:</span>
                    {orderdata ? orderdata.custMobile : '---'}
                  </div>

                  <div className="marb10" style={{ display: 'flex', width: '50%' }}>
                    <span style={{ marginRight: 6 }}>收货地址:</span>
                    {orderdata ? orderdata.provinceName + orderdata.eparchyName + orderdata.cityName + orderdata.address : '---'}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="flex1jcc" style={{ height: 107 }}>
            <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ height: '66%', width: 5, background: '#519bf7' }} />
              <span
                style={{
                  fontSize: '14px',
                  marginLeft: '18px',
                  fontWeight: 'bold',
                }}
              >
                付款信息
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0 28px',
                borderBottom: '1px solid #D9D9D9',
              }}
            >
              {orderdata?.tradeType === 'TRADE_PRE_SALE' ? (
                <>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>定金金额:</span>
                    {orderdata ? orderdata.totalPreSaleFeeStr : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>尾款金额:</span>
                    {orderdata ? orderdata.tradeEndFeeStr : '---'}
                  </div>
                </>
              ) : (
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>订单金额:</span>
                  {orderdata && (orderdata.payStatusName === '已支付' || orderdata.payStatusName === '已退费') ? orderdata.tradeFeeStr : '---'}
                </div>
              )}
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>付款状态:</span>
                {orderdata ? orderdata.payStatusName : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>支付单号:</span>
                {orderdata ? orderdata.paymentNo : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>微信支付单号:</span>
                {orderdata ? orderdata.paymentId : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>付款时间:</span>
                {orderdata ? orderdata.payDateStr : '---'}
              </div>
            </div>
          </div>

          <div className="flex1jcc" style={{ height: 107 }}>
            <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ height: '66%', width: 5, background: '#519bf7' }}></div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginLeft: '18px',
                }}
              >
                买家信息
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0 28px',
                borderBottom: '1px solid #D9D9D9',
              }}
            >
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>买 &nbsp; &nbsp; &nbsp;家:</span>
                <span>{orderdata ? orderdata.tradeUserName : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>买家手机号:</span>
                <span>{orderdata ? orderdata.tradeUserPhoneNumber : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>买家备注:</span>
                <span>{orderdata ? orderdata.remark : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>订单说明:</span>
                <span>{orderdata ? orderdata.resultNote : '---'}</span>
              </div>
            </div>
          </div>

          {orderdata?.tradeType === 'TRADE_PRE_SALE' ? (
            <div className="flex1jcc" style={{ height: 107, marginTop: 10 }}>
              <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: '66%', width: 5, background: '#519bf7' }}></div>
                <span
                  style={{
                    fontSize: '14px',
                    marginLeft: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  活动信息
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  margin: '0 28px',
                  borderBottom: '1px solid #D9D9D9',
                }}
              >
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>劵类型:</span>
                  <span>{(orderdata.tradeTicketList && orderdata.tradeTicketList[0] && orderdata.tradeTicketList[0].ticketType) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>卡劵名称:</span>
                  <span>{(orderdata.tradeTicketList && orderdata.tradeTicketList[0] && orderdata.tradeTicketList[0].ticketName) || '---'}</span>
                </div>

                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>面额:</span>
                  <span>{(orderdata.tradeTicketList && orderdata.tradeTicketList[0] && orderdata.tradeTicketList[0].ticketExplain) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>有效期:</span>
                  <span>
                    {orderdata ? orderdata.effectDateStr : '---'}
                    {orderdata.effectDateStr ? '至' : '---'}
                    {orderdata ? orderdata.expireDateStr : '---'}
                  </span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>适用品类:</span>
                  <span>{orderdata ? orderdata.resultNote : '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>优惠券号:</span>
                  <span>{(orderdata.tradeTicketList && orderdata.tradeTicketList[0] && orderdata.tradeTicketList[0].ticketCode) || '---'}</span>
                </div>
                <div style={{ width: '100%' }}></div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>活动名称:</span>
                  <span>{(orderdata.activeDTO && orderdata.activeDTO.activeName) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>活动类型:</span>
                  <span>{(orderdata.activeDTO && orderdata.activeDTO.activeTypeName) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>定金时间:</span>
                  {orderdata ? orderdata.preEndEffectDate + '至' + orderdata.preEndExpireDate : '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>尾款时间:</span>
                  {orderdata ? orderdata.preEffectDate + '至' + orderdata.preExpireDate : '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>尾款优惠方式:</span>
                  {orderdata ? orderdata.preEndDiscountType : '---'}
                </div>
              </div>
            </div>
          ) : null}
          {orderdata.ifDelivery === '0' ? null : (
            <>
              <div className="flex1jcc" style={{ height: 107, marginTop: 10 }}>
                <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ height: '66%', width: 5, background: '#519bf7' }} />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginLeft: '18px',
                    }}
                  >
                    配送信息
                  </span>
                  {orderdata && orderdata.expressCompany && <a onClick={() => setLogisticsModal(true)}>查看物流详情</a>}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: '0 28px',
                    borderBottom: '1px solid #D9D9D9',
                  }}
                >
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>物流公司:</span>
                    {orderdata ? orderdata.expressCompanyName : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>物流单号:</span>
                    {orderdata ? orderdata.expressNo : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>物流状态:</span>
                    {orderdata ? orderdata.expressStatusName : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>发货时间:</span>
                    {orderdata ? orderdata.expressDateStr : '---'}
                  </div>
                </div>
              </div>
            </>
          )}
          {orderdata.ifDelivery === '2' ? (
            <>
              <div className="flex1jcc" style={{ height: 107, marginTop: 10 }}>
                <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ height: '66%', width: 5, background: '#519bf7' }} />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginLeft: '18px',
                    }}
                  >
                    核销信息
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: '0 28px',
                    borderBottom: '1px solid #D9D9D9',
                  }}
                >
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>核销人:</span>
                    {orderdata ? orderdata.finishPersonName : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>手机号码:</span>
                    {orderdata ? orderdata.finishPersonPhoneNumber : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>核销时间:</span>
                    {orderdata ? orderdata.finishDateStr : '---'}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {orderdata.ifPrescription === '1' ? (
            <div className="flex1jcc" style={{ height: 107, marginTop: 10 }}>
              <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: '66%', width: 5, background: '#519bf7' }} />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginLeft: '18px',
                  }}
                >
                  处方药问诊信息
                </span>
                {orderdata && orderdata.prescriptionData && orderdata.prescriptionData.prescriptionImage && <a onClick={() => window.open(orderdata.prescriptionData.prescriptionImage)}>查看处方单</a>}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  margin: '0 28px',
                  borderBottom: '1px solid #D9D9D9',
                }}
              >
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>用药人姓名:</span>
                  {(orderdata && orderdata.prescriptionData && orderdata.prescriptionData.patientName) || '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>身份证号:</span>
                  {(orderdata && orderdata.prescriptionData && orderdata.prescriptionData.idCard) || '---'}
                </div>

                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>手机号:</span>
                  {(orderdata && orderdata.prescriptionData && orderdata.prescriptionData.patientTel) || '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>是否使用过此药:</span>是
                </div>
                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>疾病史:</span>
                  {(orderdata && orderdata.prescriptionData && orderdata.prescriptionData.guoMinDetail) || '---'}
                </div>
                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>本次用药的确诊疾病:</span>
                  {(orderdata && orderdata.prescriptionData && orderdata.prescriptionData.icdName) || '---'}
                </div>

                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>主诉:</span>
                  {(orderdata && orderdata.prescriptionData && orderdata.prescriptionData.chiefComplaint) || '---'}
                </div>
                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>处方/病例/检查报告:</span>
                  {orderdata && orderdata.prescriptionData && orderdata.prescriptionData.medicalHistory && orderdata.prescriptionData.medicalHistory !== '0'
                    ? orderdata.prescriptionData.medicalHistory.split(',').map((r) => {
                        return (
                          <img
                            onClick={() => {
                              window.open(r)
                            }}
                            style={{ width: 66, height: 66, marginRight: 10 }}
                            src={r}
                          />
                        )
                      })
                    : '--'}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex1jcc" style={{ height: 107 }}>
            <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ height: '66%', width: 5, background: '#519bf7' }} />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginLeft: '18px',
                }}
              >
                推广信息
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0 28px',
                borderBottom: '1px solid #D9D9D9',
              }}
            >
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>推广公司:</span>
                {orderdata ? orderdata.orgName : '---'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fefffe', margin: '0 20px' }}>
          {tableShow ? (
            goodsList.map((r) => {
              // 主订单
              return (
                <Table
                  className="brokerage_ordermng_goods_table"
                  style={{ marginTop: '15px' }}
                  footer={() => {
                    return (
                      <div className="flexjess">
                        <div style={{ width: '100%' }}>
                          <span style={{ marginRight: '6px' }}>商品总价:</span>
                          <span> {r.tradeOriginalFeeStr ? r.tradeOriginalFeeStr : '---'}</span>
                        </div>
                      </div>
                    )
                  }}
                  pagination={false}
                  columns={oldcolumns}
                  dataSource={r.tradeGoodsList}
                />
              )
            })
          ) : (
            <Table className="brokerage_ordermng_goods_table" style={{ marginTop: '15px' }} pagination={false} columns={tablecolumns} dataSource={goodsList} />
          )}
        </div>

        <div>
          <Button
            style={{
              width: 100,
              marginTop: 100,
              marginLeft: 20,
              marginBottom: 20,
              borderRadius: 8,
            }}
            type="primary"
            onClick={goBack}
          >
            返回
          </Button>

          {!tableShow && (
            <div className="flexjes" style={{ bottom: 9 }}>
              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>订单总价(元):</span>
                <span>{orderdata ? orderdata.totalSkuPriceStr : '0.00'}</span>
              </div>
              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>邮费(元):</span>
                <span>{orderdata ? orderdata.freightFeeStr : '0.00'}</span>
              </div>

              {orderdata && orderdata.tradeFeeList && Array.isArray(orderdata.tradeFeeList) && orderdata.tradeFeeList.length && (
                <div style={{ width: '100%' }}>
                  <span style={{ marginRight: '6px' }}>会员优惠(元):</span>
                  <span>{orderdata.tradeFeeList.find((r) => r.feeItem === 'MEMBERSHIP_DISCOUNT_FEE' && r.fee < 0)?.feeStr || '0.00'}</span>
                </div>
              )}

              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>{orderdata ? (Number(orderdata.tradeDiscountFeeStr) > 0 ? 'VIP优惠金额:' : '优惠金额(元):') : '优惠金额(元):'}</span>
                <span>{orderdata ? (Number(orderdata.tradeDiscountFeeStr) > 0 ? orderdata.tradeDiscountFeeStr : orderdata.tradeTicketFeeStr) : '0.00'}</span>
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
        </div>
      </div>
      <Modal title="物流信息" destroyOnclose visible={logisticsModal} footer={null} width={900} onCancel={() => setLogisticsModal(false)} style={{ overflowY: 'auto' }}>
        <Logistics show={true} onlogistics={() => {}} orderValue={orderdata} />
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
    </div>
  )
}

export default Details
