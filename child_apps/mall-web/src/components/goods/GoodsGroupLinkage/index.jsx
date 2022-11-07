import { useEffect, useMemo, useState, useRef } from 'react'
import { Form, Space, Button, Row, Col, Select } from 'antd'
import { cloneDeep } from 'lodash'
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import requestw from '@/utils/requestw'

const { Option } = Select

/**
 * @typedef IValueItem
 * @property {string} groupCode 一级分类
 * @property {string} subGroupCode 二级分类
 */

/**
 *
 * @param {object} props
 * @param {IValueItem[]} props.value 是一个数组
 * @param {(v:IValueItem[])=>void)} props.onChange
 *
 * @param {number} [props.length=1]
 * @param {boolean} [props.disabled=false]
 * @returns
 */
function Index(props) {
  const { value, onChange, length = 1, disabled = false } = props

  const formRef = useRef(null) // 保存一下formRef 目前没用到

  const [typeList1, setTypeList1] = useState([]) // 一级分类
  const typeList2Arr = useMemo(() => {
    return (value ?? []).map((valueItem) => {
      return typeList1.find((item) => item.groupCode == valueItem.groupCode)?.children ?? []
    })
  }, [typeList1, value])

  useEffect(() => {
    // 获取基础数据
    requestw({
      url: '/web/system/goods/getGoodsGroupPaggingList',
      data: {
        page: 1,
        rows: 300,
      },
      isNeedCheckResponse: true,
    }).then((data) => {
      setTypeList1(data?.data ?? [])
    })
  }, [])

  function emitValue(setValueFunc) {
    const valueTemp = cloneDeep(value)
    const newValue = setValueFunc(valueTemp)
    onChange && onChange(newValue)
  }

  function handleType1Change(code, index) {
    emitValue((arr) => {
      arr[index].groupCode = code
      arr[index].subGroupCode = ''
      return arr
    })
  }

  function handleType2Change(subCode, index) {
    emitValue((arr) => {
      arr[index].subGroupCode = subCode
      return arr
    })
  }

  function add() {
    emitValue((arr) => {
      return [...arr, { groupCode: '', subGroupCode: '' }]
    })
  }

  function remove(index) {
    emitValue((arr) => {
      arr.splice(index, 1)
      return arr
    })
  }

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        if (!formRef.current) formRef.current = form
        return (
          <>
            {(value ?? []).map((field, index) => {
              const typeList2 = typeList2Arr[index] ?? []
              return (
                <Form.Item key={index} style={{ marginBottom: 0 }}>
                  <Space align="baseline">
                    <Form.Item
                      fieldKey={index}
                      // key={index}
                      name={['goodsGroupRelationList', index, 'subGroupCode']}
                      rules={[{ required: true, message: '请选择商品类目' }]}
                      //
                    >
                      <Row gutter={10}>
                        <Col>
                          <Select
                            placeholder="请选择一级类目"
                            value={value?.[index]?.groupCode || undefined}
                            onChange={(code) => handleType1Change(code, index)}
                            disabled={disabled}
                            style={{ width: 200 }}
                          >
                            {typeList1.map((item) => (
                              <Option key={item.groupCode} value={item.groupCode}>
                                {item.groupName}
                              </Option>
                            ))}
                          </Select>
                        </Col>
                        <Col>
                          <Select
                            placeholder="请选择二级类目"
                            value={value?.[index]?.subGroupCode || undefined}
                            onChange={(subCode) => handleType2Change(subCode, index)}
                            disabled={disabled}
                            style={{ width: 200 }}
                          >
                            {typeList2.map((item) => (
                              <Option key={item.groupCode} value={item.groupCode}>
                                {item.groupName}
                              </Option>
                            ))}
                          </Select>
                        </Col>
                      </Row>
                    </Form.Item>
                    {value?.length > 1 && <MinusCircleOutlined onClick={() => remove(index)} />}
                  </Space>
                </Form.Item>
              )
            })}
            {value?.length < length && (
              <Button style={{ borderRadius: 8 }} type="primary" onClick={() => add()}>
                添加分类
              </Button>
            )}
          </>
        )
      }}
    </Form.Item>
  )
}
export default Index
