import { Button, Checkbox, DatePicker, Form, Input, message, Radio, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { createPreActive, getPreActieInfo, updatePreActive } from '@/pages/channel/ChannelTool/service'

const Steps = (props) => {
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 14 },
  }
  const { settingShow } = props
  const [htmlLoding, setHmlLoding] = useState(false)

  useEffect(() => {
    if (props.activeCode) {
      getPreActieInfo_(props.activeCode)
    }
  }, [props.activeCode])

  const getPreActieInfo_ = async (code) => {
    let res = await getPreActieInfo({ activeCode: code })
    if (res && res.code === '0') {
      form.setFieldsValue({
        ...res.data,
        ...res.data.attrMap,
        paymentTime: [moment(res.data.effectDate), moment(res.data.expireDate)],
        finalPaymentTime: [moment(res.data.attrMap?.endEffectDate), moment(res.data.attrMap?.endExpireDate)],
      })
    }
  }

  const ownOnFinish = async (values) => {
    setHmlLoding(true)
    if (values.paymentTime) {
      values.effectDate = moment(values.paymentTime[0]).format('YYYY-MM-DD')
      values.expireDate = moment(values.paymentTime[1]).format('YYYY-MM-DD')
    }
    if (values.finalPaymentTime) {
      values.endEffectDate = moment(values.finalPaymentTime[0]).format('YYYY-MM-DD')
      values.endExpireDate = moment(values.finalPaymentTime[1]).format('YYYY-MM-DD')
    }
    delete values.paymentTime
    delete values.finalPaymentTime
    values['activeType'] = 'GOODS_PRE_SALE'
    values['company'] = 'system'
    if (props.activeCode) {
      if (props.settingShow) {
        props.stepsClick()
      } else {
        values['activeCode'] = props.activeCode
        let res = await updatePreActive(values)
        if (res && res.code === '0') {
          message.success('修改成功')
          props.stepsClick()
        } else {
          message.error(res.message)
        }
      }
    } else {
      let res = await createPreActive(values)
      if (res && res.code === '0') {
        props.stepsClick(res.data.activeCode)
        message.success('创建成功')
      } else {
        message.error(res.message)
      }
    }
    setHmlLoding(false)
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <Form onFinish={ownOnFinish} form={form} {...layout} style={{ marginTop: 30 }}>
        <Form.Item name="activeName" label="活动名称" wrapperCol={{ span: 4 }} rules={[{ required: true, message: '请输入活动名称' }]}>
          <Input placeholder="请输入活动名称" disabled={settingShow} />
        </Form.Item>
        <Form.Item label="推广公司">全平台</Form.Item>
        <Form.Item label="预售时间">
          <Form.Item label="定金支付时间" name="paymentTime" rules={[{ required: true, message: '请选择' }]}>
            <RangePicker disabled={settingShow} format={'YYYY-MM-DD'}></RangePicker>
          </Form.Item>
          <Form.Item label="尾款支付时间" name="finalPaymentTime" style={{ marginBottom: 0 }} rules={[{ required: true, message: '请选择' }]}>
            <RangePicker disabled={settingShow} format={'YYYY-MM-DD'}></RangePicker>
          </Form.Item>
        </Form.Item>
        <Form.Item label="发货时间">
          <Form.Item style={{ marginBottom: 0 }}>
            <Row>
              <Form.Item style={{ marginBottom: 0 }} label="尾款支付" colon={false} name="sendDay" rules={[{ required: true, message: '请选择' }]}>
                <Input disabled={settingShow} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>天后发货</Form.Item>
            </Row>
          </Form.Item>
        </Form.Item>

        <Form.Item label="尾款优惠方式" name="endDiscountType" initialValue="1" rules={[{ required: true, message: '请选择' }]}>
          <Radio.Group disabled={settingShow}>
            <Radio value="1">定金膨胀</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="ifSmsFree" label="短信免打扰">
          <Checkbox disabled={settingShow} value="0">
            不在21点~次日8点发送尾款催促短信
          </Checkbox>
        </Form.Item>

        <Button style={{ marginLeft: '30%' }} htmlType="submit" type="primary" loading={htmlLoding}>
          {settingShow ? '下一步' : '去选择商品'}
        </Button>
      </Form>
    </div>
  )
}
export default Steps
