import React, { memo, useMemo, useCallback, useEffect } from 'react'
import { connect } from 'dva'
import { Form, Slider, InputNumber, Radio, Input, Select } from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { onValuesChange } from '../../../../utils_editor'

const { Option } = Select

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
      <Form.Item label="一行的数量" name="lineNum" initialValue={item.lineNum || 0}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="是否有标题" name="haveTitle" initialValue={item.haveTitle ? true : false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="标题对齐方式" name="titleTextAlign" initialValue={item.titleTextAlign}>
        <Select>
          <Option value="left">靠左</Option>
          <Option value="center">居中</Option>
          <Option value="right">靠右</Option>
        </Select>
      </Form.Item>
      <Form.Item label="是否有介绍" name="isHaveItemDesc" initialValue={item.isHaveItemDesc || false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate
        // shouldUpdate={(prevValues, curValues) =>
        //   prevValues.isHaveItemDesc !== curValues.isHaveItemDesc
        // }
      >
        {(form) => {
          return (
            form.getFieldValue('isHaveItemDesc') && (
              <>
                <Form.Item label="介绍左右外边距" name="itemDescLeftRightMargin" initialValue={item.itemDescLeftRightMargin || 0}>
                  <Slider />
                </Form.Item>
                <Form.Item label="介绍颜色" name="itemDescColor" initialValue={item.itemDescColor || ''}>
                  <ColorPicker key="itemDescColor" />
                </Form.Item>
                <Form.Item label="介绍字体大小" name="itemDescFontSize" initialValue={item.itemDescFontSize}>
                  <InputNumber />
                </Form.Item>
              </>
            )
          )
        }}
      </Form.Item>

      <Form.Item label="介绍行数" name="descLineNum" initialValue={item.descLineNum}>
        <InputNumber max={7} />
      </Form.Item>

      <div>元素样式</div>
      <Form.Item label="文字字体大小" name="titleTextFontSize" initialValue={item.titleTextFontSize}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="上外边距" name="marginTopItem" initialValue={item.marginTopItem || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="下外边距" name="marginBottomItem" initialValue={item.marginBottomItem || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右外边距" name="marginLeftRightItem" initialValue={item.marginLeftRightItem || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="上下内边距" name="paddingTopBottomItem" initialValue={item.paddingTopBottomItem || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="左右内边距" name="paddingLeftRightItem" initialValue={item.paddingLeftRightItem || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="圆角" name="borderRadiusItem" initialValue={item.borderRadiusItem || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="元素颜色" name="backgroundColorItem" initialValue={item.backgroundColorItem || 'transparent'}>
        <ColorPicker key="backgroundColorItem" />
      </Form.Item>
      <div>图片样式</div>
      <Form.Item label="图片左右边距" name="imgPaddingLeftRight" initialValue={item.imgPaddingLeftRight || 0}>
        <Slider />
      </Form.Item>
      <Form.Item label="图片高度">
        <Form.Item noStyle name="imgHeight" initialValue={item.imgHeight || 0}>
          <Slider max={500} />
        </Form.Item>
        <span>0代表自适应</span>
      </Form.Item>
      <Form.Item label="圆角" name="borderRadiusImg" initialValue={item.borderRadiusImg || 0}>
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
