import { useEffect, useState, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Descriptions, Spin, Table, Image, Button, Space } from 'antd'
import ExpressModal from './ExpressModal'
import useModalController from '@/hooks/useModalController'
import requestw from '@/utils/requestw'
import { isPageType, getTradeOrderInfoApi } from './func'
import styles from './index.less'

/**
 * options:
 * tradeNo
 */

const cardProps = {
  bordered: false,
  style: { marginBottom: 10 },
}

function Index() {
  const { query } = useLocation()
  const tradeNo = query.tradeNo
  const [orderInfo, setOrderInfo] = useState({})
  const [getLoading, setGetLoading] = useState(false)

  var expressModalController = useModalController()

  function getOrderInfo() {
    setGetLoading(true)
    requestw({
      url: getTradeOrderInfoApi(),
      data: { tradeNo },
      isNeedCheckResponse: true,
    })
      .finally(() => setGetLoading(false))
      .then((data) => setOrderInfo(data ?? {}))
  }

  useEffect(() => {
    getOrderInfo()
  }, [tradeNo])

  const goodsColumns = [
    {
      title: '商品图片',
      dataIndex: '_name',
      render: (v, skuRecord) => {
        return <img src={skuRecord.skuImg} style={{ width: 56, height: 56 }} />
      },
    },
    { title: '商品名称', dataIndex: 'skuName' },
    { title: '商品类型', dataIndex: 'goodsTypeName' },
    { title: '商品数量', dataIndex: 'skuCount' },
    { title: '单价', dataIndex: 'skuPriceStr' },
  ]

  return (
    <div>
      <Spin spinning={getLoading}>
        <Card>
          <Button onClick={() => window.history.go(-1)}>返回</Button>
        </Card>
        <Card {...cardProps} title="订单信息">
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="订单编号">{orderInfo.tradeNo}</Descriptions.Item>
            <Descriptions.Item label="下单时间">{orderInfo.tradeDateStr}</Descriptions.Item>
            <Descriptions.Item label="支付时间">{orderInfo.payDateStr}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{orderInfo.finishDateStr}</Descriptions.Item>
            <Descriptions.Item label="订单状态">{orderInfo.tradeStatusName}</Descriptions.Item>
            <Descriptions.Item label="订单备注">{orderInfo.remark}</Descriptions.Item>
            {orderInfo.payResult && <Descriptions.Item label="退款原因">{orderInfo.payResult}</Descriptions.Item>}
            {orderInfo.resultNote && (
              <Descriptions.Item label="说明" span={2}>
                {orderInfo.resultNote}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
        <Card {...cardProps} title="收货人信息">
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="收货人">{orderInfo.custName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{orderInfo.custMobile}</Descriptions.Item>
            <Descriptions.Item label="收货地址">{orderInfo.allAddress}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card {...cardProps} title="付款信息">
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="付款金额">{orderInfo.payFeeStr}</Descriptions.Item>
            <Descriptions.Item label="付款状态">{orderInfo.payStatusName}</Descriptions.Item>
            <Descriptions.Item label="支付单号">{orderInfo.paymentNo}</Descriptions.Item>
            {/* <Descriptions.Item label="微信支付单号"></Descriptions.Item> */}
          </Descriptions>
        </Card>
        {/* <Card {...cardProps} title="买家信息">
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="买家昵称"></Descriptions.Item>
            <Descriptions.Item label="买家备注"></Descriptions.Item>
            <Descriptions.Item label="买家手机号"></Descriptions.Item>
          </Descriptions>
        </Card> */}
        {orderInfo.tradePatientDTO && (
          <Card {...cardProps} title="用药人信息">
            <Descriptions size="small" column={4}>
              <Descriptions.Item label="用药人姓名">{orderInfo.tradePatientDTO.patientName}</Descriptions.Item>
              {/* <Descriptions.Item label="身份证号">{orderInfo.tradePatientDTO.payFeeStr}</Descriptions.Item> */}
              <Descriptions.Item label="年龄">{orderInfo.tradePatientDTO.patientAge}</Descriptions.Item>
              <Descriptions.Item label="性别">{orderInfo.tradePatientDTO.patientSexName}</Descriptions.Item>
              <Descriptions.Item label="手机号">{orderInfo.tradePatientDTO.phoneNumber}</Descriptions.Item>
              {/* <Descriptions.Item label="是否用过此药">{orderInfo.tradePatientDTO.ifUsedDrugsName}</Descriptions.Item> */}
            </Descriptions>
          </Card>
        )}
        {orderInfo.tradePrescriptionDTO && (
          <Card {...cardProps} title="问诊信息">
            <Descriptions size="small" column={4}>
              {/* <Descriptions.Item label="主诉" span={24}>
                {orderInfo.tradePrescriptionDTO.ccInfo}
              </Descriptions.Item>
              <Descriptions.Item label="临床诊断信息" span={24}>
                {orderInfo.tradePrescriptionDTO.icdName}
              </Descriptions.Item>
              <Descriptions.Item label="既往病史" span={24}>
                {orderInfo.tradePrescriptionDTO.pmhInfo}
              </Descriptions.Item> */}
              <Descriptions.Item label="处方/检查报告" span={24}>
                <Image src={orderInfo.tradePrescriptionDTO.prescriptionImage} width={80} height={80} style={{ objectFit: 'cover' }} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
        {orderInfo.expressDateStr && (
          <Card
            {...cardProps}
            title={
              <Space>
                <div>物流信息</div>
                {orderInfo.expressNo && (
                  <a
                    className={styles.card_prefix}
                    onClick={() => {
                      expressModalController.controller.open({ tradeNo })
                    }}
                  >
                    查看物流详情
                  </a>
                )}
              </Space>
            }
          >
            <Descriptions size="small" column={4}>
              <Descriptions.Item label="物流公司">{orderInfo.expressCompanyName}</Descriptions.Item>
              <Descriptions.Item label="物流单号">{orderInfo.expressNo}</Descriptions.Item>
              <Descriptions.Item label="配送时间">{orderInfo.expressDateStr}</Descriptions.Item>
            </Descriptions>
          </Card>
        )}
        {orderInfo.tradeRewardList && orderInfo.tradeRewardList.length > 0 && (
          <Card {...cardProps} title="推广信息">
            {/* 
            private Integer saleRewardFee;//  SALE_REWARD_FEE 销售佣金(医生)(单位:分)
            private Integer channelRewardFee;//  CHANNEL_REWARD_FEE 渠道佣金(患者推广人)(单位:分)
            private Integer manageServiceFee;//  MANAGE_SERVICE_FEE 管理服务费(医生发展人)(单位:分) 
            */}
            <Descriptions size="small" column={4}>
              {/* 医生的推广人 */}
              {/* <Descriptions.Item label="推广人（经纪）">{orderInfo.distributeName}</Descriptions.Item>
            <Descriptions.Item label="推广人佣金">{orderInfo.manageServiceFeeStr}</Descriptions.Item> */}
              {/* 发展人 */}
              {/* <Descriptions.Item label="推广人">{orderInfo.developName}</Descriptions.Item>
            <Descriptions.Item label="推广人佣金">{orderInfo.channelRewardFeeStr}</Descriptions.Item> */}
              {/* <Descriptions.Item label="医生集团">{orderInfo.doctorOrgName}</Descriptions.Item>
            <Descriptions.Item label="医生">{orderInfo.doctorName}</Descriptions.Item>
            <Descriptions.Item label="代理商" span={2}>{orderInfo.distributeCompanyName}</Descriptions.Item> */}
              {(orderInfo.tradeRewardList ?? []).map((item, index) => {
                const feeNameMap = {
                  DISTRIBUTE_REWARD_FEE: '推广费',
                  SALE_REWARD_FEE: '销售佣金',
                  MANAGER_SERVICE_FEE: '管理服务费',
                }
                return (
                  <Fragment key={index}>
                    <Descriptions.Item label={item.rewardTypeName}>{item.personName}</Descriptions.Item>
                    <Descriptions.Item label={feeNameMap[item.feeItem]}>{item.rewardFeeStr}</Descriptions.Item>
                  </Fragment>
                )
              })}
            </Descriptions>
          </Card>
        )}
        {orderInfo.disputeOrderDTO && (
          <Card {...cardProps} title="退款信息">
            <Descriptions size="small" column={4}>
              {/* 医生的推广人 */}
              <Descriptions.Item label="退款单号">{orderInfo.disputeOrderDTO.orderNo}</Descriptions.Item>
              <Descriptions.Item label="退款金额">{(+orderInfo.disputeOrderDTO.refundFee / 100).toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{orderInfo.disputeOrderDTO.refundDateStr}</Descriptions.Item>
              <Descriptions.Item label="退款状态">{orderInfo.disputeOrderDTO.orderStatusStr}</Descriptions.Item>
              <Descriptions.Item label="退款方式">{orderInfo.disputeOrderDTO.orderTypeStr}</Descriptions.Item>
              <Descriptions.Item label="退款原因">{orderInfo.disputeOrderDTO.disputeReason}</Descriptions.Item>
              <Descriptions.Item label="退款来源">{orderInfo.disputeOrderDTO.orderFrom}</Descriptions.Item>
              {orderInfo.disputeOrderDTO.orderType != 'REFUND_ONLY' && (
                <>
                  <Descriptions.Item label="退货物流状态">{orderInfo.disputeOrderDTO.expressStatusName}</Descriptions.Item>
                  <Descriptions.Item label="退货物流单号">{orderInfo.disputeOrderDTO.expressNo}</Descriptions.Item>
                  <Descriptions.Item label="退货物流公司">{orderInfo.disputeOrderDTO.expressCompanyName}</Descriptions.Item>
                  <Descriptions.Item label="退货邮寄人">{orderInfo.disputeOrderDTO.expressPersonName}</Descriptions.Item>
                  <Descriptions.Item label="退货邮寄人电话">{orderInfo.disputeOrderDTO.expressPersonPhoneNumber}</Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Card>
        )}
        <Card>
          <Table
            rowKey="id"
            size="small"
            columns={goodsColumns}
            dataSource={orderInfo.tradeGoodsList ?? []}
            pagination={false}
            footer={() => `合计：数量：${orderInfo.tradeGoodsList?.length ?? 0} 总价：${orderInfo.tradeFeeStr}`}
          />
        </Card>
      </Spin>

      {/* 模态 */}
      <ExpressModal {...expressModalController} />
    </div>
  )
}
export default Index
