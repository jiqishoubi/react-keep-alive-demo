import { Button, Form, message, Table } from 'antd'
import React, { useEffect, useState } from 'react'

import { getPersonTicketDetailList } from '@/services/marketing'
import { useGetRow } from '@/hooks/useGetRow'

function movableDataMinute(props) {
  //分页
  const [pageNum, setpageNum] = useState(1)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //详情页面数据
  const [onlydata, setonlydata] = useState(props.onlyData)
  const [data, setdata] = useState([])

  const [Columns] = useState([
    {
      dataIndex: 'ticketDetailNo',
      title: '客户ID',
      align: 'center',
    },
    {
      dataIndex: 'ticketCode',
      title: '订单编号',
      align: 'center',
    },
    {
      align: 'center',
      title: '订单金额(元)',
      dataIndex: 'ticketExplain',
    },
    {
      align: 'center',

      title: '下单时间',
      render: (e) => {
        return (
          <div>
            <span>{e.effectDateStr}</span>
            <span>至</span>
            <span>{e.expireDateStr}</span>
          </div>
        )
      },
    },

    {
      align: 'center',
      dataIndex: 'tradeNo',
      title: '操作',
    },
  ])
  const [operateColumns] = useState([
    {
      dataIndex: 'ticketDetailNo',
      title: '客户ID',
      align: 'center',
    },
    {
      dataIndex: 'ticketCode',
      title: '领取时间',
      align: 'center',
    },
    {
      align: 'center',
      title: '优惠券编号',
      dataIndex: 'ticketExplain',
    },
    {
      align: 'center',
      title: '卡券编号',
      dataIndex: 'ticketExplain',
    },
    {
      align: 'center',
      dataIndex: 'fromName',
      title: '面额',
    },
    {
      align: 'center',

      title: '有效期',
      render: (e) => {
        return (
          <div>
            <span>{e.effectDateStr}</span>
            <span>至</span>
            <span>{e.expireDateStr}</span>
          </div>
        )
      },
    },
    {
      align: 'center',
      dataIndex: 'fromName',
      title: '来源',
    },
  ])
  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['20'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }
  useEffect(() => {
    getPersonTicketDetailList_()
  }, [pageNum])

  async function getPersonTicketDetailList_() {
    let values = {
      personCode: onlydata.person_code,
      page: pageNum,
      rows: 10,
    }
    let res = await getPersonTicketDetailList(values)

    if (res && res.code === '0') {
      setdata(res.data)
    } else {
      message.error(res.message)
    }
  }

  // 分页点击
  function pageChange(e) {
    setpageNum(e.current)
  }

  return (
    <>
      <div className="positionre" style={{ height: '1000px' }}>
        <Form>
          <Form.Item style={{ margin: '0  20px ' }}>
            <div
              style={{
                fontSize: '14px',
                background: '#F8F8F8',
                marginBottom: '40px',
              }}
            >
              基本信息
            </div>
          </Form.Item>
          <div style={{ marginLeft: '100px' }}>
            <div className="flexjs">
              <Form.Item
                label="活动编号"
                style={{
                  marginBottom: '15px',
                  width: '300px',
                }}
              >
                <span style={{ marginLeft: '29px' }}>{onlydata ? onlydata.person_code : ''}</span>
              </Form.Item>

              <Form.Item
                label="活动名称"
                style={{
                  marginBottom: '15px',
                }}
              >
                <span style={{ marginLeft: '30px' }}>{onlydata ? onlydata.uesd : ''}</span>
              </Form.Item>
            </div>
            <div className="flexjs">
              <Form.Item
                label="参与人数(人)"
                style={{
                  marginBottom: '15px',
                  width: '300px',
                }}
              >
                <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.user_alias : ''}</span>
              </Form.Item>

              <Form.Item
                label="订单数量(笔)"
                style={{
                  marginBottom: '20px',
                }}
              >
                <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.expire : ''}</span>
              </Form.Item>
            </div>
            <div className="flexjs">
              <Form.Item
                label="交易金额(元)"
                style={{
                  marginBottom: '15px',
                  width: '300px',
                }}
              >
                <span style={{ marginLeft: '8px' }}>{onlydata ? onlydata.uesd : ''}</span>
              </Form.Item>
            </div>
          </div>
          <Form.Item style={{ margin: '0  20px ' }}>
            <div
              style={{
                fontSize: '14px',
                background: '#F8F8F8',
                marginBottom: '40px',
              }}
            >
              优惠券详情
            </div>
          </Form.Item>

          <div>
            <Table
              rowClassName={useGetRow}
              //待修改
              onChange={pageChange}
              pagination={paginationProps}
              disabled={true}
              columns={operateColumns}
              dataSource={data}
            />
          </div>

          <div style={{ margin: '20px  0px' }}>
            <Button style={{ width: '100px', borderRadius: '4px' }} onClick={props.minute} type="primary" htmlType="submit">
              返回
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
export default movableDataMinute
