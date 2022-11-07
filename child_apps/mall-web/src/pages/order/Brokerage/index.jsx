import { connect } from 'dva'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Select, Space, Table, Col, DatePicker, Modal, Radio, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import { getMouth, getToday } from '@/utils/utils'
import { updateAuthTradeCompany, getBatchTrade } from '@/pages/order/Brokerage/service'
import { router } from 'umi'
import { getSysCodeByParam } from '@/services/common'
import FetchSelect from '@/components/FetchSelect'
import lodash from 'lodash'
import api_channel from '@/services/api/channel'

const Index = (props) => {
  const {
    dispatch,
    orderBrokerageModel: { list, recordTotalNum, page, pageSize },
  } = props
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const { Option } = Select
  const [expressStatus, setExpressStatus] = useState([
    { value: '待审核', key: 0 },
    { value: '已审核', key: 1 },
  ])
  //订单状态
  const [tradeStatus, settradeStatus] = useState([])
  //审核
  const [isRefund, setIsRefund] = useState(false)
  //审核按钮loding
  const [refundLoading, setRefundLoading] = useState(false)
  const [brach, setBrach] = useState(false)
  const [resultTranNo, setResultTranNo] = useState()
  const [entry, setEntry] = useState([])

  const [tablaLoding, setTablaLoding] = useState(false)

  const rowKey = 'tradeNo'
  const [selectedData, setSelectedData] = useState([])
  const selectedRowKeys = selectedData.map((row) => row[rowKey])

  useEffect(() => {
    getSysCodeByParam_('TRADE_PROFIX_STATUS').then((res) => {
      if (res && res.code === '0') {
        setEntry(res.data)
      }
    })
    //获取订单状态
    getSysCodeByParam_('TRADE_STATUS').then((res) => {
      if (res && res.code === '0') {
        settradeStatus(res.data)
      } else {
      }
    })

    let values = getValue()
    dispatch({
      type: 'orderBrokerageModel/qureyData',
      payload: {
        searchParams: values,
      },
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
  const columns = [
    {
      dataIndex: 'tradeNo',
      title: '订单号',
      align: 'center',
      fixed: 'left',
    },
    {
      dataIndex: 'payDateStr',
      title: '下单时间',
      align: 'center',
    },

    {
      dataIndex: 'preferentialAmountFeeStr',
      title: '优惠金额(元)',
      align: 'center',
    },
    {
      dataIndex: 'tradeFeeStr',
      title: '实付金额(元)',
      align: 'center',
    },
    {
      dataIndex: 'orgName',
      title: '推广公司',
      align: 'center',
    },

    {
      dataIndex: 'distributeHeadMemberFeeStr',
      title: '推广公司渠道费(元)',
      align: 'center',
      width: 160,
    },
    {
      dataIndex: 'developName',
      title: '推广人',
      align: 'center',
    },
    {
      dataIndex: 'distributeChildMemberFeeStr',
      title: '推广人渠道费(元)',
      align: 'center',
      width: 160,
    },
    {
      dataIndex: 'distributeName',
      title: '合伙人',
      align: 'center',
    },
    {
      dataIndex: 'saleMemberFeeStr',
      title: '合伙人佣金(元)',
      align: 'center',
    },
    {
      dataIndex: 'tradeModeName',
      title: '商品类型',
      align: 'center',
    },
    {
      dataIndex: 'warehouseName',
      title: '报关关区',
      align: 'center',
    },
    {
      dataIndex: 'tradeStatusName',
      title: '订单状态',
      align: 'center',
    },

    {
      dataIndex: 'profixStatusName',
      title: '费用结算状态',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (e) => {
        return (
          <>
            <a
              onClick={() => {
                minuteItem(e)
              }}
            >
              详情
            </a>
            &nbsp; &nbsp; &nbsp;
            {e.tradeStatus === '90' && e.profixStatus === '30' ? (
              <a
                onClick={() => {
                  refundClick(e)
                }}
              >
                审核
              </a>
            ) : null}
          </>
        )
      },
    },
  ]
  //点击审核
  const refundClick = (e) => {
    setBrach(false)
    setResultTranNo(e.tradeNo)
    setIsRefund(true)
  }
  //查看详情
  const minuteItem = (e) => {
    dispatch({
      type: 'orderBrokerageModel/save',
      payload: {
        tradeNo: e.tradeNo,
      },
    })

    router.push({
      pathname: '/web/company/pricemgr/priceAuth/detail',
      query: {
        tradeNo: e.tradeNo,
      },
    })
  }

  //获取表单数据
  const getValue = () => {
    let values = form.getFieldsValue()
    if (!values['times']) {
      values['startDate'] = getMouth()
      values['endDate'] = getToday()
      delete values.times
    } else {
      values['startDate'] = values['times'][0].format('YYYY-MM-DD')
      values['endDate'] = values['times'][1].format('YYYY-MM-DD')
      delete values.times
    }
    return values
  }

  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = async (values) => {
    setTablaLoding(true)
    let value = getValue()
    dispatch({
      type: 'orderBrokerageModel/qureyData',
      payload: {
        searchParams: value,
      },
    })
    setTimeout(() => {
      setTablaLoding(false)
    }, 10)
  }

  //table批量设置
  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    getCheckboxProps: (record) => {
      return {
        disabled: record.tradeStatus === '90' && record.profixStatus === '30' ? false : true,
      }
    },
    onSelect: (row, isSelected, _) => {
      updateSelectedRows(isSelected, [row])
    },
    onSelectAll: (isSelected, _, changeRows) => {
      updateSelectedRows(isSelected, changeRows)
    },
  }

  //批量
  const updateSelectedRows = (isSelected, list) => {
    let arr = []
    if (isSelected) {
      arr = _.uniqBy([...selectedData, ...list], rowKey)
    } else {
      arr = _.differenceBy(selectedData, list, rowKey) // 从第一个数组删除第二个数组中的元素
    }
    setSelectedData(arr)
  }

  //改变页数
  const onPageChange = (newPage, newPageSize) => {
    dispatch({
      type: 'orderBrokerageModel/changePage',
      payload: {
        page: newPage,
        pageSize: newPageSize,
      },
    })
  }
  //点击审核
  const drawback = async (values) => {
    setRefundLoading(true)

    let res
    if (brach) {
      if (!selectedRowKeys.length) {
        message.warn('请先选择要审核的订单')
        return
      }
      res = await getBatchTrade({ tradeNoStr: selectedRowKeys })
    } else {
      if (!resultTranNo) {
        message.warn('请先选择要审核的订单')
        return
      }
      res = await updateAuthTradeCompany({ tradeNo: resultTranNo })
    }
    if (res && res.code === '0') {
      setIsRefund(false)
      message.success('审核成功')
      setSelectedData([])
      onFinish()
    } else {
      message.error(res.message)
    }
    setRefundLoading(false)
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item name="times" label="下单时间" initialValue={[moment(getMouth(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]}>
                  <RangePicker showToday={true} locale={locale} allowClear={true} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="tradeNo">
                  <Input placeholder="订单号" allowClear />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="distributeCompany">
                  <FetchSelect api={api_channel.queryPromotionCompanyList} valueKey="orgCode" textKey="orgName" placeholder="推广公司" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="developPhoneNumber">
                  <Input placeholder="推广人账号" allowClear />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="distributePhoneNumber">
                  <Input placeholder="合伙人账号" allowClear />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="profixStatus">
                  <Select showArrow={true} placeholder="费用结算状态" allowClear={true}>
                    {entry.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="tradeStatus" style={{ marginBottom: 0 }}>
                  <Select showArrow={true} placeholder="订单状态" allowClear={true}>
                    {tradeStatus.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px' }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
              </Col>
              <Col>
                <Button
                  style={{ borderRadius: '4px' }}
                  type="primary"
                  onClick={() => {
                    if (!selectedRowKeys.length) {
                      message.warn('请先选择要审核的订单')
                      return
                    }
                    setBrach(true)
                    setIsRefund(true)
                  }}
                >
                  批量审核
                </Button>
              </Col>
            </Row>
          </div>
        </Form>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '23px  20px' }}
          rowKey="tradeNo"
          columns={columns}
          dataSource={list}
          loading={tablaLoding}
          scroll={{ x: 2000 }}
          rowSelection={rowSelection}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: page,
            pageSize: pageSize,
            total: recordTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: onPageChange,
          }}
        />
      </div>

      <Modal
        destroyOnClose={true}
        title="提示信息"
        onCancel={() => {
          setIsRefund(false)
        }}
        visible={isRefund}
        width="500px"
        height="500px"
        footer={null}
        className="positionre"
      >
        <>
          <Form onFinish={drawback}>
            <Row style={{ marginBottom: 30 }}>
              <Col offset={9} span={18}>
                <div> 是否确认审核通过？</div>
              </Col>
            </Row>

            <Row>
              <Col offset={6} span={4}>
                <Button loading={refundLoading} type="primary" htmlType="submit" style={{ borderRadius: '4px' }}>
                  确定
                </Button>
              </Col>
              <Col offset={6} span={4}>
                <Button
                  type="primary"
                  style={{ borderRadius: '4px' }}
                  onClick={() => {
                    setIsRefund(false)
                  }}
                >
                  取消
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      </Modal>
    </>
  )
}
export default connect(({ orderBrokerageModel, loading }) => {
  return {
    orderBrokerageModel,
    loadingTable: loading.effects['orderBrokerageModel/fetch'],
  }
})(Index)
