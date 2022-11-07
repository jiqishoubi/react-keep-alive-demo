// 订单佣金
import { Button, DatePicker, Form, message, Select, Space, Table } from 'antd'
import moment from 'moment'
import { getMouth, getToday } from '@/utils/utils'
import { Input } from 'antd/es'
import React, { useEffect, useState } from 'react'
import { getSysCodeByParam } from '@/services/common'
// import { getTradeList } from '@/services/order';
import { CaretDownOutlined, RedoOutlined } from '@ant-design/icons'
import locale from 'antd/lib/date-picker/locale/zh_CN'

import 'moment/locale/zh-cn'
import { useGetRow } from '@/hooks/useGetRow'
import requestw from '@/utils/requestw'

moment.locale('zh-cn')

function orderProfit() {
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [moneyStatus, setmoneyStatus] = useState([])
  //table loding 展示
  const [loading, setloading] = useState(false)
  //页数
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  //所有数据
  const [profitData, setprofitData] = useState([])
  //init show
  const [init, setinit] = useState(true)
  //minute init
  const [minuteinit, setminuteinit] = useState(false)
  //单条数据
  const [onlydata, setonlydata] = useState()

  const [tableListTotalNum, settableListTotalNum] = useState(0)

  //单条数据
  const [Tdata, setTdata] = useState()
  //单条数据
  const [Sdata, setSdata] = useState()
  //上次的查询数据
  const [oldData, setoldData] = useState('')
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()

  //s时间变化存储
  const [dates, setDates] = useState([])
  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  // 封装获取订单状态
  async function getSysCodeByParam_(codeParam, inCode, notCode) {
    let cs = {
      codeParam,
      inCode,
      notCode,
    }
    let res = await getSysCodeByParam(cs)
    return res
  }

  useEffect(() => {
    //费用下拉框
    getSysCodeByParam_('TRADE_PROFIX_STATUS').then((res) => {
      if (res && res.code === '0') {
        setmoneyStatus(res.data)
      } else {
      }
    })

    // setTimeout(() => {
    //   document.getElementById('orderProfitinit').click();
    // }, 100);
  }, [])

  const [columns] = useState([
    {
      dataIndex: 'tradeNo',
      title: '订单编号',
      align: 'center',
      key: 'key',
    },

    {
      dataIndex: 'tradeDateStr',
      title: '下单时间',
      align: 'center',
      key: 'key',
    },

    {
      align: 'center',
      dataIndex: 'payDateStr',
      title: '订单支付时间',
      key: 'key',
    },
    {
      dataIndex: 'tradeFeeStr',
      title: '订单金额(元)',
      align: 'center',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'rewardFeeStr',
      title: '分润金额',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'distributeRewardFeeStr',
      title: '渠道费(元)',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'saleRewardFeeStr',
      title: '佣金(元)',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'tradeStatusName',
      title: '订单状态',
      key: 'key',
    },
    {
      align: 'center',
      title: '费用结算状态',
      render: (e) => {
        return <div>{e.tradeRewardList ? e.tradeRewardList[0].statusName : ''}</div>
      },
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div
            onClick={() => {
              minutes(e)
            }}
          >
            <a style={{ cursor: 'pointer' }}>详情</a>
          </div>
        )
      },
    },
  ])
  //

  function minutes(e) {
    setonlydata(e)
    let x = []
    let y = []
    e.tradeRewardList
      ? e.tradeRewardList.map((r) => {
          if (r.feeItemName === '推广费') {
            x.push(r)
          } else {
            y.push(r)
          }
          setTdata(x)
          setSdata(y)
        })
      : ''

    setinit(false)
    setminuteinit(true)
    window.scroll(0, 0)
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }
  //点击改变页数
  useEffect(() => {
    document.getElementById('orderProfitinit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
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
      values['startDate'] = getMouth()
      values['endDate'] = getToday()
      delete values.times
    } else {
      values['startDate'] = values['times'][0].format('YYYY-MM-DD')
      values['endDate'] = values['times'][1].format('YYYY-MM-DD')
      delete values.times
    }

    values['rows'] = pageSize
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
    let res = await requestw({
      url: '/web/distribute/trade/getTradeList',
      data: {
        ...values,
      },
    })
    if (res && res.code === '0') {
      setprofitData(res.data.data)

      settableListTotalNum(res.data.rowTop)
    } else {
      settableListTotalNum(0)
      message.error(res.message)
    }
    setloading(false)
  }

  const [Tcolumns] = useState([
    {
      align: 'center',
      dataIndex: 'remark',
      title: '角色',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'personName',
      title: '姓名',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'rewardPctStr',
      title: '渠道费比例',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'rewardFeeStr',
      title: '渠道费(元)',
      key: 'key',
    },
  ])

  const [Scolumns] = useState([
    {
      align: 'center',
      dataIndex: 'remark',
      title: '角色',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'personName',
      title: '姓名',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'rewardPctStr',
      title: '渠道费比例',
      key: 'key',
    },

    {
      align: 'center',
      dataIndex: 'rewardFeeStr',
      title: '佣金(元)',
      key: 'key',
    },
  ])
  ///时间选择限制
  // const disabledDate = current => {
  //   if (!dates || dates.length === 0) {
  //     return false;
  //   }
  //
  //   const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
  //   const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
  //   return tooEarly || tooLate;
  // };

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item label="下单时间" name="times" initialValue={[moment(getMouth(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]} style={{ width: 320, marginRight: '10px' }}>
                  <RangePicker
                    onCalendarChange={(value) => {
                      setDates(value)
                    }}
                    showToday={true}
                    locale={locale}
                    allowClear={true}
                  />
                </Form.Item>

                <Form.Item name="tradeNo" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="订单编号" />
                </Form.Item>

                <Form.Item name="profixStatus" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="费用结算状态" allowClear={true}>
                    {moneyStatus.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>

                <Button style={{ borderRadius: '4px' }} id="orderProfitinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
              </div>
            </div>
          </Form>

          <div>
            <Table rowClassName={useGetRow} style={{ margin: '23px  20px' }} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={profitData} />
          </div>
        </div>
      ) : (
        ''
      )}

      {minuteinit ? (
        <div className="positionre">
          <Form>
            <div className="fontMb">
              <div style={{ bottom: 20, border: '1px solid #FEFFFE' }}>
                <Form.Item>
                  <div className="marginlr20">订单信息</div>
                </Form.Item>
                <div style={{ marginLeft: '100px' }}>
                  <Form.Item label="订单编号" style={{ marginBottom: '15px', marginTop: 20 }}>
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.tradeNo : ''}</span>
                  </Form.Item>

                  <Form.Item label="订单金额" style={{ marginBottom: '15px' }}>
                    <span style={{ marginLeft: '10px' }}> {onlydata ? onlydata.tradeFeeStr : ''}</span>
                  </Form.Item>

                  <Form.Item label="下单时间" style={{ marginBottom: '15px' }}>
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.tradeDateStr : ''}</span>
                  </Form.Item>

                  <Form.Item label="支付时间" style={{ marginBottom: '15px' }}>
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.payDateStr : ''}</span>
                  </Form.Item>

                  <Form.Item label="订单状态">
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.tradeStatusName : ''}</span>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="fontMb">
              <Form.Item>
                <div className="marginlr20">渠道费信息</div>
              </Form.Item>

              <div style={{ height: '240px' }} className="positionre">
                <Table
                  pagination={false}
                  style={{
                    width: '500px',
                    left: '200px',
                    top: '10px',
                    position: 'absolute',
                  }}
                  disabled={true}
                  columns={Tcolumns}
                  dataSource={Tdata}
                />
              </div>
            </div>
            <div className="fontMb">
              <Form.Item>
                <div className="marginlr20">佣金信息</div>
              </Form.Item>

              <div style={{ height: '240px' }} className="positionre">
                <Table
                  rowClassName={useGetRow}
                  pagination={false}
                  style={{
                    width: '500px',
                    left: '200px',
                    top: '10px',
                    position: 'absolute',
                  }}
                  disabled={true}
                  columns={Scolumns}
                  dataSource={Sdata}
                />
              </div>
            </div>
            <div>
              <Button
                style={{ width: 100, borderRadius: 8, marginLeft: 20 }}
                onClick={() => {
                  setminuteinit(false)
                  setinit(true)
                }}
                className="positionmms"
                type="primary"
              >
                返回
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
export default orderProfit
