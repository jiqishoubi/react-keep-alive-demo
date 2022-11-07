import { Form, Input, InputNumber, Modal, Radio, Row } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

const setting = (props) => {
  const form = useRef()
  useEffect(() => {
    setTimeout(() => {
      form.current.setFieldsValue({
        ...props.keyValues,
      })
    }, 100)
    if (props.keyValues.depositType) {
      if (props.keyValues.depositType === 'number') {
        setRadioShow(true)
      } else {
        setRadioShow(false)
      }
    }

    setTimeout(() => {
      props.onChange(form.current.getFieldsValue())
    }, 1000)
  }, [props.keyValues])
  const [radioShow, setRadioShow] = useState(true)
  const radioChange = (e) => {
    if (e.target.value === 'percent') {
      setRadioShow(false)
      form.current.setFieldsValue({ deposit: '' })
      props.onChange(form.current.getFieldsValue())
    } else {
      setRadioShow(true)
      form.current.setFieldsValue({ deposit: '' })
      props.onChange(form.current.getFieldsValue())
    }
  }

  const onValuesChange = (e, v) => {
    props.onChange(v)
  }
  return (
    <div>
      <Form ref={form} onValuesChange={onValuesChange}>
        <Form.Item label="规格名称" name="skuName">
          <Input disabled={true} bordered={false} />
        </Form.Item>
        <Form.Item label="定金收取方式" rules={[{ required: true, message: '请选择' }]}>
          <Form.Item style={{ marginBottom: 4 }} name="depositType" initialValue="number">
            <Radio.Group onChange={radioChange}>
              <Radio value="number">按金额</Radio>
              <Radio value="percent">按比例</Radio>
            </Radio.Group>
          </Form.Item>
          {radioShow ? (
            <Form.Item style={{ marginBottom: 0 }} label="按金额" colon={false}>
              <Form.Item name="deposit" noStyle rules={[{ required: true, message: '请输入' }]}>
                <InputNumber />
              </Form.Item>
              <span>(元)收取</span>
            </Form.Item>
          ) : (
            <Form.Item style={{ marginBottom: 0 }} label="按比例" colon={false}>
              <Form.Item rules={[{ required: true, message: '请输入' }]} name="deposit" noStyle>
                <InputNumber max={100} min={0} />
              </Form.Item>
              <span style={{ marginBottom: 0 }}>(%)收取</span>
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item label="定金膨胀系数" initialValue="1" rules={[{ required: true, message: '请选择' }]} name="expandRatio">
          <Radio.Group>
            <Radio value="1">1倍</Radio>
            <Radio value="1.5">1.5倍</Radio>
            <Radio value="2">2倍</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="商品预售价" name="preSalePrice" rules={[{ required: true, message: '请输入' }]}>
          <InputNumber style={{ width: '60%' }} />
        </Form.Item>
      </Form>
    </div>
  )
}
export default setting
