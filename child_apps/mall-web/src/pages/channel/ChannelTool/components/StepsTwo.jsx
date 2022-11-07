import { DatePicker, Form, Row, Col, Button, Input, Table, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import QueryGoods from '@/pages/channel/ChannelTool/components/QueryGoods'
import { getPreActieInfo } from '@/pages/channel/ChannelTool/service'
import moment from 'moment'

const StepsTwo = (props) => {
  const [form] = Form.useForm()
  const queryRef = useRef()
  const [isRefund, setIsRefund] = useState(false)
  const { settingShow } = props

  const isPopModal = () => {
    setIsRefund(true)
  }
  //传递给组件的数据
  const goodsProps = {
    isPopModal: isPopModal,
    selectShow: true,
    modal: false,
    setting: props.setting,
    activeCode: props.activeCode,
    setRefund: () => {
      setIsRefund(false)
      queryRef.current.submit()
    },
    settingShow: settingShow,
  }
  //modal传递的
  const popProps = {
    selectShow: false,
    modal: true,
    setting: props.setting,
    activeCode: props.activeCode,
    setRefund: () => {
      setIsRefund(false)
      queryRef.current.submit()
    },
    settingShow: settingShow,
  }

  useEffect(() => {
    if (props.activeCode) {
      getPreActieInfo_(props.activeCode)
    }
  }, [])
  const getPreActieInfo_ = async (code) => {
    let res = await getPreActieInfo({ activeCode: code })
    if (res && res.code === '0') {
      let attrMap = res.data.attrMap
      let payment = attrMap.endEffectDate + '至' + attrMap.endExpireDate
      let consignment = '尾款支付后' + attrMap.sendDay + '天'
      let finalPayment = attrMap.endDiscountType === '0' ? '不设置尾款优惠' : '定金膨胀'
      form.setFieldsValue({
        payment,
        consignment,
        finalPayment,
      })
    }
  }
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ marginTop: 30, marginLeft: 20, fontSize: 16 }}>基础规则</div>
      <Form form={form} style={{ marginLeft: 20 }}>
        <Row>
          <Col span={7}>
            <Form.Item name="payment" label="定金支付时间">
              <Input disabled={true} bordered={false} />
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item label="最晚发货时间" name="consignment">
              <Input disabled={true} bordered={false} />
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item label="尾款优惠方式" name="finalPayment">
              <Input disabled={true} bordered={false} />
            </Form.Item>
          </Col>

          <Col span={3}>
            {props.settingShow ? (
              ''
            ) : (
              <Button type="primary" onClick={props.stepsCallback}>
                修改
              </Button>
            )}
          </Col>
        </Row>
      </Form>
      <QueryGoods ref={queryRef} goodsProps={goodsProps} />

      <Button style={{ marginLeft: 20, marginTop: 30 }} type="primary" onClick={() => props.stepsClick()}>
        {props.settingShow ? '下一步' : '提交'}
      </Button>

      <Modal
        destroyOnClose={true}
        title="在线选品"
        onCancel={() => {
          setIsRefund(false)
        }}
        visible={isRefund}
        width="900px"
        footer={null}
        className="positionre"
      >
        <QueryGoods goodsProps={popProps} />
      </Modal>
    </div>
  )
}
export default StepsTwo
