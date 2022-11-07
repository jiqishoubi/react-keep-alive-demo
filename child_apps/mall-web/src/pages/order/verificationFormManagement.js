// 面单页面，暂用于剥离核销单导出功能
import { Form, DatePicker, Input, Select, Space, Button, Table, message, Modal, Radio } from 'antd'
import moment from 'moment'
import { getToday, getMouth, haveCtrlElementRight } from '@/utils/utils'
import React, { useEffect, useState, useRef } from 'react'
import { getSysCodeByParam } from '@/services/common'
import Upload from '@/components/T-Upload4'
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
  verificationFormDownload,
  chinaPortTradeCheck,
} from '@/services/order'

import locale from 'antd/lib/date-picker/locale/zh_CN'
import debounce from 'lodash/debounce'
import { querySupplierList } from '@/services/channel'
import 'moment/locale/zh-cn'
import { useGetRow } from '@/hooks/useGetRow'

import Logistics from '@/components/order/Logistics'
import { CopyOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UploadImg from '@/components/T-Upload2'
import router from 'umi/router'
import { func } from 'prop-types'
import { escapeRegExp } from 'lodash'
import requestw from '@/utils/requestw'

moment.locale('zh-cn')

function orderManage() {
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
  const [selectedRowRows, setselectedRowRows] = useState([])

  //订单搜索
  const [orderTrade] = useState([
    { key: '订单号', value: 'tradeNo' },
    { key: '支付单号', value: 'paymentNo' },
    { key: '配送单号', value: 'expressNo' },
  ])
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  // 新增需求 - 只有同一保税仓才可以批量导出
  const warehouseCodeRef = useRef('')
  const warehouseCodeTradeNoRef = useRef('')

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

  //表单数据
  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }

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
      dataIndex: 'chinaPortInvtNo',
      title: '清单编号',
      align: 'center',
    },
    {
      dataIndex: 'chinaPortCheckName',
      title: '核销状态',
      align: 'center',
    },

    {
      dataIndex: 'tradeTypeName',
      title: '订单类型',
      align: 'center',
    },

    {
      dataIndex: 'tradeNo',
      title: '订单号',
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

      title: '总价(元)',
      render: (e) => {
        return <>{e.tradeFeeStr ? e.tradeFeeStr : ''}</>
      },
    },
    {
      align: 'center',
      dataIndex: 'custName',
      title: '收货人',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'custMobile',
      title: '手机号',
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
      title: '物流状态',
      render: (e) => {
        return e.tradeStatusName !== '交易关闭' ? (e.tradeStatusName !== '待发货' ? (e.tradeTypeName !== '主订单' ? (e.expressStatus === '3' ? '异常' : '正常') : '--') : '--') : '--'

        // e.tradeTypeName !== '主订单' || e.tradeStatusName!=='交易关闭'
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
      dataIndex: 'warehouseName',
      title: '保税仓',
      key: 'key',
      render: (v) => {
        let cang = '---'
        if (v) {
          cang = v
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
            {e.tradeMode === 'INTERNATION' && e.chinaPortStatus === '90' && e.chinaPortStatus === '80' ? (
              <Button
                style={{ marginTop: 10 }}
                type="link"
                onClick={() => {
                  verifyOrderEvent(e)
                }}
              >
                下载
              </Button>
            ) : (
              ''
            )}

            {e.tradeStatus === '50' ||
            // (e.tradeStatus === '59' && e.chinaPortStatus === '90') ||
            (e.tradeStatus === '59' && e.chinaPortStatus === '80') ? (
              <Button
                style={{ marginTop: 10 }}
                // type="link"
                onClick={() => {
                  orderverificationEvent(e)
                }}
              >
                核销
              </Button>
            ) : (
              ''
            )}
          </div>
        )
      },
    },
  ])

  // 核销订单
  function orderverificationEvent(e) {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否核销订单？`,
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        orderverificationFunc(e)
      },
      onCancel() {},
    })
  }
  //核销订单
  function orderverificationFunc(e) {
    chinaPortTradeCheck({
      tradeNo: e.tradeNo || '',
    }).then((res) => {
      if (res && res.code === '0') {
        message.success('提交成功')
        onFinish({})
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

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
      url: '/web/hgTrade/getTradeList',
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
    // 切换时候，清理数据留存
    warehouseCodeRef.current = ''
    warehouseCodeTradeNoRef.current = ''
    setselectedRowKeys([])
    setselectedRowRows([])
    getTableList()
  }

  // 核销单下载
  function verifyOrderEvent(e) {
    verifyOrderFunc([e.tradeNo])
  }

  //  数组中元素是否相同
  function isAllEqual(array) {
    if (array.length > 0) {
      return !array.some(function (value, index) {
        return value !== array[0]
      })
    } else {
      return true
    }
  }

  // 核销单批量下载
  function batchEvent() {
    if (!selectedRowKeys.length) {
      message.warning('请先勾选订单再导出')
      return
    }
    let identical = false
    let isAllEqualArr = []
    selectedRowRows.map((item, ind) => {
      isAllEqualArr.push(item.warehouseCode)
    })
    if (!isAllEqual(isAllEqualArr)) {
      message.warning('只能选择相同仓的订单')
      return false
    }
    let tradeNoStr = selectedRowKeys.join(',')
    verifyOrderFunc(tradeNoStr)
  }
  function verifyOrderFunc(tradeNoStr) {
    verificationFormDownload({
      tradeNoStr,
    }).then((res) => {
      if (res && res.code === '0') {
        // batchFunc(res);
        res.data && window.open(res.data)
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }

  return (
    <div>
      <div className="headBac">
        <div className="positionre" style={{ marginLeft: '20px' }}>
          <Form style={{ border: '1px solid #FEFFFE' }} form={form} name="basic" onFinish={onFinish}>
            <div>
              <div className="flexjss" style={{ border: '1px solid #FEFFFE', marginTop: '23px' }}>
                <Form.Item initialValue="TRADE" name="dateType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="时间类型">
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

                <Form.Item name="chinaPortCheckFlag" style={{ width: 220, marginRight: '10px' }}>
                  <Select
                    showArrow={true}
                    // showArrow={true}
                    placeholder="核销状态"
                    allowClear={true}
                  >
                    <Option value={0}>未核销</Option>
                    <Option value={1}>已核销</Option>
                  </Select>
                </Form.Item>
                <Form.Item style={{ marginRight: '10px' }}>
                  <Input.Group compact>
                    <Form.Item initialValue="tradeNo" name={['address', 'province']} noStyle>
                      <Select
                        showArrow={true}
                        initialValues="tradeNo"
                        // initialValue=""
                        placeholder="订单搜索"
                        allowClear={true}
                      >
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

                <Button onClick={(e) => batchEvent(e)} style={{ borderRadius: '4px' }} className="buttonNoSize" size="middle">
                  批量下载
                </Button>
              </div>
            </div>
          </Form>
        </div>

        <div>
          <Table
            style={{ margin: '23px  20px' }}
            rowClassName={useGetRow}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              current: pageRef.current,
              pageSize: pageSizeRef.current,
              total: tableListTotalNum,
              showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
              onChange: onPageChange,
            }}
            rowKey="tradeNo"
            rowSelection={{
              selectedRowKeys,
              getCheckboxProps: (e) => {
                // 下方代码用于过滤同个仓库才能导出，不同仓库的禁用勾选
                return {
                  disabled: warehouseCodeRef.current && warehouseCodeRef.current !== e.warehouseCode,
                }
                // 结束
              },
              onChange: (e, v) => {
                // 下方代码用于过滤同个仓库才能导出，不同仓库的禁用勾选
                if (e.length && !selectedRowKeys.length) {
                  warehouseCodeRef.current = v[0].warehouseCode || ''
                  warehouseCodeTradeNoRef.current = v[0].tradeNo || ''
                } else if (!e.length && selectedRowKeys.length) {
                  warehouseCodeRef.current = ''
                  warehouseCodeTradeNoRef.current = ''
                }
                let vv = v.filter((item) => {
                  return warehouseCodeRef.current ? item.warehouseCode === warehouseCodeRef.current : false
                })
                let ee = vv.map((item) => item.tradeNo)
                let aa = vv.map((item) => item.warehouseCode)
                let bb = vv.map((item) => item.tradeGoodsList[0].goodsName)
                // 结束
                setselectedRowKeys(ee)
                setselectedRowRows(vv)
              },
            }}
            loading={loading}
            columns={columns}
            scroll={{ x: 1400 }}
            dataSource={tradeList}
          />
        </div>
      </div>
    </div>
  )
}

export default orderManage
