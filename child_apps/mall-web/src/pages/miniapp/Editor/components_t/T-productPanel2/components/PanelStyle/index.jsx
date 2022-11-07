import React from 'react'
import { connect } from 'dva'
import { Form, Slider, Radio, Input } from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { onValuesChange } from '../../../../utils_editor'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const index = (props) => {
  const { form, h5Editor, dispatch } = props
  const { itemList, activeItem } = h5Editor

  const item = itemList.find((obj) => obj.id == activeItem.id)

  return (
    <Form
      style={{ paddingTop: 10 }}
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
      <Form.Item label="背景颜色" name="backgroundColor" initialValue={item.backgroundColor}>
        <ColorPicker key="backgroundColor" />
      </Form.Item>
      <Form.Item label="是否有标题" name="isHaveTitle" initialValue={item.isHaveTitle || true}>
        <Radio.Group>
          <Radio value={true}>有</Radio>
          <Radio value={false}>无</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="标题" name="titleText" initialValue={item.titleText || ''}>
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="标题颜色" name="titleColor" initialValue={item.titleColor}>
        <ColorPicker key="titleColor" />
      </Form.Item>
      <Form.Item label="是否有标题介绍" name="isHaveTitleDesc" initialValue={item.isHaveTitleDesc || true}>
        <Radio.Group>
          <Radio value={true}>有</Radio>
          <Radio value={false}>无</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="标题介绍" name="titleDescText" initialValue={item.titleDescText || ''}>
        <Input placeholder="请输入标题介绍" />
      </Form.Item>
      <Form.Item label="标题介绍颜色" name="titleDescColor" initialValue={item.titleDescColor}>
        <ColorPicker key="titleDescColor" />
      </Form.Item>
      <div>样式</div>
      <Form.Item label="上外边距" name="marginTop" initialValue={item.marginTop || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="下外边距" name="marginBottom" initialValue={item.marginBottom || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右外边距" name="marginLeftRight" initialValue={item.marginLeftRight || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="圆角" name="borderRadius" initialValue={item.borderRadius || 0}>
        <Slider />
      </Form.Item>
    </Form>
  )
}

export default connect(({ h5Editor }) => ({
  h5Editor,
}))(index)
