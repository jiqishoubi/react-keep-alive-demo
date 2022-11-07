import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Row, Select, Space, Table, Col, DatePicker, Modal, Radio, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import { getMouth, getToday } from '@/utils/utils'
import { getTradeCountReportInfo, getTradeGoodsSaleVolumeReport, queryListAjax, exportTradeReport, getExportInfo, getPagingList } from '@/pages/statistics/spread/service'
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

  const [recordTotalNum, setRecordTotalNum] = useState()

  const [expressStatus, setExpressStatus] = useState([
    { value: '未发货', key: 'NOT_DELIVERED' },
    { value: '已发货', key: 'DELIVERED' },
    { value: '交易完成', key: 'DEAL_DONE' },
    { value: '退货', key: 'REFUND' },
  ])

  //订单状态
  const [tradeStatus, settradeStatus] = useState([])
  const [tableLoading, setTableLoading] = useState(false)

  //导出数据
  const [oldData, setOldData] = useState()
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const [tableList, setTabbleList] = useState([])
  const [titleData, setTitleData] = useState({})

  useEffect(() => {
    getPagingList_()
    //获取订单状态
    getSysCodeByParam_('TRADE_STATUS').then((res) => {
      if (res && res.code === '0') {
        settradeStatus(res.data)
      } else {
      }
    })
    onFinish()
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

  const columns = [
    {
      dataIndex: 'companyName',
      title: '推广公司名称',
      align: 'center',
      fixed: 'left',
    },
    {
      dataIndex: 'distributePersonCount',
      title: '推广人总数',
      align: 'center',
    },

    {
      dataIndex: 'partnerCount',
      title: '合伙人总数',
      align: 'center',
    },
    {
      dataIndex: 'userCount',
      title: '客户总数',
      align: 'center',
    },
    {
      dataIndex: 'tradeCount',
      title: '订单总数',
      align: 'center',
    },
    {
      dataIndex: 'goodsCount',
      title: '成交商品件数',
      align: 'center',
    },

    {
      dataIndex: 'tradeUserCount',
      title: '下单客户数',
      align: 'center',
    },
    {
      dataIndex: 'priceCount',
      title: '交易额(元)',
      align: 'center',
    },
    {
      dataIndex: 'promotionFee',
      title: '总渠道费(元)',
      align: 'center',
    },
    {
      dataIndex: 'distributionCommission',
      title: '总分销佣金(元)',
      align: 'center',
    },
    {
      dataIndex: 'couponCount',
      title: '优惠券使用数',
      align: 'center',
    },
  ]

  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setTableLoading(true)
    let values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    setOldData(data)

    let res = await queryListAjax(data)

    if (res && res.code === '0' && res.data) {
      setTabbleList(res.data.pagingInfo.data)
      setTitleData(res.data.statisticsCompanyDTO)
      setRecordTotalNum(res.data.pagingInfo.rowTop)
      setTableLoading(false)
    } else {
      message.warn(res.message)
    }
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
                <Form.Item name="distributeCompany" label="推广公司">
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

        <Row gutter={[15, 5]} style={{ marginLeft: 40 }} wrap="true">
          <Col span={3} flex="true">
            <div className="spreaddiv">
              <div className="spreaddiv1">推广公司总数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.companyCount || '0'}</div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">推广人总数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.distributeCount || '0'}</div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">合伙人总数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.hehuorenCount || '0'} </div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">客户总数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.userCount || '0'} </div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">支付订单总数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.payCount || '0'} </div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">支付总额(元)</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.priceCount || '0'} </div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
        </Row>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '23px  20px' }}
          columns={columns}
          dataSource={tableList}
          loading={tableLoading}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageRef.current,
            pageSize: pageSizeRef.current,
            total: recordTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: onPageChange,
            // onShowSizeChange:onShowSizeChange
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
