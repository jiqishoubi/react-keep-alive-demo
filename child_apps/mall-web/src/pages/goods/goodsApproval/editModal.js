import React, { useState, useRef, useEffect } from 'react'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Radio, Tabs, Divider, InputNumber } from 'antd'
import BUpload from '@/components/BUpload'
import request from '@/utils/request'
import api_common from '@/services/api/common'
import { approvalStatusUpdate } from './services'
import { getNumber } from '@/utils/number'

const moduleId = 'skuCode'
const title = '商品审核'
const modalWidth = 600
const formSpan = { labelCol: { span: 6 }, wrapperCol: { span: 12 } }

const Index = (props, ref) => {
  const [info, setInfo] = useState({})
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (props.modalProps.visible) {
      form.resetFields()
      let item = loadParamsDeal({ ...(props?.controller?.payload || {}) })
      item.isAdd = item?.[moduleId] ? false : true
      setTimeout(() => {
        setInfo(item)
        form.setFieldsValue(item)
      }, 300)
    }
  }, [props?.modalProps?.visible, props?.controller?.payload])

  const loadParamsDeal = (item) => {
    // item.technicalServiceRate = 10;//test
    const { totalServiceFee, technicalServiceRate, salePrice, channelServiceFee } = item

    // 平台服务费 // 如果小于1分，就是0
    let technicalServiceFee = (technicalServiceRate / 100 || 0) * salePrice
    if (technicalServiceFee < 1) {
      technicalServiceFee = 0
    }

    const platformServiceFee = totalServiceFee - technicalServiceFee - channelServiceFee
    item.technicalServiceFeeStr = '' + (technicalServiceFee / 100).toFixed(2)
    item.platformServiceFeeStr = '' + (platformServiceFee / 100).toFixed(2)
    return item
  }

  const submitParamsDeal = (data) => {
    for (let i in data) {
      data[i] = data[i] ? data[i] : ''
    }
    if (!info.isAdd) {
      data[moduleId] = info[moduleId]
    }
    data.apprStatus = 90
    data.channelServiceFee = getNumber(+data.channelServiceFeeStr * 100 || 0)
    data.technicalServiceFee = getNumber(+data.technicalServiceFeeStr * 100 || 0)
    data.platformServiceFee = getNumber(+data.platformServiceFeeStr * 100 || 0)

    delete data.channelServiceFeeStr
    delete data.platformServiceFeeStr
    delete data.technicalServiceFeeStr
    return data
  }

  const submit = async () => {
    var data = await form.validateFields()
    data = submitParamsDeal(data)
    await approvalStatusUpdate(data)
    setInfo({})
    setTimeout(() => {
      props.controller.close('edit')
    }, 10)
  }
  const cancel = async () => {
    setInfo({})
    setTimeout(() => {
      props.controller.close()
    }, 10)
    props?.cancel && props.cancel()
  }

  const channelServiceFeeStrChange = (channelServiceFeeStr) => {
    const { totalServiceFee, technicalServiceRate, salePrice } = info
    var channelServiceFee = parseInt(+channelServiceFeeStr * 100)

    // 平台服务费 // 如果小于1分，就是0
    let technicalServiceFee = (technicalServiceRate / 100 || 0) * salePrice
    if (technicalServiceFee < 1) {
      technicalServiceFee = 0
    }

    const maxChannelServiceFee = totalServiceFee - technicalServiceFee
    if (channelServiceFee > maxChannelServiceFee) {
      channelServiceFee = maxChannelServiceFee
    }
    const platformServiceFee = totalServiceFee - technicalServiceFee - channelServiceFee
    info.technicalServiceFeeStr = '' + (+technicalServiceFee / 100).toFixed(2)
    info.platformServiceFeeStr = '' + (+platformServiceFee / 100).toFixed(2)
    info.channelServiceFeeStr = '' + (+channelServiceFee / 100).toFixed(2)

    setInfo(info)
    form.setFieldsValue(info)
  }
  return (
    <>
      {
        <Modal title={title} {...props.modalProps} destroyOnClose={true} centered={true} width={modalWidth} onOk={submit} onCancel={cancel}>
          <Form name="basic" {...formSpan} autoComplete="off" form={form}>
            <Form.Item label="商品编码"> {info.goodsCode} </Form.Item>
            <Form.Item label="商品名称"> {info.goodsName} </Form.Item>
            <Form.Item label="规格名称"> {info.skuName || ''}</Form.Item>
            <Form.Item label="规格编码"> {info.skuCode} </Form.Item>
            <Form.Item label="售价"> {info.salePriceStr} </Form.Item>
            <Form.Item label="总服务费"> {info.totalServiceFeeStr} </Form.Item>
            <Form.Item name="channelServiceFeeStr" label="渠道推广费" rules={[{ required: true, message: '请输入渠道推广费' }]} onBlur={({ target }) => channelServiceFeeStrChange(target.value)}>
              <Input allowClear />
            </Form.Item>
            <Form.Item name="technicalServiceFeeStr" label="技术服务费" rules={[{ required: true, message: '请输入技术服务费' }]}>
              <Input disabled={true} allowClear />
            </Form.Item>
            <Form.Item name="platformServiceFeeStr" label="平台服务费" rules={[{ required: true, message: '请输入平台服务费' }]}>
              <Input disabled={true} allowClear />
            </Form.Item>
          </Form>
        </Modal>
      }
    </>
  )
}

export default Index
