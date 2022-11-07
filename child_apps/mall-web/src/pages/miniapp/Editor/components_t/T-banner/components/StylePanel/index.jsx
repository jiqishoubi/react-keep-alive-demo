import React, { memo, useMemo, useCallback, useEffect } from 'react'
import { connect } from 'dva'
import { Form, Slider } from 'antd'
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
    formRef.setFieldsValue({ ...item })
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
      <Form.Item label="高度" name="height" initialValue={item.height || 0}>
        <Slider max={400} />
      </Form.Item>
      <div
        style={{
          marginLeft: '110px',
          marginTop: '-30px',
          marginBottom: '10px',
        }}
      >
        （0代表自适应）
      </div>
      <Form.Item label="上外边距" name="marginTop" initialValue={item.marginTop || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="下外边距" name="marginBottom" initialValue={item.marginLeftRight || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右边距" name="marginLeftRight" initialValue={item.marginLeftRight || 0}>
        <Slider />
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
