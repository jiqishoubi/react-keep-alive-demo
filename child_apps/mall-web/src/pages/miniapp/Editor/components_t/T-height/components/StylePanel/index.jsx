import React, { memo, useMemo } from 'react'
import { connect } from 'dva'
import { Form, Slider, Radio } from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { onValuesChange } from '../../../../utils_editor'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const index = (props) => {
  const { form, h5Editor, dispatch } = props
  const { itemList, activeItem } = h5Editor

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  return (
    <Form
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
      style={{ paddingTop: 10 }}
    >
      <Form.Item label="高度" name="height" initialValue={item.height}>
        <Slider />
      </Form.Item>
      <Form.Item label="分割线" name="haveLine" initialValue={item.haveLine ? true : false}>
        <Radio.Group>
          <Radio value={true}>有</Radio>
          <Radio value={false}>无</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="左右外边距" name="marginLeftRight" initialValue={item.marginLeftRight || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右内边距" name="paddingLeftRight" initialValue={item.paddingLeftRight || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="背景颜色" name="backgroundColor" initialValue={item.backgroundColor || 'transparent'}>
        <ColorPicker key="backgroundColor" />
      </Form.Item>
    </Form>
  )
}

export default memo(
  connect(({ h5Editor }) => ({
    h5Editor,
  }))(index)
)
