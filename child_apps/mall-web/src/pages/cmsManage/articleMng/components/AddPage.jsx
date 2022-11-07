import React, { useState, useEffect, useCallback } from 'react'
import { Button, Card, Form, Input, Row, Breadcrumb, message, InputNumber, Modal, Radio } from 'antd'
import TEditDetails from '@/components/goods/T-EditDetails'
import FetchSelect from '@/components/FetchSelect'
import BUpload from '@/components/BUpload'
import { addAjax, updateAjax } from '../service'
import { handleRes } from '@/utils/requestw'
import { localDB } from '@/utils/utils'

const { TextArea } = Input

/**
 * props
 *
 * lookingRecord
 * onCancel
 * onSuccess
 */

const getInitialValues = (lookingRecord) => {
  if (!lookingRecord) return {}
  let cardDetail = []
  try {
    cardDetail = lookingRecord && JSON.parse(lookingRecord.cardDetail)
  } catch (e) {}

  return {
    ...lookingRecord,
    cardDetail,
  }
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

const formItemLayoutTail = {
  wrapperCol: { offset: 5, span: 16 },
}

let isNeedConfirmResult = true //确认取消的结果

//组件
const Index = (props) => {
  const [form] = Form.useForm()

  const { lookingRecord } = props
  const isEdit = lookingRecord && lookingRecord.cardCode

  const [isHaveChange, setIsHaveChange] = useState(false) //编辑的时候 是否更改
  const [loadingBtn, setLoadingBtn] = useState(false)

  useEffect(() => {
    isNeedConfirmResult = true
    renderBackStorage()
    return () => {
      saveStorageOrClear()
    }
  })

  //回显自动保存的form values
  const renderBackStorage = () => {
    if (!isEdit) {
      const values = localDB.getItem('safe_cardMng_addPage') || {}
      form.setFieldsValue(values)
    }
  }
  //自动保存或清空
  const saveStorageOrClear = () => {
    if (!isEdit) {
      if (isNeedSaveStorage()) {
        //保存
        const values = form.getFieldsValue()
        localDB.setItem('safe_cardMng_addPage', values)
      } else {
        //清空
        localDB.deleteItem('safe_cardMng_addPage')
      }
    }
  }
  //是否需要自动保存
  const isNeedSaveStorage = () => {
    return !isEdit && isNeedConfirm() && isNeedConfirmResult
  }
  //取消的时候是否需要提示
  const isNeedConfirm = () => {
    if (isEdit) {
      return isHaveChange
    } else {
      const values = form.getFieldsValue()
      return Object.keys(values).some((keyStr) => values[keyStr]) //有值的话
    }
  }
  //取消
  const clickCancel = () => {
    if (!props.onCancel) return
    if (isNeedConfirm()) {
      Modal.confirm({
        title: '确认取消？',
        onOk() {
          isNeedConfirmResult = false
          props.onCancel()
        },
      })
    } else {
      props.onCancel()
    }
  }

  //提交
  const submit = async () => {
    const values = await form.validateFields()
    let postData = {
      cardCode: (isEdit && lookingRecord.cardCode) || null,
      ...values,
      cardDetail: JSON.stringify(values.cardDetail),
    }

    let res
    setLoadingBtn(true)
    if (isEdit) {
      res = await updateAjax(postData)
    } else {
      res = await addAjax(postData)
    }
    setLoadingBtn(false)
    //成功
    message.success(isEdit ? '保存成功' : '添加成功')
    if (props.onSuccess) props.onSuccess()
  }

  const breadcrumbDom = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <a onClick={props.onCancel || null}>产品管理</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>产品详情</Breadcrumb.Item>
    </Breadcrumb>
  )

  /**
   * 渲染
   */
  const initialValues = getInitialValues(lookingRecord)

  return (
    <Card title={breadcrumbDom}>
      <Form
        form={form}
        {...formItemLayout}
        initialValues={initialValues}
        onValuesChange={() => {
          setIsHaveChange(true)
        }}
        style={{ width: 700 }}
      >
        <Form.Item label="产品名称" name="cardName" required rules={[{ required: true, message: '请输入产品名称' }]}>
          <Input placeholder="请输入产品名称" />
        </Form.Item>
        <Form.Item label="产品分类" name="classifyCode" required rules={[{ required: true, message: '请选择产品分类' }]}>
          <FetchSelect api="/web/classify/product/list" valueKey="classifyCode" textKey="classifyName" placeholder="请选择产品分类" />
        </Form.Item>
        <Form.Item label="产品封面" name="cardUrl" required rules={[{ required: true, message: '请添加产品封面' }]}>
          <BUpload valueType="string" type="img" api="/web/common/uploadFile" />
        </Form.Item>
        <Form.Item label="描述" name="cardDescription" required>
          <TextArea maxLength="50" autoSize={{ minRows: 1, maxRows: 3 }} placeholder="请输入产品介绍" />
        </Form.Item>
        <Form.Item label="排序" name="sort" required rules={[{ required: true, message: '请输入排序' }]}>
          <InputNumber style={{ width: '100%' }} placeholder="请输入排序" min={1} precision={0.0} maxLength={8} />
        </Form.Item>
        <Form.Item label="页面内容" name="cardDetail" required rules={[{ required: true, message: '请上传页面内容' }]}>
          <TEditDetails />
        </Form.Item>
        <Form.Item label="是否有意向单" name="ifIntention" required rules={[{ required: true, message: '请选择是否有意向单' }]}>
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item {...formItemLayoutTail}>
          <Row type="flex">
            <Button onClick={clickCancel} style={{ marginRight: 36 }}>
              取消
            </Button>
            <Button type="primary" onClick={submit} loading={loadingBtn}>
              {isEdit ? '保存' : '提交'}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Index
