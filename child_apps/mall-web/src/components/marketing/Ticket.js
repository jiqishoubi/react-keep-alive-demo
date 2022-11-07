import { Button, Form, Input, message, Modal, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getValidTicketList } from '@/services/marketing'
import { useGetRow } from '@/hooks/useGetRow'
import _ from 'lodash'

function ticket(props) {
  //优惠券选择数据
  //满减券
  const [ticketCode, setticketCode] = useState()
  //优惠券 input展示
  const [ticketName, setticketName] = useState()

  //s优惠券数据
  const [ticketData, setticketData] = useState([])
  //优惠券loaading
  const [ticketLoading, setticketLoading] = useState(false)
  //优惠券上次values
  const [oldticketvalues, setoldticketvalues] = useState([])
  //d优惠券数据总量
  const [ticketleListTotalNum, setticketleListTotalNum] = useState(0)
  const [ticketpageNum, setticketpageNum] = useState(0)

  const rowKey = 'ticketCode'
  const [selectedData, setSelectedData] = useState([])
  const [selectedDataName, setSelectedDataName] = useState([])
  const selectedRowKeys = selectedData.map((row) => row[rowKey])
  const selectedRowName = selectedData.map((row) => row['ticketName'])

  //ticketpaginationProps
  const ticketpaginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: ticketleListTotalNum,
    pageSizeOptions: ['5'],
    defaultPageSize: 5,
    current: ticketpageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const [ticketColumns] = useState([
    {
      dataIndex: 'ticketCode',
      title: '优惠券编号',
      align: 'center',
    },
    {
      dataIndex: 'ticketName',
      title: '优惠券名称',
      align: 'center',
    },
    {
      dataIndex: 'scopeTypeName',
      title: '适用范围类型',
      align: 'center',
    },
    {
      dataIndex: 'ticketExplain',
      title: '满减金额',
      align: 'center',
    },
  ])
  useEffect(() => {
    ticketOnFinish({})
  }, [])

  useEffect(() => {
    props.ticketDatas(selectedRowName, selectedRowKeys)
  }, [selectedData])
  //卡券查询
  //卡券分页
  function ticketChange(e) {
    let values = oldticketvalues
    values['page'] = e.current
    setticketpageNum(e.current)

    ticketOnFinish(values)
  }

  //卡券查询
  async function ticketOnFinish(values) {
    setticketLoading(true)
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }
    let page
    if (values && values.page) {
      page = values.page
      delete values.page
    }

    let news = JSON.stringify(values)
    let old = JSON.stringify(oldticketvalues)
    if (news !== old) {
      setoldticketvalues(values)
      values['page'] = 1
      setticketpageNum(1)
    } else {
      values['page'] = page
    }

    values['rows'] = 5

    let res = await getValidTicketList(values)

    if (res && res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].ticketCode
        }
        setticketData(len)
      }
      setticketleListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setticketLoading(false)
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

  return (
    <>
      <Form onFinish={ticketOnFinish}>
        <div>
          <Space>
            <Form.Item name="ticketName" style={{ width: 210 }}>
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Space>
          <Button style={{ marginLeft: '10px', borderRadius: '4px' }} type="primary" size="middle" htmlType="submit">
            查询
          </Button>
        </div>
      </Form>
      <div className="positionre">
        <Table rowSelection={rowSelection} onChange={ticketChange} pagination={ticketpaginationProps} loading={ticketLoading} columns={ticketColumns} dataSource={ticketData} />
      </div>
    </>
  )
}
export default ticket
