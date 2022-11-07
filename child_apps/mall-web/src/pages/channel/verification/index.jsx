import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Table, InputNumber, message } from 'antd'

import { useGetRow } from '@/hooks/useGetRow'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
}
import { queryListAjax, createUserAjax, resetUserPasswordAjax, updateUserStatusAjax } from './services'
const Index = (props) => {
  const [form] = Form.useForm()
  const [createForm] = Form.useForm()
  const [resetForm] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState([])

  useEffect(() => {
    onFinish()
  }, [])

  const columns = [
    {
      dataIndex: 'userName',
      title: '姓名',
      align: 'center',
    },
    {
      dataIndex: 'phoneNumber',
      title: '手机号',
      align: 'center',
    },
    {
      dataIndex: 'createDateStr',
      title: '创建时间',
      align: 'center',
    },
    {
      dataIndex: 'statusName',
      title: '状态',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (r) => {
        return (
          <>
            <a onClick={() => resetPassword(r.userCode)}>重置密码</a>
            &nbsp; &nbsp;
            <a onClick={() => closeUser({ userCode: r.userCode, status: r.status })}>{Number(r.status) ? '生效' : '失效'}</a>
          </>
        )
      },
    },
  ]

  async function resetPassword(userCode) {
    Modal.confirm({
      title: '重置账户',
      content: '是否重置账户?',
      okText: '确定',
      onOk: async () => {
        const res = await resetUserPasswordAjax({ userCode })
        if (!!res && res.code === '0') {
          message.success('成功')
          onFinish()
        } else {
          message.warn('失败')
        }
      },
    })
  }

  async function closeUser(params) {
    Modal.confirm({
      title: '状态更改',
      content: '是否更改账户状态?',
      okText: '确定',
      onOk: async () => {
        //0：有效 3：无效
        const postData = {
          userCode: params.userCode,
          status: Number(params.status) ? 0 : 3,
        }

        const res = await updateUserStatusAjax(postData)
        if (!!res && res.code === '0') {
          message.success(res.message || '成功')
          onFinish()
        } else {
          message.success(res.message || '失败')
        }
      },
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
    setTableLoading(true)
    let values = form.getFieldsValue()
    const res = await queryListAjax(values)
    if (!!res && res.code === '0') {
      setTableData(res.data.data)
      setRecordTotalNum(res.data.rowTop)
    }
    setTableLoading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  //创建
  const createModal = () => {
    Modal.confirm({
      title: '创建核销人员',
      icon: null,
      okText: '提交',
      width: 500,
      content: (
        <Form {...formItemLayout} preserve={false} form={createForm} style={{ marginTop: 40 }}>
          <Form.Item name="phoneNumber" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="userName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="initPassword" label="密码" rules={[{ required: true, message: '请输入输入密码' }]}>
            <Input placeholder="请输入输入密码" />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const values = createForm.getFieldsValue()
        const res = await createUserAjax(values)
        if (!!res && res.code === '0') {
          message.success(res.message || '成功')
          onFinish()
        } else {
          message.warn(res.message || '失败')
        }
      },
    })
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={[15, 5]}>
              <Col span={3}>
                <Form.Item name="userName">
                  <Input placeholder="姓名" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="phoneNumber">
                  <Input placeholder="手机号" />
                </Form.Item>
              </Col>

              <Col>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" onClick={createModal}>
                  新建
                </Button>
              </Col>
            </Row>
          </div>
        </Form>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '40px  20px' }}
          rowKey="tradeNo"
          columns={columns}
          dataSource={tableData}
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
    </>
  )
}
export default Index
