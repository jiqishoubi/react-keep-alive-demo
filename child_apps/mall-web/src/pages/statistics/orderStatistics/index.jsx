import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Row, Select, Space, Table, Col, DatePicker, Modal, Radio, message, Image } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import { getMouth, getToday } from '@/utils/utils'
import { getTradeCountReportInfo, getTradeGoodsSaleVolumeReport, queryListAjax, exportTradeReport, getExportInfo, getPagingList } from '@/pages/statistics/orderStatistics/service'
import * as echarts from 'echarts'
import FetchSelect from '@/components/FetchSelect'
import { getSysCodeByParam } from '@/services/common'
import api_channel from '@/services/api/channel'

const Index = () => {
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const { Option } = Select
  const { TextArea } = Input
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)

  const [expressStatus, setExpressStatus] = useState([
    { value: '未发货', key: 'NOT_DELIVERED' },
    { value: '已发货', key: 'DELIVERED' },
    { value: '交易完成', key: 'DEAL_DONE' },
    { value: '退货', key: 'REFUND' },
  ])

  //订单状态
  const [tradeStatus, settradeStatus] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [titleData, setTitleData] = useState([])

  const [recordTotalNum, setRecordTotalNum] = useState()
  //导出数据
  const [oldData, setOldData] = useState()
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const [chartOne, setChartOne] = useState(false)
  const [chartTwo, setChartTwo] = useState(false)

  let myChart
  let myChartTwo

  const option = {
    tooltip: {
      trigger: 'axis',
      show: false,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    title: [
      {
        text: '商品统计',
        x: 'left',
      },
      {
        text: '此商品只统计交易成功的订单',
        x: 'right',
        textStyle: {
          fontSize: 10,
        },
      },
    ],
    legend: {
      selectedMode: false,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        splitLine: {
          show: false,
        },
        type: 'value',
        show: false,
      },
    ],
    yAxis: [
      {
        splitLine: {
          show: false,
        },
        axisLine: {
          //y轴
          show: false,
        },
        type: 'category',
        axisTick: {
          show: false,
        },
        data: [],
        axisLabel: {
          color: '#262626',
        },
      },
    ],
    series: [
      {
        type: 'bar',
        barWidth: 24, // 柱子宽度
        label: {
          show: true,
          position: 'left', // 位置
          color: '#1CD8A8',
          fontSize: 18,
          distance: -20, // 距离
        }, // 柱子上方的数值
        itemStyle: {
          barBorderRadius: [0, 20, 20, 0], // 圆角（左上、右上、右下、左下）
          color: '#FFFFFF',
        },
        data: [],
      },
    ],
  }

  const optionTwo = {
    backgroundColor: '#ffffff',
    title: {
      text: '订单统计',
      x: 'left',
    },
    tooltip: {
      show: false,
    },
    xAxis: [
      {
        type: 'category',
        data: ['已提单', '待支付', '已支付', '待发货', '已发货', '交易完成', '退款待审核', '交易关闭'],
        axisLabel: {
          color: '#262626',
          interval: 0,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          color: '#a4a4a4',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        minInterval: 1,
      },
    ],
    series: [
      {
        type: 'bar',
        data: [],
        barWidth: '20px',
        itemStyle: {
          normal: {
            color: (params) => {
              let colors = ['#4150d8', '#28bf7e', '#ed7c2f', '#f2a93b', '#ecd688', '#2ca696', '#fef93b', '#aee93b']
              return colors[params.dataIndex]
            },
          },
        },
        label: {
          normal: {
            show: true,
            position: 'top',
          },
        },
      },
    ],
  }

  useEffect(() => {
    onFinish()
    getTradeCountReportInfo_()
    getTradeGoodsSaleVolumeReport_()
    getPagingList_()

    //获取订单状态
    getSysCodeByParam_('TRADE_STATUS').then((res) => {
      if (res && res.code === '0') {
        settradeStatus(res.data)
      } else {
      }
    })
  }, [])
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
  //订单数据
  const getTradeCountReportInfo_ = async () => {
    myChartTwo = echarts.init(document.getElementById('myChartTwo_chart'))

    let values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    values['dateType'] = 'RANGE'
    let res = await getTradeCountReportInfo(values)
    if (res && res.code === '0' && res.data) {
      let dataKey = ['submitTradeCount', 'placeTradeCount', 'paymentTradeCount', 'notDeliveredTradeCount', 'deliveredTradeCount', 'dealDoneTradeCount', 'refundNotExamineTradeCount', 'closeTradeCount']
      let data = []
      dataKey.map((r) => {
        data.push(res.data[r])
      })

      let sumData = sum(data)

      if (Number(sumData) === 0) {
        setChartOne(true)
        return
      }

      setChartOne(false)

      optionTwo.series[0].data = data
    }

    myChartTwo.setOption(optionTwo)
  }

  function sum(arr) {
    return arr.reduce(function (prev, curr, idx, arr) {
      return prev + curr
    })
  }

  //

  //商品数据
  const getTradeGoodsSaleVolumeReport_ = async () => {
    myChart = echarts.init(document.getElementById('thresholdReport_chart'))

    let values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    values['dateType'] = 'RANGE'
    let res = await getTradeGoodsSaleVolumeReport(values)
    let dataKey = []
    let dataValue = []

    if (res && res.code === '9000') {
      setChartTwo(true)
      return
    }
    if (res && res.code === '0' && res.data) {
      setChartTwo(false)
      res.data.map((r) => {
        let name
        if (r.goodsName.length > 35) {
          name = r.goodsName.substring(0, 34) + '...'
        } else {
          name = r.goodsName
        }
        dataKey.push(name)
        dataValue.push(r.goodsSaleCount)
      })

      dataKey = dataKey.reverse()
      dataValue = dataValue.reverse()

      option.yAxis[0].data = dataKey
      option.series[0].data = dataValue
    }
    myChart.setOption(option)
  }

  const columns = [
    {
      dataIndex: 'tradeNo',
      title: '订单编号',
      align: 'center',
      fixed: 'left',
      width: 120,
    },
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
      ellipsis: true,
      width: 120,
    },

    {
      dataIndex: 'tradeDateStr',
      title: '下单时间',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'tradeStatus',
      title: '订单状态',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'goodsType',
      title: '商品类型',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'userName',
      title: '买家',
      align: 'center',
      width: 120,
    },

    {
      dataIndex: 'userPhone',
      title: '买家手机号',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'tradeOriginalFeeStr',
      title: '订单金额',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'tradeTicketFeeStr',
      title: '优惠金额',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'tradeFeeStr',
      title: '实付金额',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'distributeCompanyName',
      title: '推广公司名称',
      align: 'center',
      width: 160,
    },
    {
      dataIndex: 'distributeHeadMemberFeeStr',
      title: '推广公司渠道费',
      align: 'center',
      width: 160,
    },
    {
      dataIndex: 'developPersonName',
      title: '推广人名称',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'distributeDevelopMemberFeeStr',
      title: '推广人渠道费',
      align: 'center',
      width: 120,
    },

    {
      dataIndex: 'distributePersonName',
      title: '合伙人名称',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'distributePersonMemberFeeStr',
      title: '合伙人渠道费',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'profixStatus',
      title: '费用结算状态',
      align: 'center',
      width: 120,
    },
    {
      align: 'center',
      dataIndex: 'supplierName',
      title: '供应商',
      width: 100,
      render: (e) => {
        return e ? e : '--'
      },
    },

    {
      align: 'center',
      dataIndex: 'expressDateStr',
      title: '发货时间',
      width: 100,
      render: (e) => {
        return e ? e : '--'
      },
    },
    {
      align: 'center',
      dataIndex: 'totalCount',
      title: '数量',
      width: 100,
    },
  ]

  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
    getTradeCountReportInfo_()
    getTradeGoodsSaleVolumeReport_()
  }
  const getTableList = async () => {
    setTableLoading(true)
    let values = form.getFieldsValue()
    values['dateType'] = 'RANGE'
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    setOldData(data)

    let res = await queryListAjax(data)
    if (res && res.code === '0') {
      setTitleData(res.data.data)
      setRecordTotalNum(res.data.rowTop)
    } else {
      setTableLoading(false)
      message.error(res.message)
    }
    setTableLoading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = oldData

    let res = await exportTradeReport(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getExportInfo({ exportCode: code })
        if (res2.code === '0' && res2.data.status === '90') {
          clearInterval(interTimes)

          getPagingList_()
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
  const getPagingList_ = async (value) => {
    setpagingShow(true)
    let res = await getPagingList(value)
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={[15, 5]}>
              <Col span={3}>
                <Form.Item name="startDate" initialValue={moment().add(-30, 'days')}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期"></DatePicker>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="endDate" initialValue={moment()}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期"></DatePicker>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="tradeStatus" label="订单状态">
                  <Select showArrow={true} placeholder="请选择" allowClear={true}>
                    {tradeStatus.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="distributeOrgCode" label="推广公司">
                  <FetchSelect api={api_channel.queryPromotionCompanyList} valueKey="orgCode" textKey="orgName" placeholder="推广公司" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
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
              </Col>
            </Row>
          </div>
        </Form>

        <div style={{ width: '100%', height: 400, display: 'flex' }}>
          <div
            id="myChartTwo_chart"
            style={{
              width: '50%',
              height: 400,
              border: '1px solid #262626',
              padding: 30,
              margin: 20,
              display: chartOne ? 'none' : 'block',
            }}
          ></div>

          <div
            style={{
              width: '50%',
              height: 400,
              border: '1px solid #262626',
              padding: 30,
              margin: 20,
              display: chartOne ? 'block' : 'none',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                margin: '-100px 0 0 -150px',
              }}
            >
              <Image preview={false} style={{ margin: '0 auto' }} height={200} width={300} src="https://cdn.s.bld365.com/shangyao/web/zanwushuju.png"></Image>
            </div>
          </div>

          <div
            id="thresholdReport_chart"
            style={{
              width: '50%',
              height: 400,
              border: '1px solid #262626',
              padding: 30,
              margin: 20,
              display: chartTwo ? 'none' : 'block',
            }}
          ></div>

          <div
            style={{
              width: '50%',
              height: 400,
              border: '1px solid #262626',
              padding: 30,
              margin: 20,
              display: chartTwo ? 'block' : 'none',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                margin: '-100px 0 0 -150px',
              }}
            >
              <Image preview={false} style={{ margin: '0 auto' }} height={200} width={300} src="https://cdn.s.bld365.com/shangyao/web/zanwushuju.png"></Image>
            </div>
          </div>
        </div>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '40px  20px' }}
          rowKey="tradeNo"
          columns={columns}
          dataSource={titleData}
          loading={tableLoading}
          scroll={{ x: 1500 }}
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
      </div>
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
                  getPagingList_()
                }}
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
              >
                刷新
              </Button>
            </Form.Item>

            <div>
              <Table loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={pagingColumns} dataSource={pagingList} />
            </div>

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
    </>
  )
}
export default Index
