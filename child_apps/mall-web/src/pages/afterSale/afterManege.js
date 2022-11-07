import { Form, DatePicker, Input, Select, Space, Button, Radio, Table, Modal, message } from 'antd'

import React, { useEffect, useState } from 'react'
import { CaretDownOutlined, RedoOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getToday, getYesterday } from '@/utils/utils'

import { getDisputeOrderListPaging } from '@/services/afterSale'
import AfterMinute from '@/components/AfterSale/AfterMinute'
import NewAfter from '@/components/AfterSale/NewAfter'
import { useGetRow } from '@/hooks/useGetRow'
function afterManege() {
  const [form] = Form.useForm()
  const { TextArea } = Input
  //分页
  const [pageNum, setpageNum] = useState(1)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState('')
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
  //table loding 展示
  const [loading, setloading] = useState(false)
  //详情页面啊是否展示
  const [onlyinit, setonlyinit] = useState(false)

  //主页面是否展示
  const [init, setinit] = useState(true)

  //table数据
  const [tradeList, settradeList] = useState([])
  //订单号
  const [tradeNo, settradeNo] = useState()
  //审核按钮是否展示
  const [examineShow, setExamineShow] = useState(false)
  //NewAfter新建是否展示
  const [newAfter, setnewAfter] = useState(false)
  //s时间变化存储
  const [dates, setDates] = useState([])
  const { RangePicker } = DatePicker
  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['20'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const [columns] = useState([
    {
      dataIndex: 'orderNo',
      title: '售后单编号',
      align: 'center',
    },
    {
      dataIndex: 'tradeNo',
      title: '原订单编号',
      align: 'center',
    },
    {
      align: 'center',
      title: '申请时间',
      dataIndex: 'orderDateStr',
    },
    {
      align: 'center',
      dataIndex: 'orderTypeStr',
      title: '售后单类型',
    },
    {
      align: 'center',
      dataIndex: 'orderStatusStr',
      title: '售后状态',
    },
    {
      align: 'center',
      dataIndex: 'processNote',
      title: '审核意见',
      width: 120,
      render: (e) => {
        return e ? e : '--'
      },
    },

    {
      align: 'center',
      dataIndex: 'orderFrom',
      title: '来源',
    },
    {
      align: 'center',
      dataIndex: 'custName',
      title: '联系人',
    },
    {
      align: 'center',
      dataIndex: 'custMobile',
      title: '联系人手机号',
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => {
                getTradeInfo_(e)
              }}
            >
              详情
            </a>
            &nbsp;&nbsp;
            {e.orderStatusStr === '待商家审核' ? (
              <a
                onClick={() => {
                  afterExamine(e)
                }}
              >
                审核
              </a>
            ) : (
              ''
            )}
          </div>
        )
      },
    },
  ])

  //点击查看详情
  function getTradeInfo_(e) {
    setonlyinit(true)
    setinit(false)
    setExamineShow(false)
    settradeNo(e.orderNo)
    window.scroll(0, 0)
  }
  //点击审核
  function afterExamine(e) {
    setonlyinit(true)
    setinit(false)
    setExamineShow(true)
    settradeNo(e.orderNo)
    window.scroll(0, 0)
  }
  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //点击改变页数
  useEffect(() => {
    document.getElementById('afterManageInit').click()
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
    let news = JSON.stringify(values)

    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['page'] = 1
    } else {
      values['page'] = pageNum
    }

    setloading(true)
    if (!values['times']) {
      delete values.times
    } else {
      values['startDate'] = values['times'][0].format('YYYY-MM-DD')
      values['endDate'] = values['times'][1].format('YYYY-MM-DD') + '-' + '23' + '-' + '59' + '-' + '59'
      delete values.times
    }
    values['rows'] = 20
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
    let res = await getDisputeOrderListPaging(values)
    if (res && res.code === '0') {
      settradeList(res.data.data)
      settableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setloading(false)
  }
  //审核和详情与父组件的通信
  function afterMinuteChange(e) {
    setonlyinit(false)
    setinit(true)

    if (e === 0) {
      resetSearch()
      onFinish({})
    }
  }
  //新建与父组件的通信
  function newAfterChange(e) {
    setnewAfter(false)
    setinit(true)
    if (e === 0) {
      resetSearch()
      onFinish({})
    }
  }

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form style={{ border: '1px solid #FEFFFE', marginTop: '30px' }} form={form} name="basic" onFinish={onFinish}>
            <div style={{ marginLeft: '20px' }}>
              <div className="flexjss">
                <Form.Item name="times">
                  <RangePicker
                    style={{ marginRight: '10px' }}
                    // disabledDate={disabledDate}
                    onCalendarChange={(value) => {
                      setDates(value)
                    }}
                    showToday={true}
                    allowClear={true}
                    placeholder={['申请时间', '申请时间']}
                  />
                </Form.Item>

                <Form.Item name="orderNo" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="售后订单编号" allowClear />
                </Form.Item>

                <Form.Item name="tradeNo" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="原订单号" allowClear />
                </Form.Item>

                <Form.Item name="orderType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="售后单类型" allowClear={true}>
                    <Option value="REFUND_ONLY">仅退款 </Option>
                    <Option value="REFUND_RETURN">退款并退货 </Option>
                  </Select>
                </Form.Item>
                <Form.Item name="orderFrom" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="来源" allowClear={true}>
                    <Option value="后台创建">后台创建</Option>
                    <Option value="客户主动申请">客户主动申请</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="orderStatus" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="售后状态" allowClear={true}>
                    <Option value="20">待审核</Option>
                    <Option value="29">审核通过</Option>
                    <Option value="93">已取消</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="custMobile" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="联系人手机号" allowClear />
                </Form.Item>

                <div>
                  <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                    重置
                  </Button>

                  <Button style={{ borderRadius: '4px', marginRight: 10 }} id="afterManageInit" type="primary" size="middle" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    style={{ borderRadius: '4px', marginRight: 10 }}
                    onClick={() => {
                      setnewAfter(true), setinit(false)
                    }}
                    type="primary"
                    size="middle"
                  >
                    新建售后订单
                  </Button>
                </div>
              </div>
            </div>
          </Form>
          <div className="positionre">
            <Table style={{ margin: '23px  20px' }} rowClassName={useGetRow} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={tradeList} />
            {/*<div>{tableListTotalNum ? <p className="allNums_">共{tableListTotalNum}条</p> : ''}</div>*/}
          </div>
        </div>
      ) : (
        ''
      )}

      {onlyinit ? <AfterMinute tradeNo={tradeNo} examineShow={examineShow} afterMinuteChange={afterMinuteChange} /> : ''}

      {newAfter ? <NewAfter newAfterChange={newAfterChange} /> : ''}
    </div>
  )
}

export default afterManege
