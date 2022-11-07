import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Radio, Tabs, Divider, InputNumber } from 'antd'
import FetchTreeSelect from './FetchTreeSelect'
import BUpload from '@/components/BUpload'
import request from '@/utils/request'
import api_common from '@/services/api/common'
import { create, update, api } from './services'
const moduleId = 'groupCode'
const title = '商品类目'
const modalWidth = 600
const formSpan = { labelCol: { span: 6 }, wrapperCol: { span: 12 } }
const Index = (props, ref) => {
  const [show, setShow] = useState(false)
  const [info, setInfo] = useState({})
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    show: async (params) => {
      form.resetFields() //清除其他字段的值
      setShow(true)
      params.isAdd = params?.orgCode ? false : true
      params = await loadParamsDeal(params)
      setInfo(params)
      form.setFieldsValue(params) //重新赋值
    },
  }))

  const loadParamsDeal = async (params) => {
    return params
  }

  const submitParamsDeal = (data) => {
    for (let i in data) {
      data[i] = data[i] ? data[i] : ''
    }
    if (!info.isAdd) {
      data[moduleId] = info[moduleId]
    }
    // data.groupLevel = data?.parentGroup?1:0
    data.orgCode = props.orgCode
    data.disabled = 1
    return data
  }
  const submit = async () => {
    var data = await form.validateFields()
    data = submitParamsDeal(data)

    setSubmitLoading(true)
    info.isAdd ? await create(data) : await update(data)
    setSubmitLoading(false)

    props?.submitCompleted && props.submitCompleted()
    cancel()
  }
  const cancel = async () => {
    setInfo({})
    setTimeout(() => {
      setShow(false)
    }, 100)
    props?.cancel && props.cancel()
  }

  return (
    <>
      {
        <Modal title={(info.isAdd ? '新增' : '编辑') + title} visible={show} destroyOnClose={true} maskClosable={false} centered={true} width={modalWidth} onOk={submit} onCancel={cancel}>
          <Form name="basic" {...formSpan} autoComplete="off" form={form}>
            {info?.groupLevel > 0 && (
              <Form.Item name="parentGroup" label="父级类目">
                <FetchTreeSelect
                  disabled={!info.isAdd}
                  placeholder="请选择父级类目"
                  api={api.getGoodsGroupPaggingList}
                  valueKey="groupCode"
                  textKey="groupName"
                  formData={{
                    groupLevel: 0,
                  }}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                />
              </Form.Item>
            )}
            <Form.Item name="groupName" label="商品类目名称" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入商品类目名称" allowClear />
            </Form.Item>
            <Form.Item label="类目图片" name="groupImg" rules={[{ required: true, message: '请上类目图片' }]}>
              <BUpload
                valueType="string"
                type="img"
                api={api_common.uploadApi}
                length={1}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'companyCard',
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="groupOrder" label="排序" initialValue={1} rules={[{ required: true, message: '请输入排序' }]}>
              <Input placeholder="请输入排序" maxLength={11} allowClear />
            </Form.Item>
          </Form>
        </Modal>
      }
    </>
  )
}

export default forwardRef(Index)
