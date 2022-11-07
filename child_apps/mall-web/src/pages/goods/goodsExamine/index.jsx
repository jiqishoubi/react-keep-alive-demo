import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, Dropdown, Row, Select, Table, Menu, InputNumber, Modal, message, Tooltip } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { useGetRow } from '@/hooks/useGetRow'
import moment from 'moment'
import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'
import BigNumber from 'bignumber.js'

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
}

const Index = () => {
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState('')
  const [statusList, setStatusList] = useState([])
  const [viceSku, setViceSku] = useState({})
  const [viceStatus, setViceStatus] = useState(2)
  const [modalShow, setModalShow] = useState(false)
  useEffect(() => {
    getStatusList()
    onFinish()
  }, [])

  const getStatusList = async () => {
    let res = await requestw({
      url: '/web/sys/code/getSysCodeByParam',
      data: { codeParam: 'SUPPLIER_SKU_STATUS' },
    })
    if (res && res.code === '0') {
      setStatusList(res.data)
    }
  }

  const columns = [
    {
      dataIndex: 'goodsCode',
      title: '商品编码',
      align: 'center',
    },
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
      ellipsis: 'true',
    },
    {
      dataIndex: 'orgName',
      title: '供应商',
      align: '',
    },
    {
      dataIndex: 'skuCode',
      title: 'sku编码',
      align: 'center',
    },
    {
      dataIndex: 'skuName',
      title: 'sku名称',
      align: 'center',
    },
    {
      dataIndex: 'saleMinPriceStr',
      title: '售价(元)',
      align: 'center',
    },
    {
      dataIndex: 'distributeRewardFeeStr',
      title: '总服务费(元)',
      align: 'center',
      width: 130,
    },
    {
      dataIndex: 'channelPromotionFeeStr',
      title: '渠道推广费(元)',
      align: 'center',
      width: 130,
    },
    {
      dataIndex: 'platPromotionFeeStr',
      title: '平台推广费(元)',
      align: 'center',
      width: 130,
    },
    {
      dataIndex: 'technicalServiceFeeStr',
      title: '技术服务费(元)',
      align: 'center',
      width: 130,
    },
    {
      dataIndex: 'statusName',
      title: '状态',
      align: 'center',
    },
    {
      dataIndex: 'auditDate',
      title: '审核时间',
      align: 'center',
    },
    {
      dataIndex: 'updateDateStr',
      title: '修改时间',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (e) => (
        <>
          {e.status == 2 && (
            <Button size="small" type="link" onClick={() => succeeStatus(e, 1)}>
              修改
            </Button>
          )}
          {e.status == 1 && (
            <Dropdown overlay={actionMenuCreator(e)}>
              <Button type="link" size="small">
                审核
              </Button>
            </Dropdown>
          )}
        </>
      ),
    },
  ]

  const actionMenuCreator = (v) => {
    const menuClick = (item) => {
      switch (item.key) {
        case '1': //禁用' : '启用
          succeeStatus(v, 2)
          break
        case '2': //重置密码
          loseStatus(v)
          break

        default:
          break
      }
    }
    return (
      <Menu onClick={menuClick}>
        <Menu.Item key="1">审核通过</Menu.Item>
        <Menu.Item key="2">审核失败</Menu.Item>
      </Menu>
    )
  }
  const succeeStatus = (v, status) => {
    setViceStatus(status)
    setViceSku(v)
    setModalShow(true)
    modalForm.setFieldsValue({ ...v })
  }
  const loseStatus = (v) => {
    setViceStatus(4)
    setViceSku(v)
    setModalShow(true)
    modalForm.setFieldsValue({ ...v })
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
    const postData = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }

    const res = await requestw({
      // url: '/web/admin/supplierSku/queryPage',
      url: '/web/system/sku/getSupplierGoodsList',
      data: postData,
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

  const userModalOk = () => {
    const formData = modalForm.getFieldsValue()
    formData['skuCode'] = viceSku.skuCode
    formData['status'] = viceStatus
    formData['channelPromotionFee'] = new BigNumber(formData?.channelPromotionFeeStr || 0).times(100).toNumber()
    requestw({
      url: viceStatus === 1 ? '/web/admin/supplierSku/updateChannelPromotionFee' : '/web/admin/supplierSku/auditSku',
      data: { ...formData },
    }).then((res) => {
      if (res && res.code === '0') {
        message.success(res.message || '成功')
        modalForm.resetFields()
        setModalShow(false)
        onFinish()
      } else message.warn(res.message || '失败')
    })
  }
  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={[15, 5]}>
              <Col span={3}>
                <Form.Item name="startDate" initialValue={moment().add(-30, 'days')}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="endDate" initialValue={moment()}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="goodsCode">
                  <Input placeholder="商品编码" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="goodsName">
                  <Input placeholder="商品名称" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="skuCode">
                  <Input placeholder="sku编码" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="skuName">
                  <Input placeholder="sku名称" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="supplierOrgCode">
                  <FetchSelect
                    api="/web/system/supplier/getSupplierPaggingList"
                    formData={{
                      page: 1,
                      rows: 10000,
                    }}
                    dealResFunc={(data) => data?.data ?? []}
                    valueKey="orgCode"
                    textKey="orgName"
                    placeholder="供应商"
                  />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="status">
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

        <Modal
          visible={modalShow}
          width={600}
          title={viceStatus === '1' ? '修改' : '商品审核'}
          onCancel={() => {
            setModalShow(false)
            modalForm.resetFields()
          }}
          onOk={() =>
            modalForm
              .validateFields()
              .then(() => userModalOk())
              .catch(() => {})
          }
          destroyOnClose={true}
          maskClosable={false}
        >
          <Form form={modalForm} preserve={false} {...formItemLayout}>
            <Form.Item label="商品编码" name="goodsCode" wrapperCol={{ span: 12 }}>
              <Input readOnly={true} bordered={false} />
            </Form.Item>

            <Form.Item label="商品名称" name="goodsName" wrapperCol={{ span: 12 }}>
              <Input readOnly={true} bordered={false} />
            </Form.Item>
            <Form.Item label="sku名称" name="skuName" wrapperCol={{ span: 12 }}>
              <Input readOnly={true} bordered={false} />
            </Form.Item>
            <Form.Item label="sku编码" name="skuCode" wrapperCol={{ span: 12 }}>
              <Input readOnly={true} bordered={false} />
            </Form.Item>
            <Form.Item label="售价(元)" name="saleMinPriceStr" wrapperCol={{ span: 12 }}>
              <Input readOnly={true} bordered={false} />
            </Form.Item>
            <Form.Item label="总服务费(元)" name="distributeRewardFeeStr" wrapperCol={{ span: 12 }}>
              <Input readOnly={true} bordered={false} />
            </Form.Item>
            {viceStatus === 2 || viceStatus === 1 ? (
              <>
                <Form.Item label="渠道推广费(元)" name="channelPromotionFeeStr" rules={[{ required: 'true', message: '请输入渠道推广费(元)' }]} wrapperCol={{ span: 12 }}>
                  <InputNumber
                    min={0}
                    precision={2}
                    style={{ width: '100%' }}
                    placeholder="渠道推广费"
                    max={(Number(modalForm.getFieldValue('distributeRewardFeeStr')) * 100 - Number(modalForm.getFieldValue('technicalServiceFeeStr')) * 100) / 100}
                  />
                </Form.Item>

                <Form.Item label="技术服务费(元)" name="technicalServiceFeeStr" wrapperCol={{ span: 12 }}>
                  <InputNumber disabled min={0} precision={2} style={{ width: '100%' }} placeholder="技术服务费" />
                </Form.Item>

                <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.channelPromotionFeeStr !== curValues.channelPromotionFeeStr} wrapperCol={{ span: 24 }}>
                  {() => {
                    const { distributeRewardFeeStr, channelPromotionFeeStr, technicalServiceFeeStr } = modalForm.getFieldsValue()
                    if (distributeRewardFeeStr !== undefined && channelPromotionFeeStr !== undefined && technicalServiceFeeStr !== undefined) {
                      let fee =
                        (new BigNumber(distributeRewardFeeStr || 0).times(100).toNumber() -
                          new BigNumber(channelPromotionFeeStr || 0).times(100).toNumber() -
                          new BigNumber(technicalServiceFeeStr || 0).times(100).toNumber()) /
                        100
                      fee = Math.round(fee * 100) / 100
                      if (fee >= 0) {
                        modalForm.setFieldsValue({ platPromotionFeeStr: fee })
                      } else modalForm.setFieldsValue({ platPromotionFeeStr: 0 })
                    }
                    return (
                      <Form.Item label="平台推广费(元)" wrapperCol={{ span: 12 }} labelCol={{ span: 7 }} name="platPromotionFeeStr" style={{ width: '100%' }}>
                        <InputNumber style={{ width: '100%' }} disabled />
                      </Form.Item>
                    )
                  }}
                </Form.Item>
              </>
            ) : (
              <Form.Item label="原因" name="auditReason" rules={[{ required: 'true', message: '请输入拒绝原因' }]} wrapperCol={{ span: 12 }}>
                <Input.TextArea />
              </Form.Item>
            )}
          </Form>
        </Modal>
      </div>
    </>
  )
}
export default Index
