import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'dva'
import { Form, Input, Row, Col, Table, Button, Modal, Radio, message } from 'antd'
import { router } from 'umi'
import { getUrlParam } from '@/utils/utils'
import { use } from 'umi/src/runtimePlugin'
import { getTradeInfo } from '@/services/order'
import { updateAuthTradeCompany } from '@/pages/order/Brokerage/service'

const Detail = (props) => {
  const {
    dispatch,
    orderBrokerageModel: { tradeNo },
  } = props
  const [form] = Form.useForm()
  const [minuteData, setMinuteData] = useState({})

  const [extendData, setExtendData] = useState([])
  const [brokerageData, setBrokerageData] = useState([])

  const [isRefund, setIsRefund] = useState(false)
  //审核按钮loding
  const [refundLoading, setRefundLoading] = useState(false)

  useEffect(() => {
    getTradeInfo_()
    return () => {
      dispatch({
        type: 'orderBrokerageModel/save',
        payload: {
          tradeNo: '',
        },
      })
    }
  }, [tradeNo])

  //获取订单详情
  const getTradeInfo_ = async () => {
    let res = await getTradeInfo({ tradeNo: tradeNo })
    if (res && res.code === '0') {
      setMinuteData(res.data)
      form.setFieldsValue({
        ...res.data,
      })

      let feeData = res.data.tradeRewardList
      let extendDataFee = []
      let brokerageDataFee = []
      if (feeData) {
        feeData.map((r) => {
          if (r.rewardType === 'DISTRIBUTE_HEAD_MEMBER') {
            extendDataFee.push(r)
          }
          if (r.rewardType === 'DISTRIBUTE_CHLID_MEMBER') {
            extendDataFee.push(r)
          }
          if (r.rewardType === 'SALE_1ST_MEMBER') {
            brokerageDataFee.push(r)
          }
          if (r.rewardType === 'SALE_2ND_MEMBER') {
            brokerageDataFee.push(r)
          }
        })
      }

      setExtendData(extendDataFee)
      setBrokerageData(brokerageDataFee)
    }
  }

  const tablecolumns = [
    {
      title: '商品图片',
      className: 'datumsShow',
      align: 'center',
      render: (v) => {
        return <>{v ? <img style={{ width: '80px', height: '80px', marginRight: '10px' }} src={v.skuImg} /> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      title: '商品名称',
      align: 'center',
      width: 200,
      ellipsis: true,
      render: (v) => {
        return <>{v ? <div>{v.goodsName}</div> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      title: '商品规格',
      align: 'center',
      render: (v) => {
        return <>{v ? <div>{v.goodsPropertyStr}</div> : ''}</>
      },
    },
    {
      className: 'datumsShow',
      dataIndex: 'supplierName',
      title: '供应商',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'tradeModeName',
      title: '商品类型',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'warehouseName',
      title: '报关关区',
      align: 'center',

      render: (v) => {
        return <>{v ? v : '---'}</>
      },
    },
    {
      className: 'datumsShow',
      dataIndex: 'chinaPortStatusName',
      title: '报关状态',
      align: 'center',

      render: (v) => {
        return <>{v ? v : '---'}</>
      },
    },
    {
      className: 'datumsShow',
      align: 'center',
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
    {
      className: 'datumsShow',

      dataIndex: 'distributeChlidMemberFeeStr',
      title: '渠道费(元)',
      align: 'center',
      render: (v) => {
        return <>{v ? v : '---'}</>
      },
    },
    {
      className: 'datumsShow',
      dataIndex: 'saleMemberFeeStr',
      title: '推广费(元)',
      align: 'center',
      render: (v) => {
        return <>{v ? v : '---'}</>
      },
    },
  ]

  const extendColumns = [
    {
      className: 'datumsShow',
      dataIndex: 'rewardTypeName',
      title: '角色',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'personName',
      title: '姓名',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'rewardPctStr',
      title: '渠道费比例',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'rewardFeeStr',
      title: '渠道费',
      align: 'center',
    },
  ]

  const brokerageColumns = [
    {
      className: 'datumsShow',
      dataIndex: 'rewardTypeName',
      title: '角色',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'personName',
      title: '姓名',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'rewardPctStr',
      title: '渠道费比例',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'rewardFeeStr',
      title: '渠道费',
      align: 'center',
    },
  ]

  const backAdd = useCallback(() => {
    router.push({
      pathname: '/web/company/pricemgr/priceAuth',
    })
  }, [])

  //点击审核
  const drawback = async (values) => {
    setRefundLoading(true)
    let res = await updateAuthTradeCompany({ tradeNo: tradeNo })
    if (res && res.code === '0') {
      setIsRefund(false)
      message.success(res.message)
      getTradeInfo_()
    } else {
      message.error(res.message)
    }
    setRefundLoading(false)
  }

  return (
    <>
      <div className="positionre">
        <div className="fontMb">
          <Form form={form}>
            <Form.Item style={{ marginBottom: 10 }}>
              <div className="marginlr20">基本信息</div>
            </Form.Item>

            <Row>
              <Col span={5} offset={1}>
                <Form.Item label="订 &nbsp;单 &nbsp;号" name="tradeNo" style={{ marginBottom: 0 }}>
                  <Input bordered={false} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={5} offset={4}>
                <Form.Item label="实 付 金额(元)" name="tradeFeeStr" style={{ marginBottom: 0 }}>
                  <Input bordered={false} disabled={true} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={5} offset={1}>
                <Form.Item label="下单时间" name="tradeDateStr" style={{ marginBottom: 0 }}>
                  <Input bordered={false} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={5} offset={4}>
                <Form.Item label="费用结算状态" name="profixStatusName" style={{ marginBottom: 0 }}>
                  <Input bordered={false} disabled={true} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={5} offset={1}>
                <Form.Item label="订单状态" name="tradeStatusName" style={{ marginBottom: 0 }}>
                  <Input bordered={false} disabled={true} />
                </Form.Item>
              </Col>
              <Col span={5} offset={4}>
                <Form.Item label="优 惠 金额(元)" name="preferentialAmountFeeStr" style={{ marginBottom: 0 }}>
                  <Input bordered={false} disabled={true} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={5} offset={1}>
                <Form.Item label="总&nbsp;价&nbsp;(元)" name="tradeOriginalFeeStr">
                  <Input bordered={false} disabled={true} />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div className="marginlr20">渠道费信息</div>
          <Table style={{ margin: 20 }} pagination={false} columns={extendColumns} dataSource={extendData} />
          <div className="marginlr20">佣金信息</div>
          <Table style={{ margin: 20 }} pagination={false} columns={brokerageColumns} dataSource={brokerageData} />
          <div className="marginlr20">商品信息</div>
          <Table style={{ margin: 20 }} pagination={false} columns={tablecolumns} dataSource={minuteData.tradeGoodsList || []} />
        </div>

        <div style={{ marginTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {minuteData.authStatus === '待审核' ? (
              <Button
                type="primary"
                style={{
                  marginRight: '100px',
                  width: '120px',
                  borderRadius: '4px',
                }}
                size="middle"
                onClick={() => {
                  setIsRefund(true)
                }}
              >
                审核
              </Button>
            ) : null}
            <Button style={{ width: '120px', marginBottom: 100, borderRadius: '4px' }} onClick={() => backAdd()} type="primary">
              返回
            </Button>
          </div>
        </div>
      </div>
      <Modal
        destroyOnClose={true}
        title="提示信息"
        onCancel={() => {
          setIsRefund(false)
        }}
        visible={isRefund}
        width="500px"
        height="500px"
        footer={null}
        className="positionre"
      >
        <>
          <Form onFinish={drawback}>
            <Row style={{ marginBottom: 30 }}>
              <Col offset={9} span={18}>
                <div> 是否确认审核通过？</div>
              </Col>
            </Row>
            <Row>
              <Col offset={6} span={4}>
                <Button loading={refundLoading} type="primary" htmlType="submit" style={{ borderRadius: '4px' }}>
                  {' '}
                  确定
                </Button>
              </Col>
              <Col offset={6} span={4}>
                <Button
                  type="primary"
                  style={{ borderRadius: '4px' }}
                  onClick={() => {
                    setIsRefund(false)
                  }}
                >
                  取消
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      </Modal>
    </>
  )
}

export default connect(({ orderBrokerageModel, loading }) => {
  return {
    orderBrokerageModel,
    loadingTable: loading.effects['orderBrokerageModel/fetch'],
  }
})(Detail)
