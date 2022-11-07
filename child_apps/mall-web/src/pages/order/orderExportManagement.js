// 面单页面，暂用于剥离面单打印功能
import { Form, DatePicker, Input, Select, Space, Button, Table, message, Modal, Radio, Col } from 'antd'
import moment from 'moment'
import { getToday, getMouth } from '@/utils/utils'
import React, { useEffect, useRef, useState } from 'react'
import { getSysCodeByParam } from '@/services/common'
import Upload from '@/components/T-Upload4'
import requestw from '@/utils/requestw'
import {
  initTradePage,
  getTradeList,
  getTradeInfo,
  updateTradeProcessNote,
  expressTrade,
  cancelTrade,
  getExpressListQuery,
  updateTradeExpress,
  bulkDelivery,
  getImportStatus,
  getImportData,
  getPagingList,
  getExportInfo,
  getTrade,
  getTicketDetailByTradeNo,
  batchGetExpressOrder,
} from '@/services/order'

import locale from 'antd/lib/date-picker/locale/zh_CN'
import debounce from 'lodash/debounce'
import { querySupplierList } from '@/services/channel'
import 'moment/locale/zh-cn'
import { useGetRow } from '@/hooks/useGetRow'

import Logistics from '@/components/order/Logistics'
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons'
import UploadImg from '@/components/T-Upload2'
import router from 'umi/router'
import { func } from 'prop-types'
import { escapeRegExp } from 'lodash'

moment.locale('zh-cn')

function orderManage() {
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  }

  const { Option } = Select
  const [form] = Form.useForm()

  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)

  const [tradeList, settradeList] = useState([])

  //时间类型
  const [timeList, settimeList] = useState([])

  //table loding 展示
  const [loading, setloading] = useState(false)
  const [selectedRowKeys, setselectedRowKeys] = useState([])
  //订单搜索
  const [orderTrade] = useState([
    { key: '订单号', value: 'tradeNo' },
    { key: '支付单号', value: 'paymentNo' },
    { key: '配送单号', value: 'expressNo' },
  ])

  const [tableListTotalNum, settableListTotalNum] = useState(0)

  async function initTradePage_() {
    let res = await initTradePage()
    if (res && res.code === '0') {
      settimeList(res.data.dateTypeList)
    } else {
      message.error(res.message)
    }
  }

  useEffect(() => {
    initTradePage_()
    onFinish()
  }, [])

  const [columns] = useState([
    {
      title: '商品图片',
      align: 'center',
      render: (v) => {
        return <>{v.tradeGoodsList && v.tradeGoodsList[0] ? <img style={{ width: '80px', height: '80px' }} src={v.tradeGoodsList[0].skuImg} /> : ''}</>
      },
    },
    {
      title: '商品名称',
      align: 'center',
      render: (v) => {
        return <>{v.tradeGoodsList[0] ? <div>{v.tradeGoodsList[0].goodsName}</div> : ''}</>
      },
    },

    {
      dataIndex: 'tradeTypeName',
      title: '订单类型',
      align: 'center',
      key: 'tradeTypeName',
    },

    {
      dataIndex: 'tradeNo',
      title: '订单号',
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
      title: '总价(元)',
      render: (e) => {
        return <>{e.tradeFeeStr ? e.tradeFeeStr : ''}</>
      },
    },
    {
      align: 'center',
      dataIndex: 'custName',
      title: '收货人',
      key: 'custName',
    },

    {
      align: 'center',
      dataIndex: 'allAddress',
      title: '地址',
      width: 160,
    },
    {
      align: 'center',
      dataIndex: 'custMobile',
      title: '手机号',
      key: 'custMobile',
    },
    {
      align: 'center',
      dataIndex: 'tradeStatusName',
      title: '订单状态',
      key: 'tradeStatusName',
    },
    {
      align: 'center',
      title: '物流状态',
      render: (e) => {
        return e.tradeStatusName !== '交易关闭' ? (e.tradeStatusName !== '待发货' ? (e.tradeTypeName !== '主订单' ? (e.expressStatus === '3' ? '异常' : '正常') : '--') : '--') : '--'
      },
    },
    {
      align: 'center',
      dataIndex: 'tradeModeName',
      title: '商品类型',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'warehouseCode',
      title: '保税仓',
      key: 'key',
      render: (v) => {
        let cang = '---'
        if (v == 'WHNINGBOYONG001') {
          cang = '宁波保税仓'
        }
        if (v == 'WHBEIJINGTIANZHU001') {
          cang = '北京保税仓'
        }
        return <>{cang}</>
      },
    },
    {
      align: 'center',
      title: '操作',
      fixed: 'right',
      render: (e) => {
        return (
          <div>
            {e.expressNo && e.tradeMode === 'INTERNATION' && e.expressCompany === 'zhongtongguoji' && (e.tradeStatus === '59' || e.tradeStatus === '90' || e.tradeStatus === '60') ? (
              <Button
                style={{ marginTop: 10 }}
                type="link"
                onClick={() => {
                  orderPrint(e)
                }}
              >
                面单打印
              </Button>
            ) : (
              ''
            )}
          </div>
        )
      },
    },
  ])

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  // 面单打印
  function orderPrint(e) {
    e.tradeNo && batchFunc(e.tradeNo)
  }

  // 面单批量打印
  function batchEvent() {
    if (!selectedRowKeys.length) {
      message.warning('请先勾选订单再导出')
      return
    }
    getImgUrlsFunc(selectedRowKeys)
  }
  function batchFunc(tradeNoList) {
    sessionStorage.setItem('expressExportSessionKey', tradeNoList)
    window.open('#/blank/print')
  }

  function getImgUrlsFunc(tradeNoList) {
    batchGetExpressOrder({
      tradeNoList,
    }).then((res) => {
      if (res && res.code === '0') {
        batchFunc(tradeNoList)
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  //查询中介
  const getTableList = async () => {
    setloading(true)
    let values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    if (values.address) {
      values[values.address.province] = values.address.street
      delete values.address
    }
    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }

    let res = await requestw({
      url: '/web/expressOrder/getTradeList',
      data: {
        ...data,
      },
    })

    if (res && res.code === '0') {
      settradeList(res.data.data)
      setloading(false)
      settableListTotalNum(res.data.rowTop)
    } else {
      settableListTotalNum(0)
      message.error(res.message)
      resetSearch()
    }
    setloading(false)
  }
  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  return (
    <div>
      <div className="headBac">
        <div className="positionre" style={{ marginLeft: '20px' }}>
          <Form style={{ border: '1px solid #FEFFFE' }} form={form} name="basic" onFinish={onFinish}>
            <div>
              <div className="flexjss" style={{ border: '1px solid #FEFFFE', marginTop: '23px' }}>
                <Form.Item initialValue="TRADE" name="dateType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="时间类型" allowClear={true}>
                    {timeList.map((r) => (
                      <Option key={r.value} value={r.value}>
                        {r.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="startDate" initialValue={moment().add(-30, 'days')}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期"></DatePicker>
                </Form.Item>

                <Form.Item name="endDate" initialValue={moment()} style={{ marginRight: '10px' }}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期"></DatePicker>
                </Form.Item>

                <Form.Item name="custMobile" style={{ width: '220px', marginRight: '10px' }}>
                  <Input placeholder="手机号" style={{ width: '220px' }} />
                </Form.Item>
                <Form.Item name="custName" style={{ width: '220px', marginRight: '10px' }}>
                  <Input placeholder="收货人" style={{ width: '220px' }} />
                </Form.Item>

                <Form.Item style={{ marginRight: '10px' }}>
                  <Input.Group compact>
                    <Form.Item initialValue="tradeNo" name={['address', 'province']} noStyle>
                      <Select showArrow={true} initialValues="tradeNo" placeholder="订单搜索">
                        {orderTrade.map((r) => (
                          <Option key={r.value} value={r.value ? r.value : 'tradeNo'}>
                            {r.key}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={['address', 'street']} style={{ width: '180px' }}>
                      <Input placeholder="请输入" style={{ width: '180px' }} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} id="orderManageinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>

                <Button onClick={(e) => batchEvent(e)} style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle">
                  批量打印
                </Button>
              </div>
            </div>
          </Form>
        </div>

        <div>
          <Table
            style={{ margin: '23px  20px' }}
            rowClassName={useGetRow}
            rowKey="tradeNo"
            rowSelection={{
              selectedRowKeys,
              onChange: (e) => {
                setselectedRowKeys(e)
              },
            }}
            loading={loading}
            columns={columns}
            scroll={{ x: 1400 }}
            dataSource={tradeList}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              current: pageRef.current,
              pageSize: pageSizeRef.current,
              total: tableListTotalNum,
              showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
              onChange: onPageChange,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default orderManage
