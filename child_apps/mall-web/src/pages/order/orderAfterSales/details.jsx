import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import { Button, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getTradeInfo } from './services'
import { router } from 'umi'
import Logistics from '@/components/order/Logistics'

const Details = (props) => {
  const { tradeNo } = props.location.query
  const [orderData, setOrderData] = useState({})
  const [tableShow, setTableShow] = useState(true)
  const [goodsList, setGoodsList] = useState([])
  const [logisticsModal, setLogisticsModal] = useState(false)

  useEffect(() => {
    getTradeInfoAjax()
  }, [props.query])

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
  const oldColumns = [
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

  /* 返回*/
  const goBack = () => {
    let pathname = ''
    if (getOrgKind().isAdmin) {
      pathname = '/web/system/trademgr/disputeOrder'
    } else {
      pathname = '/web/company/trademgr/disputeOrder'
    }

    router.push(pathname)
  }

  /*获取订单详情*/
  const getTradeInfoAjax = async () => {
    const res = await getTradeInfo({ tradeNo })

    if (res && res.code === '0') {
      if (res.data.tradeStatusName === '交易完成' && res.data.tradeTypeName === '主订单') {
        setOrderData(res.data)
        setTableShow(true)
        setGoodsList(res.data.subTradeList)
      } else {
        let data = res.data.tradeGoodsList?.map((r) => {
          return { ...res.data, ...r }
        })
        setGoodsList(data)
        setTableShow(false)
        setOrderData(res.data)
      }
    }
  }

  return (
    <>
      <div className="positionre">
        <div className="fontMb">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button style={{ width: 100, borderRadius: 8, marginLeft: 10 }} type="primary" onClick={goBack}>
              返回
            </Button>
          </div>

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
                <span>{orderData ? orderData.tradeNo : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>清单编号：</span>
                <span>{orderData ? orderData.chinaPortInvtNo : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>订单类型：</span>
                <span>{orderData ? orderData.tradeTypeName : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>下单时间：</span>
                <span>{orderData ? orderData.tradeDateStr : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>完成时间：</span>
                <span>{orderData ? orderData.finishDateStr : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>订单状态：</span>
                <span>{orderData ? orderData.tradeStatusName : '---'}</span>
              </div>
              {orderData && orderData.tradeTypeName && orderData.tradeTypeName === '子订单' ? (
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 2 }}>父订单号：</span>
                  <span>{orderData ? orderData.batchNo : '---'}</span>
                </div>
              ) : null}
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>退款原因：</span>
                <span>{orderData ? orderData.payResult : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 2 }}>审核原因：</span>
                <span>{orderData ? orderData.processNote : '---'}</span>
              </div>
            </div>
          </div>

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
                {orderData ? orderData.custName : '---'}
              </div>

              <div className="marb10" style={{ display: 'flex', width: '25%' }}>
                <span style={{ marginRight: 6 }}>联系电话:</span>
                {orderData ? orderData.custMobile : '---'}
              </div>

              <div className="marb10" style={{ display: 'flex', width: '50%' }}>
                <span style={{ marginRight: 6 }}>收货地址:</span>
                {orderData ? orderData.provinceName + orderData.eparchyName + orderData.cityName + orderData.address : '---'}
              </div>
            </div>
          </div>

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
              {orderData?.tradeType === 'TRADE_PRE_SALE' ? (
                <>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>定金金额:</span>
                    {orderData ? orderData.totalPreSaleFeeStr : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>尾款金额:</span>
                    {orderData ? orderData.tradeEndFeeStr : '---'}
                  </div>
                </>
              ) : (
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>订单金额:</span>
                  {orderData && (orderData.payStatusName === '已支付' || orderData.payStatusName === '已退费') ? orderData.tradeFeeStr : '---'}
                </div>
              )}
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>付款状态:</span>
                {orderData ? orderData.payStatusName : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>支付单号:</span>
                {orderData ? orderData.paymentNo : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>微信支付单号:</span>
                {orderData ? orderData.paymentId : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>付款时间:</span>
                {orderData ? orderData.payDateStr : '---'}
              </div>
            </div>
          </div>

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
                <span>{orderData ? orderData.tradeUserName : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>买家手机号:</span>
                <span>{orderData ? orderData.tradeUserPhoneNumber : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>买家备注:</span>
                <span>{orderData ? orderData.remark : '---'}</span>
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>订单说明:</span>
                <span>{orderData ? orderData.resultNote : '---'}</span>
              </div>
            </div>
          </div>

          {orderData?.tradeType === 'TRADE_PRE_SALE' ? (
            <div className="flex1jcc" style={{ height: 107, marginTop: 10 }}>
              <div className="marb5" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: '66%', width: 5, background: '#519bf7' }} />
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
                  <span>{(orderData.tradeTicketList && orderData.tradeTicketList[0] && orderData.tradeTicketList[0].ticketType) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>卡劵名称:</span>
                  <span>{(orderData.tradeTicketList && orderData.tradeTicketList[0] && orderData.tradeTicketList[0].ticketName) || '---'}</span>
                </div>

                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>面额:</span>
                  <span>{(orderData.tradeTicketList && orderData.tradeTicketList[0] && orderData.tradeTicketList[0].ticketExplain) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>有效期:</span>
                  <span>
                    {orderData ? orderData.effectDateStr : '---'}
                    {orderData.effectDateStr ? '至' : '---'}
                    {orderData ? orderData.expireDateStr : '---'}
                  </span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>适用品类:</span>
                  <span>{orderData ? orderData.resultNote : '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>优惠券号:</span>
                  <span>{(orderData.tradeTicketList && orderData.tradeTicketList[0] && orderData.tradeTicketList[0].ticketCode) || '---'}</span>
                </div>
                <div style={{ width: '100%' }} />
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>活动名称:</span>
                  <span>{(orderData.activeDTO && orderData.activeDTO.activeName) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>活动类型:</span>
                  <span>{(orderData.activeDTO && orderData.activeDTO.activeTypeName) || '---'}</span>
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>定金时间:</span>
                  {orderData ? orderData.preEndEffectDate + '至' + orderData.preEndExpireDate : '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>尾款时间:</span>
                  {orderData ? orderData.preEffectDate + '至' + orderData.preExpireDate : '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>尾款优惠方式:</span>
                  {orderData ? orderData.preEndDiscountType : '---'}
                </div>
              </div>
            </div>
          ) : null}

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
              {orderData && orderData.disputeOrderDTO && orderData.disputeOrderDTO.expressNo && <a onClick={() => setLogisticsModal(true)}>查看物流详情</a>}
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
                {(orderData && orderData.disputeOrderDTO && orderData.disputeOrderDTO.expressCompanyName) || '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>物流单号:</span>
                {(orderData && orderData.disputeOrderDTO && orderData.disputeOrderDTO.expressNo) || '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>填写时间:</span>
                {(orderData && orderData.disputeOrderDTO && orderData.disputeOrderDTO.refundDateStr) || '---'}
              </div>
            </div>
          </div>

          {orderData.ifDelivery === '2' ? (
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
                    {orderData ? orderData.finishPersonName : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>手机号码:</span>
                    {orderData ? orderData.finishPersonPhoneNumber : '---'}
                  </div>
                  <div className="marb10" style={{ width: '25%' }}>
                    <span style={{ marginRight: 6 }}>核销时间:</span>
                    {orderData ? orderData.finishDateStr : '---'}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {orderData.ifPrescription === '1' ? (
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
                {orderData && orderData.prescriptionData && orderData.prescriptionData.prescriptionImage && <a onClick={() => window.open(orderData.prescriptionData.prescriptionImage)}>查看处方单</a>}
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
                  {(orderData && orderData.prescriptionData && orderData.prescriptionData.patientName) || '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>身份证号:</span>
                  {(orderData && orderData.prescriptionData && orderData.prescriptionData.idCard) || '---'}
                </div>

                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>手机号:</span>
                  {(orderData && orderData.prescriptionData && orderData.prescriptionData.patientTel) || '---'}
                </div>
                <div className="marb10" style={{ width: '25%' }}>
                  <span style={{ marginRight: 6 }}>是否使用过此药:</span>是
                </div>
                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>疾病史:</span>
                  {(orderData && orderData.prescriptionData && orderData.prescriptionData.guoMinDetail) || '---'}
                </div>
                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>本次用药的确诊疾病:</span>
                  {(orderData && orderData.prescriptionData && orderData.prescriptionData.icdName) || '---'}
                </div>

                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>主诉:</span>
                  {(orderdata && orderdata.prescriptionData && orderdata.prescriptionData.chiefComplaint) || '---'}
                </div>
                <div className="marb10" style={{ width: '50%' }}>
                  <span style={{ marginRight: 6 }}>处方/病例/检查报告:</span>
                  {orderData && orderData.prescriptionData && orderData.prescriptionData.medicalHistory && orderData.prescriptionData.medicalHistory !== '0'
                    ? orderData.prescriptionData.medicalHistory.split(',').map((r) => {
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
                {orderData ? orderData.orgName : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>推广人:</span>
                {orderData ? orderData.developName : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>推广人佣金:</span>
                {orderData ? orderData.distributeChildMemberFeeStr : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>合伙人:</span>
                {orderData ? orderData.distributeName : '---'}
              </div>
              <div className="marb10" style={{ width: '25%' }}>
                <span style={{ marginRight: 6 }}>合伙人佣金:</span>
                {orderData ? orderData.saleMemberFeeStr : '---'}
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
                  columns={oldColumns}
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
            <div className="flexjes" style={{ bottom: 40 }}>
              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>订单总价(元):</span>
                <span>{orderData ? orderData.totalSkuPriceStr : '0.00'}</span>
              </div>
              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>邮费(元):</span>
                <span>{orderData ? orderData?.freightFeeStr : '0.00'}</span>
              </div>

              <div style={{ width: '100%' }}>
                <span style={{ marginRight: '6px' }}>{orderData ? (Number(orderData.tradeDiscountFeeStr) > 0 ? 'VIP优惠金额:' : '优惠金额(元):') : '优惠金额(元):'}</span>
                <span>{orderData ? (Number(orderData.tradeDiscountFeeStr) > 0 ? orderData.tradeDiscountFeeStr : orderData.tradeTicketFeeStr) : '0.00'}</span>
              </div>
              {orderData && (orderData.payStatusName === '已支付' || orderData.payStatusName === '已退费') ? (
                <div style={{ width: '100%' }}>
                  <span style={{ marginRight: '6px' }}>实付金额(元):</span>
                  <span>{orderData.tradeFeeStr}</span>
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  <span style={{ marginRight: '6px' }}>待付金额(元):</span>
                  <span>{orderData.tradeFeeStr}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal title="物流信息" destroyOnclose visible={logisticsModal} footer={null} width={900} onCancel={() => setLogisticsModal(false)} style={{ overflowY: 'auto' }}>
        <Logistics show={false} onlogistics={() => {}} orderValue={orderData} />
      </Modal>
    </>
  )
}
export default Details
