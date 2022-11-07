import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Table } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { useGetRow } from '@/hooks/useGetRow'
import { getMonopolyGoodsList, addGroupMonopolyGoods, delGroupMonopolyGoods } from '@/services/groupmgr'
import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'
const goodsModal = (props) => {
  const { groupCode, changeGoodsModal } = props

  const [form] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState('')
  const rowKey = 'goodsCode'
  const [selectedData, setSelectedData] = useState([])
  const selectedRowKeys = selectedData.map((row) => row[rowKey])
  const [goodTypeList, setGoodTypeList] = useState([])

  useEffect(() => {
    onFinish()
    getGoodType()
  }, [])

  const columns = [
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
    },
    {
      title: '商品编码',
      align: 'center',
      dataIndex: 'goodsCode',
    },
    {
      dataIndex: 'ifMonopoly',
      title: '是否销售',
      align: 'center',
      render: (e) => {
        return e == 0 ? '否' : '是'
      },
    },
    {
      dataIndex: 'goodsTypeName',
      title: '商品类型',
      align: 'center',
    },
    {
      dataIndex: 'createDateStr',
      title: '创建时间',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (e) => {
        return e.ifMonopoly == 0 ? (
          <a
            onClick={() => {
              addGroupmgr(e.goodsCode, 1)
            }}
          >
            设置销售
          </a>
        ) : (
          <a
            onClick={() => {
              deleteGroupmgr(e.goodsCode, 1)
            }}
          >
            取消销售
          </a>
        )
      },
    },
  ]

  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setTableLoading(true)
    let values = form.getFieldsValue()
    values['page'] = pageRef.current
    values['rows'] = pageSizeRef.current
    values['distributeGroupCode'] = groupCode
    let res = await getMonopolyGoodsList(values)
    if (res && res.code === '0') {
      setTableData(res.data.data)
      setRecordTotalNum(res.data.rowTop)
    }

    setTableLoading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  //table批量设置
  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    getCheckboxProps: (record) => {
      return {
        disabled: false,
      }
    },
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
    if (isSelected) {
      arr = _.uniqBy([...selectedData, ...list], rowKey)
    } else {
      arr = _.differenceBy(selectedData, list, rowKey) // 从第一个数组删除第二个数组中的元素
    }
    setSelectedData(arr)
  }
  //设置专营
  const addGroupmgr = async (code, source) => {
    let postData = {
      groupCode,
      goodsCodeStr: '',
    }
    if (source === 0) {
      postData.goodsCodeStr = code.join(',')
    } else {
      postData.goodsCodeStr = code
    }
    let res = await addGroupMonopolyGoods(postData)
    if (res && res.code === '0') {
      getTableList()
      message.success(res.message || '成功')
      setSelectedData([])
    } else {
      message.warn(res.message || '失败')
    }
  }
  // 取消专营
  const deleteGroupmgr = async (code, source) => {
    let postData = {
      groupCode,
      goodsCodeStr: '',
    }
    if (source === 0) {
      postData.goodsCodeStr = code.join(',')
    } else {
      postData.goodsCodeStr = code
    }
    let res = await delGroupMonopolyGoods(postData)
    if (res && res.code === '0') {
      getTableList()
      message.success(res.message || '成功')
      setSelectedData([])
    } else {
      message.warn(res.message || '失败')
    }
  }
  //获取商品类型
  const getGoodType = async () => {
    let res = await requestw({
      url: api_goods.getSysCodeByParam,
      data: { codeParam: 'GOODS_TYPE' },
    })
    if (res && res.code == '0') {
      setGoodTypeList(res.data)
    }
  }

  return (
    <>
      <Modal visible={groupCode} width={1100} onCancel={changeGoodsModal} footer={false}>
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={[15, 5]}>
              <Col span={5}>
                <Form.Item name="goodsName">
                  <Input placeholder="商品名称" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="goodsType">
                  <Select placeholder="商品类型">
                    {goodTypeList.map((obj) => (
                      <Select.Option key={obj.id} value={obj.codeKey}>
                        {obj.codeDesc}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="ifMonopoly">
                  <Select placeholder="是否销售">
                    <Select.Option value={0}>否</Select.Option>
                    <Select.Option value={1}>是</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginRight: 10 }}
                  type="primary"
                  size="middle"
                  onClick={() => {
                    addGroupmgr(selectedRowKeys, 0)
                  }}
                >
                  批量销售
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginRight: 10 }}
                  type="primary"
                  size="middle"
                  onClick={() => {
                    deleteGroupmgr(selectedRowKeys, 0)
                  }}
                >
                  取消销售
                </Button>
              </Col>
            </Row>
          </div>
        </Form>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '40px  20px' }}
          rowKey="goodsCode"
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          rowSelection={rowSelection}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageRef.current,
            pageSize: pageSizeRef.current,
            total: recordTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: onPageChange,
          }}
        />
      </Modal>
    </>
  )
}
export default goodsModal
