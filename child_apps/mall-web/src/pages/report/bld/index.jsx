import React, { useRef, useState } from 'react'
import { Button, Card, Col, DatePicker, Form, Row, Select } from 'antd'
import api_channel from '@/services/api/channel'
import FetchSelect from '@/components/FetchSelect'
import { getOrgKind } from '@/utils/utils'
import DocumentExport from '@/components/DocumentExport'
import moment from 'moment'
import down from '../../../assets/down.png'
import styles from './index.less'
//对账总表
const API = {
  pageQuery: '/web/admin/statementStatistics/pageQuery',
  export: '/web/admin/statementStatistics/platSupplierStatement/export',
  getPagingList: '/web/admin/export/statementStatistics/platSupplierStatement/getPagingList',
  getExportInfo: '/web/admin/export/statementStatistics/getExportInfo',
}
//供应商对账报表
const API2 = {
  pageQuery: '/web/admin/statementStatistics/pageQuery',
  export: '/web/admin/statementStatistics/supplierStatement/export',
  getPagingList: '/web/admin/export/statementStatistics/supplierStatement/getPagingList',
  getExportInfo: '/web/admin/export/statementStatistics/getExportInfo',
}
//渠道费
const API3 = {
  pageQuery: '/web/supplier/statementStatistics/pageQuery',
  export: '/web/supplier/statementStatistics/supplierChannelFeeStatement/export',
  getPagingList: '/web/supplier/export/statementStatistics/supplierChannelFeeStatement/getPagingList',
  getExportInfo: '/web/supplier/export/statementStatistics/getExportInfo',
}

//推广费
const API4 = {
  pageQuery: '/web/supplier/statementStatistics/pageQuery',
  export: '/web/supplier/statementStatistics/supplierDistributeFeeStatement/export',
  getPagingList: '/web/supplier/export/statementStatistics/supplierDistributeFeeStatement/getPagingList',
  getExportInfo: '/web/supplier/export/statementStatistics/getExportInfo',
}

//管理费
const API5 = {
  pageQuery: '/web/supplier/statementStatistics/pageQuery',
  export: '/web/supplier/statementStatistics/supplierMgrFeeStatement/export',
  getPagingList: '/web/supplier/export/statementStatistics/supplierMgrFeeStatement/getPagingList',
  getExportInfo: '/web/supplier/export/statementStatistics/getExportInfo',
}

const Index = () => {
  const [form] = Form.useForm()
  const documentExportRef = useRef()
  const documentExportRef2 = useRef()
  const documentExportRef3 = useRef()
  const documentExportRef4 = useRef()
  const documentExportRef5 = useRef()
  const [viceExportKeyData, setViceExportKeyData] = useState('')

  const resetSearch = () => {
    form.resetFields()
  }
  function getTableList() {
    const formData = form.getFieldsValue()
    formData?.startDate && (formData['startDate'] = moment(formData?.startDate).format('YYYY-MM-DD'))
    formData?.endDate && (formData['endDate'] = moment(formData?.endDate).format('YYYY-MM-DD'))
    setViceExportKeyData(formData)
  }

  return (
    <Card style={{ minHeight: '100Vh' }}>
      <Form form={form} onFinish={getTableList}>
        <Row gutter={[15, 5]}>
          <Col span={3}>
            <Form.Item name="dateType" initialValue="TRADE">
              <Select>
                <Select.Option value="TRADE">下单时间</Select.Option>
                <Select.Option value="FINISH">完成时间</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="startDate">
              <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="endDate">
              <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="orgCode">
              <FetchSelect api={api_channel.queryPromotionCompanyList} valueKey="orgCode" textKey="orgName" placeholder="推广公司" />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item name="supplierOrgCode">
              <FetchSelect api={getOrgKind().isAdmin ? '/web/admin/supplier/getList' : '/web/staff/supplier/getList'} valueKey="orgCode" textKey="orgName" placeholder="供应商" />
            </Form.Item>
          </Col>

          <Col style={{ marginBottom: 20 }}>
            <Button style={{ borderRadius: 8, marginRight: 10 }} size="middle" onClick={resetSearch}>
              重置
            </Button>
            <Button style={{ borderRadius: 8, marginRight: 10 }} type="primary" size="middle" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <Row gutter={[48, 48]} justify="space-between" style={{ marginRight: 20 }}>
        <Col
          span={4}
          onClick={() => {
            documentExportRef2.current?.openFinish()
          }}
        >
          <div className={styles.item}>
            <img alt="" src={down} style={{ width: 40, height: 40 }} />
            供应商对账报表
          </div>
        </Col>
        <Col
          span={4}
          onClick={() => {
            documentExportRef.current?.openFinish()
          }}
        >
          <div className={styles.item}>
            <img alt="" src={down} style={{ width: 40, height: 40 }} />
            对账总表
          </div>
        </Col>

        <Col
          span={4}
          onClick={() => {
            documentExportRef3.current?.openFinish()
          }}
        >
          <div className={styles.item}>
            <img alt="" src={down} style={{ width: 40, height: 40 }} />
            渠道费对账报表
          </div>
        </Col>
        <Col
          span={4}
          onClick={() => {
            documentExportRef4.current?.openFinish()
          }}
        >
          <div className={styles.item}>
            <img alt="" src={down} style={{ width: 40, height: 40 }} />
            推广费对账报表
          </div>
        </Col>
        <Col
          span={4}
          onClick={() => {
            documentExportRef5.current?.openFinish()
          }}
        >
          <div className={styles.item}>
            <img alt="" src={down} style={{ width: 40, height: 40 }} />
            管理费对账报表
          </div>
        </Col>
      </Row>
      <DocumentExport ref={documentExportRef} exportKeyData={viceExportKeyData} exportUrl={API.export} infoUrl={API.getExportInfo} historyUrl={API.getPagingList} />
      <DocumentExport ref={documentExportRef2} exportKeyData={viceExportKeyData} exportUrl={API2.export} infoUrl={API2.getExportInfo} historyUrl={API2.getPagingList} />
      <DocumentExport ref={documentExportRef3} exportKeyData={viceExportKeyData} exportUrl={API3.export} infoUrl={API3.getExportInfo} historyUrl={API3.getPagingList} />
      <DocumentExport ref={documentExportRef4} exportKeyData={viceExportKeyData} exportUrl={API4.export} infoUrl={API4.getExportInfo} historyUrl={API4.getPagingList} />
      <DocumentExport ref={documentExportRef5} exportKeyData={viceExportKeyData} exportUrl={API5.export} infoUrl={API5.getExportInfo} historyUrl={API5.getPagingList} />
    </Card>
  )
}
export default Index
