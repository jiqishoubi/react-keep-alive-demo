import { Col, Form, Row, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'

const Index = (props) => {
  const [form] = Form.useForm()
  const [goodsTypeList, setGoodsTypeList] = useState([])
  const [goodsTypeList2, setGoodsTypeList2] = useState([])

  useEffect(() => {
    getSelect1()
  }, [])

  useEffect(() => {
    form.setFieldsValue(props.value)
    setTimeout(() => {
      typeChange(false)
    }, 10)
  }, [props.value])

  const getSelect1 = async () => {
    requestw({
      url: '/web/system/goods/getGoodsGroupPaggingList',
      data: {
        page: 1,
        rows: 300,
      },
      isNeedCheckResponse: true,
    }).then((data) => {
      const arr = data?.data ?? []
      setGoodsTypeList(arr)
    })
  }

  const typeChange = async (show) => {
    let typeId = form.getFieldValue('groupCode')
    show &&
      form.setFieldsValue({
        subGroupCode: '',
      })
    let res = await requestw({
      url: api_goods.querySecondGroupListForSelect(),
      data: {
        groupCode: typeId,
      },
    })
    if (res && res.code == '0' && res.data && res.data.length) {
      setGoodsTypeList2(res.data)
      if (!show) return
      form.setFieldsValue({ subGroupCode: res.data[0].groupCode })
      props.onChange(form.getFieldsValue())
    } else {
      setGoodsTypeList2([])
    }
  }
  return (
    <>
      <Form form={form} style={{ marginBottom: 0 }}>
        <Row wrap={false}>
          <Col style={{ marginRight: 12 }}>
            <Form.Item name="groupCode" rules={[{ required: true, message: '请选择商品分类' }]} style={{ marginBottom: 0 }}>
              <Select showArrow={true} placeholder="一级分类" onChange={() => typeChange(true)} style={{ width: 200 }}>
                {goodsTypeList &&
                  goodsTypeList.map((obj, index) => (
                    <Select.Option key={obj.groupCode} value={obj.groupCode}>
                      {obj.groupName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ marginRight: 12 }}>
            <Form.Item name="subGroupCode" rules={[{ required: true, message: '请选择商品分类' }]} style={{ marginBottom: 0 }}>
              <Select
                showArrow={true}
                placeholder="二级分类"
                onChange={() => {
                  props.onChange(form.getFieldsValue())
                }}
                style={{ width: 200 }}
              >
                {goodsTypeList2 &&
                  goodsTypeList2.map((obj) => (
                    <Select.Option key={obj.id} value={obj.groupCode}>
                      {obj.groupName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}
export default Index
