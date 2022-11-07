import React from 'react'
import { connect } from 'dva'
import { Tabs, Button, Form, Input, Radio } from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { getOrgKind } from '@/utils/utils'

const { TabPane } = Tabs

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = (props) => {
  const { dispatch, h5Editor } = props
  const { isPageConfig, pageConfig, itemList, activeItem } = h5Editor

  const onFormValuesChange = (changedValues) => {
    //处理
    const changedValuesTemp = {
      ...changedValues,
    }

    dispatch({
      type: 'h5Editor/save',
      payload: {
        pageConfig: {
          ...pageConfig,
          ...changedValuesTemp,
        },
      },
    })
  }

  return (
    <div>
      <Tabs tabBarStyle={{ marginBottom: 0 }}>
        <TabPane tab="常规" key="1">
          <div>
            <Form {...formItemLayout} onValuesChange={onFormValuesChange} initialValues={pageConfig} style={{ paddingTop: 15 }}>
              <Form.Item label="名称" name="templateDataName">
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item label="页面背景颜色" name="backgroundColor">
                <ColorPicker key="backgroundColor" />
              </Form.Item>
              {getOrgKind().isCompany && (
                <Form.Item label="是否默认" name="ifDefault">
                  <Radio.Group>
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ h5Editor }) => ({
  h5Editor,
}))(Index)
