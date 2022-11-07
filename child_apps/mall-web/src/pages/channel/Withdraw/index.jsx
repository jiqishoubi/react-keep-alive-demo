/**
 * 提现记录
 */
import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { Button, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select, Space, Table } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import DetailModal from './detail'
import TotalAccount from '../components/TotalAccount'
import { getUserPaymentListPaging, approval, cancelPayment, exportTradeReportWith, getExportInfoWith, getPagingListWith } from '@/services/channel'
import { getOrgKind } from '@/utils/utils'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'

moment.locale('zh-cn')

const { Option } = Select
const { RangePicker } = DatePicker

function withdraw() {
  const [form] = Form.useForm()
  const detailModalRef = useRef()
  //页数
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  //状态
  const [loading, setloading] = useState(false)
  //Data 数据
  const [withdrawData, setwithdrawData] = useState([])
  const [messageObj, setMessageObj] = useState(null) //上面的总计数据
  //按钮loding
  const [refundLoading, setRefundLoading] = useState(false)
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
  //审核
  const [isCheck, setIsCheck] = useState(false)
  //唯一数据
  const [soleData, setSoleData] = useState({})
  //导出说需数据
  const [educe, seteduce] = useState(false)
  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const columns = [
    {
      dataIndex: 'paymentNo',
      title: '提现单号',
      align: 'center',
    },
    {
      dataIndex: 'phoneNumber',
      title: '账号',
      align: 'center',
    },
    {
      dataIndex: 'userName',
      title: '姓名',
      align: 'center',
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
      dataIndex: 'payDateStr',
      title: '申请时间',
    },
    {
      align: 'center',
      dataIndex: 'payFeeStr',
      title: '金额(元)',
    },
    {
      align: 'center',
      dataIndex: 'bankName',
      title: '提现银行',
    },
    {
      align: 'center',
      dataIndex: 'bankCardNo',
      title: '银行卡号',
    },

    {
      align: 'center',
      dataIndex: 'finishDateStr',
      title: '到账时间',
    },
    {
      align: 'center',
      dataIndex: 'paymentKindStatusName',
      title: '提现状态',
    },
    {
      align: 'center',
      title: '备注',
      render: (r) => {
        return <>{r.resultNote ? r.resultNote : '--'}</>
      },
    },
    {
      align: 'center',
      title: '操作',
      render: (r) => {
        return (
          <>
            <a
              onClick={() => {
                detailModalRef.current?.open(r)
              }}
            >
              详情
            </a>
            {r.paymentKindStatusName === '待审批' ? (
              <a onClick={() => checkClick(r)} style={{ marginLeft: 10 }}>
                审核
              </a>
            ) : null}
          </>
        )
      },
    },
  ]

  const checkClick = (r) => {
    setSoleData(r)
    setIsCheck(true)
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }
  useEffect(() => {
    getPagingListWith_()
  }, [])

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

    values['rowsPage'] = pageSize
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

    let res = await getUserPaymentListPaging(values)
    if (res && res.code === '0') {
      setwithdrawData(res.data.data)
      settableListTotalNum(res.data.rowTop)

      setResDataFunc(res)
    } else {
      settableListTotalNum(0)
      message.error(res.message)
    }

    setloading(false)
  }

  //处理总计数据
  function setResDataFunc(resData) {
    let messageObj = null
    if (resData && resData.code == '0' && resData.message) {
      try {
        const obj = JSON.parse(resData.message)
        if (Object.prototype.toString.call(obj) === '[object Object]') messageObj = obj
      } catch (e) {}
    }
    setMessageObj(messageObj)
  }

  const drawback = async (values) => {
    setRefundLoading(true)
    const paymentNo = soleData.paymentNo
    if (values.resultFlag == '1') {
      const res = await approval({ paymentNo: paymentNo })
      if (res && res.code === '0') {
        message.success('操作成功')
        setIsCheck(false)
        document.getElementById('withdrawinit').click()
      } else {
        message.warn(res.message)
      }
    } else {
      const res = await cancelPayment({ paymentNo: paymentNo })
      if (res && res.code === '0') {
        message.success('操作成功')
        setIsCheck(false)
        document.getElementById('withdrawinit').click()
      } else {
        message.warn(res.message)
      }
    }
    setRefundLoading(false)
  }

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = JSON.parse(oldData)

    let res = await exportTradeReportWith(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getExportInfoWith({ exportCode: code })
        if (res2.code === '0' && res2.data.status === '90') {
          clearInterval(interTimes)

          getPagingListWith_()
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
  const getPagingListWith_ = async (value) => {
    setpagingShow(true)
    const res = await getPagingListWith(value)
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
            <div className="flexjs">
              <Form.Item name="times" initialValue={[moment().subtract(30, 'days'), moment()]} style={{ width: 260, marginRight: '10px' }}>
                <RangePicker locale={locale} allowClear={false} />
              </Form.Item>
              <Form.Item name="paymentStatus" style={{ width: 220, marginRight: '10px' }}>
                <Select showArrow={true} placeholder="提现状态" allowClear={true}>
                  {withdrawList.map((r) => (
                    <Option key={r.value} value={r.value}>
                      {r.name}
                    </Option>
                  ))}
                </Select>
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
              <Form.Item name="userName" style={{ width: 220, marginRight: '10px' }}>
                <Input placeholder="姓名" />
              </Form.Item>
              <Form.Item name="phoneNumber" style={{ width: 220, marginRight: '10px' }}>
                <Input placeholder="账户" />
              </Form.Item>
              <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                重置
              </Button>
              <Button style={{ borderRadius: 8, marginRight: 10 }} id="withdrawinit" type="primary" size="middle" htmlType="submit">
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

        {messageObj && (
          <TotalAccount
            items={[
              { title: '乐薪银行卡余额（元）', value: messageObj.bankBalance },
              { title: '待审核金额（元）', value: messageObj.TO_BE_REVIEWED },
              { title: '已支付金额（元）', value: messageObj.PAY_SUCCESS },
            ]}
            style={{ margin: '0 20px' }}
          />
        )}

        <Table rowKey="id" style={{ margin: '23px  20px' }} rowClassName={useGetRow} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={withdrawData} />
      </div>

      <Modal
        destroyOnClose={true}
        title="提现审核"
        onCancel={() => {
          setIsCheck(false)
        }}
        visible={isCheck}
        width="500px"
        height="500px"
        footer={null}
        className="positionre"
      >
        <>
          <Form onFinish={drawback}>
            <Row>
              <Col span={16} offset={3}>
                <Form.Item label="审核" name="resultFlag" rules={[{ required: true, message: '请选择' }]} initialValue={1}>
                  <Radio.Group value={1}>
                    <Radio value={1}>审核通过</Radio>
                    <Radio value={2}>审核不通过</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col offset={16} span={4}>
                <Button loading={refundLoading} type="primary" htmlType="submit" style={{ borderRadius: '4px' }}>
                  确定
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      </Modal>

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
                  getPagingListWith_()
                }}
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
              >
                刷新
              </Button>
            </Form.Item>

            <Table loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={pagingColumns} dataSource={pagingList} />

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

      <DetailModal ref={detailModalRef} />
    </>
  )
}
export default withdraw
