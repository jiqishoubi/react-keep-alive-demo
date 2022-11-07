import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Row, Select, Space, Table, Col, DatePicker, Modal, Radio, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import moment from 'moment'
import { queryListAjax, exportTradeReport, getExportInfo } from '@/pages/report/airadarmgr/service'
import { isPageType, getTableUrl, getDetailPath, getTableUrlExportApi } from './func'
import requestw from '@/utils/requestw'
import useExport from '@/hooks/useExport'
import { useHistory } from 'react-router-dom'

const Index = (props) => {
  const history = useHistory()

  const [form] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [recordTotalNum, setRecordTotalNum] = useState()
  const [tableLoading, setTableLoading] = useState(false)
  const [tableList, setTableList] = useState([])

  useEffect(() => {
    onFinish()
  }, [])

  const columns = [
    {
      dataIndex: 'doctorName',
      title: '医生',
      align: 'center',
      fixed: 'left',
    },
    {
      dataIndex: 'doctorPhoneNumber',
      title: '医生手机号',
      align: 'center',
    },
    {
      dataIndex: 'ifVirtualBody',
      title: '类型',
      align: 'center',
    },
    {
      dataIndex: 'distributeName',
      title: '所属推广人',
      align: 'center',
    },
    {
      dataIndex: 'distributePhoneNumber',
      title: '推广人手机号',
      align: 'center',
    },
    {
      dataIndex: 'totalBrowse',
      title: '被浏览总次数',
      align: 'center',
    },
    {
      dataIndex: 'loginBrowse',
      title: '他人已登录浏览次数',
      align: 'center',
    },

    {
      dataIndex: 'unLoginBrowse',
      title: '他人未登录浏览次数',
      align: 'center',
    },
    {
      dataIndex: 'personBrowse',
      title: '个人浏览次数',
      align: 'center',
    },
    {
      dataIndex: 'totalTrade',
      title: '订单销量',
      align: 'center',
    },
    {
      dataIndex: 'targetUserCode',
      title: '详细',
      align: 'center',
      render: (e) => {
        return (
          <Button
            type="link"
            onClick={() => {
              minuteClick(e)
            }}
          >
            详细
          </Button>
        )
      },
    },
  ]

  const minuteClick = (e) => {
    let values = form.getFieldsValue()
    let startDate = moment(values.startDate).format('YYYY-MM-DD')
    let endDate = moment(values.endDate).format('YYYY-MM-DD')

    history.push({
      pathname: getDetailPath(),
      query: { targetUserCode: e, startDate, endDate },
    })
  }
  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    let values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    exportController.setQueryData(data)
    setTableLoading(true)
    requestw({
      url: getTableUrl(),
      data,
      isNeedCheckResponse: true,
      errMsg: false,
    })
      .finally(() => setTableLoading(false))
      .then((data) => {
        setTableList(data?.data ?? [])
        setRecordTotalNum(data?.rowTop || 0)
      })
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  const exportController = useExport({ rawData: tableList, exportApi: getTableUrlExportApi() })

  return (
    <>
      <Form className="global_searchForm_box" form={form} name="basic" onFinish={onFinish}>
        <Row gutter={10}>
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
          <Col span={4}>
            <Form.Item name="doctorName">
              <Input placeholder="医生姓名" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="doctorPhoneNumber">
              <Input placeholder="医生手机号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="distributeName">
              <Input placeholder="推广人姓名" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="distributePhoneNumber">
              <Input placeholder="推广人手机号" />
            </Form.Item>
          </Col>
          <Col>
            <Button style={{ borderRadius: '4px', marginBottom: 24 }} size="middle" onClick={resetSearch}>
              重置
            </Button>
          </Col>
          <Col>
            <Button style={{ borderRadius: '4px', marginBottom: 24 }} type="primary" size="middle" htmlType="submit">
              查询
            </Button>
          </Col>
          <Col>
            <Button style={{ borderRadius: '4px', marginBottom: 24 }} size="middle" onClick={exportController.handleExport}>
              导出
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        className="global_table_box"
        size="small"
        rowKey="id"
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
        }}
      />
    </>
  )
}
export default Index
