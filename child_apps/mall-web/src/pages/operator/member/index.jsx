import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Input, Row, Select, Table, Modal, DatePicker } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'

import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'
import DocumentExport from '@/components/DocumentExport'
import moment from 'moment'
import FetchSelect from '@/components/FetchSelect'

const Index = () => {
  const [form] = Form.useForm()
  const documentExportRef = useRef()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState('')
  const [statusList, setStatusList] = useState([])

  const [modalShow, setModalShow] = useState(false)
  const [modalTableData, setModalTableData] = useState([])
  const [modalTableLoading, setModalTableLoading] = useState(false)
  const [viceExportKeyData, setViceExportKeyData] = useState({})
  useEffect(() => {
    getStatusList()
    onFinish()
  }, [])

  const getStatusList = async () => {
    let res = await requestw({
      url: api_goods.getSysCodeByParam,
      data: { codeParam: 'USE_MEMBERSHIP_STATUS' },
    })
    if (res && res.code === '0') {
      setStatusList(res.data)
    }
  }

  const columns = [
    {
      dataIndex: 'membershipCode',
      title: '会员编码',
      align: 'center',
    },
    {
      dataIndex: 'userName',
      title: '会员名称',
      align: 'center',
    },
    {
      dataIndex: 'phoneNumber',
      title: '手机号码',
      align: 'center',
    },
    {
      dataIndex: 'ruleName',
      title: '会员类型',
      align: 'center',
    },
    {
      dataIndex: 'membershipPriceStr',
      title: '价格',
      align: 'center',
    },
    {
      dataIndex: 'inDateStr',
      title: '加入时间',
      align: 'center',
    },
    {
      dataIndex: 'effectDateStr',
      title: '生效时间',
      align: 'center',
    },
    {
      dataIndex: 'expireDateStr',
      title: '到期时间',
      align: 'center',
    },
    {
      dataIndex: 'discountPct',
      title: '折扣',
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
      fixed: 'right',
      render: (e) => (
        <>
          {e.status === '90' && (
            <Button size="small" type="link" onClick={() => getUserInfo(e)}>
              详情
            </Button>
          )}
        </>
      ),
    },
  ]
  const modalColumns = [
    {
      dataIndex: 'giftName',
      title: '产品名称',
      align: 'center',
    },
    {
      title: '次数',
      align: 'center',
      render: (e) => 1,
    },
    {
      dataIndex: 'effectDateStr',
      title: '生效时间',
      align: 'center',
    },
    {
      dataIndex: 'expireDateStr',
      title: '到期时间',
      align: 'center',
    },
    {
      dataIndex: 'useDateStr',
      title: '使用时间',
      align: 'center',
    },
    {
      dataIndex: 'usePersonName',
      title: '核销人',
      align: 'center',
    },
    {
      dataIndex: 'medicalStatusName',
      title: '状态',
      align: 'center',
    },
  ]

  const getUserInfo = async (v) => {
    setModalShow(true)
    setModalTableLoading(true)
    const postData = { membershipCode: v.membershipCode }
    const res = await requestw({
      url: '/web/membership/user/queryUserGiftPage',
      data: postData,
    })
    if (res && res.code === '0' && res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length) {
      setModalTableData(res.data.data)
    } else {
      setModalTableData([])
    }
    setModalTableLoading(false)
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
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    values['page'] = pageRef.current
    values['rows'] = pageSizeRef.current
    setViceExportKeyData(values)
    const res = await requestw({
      url: '/web/membership/user/queryPage',
      data: values,
    })
    if (res && res.code === '0') {
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

  const exportClick = () => {
    documentExportRef.current.open()
  }
  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={[15, 5]}>
              <Col span={3}>
                <Form.Item name="startDate" initialValue={moment().add(-30, 'days')}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择加入开始时间" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="endDate" initialValue={moment()}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择加入结束时间" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="ruleCode">
                  <FetchSelect api="/web/membership/getRuleList" valueKey="ruleCode" textKey="ruleName" placeholder="会员类型" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="userName">
                  <Input placeholder="会员用户名称" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="phoneNumber">
                  <Input placeholder="手机号码" />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="status" initialValue="90">
                  <Select placeholder="状态" allowClear>
                    {statusList.map((r) => (
                      <Select.Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" onClick={exportClick}>
                  导出
                </Button>
              </Col>
            </Row>
          </div>
        </Form>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '40px  20px' }}
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

        <Modal
          visible={modalShow}
          width={760}
          title="会员权益"
          onCancel={() => {
            setModalShow(false)
          }}
          onOk={() => setModalShow(false)}
          destroyOnClose={true}
          maskClosable={false}
          cancelText={false}
          footer={null}
        >
          <Table rowClassName={useGetRow} style={{ margin: '40px  20px' }} columns={modalColumns} dataSource={modalTableData} loading={modalTableLoading} pagination={false} />
        </Modal>

        <DocumentExport
          ref={documentExportRef}
          exportKeyData={viceExportKeyData}
          exportUrl={'/web/membership/user/export'}
          historyUrl={'/web/export/membership/user/getPagingList'}
          infoUrl={'/web/export/getExportInfo'}
        />
      </div>
    </>
  )
}
export default Index
