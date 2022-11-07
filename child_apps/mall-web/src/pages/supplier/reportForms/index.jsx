import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Table } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { useGetRow } from '@/hooks/useGetRow'
import { queryListAjax, getSkuFeeStatisticAjax } from './services'
import moment from 'moment'
import { getOrgKind } from '@/utils/utils'
import styles from './index.less'
import DocumentExport from '@/components/DocumentExport'

const Index = () => {
  const [form] = Form.useForm()
  const documentExportRef = useRef()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState('')
  const [orderInfo, setOrderInfo] = useState({})
  const [viceExportKeyData, setViceExportKeyData] = useState({})

  useEffect(() => {
    onFinish()
  }, [])

  const columns = [
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
    },
    {
      dataIndex: 'skuCode',
      title: '规格编码',
      align: 'center',
    },
    {
      dataIndex: 'skuName',
      title: '规格',
      align: 'center',
    },
    {
      dataIndex: 'orgName',
      title: '推广公司',
      align: 'center',
    },
    {
      dataIndex: 'skuPrice',
      title: '销售金额',
      align: 'center',
    },
    {
      dataIndex: 'tradeCount',
      title: '订单数',
      align: 'center',
    },
    {
      dataIndex: 'skuCount',
      title: '销量',
      align: 'center',
    },
    {
      dataIndex: 'companyDistributeRewardFee',
      title: '总服务费(元)',
      align: 'center',
    },
  ]

  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
    getSkuFeeStatistic()
  }
  const getTableList = async () => {
    setTableLoading(true)

    const values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    const res = await queryListAjax(values)
    if (res && res.code === '0' && res.data && res.data.data && res.data.data.length) {
      setViceExportKeyData(values)
      setTableData(res.data.data)
      setRecordTotalNum(res.data.rowTop)
    } else {
      setTableData([])
    }

    setTableLoading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  // 获取详情
  async function getSkuFeeStatistic() {
    const values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    const res = await getSkuFeeStatisticAjax(values)
    if (res && res.code === '0' && res.data) {
      setOrderInfo(res.data)
    } else {
      setOrderInfo({})
    }
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
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="endDate" initialValue={moment()}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="goodsCode">
                  <Input placeholder="请输入商品编码" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="goodsName">
                  <Input placeholder="请输入商品名称" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="skuCode">
                  <Input placeholder="请输入商品规格编码" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="orgCode" label="">
                  <FetchSelect api="/web/supplier/company/queryList" valueKey="orgCode" textKey="orgName" placeholder="请选择推广公司" />
                </Form.Item>
              </Col>

              <Col span={6} style={{ marginBottom: 20 }}>
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
        <Row gutter={[15, 5]} wrap="true" style={{ marginLeft: 20 }} justify={'space-between'}>
          <Col span={3} flex="true">
            <div className={styles.colDiv}>
              <div className={styles.colDiv1}>
                <div>总销售额(元)</div>
                <div>{orderInfo.skuPrice}</div>
              </div>
            </div>
          </Col>
          <Col span={3} flex="true">
            <div className={styles.colDiv}>
              <div className={styles.colDiv1}>
                <div>总订单数(单)</div>
                <div>{orderInfo.tradeCount || '0'}</div>
              </div>
            </div>
          </Col>
          <Col span={3} flex="true">
            <div className={styles.colDiv}>
              <div className={styles.colDiv1}>
                <div>总销量(件)</div>
                <div>{orderInfo.skuCount || '0'}</div>
              </div>
            </div>
          </Col>
          <Col span={3} flex="true">
            <div className={styles.colDiv}>
              <div className={styles.colDiv1}>
                <div>总服务费(元)</div>
                <div>{orderInfo.companyDistributeRewardFee || '0'}</div>
              </div>
            </div>
          </Col>
        </Row>

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
        <DocumentExport
          ref={documentExportRef}
          exportKeyData={viceExportKeyData}
          exportUrl="/web/supplier/export/goodsStatistic/export"
          historyUrl="/web/supplier/export/goodsStatistic/getPagingList"
          infoUrl="/web/supplier/export/goodsStatistic/getExportInfo"
        />
      </div>
    </>
  )
}
export default Index
