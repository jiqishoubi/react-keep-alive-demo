import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Table, Radio, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import moment from 'moment'
import { queryPageAjax, updateDisputeOrderStatus } from './services'
import { getSysCodeByParam } from '@/services/common'
import { router } from 'umi'
import { getOrgKind } from '@/utils/utils'
import FetchSelect from '@/components/FetchSelect'
import styles from '@/utils/utils.less'
const Index = (props) => {
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState('')
  const [afterData, setAfterData] = useState([])
  const [afterStatusData, setAfterStatusData] = useState([])
  // 封装获取订单状态
  async function getSysCodeByParam_(codeParam, inCode, notCode) {
    let cs = {
      codeParam,
      inCode,
      notCode,
    }
    return await getSysCodeByParam(cs)
  }
  useEffect(() => {
    onFinish()
    //获取售后单类型
    getSysCodeByParam_('DISPUTE_ORDER_TYPE').then((res) => {
      if (res && res.code === '0') {
        setAfterData(res.data)
      }
    })
    //售后状态
    getSysCodeByParam_('DISPUTE_ORDER_STATUS').then((res) => {
      if (res && res.code === '0') {
        setAfterStatusData(res.data)
      }
    })
  }, [])

  const columns = [
    {
      dataIndex: 'orderNo',
      title: '售后订单编码',
      align: 'center',
    },
    {
      dataIndex: 'tradeNo',
      title: '原订单编码',
      align: 'center',
    },

    {
      dataIndex: 'orgName',
      title: '推广公司',
      className: getOrgKind().isAdmin ? '' : styles.noShow,
      align: 'center',
    },

    {
      dataIndex: 'supplierOrgName',
      title: '供应商名称',
      className: getOrgKind().isAdmin ? '' : styles.noShow,
      align: 'center',
    },
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
      ellipsis: 'true',
    },
    {
      dataIndex: 'orderDateStr',
      title: '申请时间',
      align: 'center',
    },
    {
      dataIndex: 'orderTypeStr',
      title: '售后单类型',
      align: 'center',
    },
    {
      dataIndex: 'orderStatusStr',
      title: '售后状态',
      align: 'center',
    },
    {
      dataIndex: 'auditPassReason',
      title: '审核意见',
      align: 'center',
    },
    {
      dataIndex: 'orderFrom',
      title: '来源',
      align: 'center',
    },
    {
      dataIndex: 'custName',
      title: '买家',
      align: 'center',
    },
    {
      dataIndex: 'custMobile',
      title: '买家手机号',
      align: 'center',
    },
    {
      dataIndex: '',
      title: '操作',
      align: 'center',
      render: (e) => {
        return (
          <>
            {getOrgKind().isCompany && (e.orderStatus === '20' || e.orderStatus === '50') && <a onClick={() => orderExamine(e)}>审核</a>}
            &nbsp;&nbsp;
            <a onClick={() => goDetails(e)}>详情</a>
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
    const values = form.getFieldsValue()
    values['dateType'] = 'order'
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    const postData = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    const res = await queryPageAjax(postData)
    if (res && res.code === '0') {
      setTableData(res.data.data)
      setRecordTotalNum(res.data.rowTop)
    } else {
      setTableData([])
      setRecordTotalNum(0)
    }

    setTableLoading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  /*  details*/
  const goDetails = (e) => {
    let pathname = ''
    if (getOrgKind().isAdmin) {
      pathname = '/web/system/trademgr/disputeOrder/details'
    } else {
      pathname = '/web/company/trademgr/disputeOrder/details'
    }
    router.push({
      pathname,
      query: { tradeNo: e.tradeNo },
    })
  }

  //审核
  const orderExamine = async (e) => {
    if (!e) return
    let visible = true
    Modal.confirm({
      title: '售后审核',
      visible,
      icon: null,
      content: (
        <>
          <Form form={modalForm} preserve={false}>
            <Form.Item name="auditStatus" label="审核状态" initialValue={1} rules={[{ required: true, message: '请选择' }]}>
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={0}>驳回</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="auditReason" label="原因" rules={[{ required: true, message: '请输入原因' }]}>
              <Input.TextArea />
            </Form.Item>
          </Form>
        </>
      ),
      onOk: async () => {
        const values = modalForm.getFieldsValue()
        if (!values.auditReason && values.auditReason !== 0) {
          message.warn('请输入原因')
          return
        }
        values['orderNo'] = e.orderNo
        const res = await updateDisputeOrderStatus(values)
        if (res && res.code === '0') {
          message.success(res.message || '成功')
          visible = false
          getTableList()
        } else {
          message.warn(res.message || '失败')
          visible = true
        }
      },
      onCancel: () => {},
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
                  <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} placeholder="申请时间" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="endDate" initialValue={moment()}>
                  <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} placeholder="申请时间" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="orderNo">
                  <Input placeholder="售后单编号" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="tradeNo">
                  <Input placeholder="原订单号" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="custName">
                  <Input placeholder="联系人" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="custMobile">
                  <Input placeholder="联系人手机号" />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="orderStatus">
                  <Select showArrow={true} placeholder="售后状态" allowClear={true}>
                    {afterStatusData.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="orderType">
                  <Select showArrow={true} placeholder="售后单类型" allowClear={true}>
                    {afterData.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {getOrgKind().isAdmin ? (
                <>
                  <Col span={4}>
                    <Form.Item name="supplierOrgCode">
                      <FetchSelect api={'/web/admin/supplier/getList'} valueKey="orgCode" textKey="orgName" placeholder="供应商" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="orgCode">
                      <FetchSelect api="/web/admin/company/queryCompanyList" valueKey="orgCode" textKey="orgName" placeholder="推广公司" />
                    </Form.Item>
                  </Col>
                </>
              ) : null}
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
          rowKey="orderNo"
          style={{ margin: '40px  20px' }}
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
