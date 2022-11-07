import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Row, Table, Col, message, Select, Modal } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'

import { getUserAndTicket, exportTradeReport, getExportInfo, getPagingList } from '../activityStatistics/service'

const Index = (props) => {
  const [form] = Form.useForm()
  const { Option } = Select
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)

  const [recordTotalNum, setRecordTotalNum] = useState()

  //订单状态
  const [tableLoading, setTableLoading] = useState(false)
  const [tableList, setTabbleList] = useState([])
  //导出数据
  const [oldData, setOldData] = useState()
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  useEffect(() => {
    onFinish()
    getPagingList_()
  }, [])

  const columns = [
    {
      dataIndex: 'ticketCode',
      title: '优惠券编码',
      align: 'center',
    },
    {
      dataIndex: 'ticketExplain',
      title: '面额',
      align: 'center',
    },

    {
      title: '有效期',
      align: 'center',
      render: (e) => {
        return e.effectDateStr + '--' + e.expireDateStr
      },
    },
    {
      dataIndex: 'userName',
      title: '客户昵称',
      align: 'center',
    },
    {
      dataIndex: 'personCode',
      title: '客户ID',
      align: 'center',
    },
    {
      dataIndex: 'statusName',
      title: '状态',
      align: 'center',
    },
    {
      dataIndex: 'tradeNo',
      title: '关联订单号',
      align: 'center',
      render: (e) => {
        return e ? e : '--'
      },
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
    let activeCode = props.location.query.activeCode
    if (!activeCode) return
    let data = {
      activeCode,
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    setOldData(data)
    let res = await getUserAndTicket(data)

    if (res && res.code === '0' && res.data) {
      setTabbleList(res.data.data)
      setRecordTotalNum(res.data.rowTop)
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
    if (res.code === '0') {
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
    if (res.code === '0') {
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
              <Col span={4}>
                <Form.Item name="userName">
                  <Input placeholder="用户昵称" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="tradeNo">
                  <Input placeholder="订单号" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="ticketStatus">
                  <Select showArrow={true} placeholder="使用状态" allowClear={true}>
                    <Option value={0}>未使用</Option>
                    <Option value={90}>已使用</Option>
                    <Option value={93}>已过期 </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginRight: 10 }}
                  onClick={() => {
                    seteduce(true)
                  }}
                  className="buttonNoSize"
                  size="middle"
                >
                  导出
                </Button>
              </Col>
            </Row>
          </div>
        </Form>

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
