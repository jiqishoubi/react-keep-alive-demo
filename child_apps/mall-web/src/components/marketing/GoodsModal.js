import { Button, Form, Input, message, Modal, Space, Table } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { getGoodsList } from '@/services/marketing'
import { useGetRow } from '@/hooks/useGetRow'
import _ from 'lodash'

function goodsModal(props) {
  //商品的数据
  const [form] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(5)
  //商品loaading
  const [goodsLoading, setgoodsLoading] = useState(false)
  //商品
  const [goodsData, setgoodsData] = useState([])

  //商品数据总量
  const [goodtableListTotalNum, setgoodtableListTotalNum] = useState(0)

  const rowKey = 'goodsCode'
  const [selectedData, setSelectedData] = useState(props.scopeCodeData)
  const [selectedDataName, setSelectedDataName] = useState(props.scopeCodeData)
  const selectedRowKeys = selectedData.map((row) => row[rowKey])
  const selectedRowName = selectedData.map((row) => row['goodsName'])
  const goodsColumns = [
    {
      dataIndex: 'goodsCode',
      title: '商品编号',
      align: 'center',
    },
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
    },
  ]
  useEffect(() => {
    goodOnFinish()
  }, [])
  //商品分页
  function goodPageChange(e, f) {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  //商品查询
  async function goodOnFinish() {
    pageRef.current = 1
    getTableList()
  }

  const getTableList = async () => {
    setgoodsLoading(true)
    let values = form.getFieldsValue()
    values['page'] = pageRef.current
    values['orgCode'] = 'ORGSHYY00001'
    values['rows'] = pageSizeRef.current
    let res = await getGoodsList(values)
    if (res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].goodsCode
        }
        setgoodsData(len)
      }
      setgoodtableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setgoodsLoading(false)
  }
  //多选
  const rowSelection = {
    selectedRowKeys,
    onSelect: (row, isSelected, _) => {
      updateSelectedRows(isSelected, [row])
    },
    onSelectAll: (isSelected, _, changeRows) => {
      updateSelectedRows(isSelected, changeRows)
    },
  }
  //批量
  const updateSelectedRows = (isSelected, list) => {
    let arr = []
    let arrName = []
    if (isSelected) {
      arr = _.uniqBy([...selectedData, ...list], rowKey)
      arrName = _.uniqBy([...selectedDataName, ...list], 'goodsName')
    } else {
      arr = _.differenceBy(selectedData, list, rowKey) // 从第一个数组删除第二个数组中的元素
      arrName = _.differenceBy(selectedDataName, list, 'goodsName') // 从第一个数组删除第二个数组中的元素
    }
    setSelectedData(arr)
    setSelectedDataName(arrName)
  }

  useEffect(() => {
    let code = selectedRowKeys.join(',')
    props.goodsDatas(code, selectedData)
    let name = selectedRowName.join(',')
    props.goodsNames(name, selectedDataName)
  }, [selectedRowKeys])

  return (
    <>
      <Form form={form} onFinish={goodOnFinish}>
        <div>
          <Space>
            <Form.Item name="goodsName" style={{ width: 210 }}>
              <Input placeholder="请输入商品名称" />
            </Form.Item>
          </Space>
          <Button style={{ marginLeft: '10px', borderRadius: '4px' }} type="primary" size="middle" htmlType="submit">
            查询
          </Button>
        </div>
      </Form>
      <div className="positionre">
        <Table
          rowClassName={useGetRow}
          rowSelection={rowSelection}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageRef.current,
            pageSize: pageSizeRef.current,
            total: goodtableListTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: goodPageChange,
          }}
          loading={goodsLoading}
          columns={goodsColumns}
          dataSource={goodsData}
        />
      </div>
    </>
  )
}
export default goodsModal
