import { useState, useMemo, useEffect, useRef, Fragment } from 'react'
import { Col, Form, Select } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import requestw from '@/utils/requestw'

const { Option } = Select

/**
 *
 * @param {object} props
 * @param {number} [props.colSpan=4]
 * @param {string[]} [props.nameArr=['goodsGroupCode', 'subGoodsGroupCode']]
 * @returns
 */
function Index(props) {
  const { colSpan = 4, nameArr = ['goodsGroupCode', 'subGoodsGroupCode'] } = props

  const formRef = useRef()

  // 一级分类改变
  function handleGroupCodeChange() {
    formRef.current?.setFieldsValue({ [nameArr[1]]: undefined }) // 清空二级分类
  }

  return (
    <Fragment>
      <Col span={colSpan}>
        <Form.Item name={nameArr[0]}>
          <FetchSelect
            placeholder="一级分类"
            api="/web/system/goodsGroup/getFirstGroupList"
            formData={{
              page: 1,
              rows: 900,
            }}
            dealResFunc={(data) => data?.data ?? []}
            valueKey="groupCode"
            textKey="groupName"
            showSearch
            filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={handleGroupCodeChange}
          />
        </Form.Item>
      </Col>
      <Col span={colSpan}>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) => {
            const key = nameArr[0]
            return prevValues[key] !== curValues[key]
          }}
        >
          {(form) => {
            if (!formRef.current) formRef.current = form
            const value1 = form.getFieldValue(nameArr[0])
            return (
              <Form.Item name={nameArr[1]}>
                <FetchSelect
                  placeholder="二级分类"
                  api="/web/system/goodsGroup/getSecondGroupList"
                  formData={{
                    groupCode: value1,
                  }}
                  valueKey="groupCode"
                  textKey="groupName"
                  showSearch
                  filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                />
              </Form.Item>
            )
          }}
        </Form.Item>
      </Col>
    </Fragment>
  )
}
export default Index
