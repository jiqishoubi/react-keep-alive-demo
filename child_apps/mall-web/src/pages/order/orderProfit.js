import React, { useEffect, useState } from 'react'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { Button, Col, DatePicker, Form, message, Modal, Row, Select, Space, Table } from 'antd'
import { Input } from 'antd/es'
import { useGetRow } from '@/hooks/useGetRow'
import { getMouth, getOrgKind, getToday } from '@/utils/utils'
import { getSysCodeByParam } from '@/services/common'
import { getTradeList, exportTradeReportOrder, getExportInfoOrder, getPagingListOrder } from '@/services/order'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'

moment.locale('zh-cn')

const { Option } = Select

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

  //导出数据
  const [educe, seteduce] = useState(false)
  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)
  const [pagingLoading, setPagingLoading] = useState(false)

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
    getPagingListOrder_()
  }, [])

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = JSON.parse(oldData)

    let res = await exportTradeReportOrder(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getExportInfoOrder({ exportCode: code })
        if (res2.code === '0' && res2.data.status === '90') {
          clearInterval(interTimes)

          getPagingListOrder_()
          setPagingLoading(false)
        }
      }, 1000)
      setinterTime(interTimes)
      clearInterval(interTime)
    } else {
      clearInterval(interTime)
      message.error(res.message)
      setPagingLoading(false)
    }
  }

  //导出表头
  const pagingColumns = [
    {
      title: '导出任务编码',
      align: 'center',
      dataIndex: 'exportCode',
    },
    {
      title: '导出时间',
      align: 'center',
      dataIndex: 'exportDateStr',
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishDateStr',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'statusName',
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return e.status === '90' ? (
          <a
            onClick={() => {
              window.location.href = e.exportFileUrl
            }}
          >
            下载Excel
          </a>
        ) : (
          ''
        )
      },
    },
  ]

  //导出历史订单获取
  const getPagingListOrder_ = async (value) => {
    setpagingShow(true)
    let res = await getPagingListOrder(value)
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  const columns = [
    {
      dataIndex: 'tradeNo',
      title: '订单编号',
      align: 'center',
      key: 'tradeNo',
    },

    {
      dataIndex: 'tradeDateStr',
      title: '下单时间',
      align: 'center',

      key: 'tradeDateStr',
    },

    {
      align: 'center',
      dataIndex: 'payDateStr',
      title: '订单支付时间',
      key: 'payDateStr',
      width: 160,
    },
    {
      dataIndex: 'tradeFeeStr',
      title: '订单金额(元)',
      align: 'center',
      key: 'tradeFeeStr',
      width: 120,
    },
    {
      align: 'center',
      dataIndex: 'rewardFeeStr',
      title: '分润金额',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'orgName',
      title: '推广公司',
      width: 170,
      ellipsis: true,
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
      width: 120,
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
  ]
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

    let news = JSON.stringify(values)

    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['page'] = 1
    } else {
      values['page'] = pageNum
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
    let res = await getTradeList(values)
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

                {getOrgKind().isAdmin && (
                  <Form.Item name="orgCode" style={{ width: 220, marginRight: '10px' }}>
                    <FetchSelect
                      placeholder="推广公司"
                      api={api_channel.queryPromotionCompanyList}
                      valueKey="orgCode"
                      textKey="orgName"
                      //搜索
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    />
                  </Form.Item>
                )}

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
                <Button style={{ borderRadius: 8, marginRight: 10 }} id="orderProfitinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>

                <Button
                  style={{ borderRadius: '4px' }}
                  size="middle"
                  onClick={() => {
                    seteduce(true)
                  }}
                >
                  导出
                </Button>
              </div>
            </div>
          </Form>

          <div>
            <Table
              rowKey="id"
              rowClassName={useGetRow}
              style={{ margin: '23px  20px' }}
              pagination={paginationProps}
              onChange={pageChange}
              loading={loading}
              columns={columns}
              dataSource={profitData}
            />
          </div>
        </div>
      ) : (
        ''
      )}

      {minuteinit ? (
        <div className="positionre">
          <Form>
            <div className="fontMbs">
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
            <div className="fontMbs">
              <Form.Item>
                <div className="marginlr20">渠道费信息</div>
              </Form.Item>

              <div style={{ height: '240px' }} className="positionre">
                <Table
                  rowKey="id"
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
            <div className="fontMbs">
              <Form.Item>
                <div className="marginlr20">佣金信息</div>
              </Form.Item>

              <div style={{ height: '240px' }} className="positionre">
                <Table
                  rowKey="id"
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
                  setTdata([])
                  setSdata([])
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

      <Modal
        destroyOnClose={true}
        title="导出"
        onCancel={() => {
          seteduce(false)
          setPagingLoading(false)
          clearInterval(interTime)
        }}
        visible={educe}
        width="800px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form name="basic" onFinish={educeFinish}>
            <Form.Item wrapperCol={{ span: 3, offset: 21 }}>
              <Button
                onClick={() => {
                  getPagingListOrder_()
                }}
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
              >
                刷新
              </Button>
            </Form.Item>

            <Table rowKey="id" loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={pagingColumns} dataSource={pagingList} />

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={pagingLoading} disabled={pagingLoading} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定导出
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 130 }}
                onClick={() => {
                  clearInterval(interTime)
                  setPagingLoading(false)
                  seteduce(false)
                }}
                type="primary"
              >
                关闭
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </div>
  )
}
export default orderProfit
