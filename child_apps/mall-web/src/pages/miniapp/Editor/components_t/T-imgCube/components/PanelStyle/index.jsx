import React, { memo, useMemo, useCallback, useEffect } from 'react'
import { connect } from 'dva'
import { Form, Slider } from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { onValuesChange } from '../../../../utils_editor'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = (props) => {
  const [formRef] = Form.useForm()
  const { form, h5Editor, dispatch } = props
  const { itemList, activeItem } = h5Editor

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  useEffect(() => {
    formRef.setFieldsValue({
      ...item,
    })
  }, [item])

  const onFormChange = useCallback(
    (changedValues, allValues) => {
      onValuesChange({
        changedValues,
        allValues,
        itemList,
        activeItem,
        dispatch,
      })
    },
    [itemList, activeItem, dispatch]
  )

  return (
    <Form form={formRef} {...formItemLayout} onValuesChange={onFormChange}>
      <Form.Item label="上下外边距" name="marginTopBottom" initialValue={item.marginTopBottom || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右外边距" name="marginLeftRight" initialValue={item.marginLeftRight || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="上下内边距" name="paddingTopBottom" initialValue={item.paddingTopBottom || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右内边距" name="paddingLeftRight" initialValue={item.paddingLeftRight || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="背景颜色" name="backgroundColor">
        <ColorPicker key="backgroundColor" />
      </Form.Item>
      <Form.Item label="圆角" name="borderRadius" initialValue={item.borderRadius || 0}>
        <Slider />
      </Form.Item>
    </Form>
  )
}

export default memo(
  connect(({ h5Editor }) => ({
    h5Editor,
  }))(Index)
)
