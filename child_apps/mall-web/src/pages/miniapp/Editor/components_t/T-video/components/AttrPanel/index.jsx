import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import lodash from 'lodash'
import { Form, Input, Select } from 'antd'
import BUpload from '@/components/BUpload'
import SelectItemFromTable from '@/components/SelectItemFromTable'
import { onValuesChange, goTypeOptionsList, getSelectItemFromTableProps } from '../../../../utils_editor'

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

  const [goTypeState, setGoTypeState] = useState(undefined)

  const init = () => {
    let list = lodash.cloneDeep(itemList)
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.id == activeItem.id) {
        formRef.setFieldsValue({
          ...item,
        })
        break
      }
    }
  }

  useEffect(() => {
    init()
  }, [itemList, activeItem])

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  const onGoTypeChange = useCallback(
    (val) => {
      setGoTypeState(val)
      selectItemFromTableRef.current?.resetVal()
    },
    [selectItemFromTableRef]
  )

  const SelectItemFromTableProps = getSelectItemFromTableProps(goTypeState)

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
      style={{ paddingTop: 10 }}
    >
      <Form.Item label="视频" name="videoUrl" rules={[{ required: true, message: '请上传视频' }]}>
        <BUpload
          valueType="string"
          type="video"
          listType="text"
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
    </Form>
  )
}

export default connect(({ h5Editor }) => ({
  h5Editor,
}))(Index)
