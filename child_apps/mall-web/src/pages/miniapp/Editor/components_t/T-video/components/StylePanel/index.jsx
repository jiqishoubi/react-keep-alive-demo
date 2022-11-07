import React, { useMemo, useEffect } from 'react'
import { connect } from 'dva'
import { Form, Slider, Radio, InputNumber, Select } from 'antd'
import { onValuesChange } from '../../../../utils_editor'

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = (props) => {
  const { form, h5Editor, dispatch } = props
  const { itemList, activeItem } = h5Editor

  const [formRef] = Form.useForm()

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  useEffect(() => {
    formRef.setFieldsValue({ ...item })
  }, [item])

  return (
    <Form
      form={formRef}
      {...formItemLayout}
      onValuesChange={(changedValues, allValues) => {
        onValuesChange({
          changedValues,
          allValues,
          itemList,
          activeItem,
          dispatch,
        })
      }}
    >
      <Form.Item label="高度" name="height" initialValue={item.height || 0}>
        <Slider max={500} />
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
      <Form.Item label="上边距" name="marginTop" initialValue={item.marginTop || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="下边距" name="marginBottom" initialValue={item.marginBottom || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右边距" name="marginLeftRight" initialValue={item.marginLeftRight || 0}>
        <Slider />
      </Form.Item>
    </Form>
  )
}

export default connect(({ h5Editor }) => ({
  h5Editor,
}))(Index)
