import { Button, DatePicker, Form, Input, message, Modal, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { getToday } from '@/utils/utils'
import { getDisputeTradeList } from '@/services/afterSale'
import { useGetRow } from '@/hooks/useGetRow'

function newPop(props) {
  const { RangePicker } = DatePicker
  //tabal 状态
  const [newPoploading, setloading] = useState(false)
  //table数据
  const [data, setdata] = useState([])
  //总条数
  const [totalNum, settotalNum] = useState()
  //分页
  const [pageNum, setpageNum] = useState(1)
  // setoldData上一次的数据
  const [oldData, setoldData] = useState({})
  //监控页面变动
  const [clickPag, setclickPag] = useState()

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
      dataIndex: 'tradeTypeName',
      title: '订单类型',
      align: 'center',
    },
    {
      dataIndex: 'tradeStatusName',
      title: '订单状态',
      align: 'center',
    },
    {
      dataIndex: 'tradeFeeStr',
      title: '金额(元)',
      align: 'center',
    },
    {
      dataIndex: 'tradeDateStr',
      title: '下单时间',
      align: 'center',
    },
    {
      dataIndex: 'custName',
      title: '收货人',
      align: 'center',
    },
    {
      dataIndex: 'custMobile',
      title: '手机号',
      align: 'center',
    },
    {
      align: 'center',
      title: '地址',
      render: (e) => {
        return (
          <>
            <span>{e.provinceName}</span>
            <span>{e.eparchyName}</span>
            <span>{e.cityName}</span>
            <span>{e.address}</span>
          </>
        )
      },
    },
  ])

  //父订单选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let data = selectedRows[0].tradeNo
      let datacode = selectedRows[0].tradeUserCode

      props.newPopChange(data, datacode)
    },
  }
  //点击改变页数
  useEffect(() => {
    document.getElementById('newpopinit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  //表单数据
  async function onFinish(values) {
    delete values.page
    if (!values['times']) {
      values['startDate'] = getToday()
      values['endDate'] = getToday()
      delete values.times
    } else {
      values['startDate'] = values['times'][0].format('YYYY-MM-DD')
      values['endDate'] = values['times'][1].format('YYYY-MM-DD')
      delete values.times
    }
    let news = JSON.stringify(values)

    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['page'] = 1
    } else {
      values['page'] = pageNum
    }

    setloading(true)

    values['rows'] = 10
    for (let key in values) {
      if (values[key] instanceof Array) {
        values[key] = values[key].join(',')
      }
    }
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }
    let res = await getDisputeTradeList(values)

    if (res && res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].tradeNo
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
      <Form onFinish={onFinish}>
        <div>
          <Space>
            <Form.Item name="tradeNo" style={{ width: 170 }}>
              <Input placeholder="订单编号" />
            </Form.Item>
            <Form.Item name="custName" style={{ width: 170 }}>
              <Input placeholder="收货人" />
            </Form.Item>
            <Form.Item name="custMobile" style={{ width: 170 }}>
              <Input placeholder="手机号" />
            </Form.Item>
            <Form.Item name="times">
              <RangePicker
                allowClear={false}
                defaultPickerValue={[moment(getToday(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]}
                defaultValue={[moment(getToday(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]}
              />
            </Form.Item>
          </Space>

          <Button id="newpopinit" style={{ marginLeft: '10px', borderRadius: '4px' }} type="primary" size="middle" htmlType="submit">
            查询
          </Button>
        </div>
      </Form>
      <div className="positionre">
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          rowClassName={useGetRow}
          scroll={{ y: 240 }}
          onChange={pageChange}
          pagination={paginationProps}
          loading={newPoploading}
          columns={columns}
          dataSource={data}
        />
      </div>
    </>
  )
}
export default newPop
