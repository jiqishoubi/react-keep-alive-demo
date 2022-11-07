import { Button, Form, message, Table } from 'antd'
import React, { useEffect, useState } from 'react'

import { getPersonTicketDetailList } from '@/services/marketing'
import { useGetRow } from '@/hooks/useGetRow'

function couponQueryMinute(props) {
  //分页
  const [pageNum, setpageNum] = useState(1)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //详情页面数据
  const [onlydata, setonlydata] = useState(props.onlyData)
  const [data, setdata] = useState([])

  const [operateColumns] = useState([
    {
      dataIndex: 'ticketDetailNo',
      title: '优惠券编号',
      align: 'center',
    },
    {
      dataIndex: 'ticketCode',
      title: '卡券编号',
      align: 'center',
    },
    {
      align: 'center',
      title: '面额',
      dataIndex: 'ticketExplain',
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
    {
      align: 'center',
      dataIndex: 'statusName',
      title: '状态',
    },
    {
      align: 'center',
      dataIndex: 'tradeNo',
      title: '关联订单号',
    },
  ])

  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10'],
    defaultPageSize: 10,
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
      setdata(res.data.data)
      settableListTotalNum(res.data.rowTop)
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
          <div className="fontMb">
            <Form.Item>
              <div className="marginlr20">基本信息</div>
            </Form.Item>
            <div style={{ marginLeft: '100px' }}>
              <div className="flexjs">
                <Form.Item
                  label="客&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID"
                  style={{
                    marginBottom: '15px',
                    width: '400px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.person_code : ''}</span>
                </Form.Item>

                <Form.Item
                  label="已使用优惠券数量"
                  style={{
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.uesd : ''}</span>
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  label="客&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;昵&nbsp;&nbsp;&nbsp;称"
                  style={{
                    marginBottom: '15px',
                    width: '400px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.user_alias : ''}</span>
                </Form.Item>

                <Form.Item
                  label="已过期优惠券数量"
                  style={{
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.expire : ''}</span>
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  label="可用优惠券数量"
                  style={{
                    marginBottom: '15px',
                    width: '400px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.unuesd : ''}</span>
                </Form.Item>

                <Form.Item
                  label="手机号"
                  style={{
                    marginBottom: '15px',
                    width: '400px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.phone_number : ''}</span>
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="fontMb">
            <Form.Item>
              <div className="marginlr20">优惠券详情</div>
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
          </div>
          <div style={{ margin: '20px  20px' }}>
            <Button style={{ width: '100px', borderRadius: '4px' }} onClick={props.minute} type="primary" htmlType="submit">
              返回
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
export default couponQueryMinute
