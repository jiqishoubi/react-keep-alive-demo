import { message, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getTradeGoodsList } from '@/services/afterSale'
import { useGetRow } from '@/hooks/useGetRow'

function newSubOrder(props) {
  //tabal 状态
  const [loading, setloading] = useState(false)
  //table数据
  const [data, setdata] = useState([])
  //总条数
  const [totalNum, settotalNum] = useState()
  //分页
  const [pageNum, setpageNum] = useState(1)

  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: totalNum,
    pageSizeOptions: ['10'],
    defaultPageSize: 10,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const [columns] = useState([
    {
      dataIndex: 'tradeNo',
      title: '订单编号',
      align: 'center',
    },
    {
      dataIndex: 'goodsCode',
      title: '商品编号',
      align: 'center',
    },
    {
      dataIndex: 'skuName',
      title: '商品名称',
      align: 'center',
    },

    {
      dataIndex: 'skuPriceStr',
      title: '商品金额(元)',
      align: 'center',
    },

    {
      dataIndex: 'skuCount',
      title: '数量',
      align: 'center',
    },
  ])

  // 多选
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      props.newSubOrderChange(selectedRows)
    },
  }
  //分页被点击
  function pageChange(e) {
    setpageNum(e.current)
  }

  useEffect(() => {
    init({})
  }, [pageNum])
  //数据
  async function init(values) {
    setloading(true)
    values['page'] = pageNum
    values['rows'] = 10
    values['tradeNo'] = props.popData
    let res = await getTradeGoodsList(values)

    if (res && res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].id
        }
        setdata(len)
      }

      settotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }

    setloading(false)
  }

  return (
    <>
      <Table
        rowClassName={useGetRow}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        onChange={pageChange}
        pagination={paginationProps}
        loading={loading}
        columns={columns}
        dataSource={data}
      />
    </>
  )
}
export default newSubOrder
