import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Row, Table, Tabs } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
const Index = () => {
  const [form] = Form.useForm()
  const { TabPane } = Tabs
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState('')

  useEffect(() => {}, [])

  const columns = [
    {
      dataIndex: '',
      title: '规则名称',
      align: 'center',
    },
    {
      dataIndex: '',
      title: '关键字',
      align: 'center',
    },
    {
      dataIndex: '',
      title: '回复内容',
      align: 'center',
    },
    {
      dataIndex: '',
      title: '操作',
      align: 'center',
      render: (e) => {
        return (
          <>
            <a>详情</a>
            &nbsp;&nbsp;
            <a>编辑</a>
            &nbsp;&nbsp;
            <a>删除</a>
          </>
        )
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
    setTableLoading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  const tabsCallback = () => {}

  return (
    <>
      <div className="headBac">
        <Tabs defaultActiveKey="1" onChange={tabsCallback}>
          <TabPane tab="关键字回复" key="1">
            <>
              <Form form={form} onFinish={onFinish}>
                <Row gutter={[15, 5]}>
                  <Col span={6}>
                    <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                      添加回复
                    </Button>
                    <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                      查询
                    </Button>
                  </Col>
                </Row>
              </Form>

              <Table
                rowClassName={useGetRow}
                style={{ margin: '40px  0' }}
                rowKey="tradeNo"
                columns={columns}
                dataSource={tableData}
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
          </TabPane>
          <TabPane tab="收到消息回复" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="被关注回复" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
export default Index
