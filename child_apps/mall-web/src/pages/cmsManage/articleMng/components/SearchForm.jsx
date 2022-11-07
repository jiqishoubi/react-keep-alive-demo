import React from 'react'
import { connect } from 'dva'
import { Form, Row, Col, Tooltip, Button, Input, Select, Space } from 'antd'
import { UndoOutlined } from '@ant-design/icons'
import FetchSelect from '@/components/FetchSelect'
import { getOrgKind } from '@/utils/utils'
import api_channel from '@/services/api/channel'

/**
 *
 * @param {*} props
 *
 * onClickAdd
 */

const { Option } = Select

const SearchFormItem = (props) => {
  const { width = 200 } = props
  return <div style={{ width }}>{props.children}</div>
}

const Index = (props) => {
  const [searchFormRef] = Form.useForm()
  const {
    dispatch,
    cmsManageArticleMngModel: { searchParams },
    //传进来的props
    onClickAdd,
  } = props

  const resetSearch = () => {
    searchFormRef.resetFields()
    dispatch({
      type: 'cmsManageArticleMngModel/save',
      payload: {
        searchParams: {},
      },
    })
  }

  const onSearch = () => {
    const values = searchFormRef.getFieldsValue()
    dispatch({
      type: 'cmsManageArticleMngModel/goSearch',
      payload: {
        //查询参数
        ...values,
      },
    })
  }

  return (
    <Form form={searchFormRef} style={{ marginBottom: 20 }}>
      <Row type="flex" gutter={10}>
        <Col>
          <SearchFormItem>
            <Form.Item name="textName">
              <Input allowClear placeholder="文章名称" />
            </Form.Item>
          </SearchFormItem>
        </Col>
        {getOrgKind().isAdmin && (
          <Col>
            <Form.Item name="orgCode" style={{ width: 220, marginRight: '10px' }}>
              <FetchSelect
                placeholder="供应商"
                api="/web/system/supplier/getSupplierPaggingList"
                formData={{ page: 1, rows: 9999 }}
                valueKey="orgCode"
                textKey="orgName"
                dealResFunc={(data) => data?.data || []}
                //搜索
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
        )}

        <Button style={{ borderRadius: '4px', marginRight: 10, marginLeft: 5 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
          重置
        </Button>

        <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" onClick={onSearch}>
          查询
        </Button>

        {!getOrgKind().isAdmin && (
          <Button style={{ borderRadius: '4px' }} type="primary" size="middle" onClick={onClickAdd}>
            新建
          </Button>
        )}
      </Row>
    </Form>
  )
}

export default connect(({ cmsManageArticleMngModel }) => {
  return {
    cmsManageArticleMngModel,
  }
})(Index)
