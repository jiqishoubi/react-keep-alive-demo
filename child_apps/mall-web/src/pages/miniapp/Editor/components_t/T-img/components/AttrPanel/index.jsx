import React, { memo, useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import { Form, Input, Select } from 'antd'
import BUpload from '@/components/BUpload'
import SelectItemFromTable from '@/components/SelectItemFromTable'
import { onValuesChange, goTypeOptionsListOne, getSelectItemFromTableProps } from '../../../../utils_editor'

const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = (props) => {
  const { form, h5Editor, dispatch } = props
  const { itemList, activeItem } = h5Editor
  const [formRef] = Form.useForm()
  const selectItemFromTableRef = useRef()

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  const [goTypeState, setGoTypeState] = useState((item && item.goType) || undefined)

  useEffect(() => {
    formRef.setFieldsValue({
      ...item,
    })
  }, [item])

  const onGoTypeChange = (val) => {
    setGoTypeState(val)
    selectItemFromTableRef.current?.resetVal()
  }

  const SelectItemFromTableProps = getSelectItemFromTableProps(goTypeState)

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
    <Form form={formRef} {...formItemLayout} onValuesChange={onFormChange} style={{ paddingTop: 30 }}>
      <Form.Item label="图片" name="imgUrl" rules={[{ required: true, message: '请上传图片' }]}>
        <BUpload
          valueType="string"
          type="img"
          api="/web/sys/uploadFile"
          getPostData={(e) => {
            const file = e.file
            const fileExt = file.type.split('/')[1]
            return {
              fileExt,
              fileType: 'customIndex',
            }
          }}
        />
      </Form.Item>

      <Form.Item label="跳转类型" name="goType" initialValue={item.goType || undefined}>
        <Select placeholder="请选择跳转类型" onChange={onGoTypeChange} allowClear>
          {goTypeOptionsListOne().map((obj, index) => (
            <Option key={index} value={obj.value} disabled={obj.disabled}>
              {obj.text}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {['allGoods', 'jumpMiniApp', 'wxArticle', 'miniPages'].every((r) => r !== goTypeState) && (
        <Form.Item label="跳转地址" name="goUrl" initialValue={item.goUrl || ''}>
          <SelectItemFromTable
            onRef={(e) => {
              selectItemFromTableRef.current = e
            }}
            {...SelectItemFromTableProps}
          />
        </Form.Item>
      )}

      {(goTypeState === 'wxArticle' || goTypeState === 'miniPages') && (
        <>
          <Form.Item label="跳转地址/路径" name="goWx" initialValue={item.goWx || ''}>
            <Input placeholder="请输入跳转地址/路径" />
          </Form.Item>
        </>
      )}

      {goTypeState === 'jumpMiniApp' && (
        <>
          <Form.Item label="跳转小程序" name="goAppId" initialValue={item.goAppId}>
            <Input placeholder="请输入小程序AppId" />
          </Form.Item>
          <Form.Item label="跳转路径" name="goAppUrl" initialValue={item.goAppUrl || '/pages/index/index'}>
            <Input placeholder="请输入小程序AppId" />
          </Form.Item>
        </>
      )}
    </Form>
  )
}

export default memo(
  connect(({ h5Editor }) => ({
    h5Editor,
  }))(Index)
)
