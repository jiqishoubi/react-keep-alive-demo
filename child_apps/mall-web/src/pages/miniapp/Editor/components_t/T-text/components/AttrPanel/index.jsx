import React, { useState, useRef } from 'react'
import { connect } from 'dva'
import { Form, Input, Select } from 'antd'
import SelectItemFromTable from '@/components/SelectItemFromTable'
import { onValuesChange, goTypeOptionsList, getSelectItemFromTableProps, goTypeOptionsListOne } from '../../../../utils_editor'

const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = (props) => {
  const selectItemFromTableRef = useRef()
  const { form, h5Editor, dispatch } = props
  const { itemList, activeItem } = h5Editor
  const item = itemList.find((obj) => obj.id == activeItem.id)
  const [goTypeState, setGoTypeState] = useState((item && item.goType) || undefined)

  const onGoTypeChange = (val) => {
    selectItemFromTableRef.current?.resetVal()
    setGoTypeState(val)
  }

  const SelectItemFromTableProps = getSelectItemFromTableProps(goTypeState)

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
      <Form.Item label="文字内容" name="content" initialValue={item.content}>
        <TextArea placeholder="请输入文字内容" style={{ minHeight: 120 }} />
      </Form.Item>

      {/* 跳转 */}
      <Form.Item label="跳转类型" name="goType" initialValue={item.goType}>
        <Select placeholder="请选择跳转类型" onChange={onGoTypeChange} allowClear>
          {goTypeOptionsListOne().map((obj, index) => (
            <Option key={index} value={obj.value} disabled={obj.disabled}>
              {obj.text}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {['allGoods', 'jumpMiniApp', 'wxArticle', 'miniPages'].every((r) => r !== goTypeState) && (
        <Form.Item label="跳转地址" name="goUrl">
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

export default connect(({ h5Editor }) => ({
  h5Editor,
}))(Index)
