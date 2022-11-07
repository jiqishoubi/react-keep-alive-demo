import React, { useEffect, useState, useRef } from 'react'
import { Button, DatePicker, Form, Row, Col, Radio, Input, message, Select, Space, Table } from 'antd'
import moment from 'moment'
import datePickerLocale from 'antd/lib/date-picker/locale/zh_CN'

import 'moment/locale/zh-cn'
import { CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import requestw from '@/utils/requestw'

moment.locale('zh-cn')

function BldPage() {
  const [searchForm] = Form.useForm()

  // 分页信息
  const pageRef = useRef(1)
  const [pageSize, setpageSize] = useState(20)
  const [total, settotal] = useState(0)

  //详情信息
  const [detailInfo, setdetailInfo] = useState({})

  //表格信息
  const [tableList, settableList] = useState([])
  const [tableLoading, settableLoading] = useState(false)

  // 逻辑使用
  const accountTypeRef = useRef('VIRTUAL')

  useEffect(() => {
    onFinish()
    getDetail()
  }, [])

  // 分页点击
  function pageChange(e) {}

  function onFinish() {
    pageRef.current = 1
    getTableList()
  }

  function getTableList() {
    settableLoading(true)
    requestw({
      url: '/web/distribute/account/getVirtualDetailList',
      data: {
        page: pageRef.current,
        pageSize: pageSize,
        accountType: accountTypeRef.current,
      },
    }).then((res) => {
      settableLoading(false)
      if (res && res.code === '0') {
        settableList(res.data.data || [])
        settotal(res.data.rowTop || 0)
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }

  function getDetail() {
    requestw({
      url: '/web/distribute/account/getAccountTotalBalance',
      data: {},
    }).then((res) => {
      if (res && res.code === '0') {
        setdetailInfo(res.data || {})
      } else {
        message.error(res.message || '服务异常')
      }
    })
  }

  function onRadioChange(e) {
    accountTypeRef.current = e.target.value
    onFinish()
  }

  function tableOnChange(pageInfo) {
    pageRef.current = pageInfo.current
    setpageSize(pageInfo.pageSize)
    getTableList()
  }

  const tableColumns = [
    {
      title: '类型',
      align: 'center',
      key: 1,
      dataIndex: 'feeItemName',
    },
    {
      title: '金额（元）',
      align: 'center',
      key: 2,
      dataIndex: 'feeStr',
    },
    {
      title: '时间',
      align: 'center',
      key: 3,
      dataIndex: 'billDay',
    },
    {
      title: '交易单号',
      align: 'center',
      key: 4,
      dataIndex: 'billId',
    },
    {
      title: '备注',
      align: 'center',
      key: 5,
      dataIndex: 'billNote',
    },
    {
      title: '状态',
      align: 'center',
      key: 6,
      dataIndex: 'statusName',
    },
  ]

  return (
    <div className="headBac">
      <div className="marginlr20" style={{ marginBottom: '20px' }}>
        其他信息
      </div>
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} style={{ padding: '20px 20px' }}>
        <Row gutter={10} type="flex" align="middle">
          <Col span={10}>
            <Form.Item label="公司名称">
              <div style={{ lineHeight: '30px' }}>{detailInfo.orgName || '--'}</div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10} type="flex" align="middle">
          <Col span={10}>
            <Form.Item label="待入账金额">
              <div style={{ lineHeight: '30px' }}>
                ￥{detailInfo.virtualBalanceStr || 0}
                <span style={{ paddingLeft: '20px', color: '#bbbbbb' }}>*客户已支付未收货的订单渠道费</span>
              </div>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item label="已入账待结算金额">
              <div style={{ lineHeight: '30px' }}>
                ￥{detailInfo.balanceStr || 0}
                <span style={{ paddingLeft: '20px', color: '#bbbbbb' }}>*客户已收货未结算的订单渠道费，每月1日结算</span>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Radio.Group onChange={(e) => onRadioChange(e)} defaultValue="VIRTUAL" style={{ margin: '0 20px' }}>
        <Radio.Button value="VIRTUAL">待入账明细</Radio.Button>
        <Radio.Button value="BALANCE">已入账待结算明细</Radio.Button>
      </Radio.Group>
      <div
        style={{
          margin: '-1px 20px 20px 20px',
          borderBottom: '1px solid #cccccc',
        }}
      ></div>

      <Table
        columns={tableColumns}
        style={{ padding: '0 20px' }}
        rowKey="ID"
        loading={tableLoading}
        dataSource={tableList}
        locale={{ emptyText: '暂无数据' }}
        pagination={{
          showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
          current: pageRef.current,
          pageSize: pageSize,
          total: total,
        }}
        onChange={(pageInfo) => tableOnChange(pageInfo)}
      />
    </div>
  )
}
export default BldPage
