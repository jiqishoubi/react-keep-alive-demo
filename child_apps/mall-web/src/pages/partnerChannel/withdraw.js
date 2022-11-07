import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, message, Select, Space, Table } from 'antd'
import moment from 'moment'
import { getUserPaymentListPaging } from '@/services/channel'
import locale from 'antd/lib/date-picker/locale/zh_CN'

import 'moment/locale/zh-cn'
import { useGetRow } from '@/hooks/useGetRow'
import { CaretDownOutlined } from '@ant-design/icons'
import requestw from '@/utils/requestw'

moment.locale('zh-cn')

function withdraw() {
  const [form] = Form.useForm()
  const { RangePicker } = DatePicker
  //页数
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  //状态
  const [loading, setloading] = useState(false)
  //Data 数据
  const [withdrawData, setwithdrawData] = useState([])

  //account状态
  const [withdrawList, setwithdrawList] = useState([
    { name: '待审批', value: '30' },
    { name: '提现成功', value: '90' },
    { name: '提现失败', value: '93' },
  ])

  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState()
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const [columns] = useState([
    {
      dataIndex: 'paymentNo',
      title: '提现单号',
      align: 'center',
      key: 'key',
    },
    {
      dataIndex: 'phoneNumber',
      title: '账号',
      align: 'center',
      key: 'key',
    },
    {
      dataIndex: 'userName',
      title: '姓名',
      align: 'center',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'payDateStr',
      title: '申请时间',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'payFeeStr',
      title: '金额(元)',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'bankName',
      title: '提现银行',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'bankCardNo',
      title: '银行卡号',
      key: 'key',
    },

    {
      align: 'center',
      dataIndex: 'finishDateStr',
      title: '到账时间',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'statusName',
      title: '提现状态',
      key: 'key',
    },
    {
      align: 'center',
      title: '备注',
      key: 'key',
      render: (r) => {
        return <>{r.resultNote ? r.resultNote : '--'}</>
      },
    },
  ])

  // useEffect(() => {
  //   setTimeout(() => {
  //     document.getElementById('withdrawinit').click();
  //   }, 100);
  // }, []);

  //重置一下
  function resetSearch() {
    form.resetFields()
  }
  //点击改变页数
  useEffect(() => {
    document.getElementById('withdrawinit').click()
  }, [pageNum])
  //点击改变页数
  useEffect(() => {
    document.getElementById('withdrawinit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  async function onFinish(values) {
    if (!values['times']) {
      delete values.times
    } else {
      values['startTime'] = values['times'][0].format('YYYY-MM-DD')
      values['endTime'] = values['times'][1].format('YYYY-MM-DD')
      delete values.times
    }

    delete values.nowPage
    let news = JSON.stringify(values)

    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['nowPage'] = 1
    } else {
      values['nowPage'] = pageNum
    }

    setloading(true)

    values['rows'] = pageSize
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }
    for (let key in values) {
      if (values[key] instanceof Array) {
        values[key] = values[key].join(',')
      }
    }

    let res = await requestw({
      url: '/web/distribute/getUserPaymentListPaging',
      data: {
        ...values,
      },
    })
    if (res && res.code === '0') {
      setwithdrawData(res.data.data)
      settableListTotalNum(res.data.rowTop)
    } else {
      settableListTotalNum(0)
      message.error(res.message)
    }

    setloading(false)
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <div className="flexjs">
              <Form.Item name="times" style={{ width: 260, marginRight: '10px' }}>
                <RangePicker locale={locale} allowClear={false} />
              </Form.Item>

              <Form.Item
                name="paymentStatus"
                // label="提现状态"
                style={{ width: 220, marginRight: '10px' }}
              >
                <Select showArrow={true} placeholder="提现状态" allowClear={true}>
                  {withdrawList.map((r) => (
                    <Option key={r.value} value={r.value}>
                      {r.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="userName"
                // label="姓名"
                style={{ width: 220, marginRight: '10px' }}
              >
                <Input placeholder="姓名" />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                // label="账户"
                style={{ width: 220, marginRight: '10px' }}
              >
                <Input placeholder="账户" />
              </Form.Item>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                重置
              </Button>
              <Button style={{ borderRadius: '4px' }} id="withdrawinit" type="primary" size="middle" htmlType="submit">
                查询
              </Button>
            </div>
          </div>
        </Form>

        <div>
          <Table style={{ margin: '23px  20px' }} rowClassName={useGetRow} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={withdrawData} />
        </div>
      </div>
    </>
  )
}
export default withdraw
