import React, { useMemo, useEffect } from 'react'
import { connect } from 'dva'
import { Form, Slider, Radio, InputNumber, Select } from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { onValuesChange } from '../../../../utils_editor'

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const index = (props) => {
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
        <Slider max={600} />
      </Form.Item>
      <Form.Item label="大小" name="fontSize" initialValue={item.fontSize}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="颜色" name="color">
        <ColorPicker key="color" />
      </Form.Item>
      <Form.Item label="加粗" name="fontWeight" initialValue={item.fontWeight || 'normal'}>
        <Radio.Group>
          <Radio value="normal">不加粗</Radio>
          <Radio value="bold">加粗</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="对齐" name="justifyContent" initialValue={item.justifyContent || 'flex-start'}>
        <Select placeholder="请选择对齐方式">
          <Option value="flex-start">靠左</Option>
          <Option value="center">居中</Option>
          <Option value="flex-end">靠右</Option>
        </Select>
      </Form.Item>
      <Form.Item label="是否缩进" name="isIndent" initialValue={item.isIndent || false}>
        <Radio.Group>
          <Radio value={true}>缩进</Radio>
          <Radio value={false}>不缩进</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="上下边距" name="marginTopBottom" initialValue={item.marginTopBottom || 0}>
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
}))(index)
