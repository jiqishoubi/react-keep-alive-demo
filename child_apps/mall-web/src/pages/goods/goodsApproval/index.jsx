import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Upload, DatePicker, Table, Popconfirm } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { history, Link } from 'umi'
import ProTable from '@ant-design/pro-table'
import SearchForm from '@/components/SearchForm'
import useTable from '@/hooks/useTable'
import useModalController from '@/hooks/useModalController'
import request from '@/utils/requestw'
import FetchSelect from '@/components/FetchSelect'
import { getList, approvalStatusUpdate } from './services'
import EditModal from './editModal'
// import InfoModal from './InfoModal'
import { connect } from 'dva'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'
import api_common from '@/services/api/common'
import moment from 'moment'

const title = '商品审核'
const rowKey = 'id'
function Index(props) {
  const { dispatch } = props
  const history = useHistory()
  const [searchFormRef] = Form.useForm()
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
      dataIndex: 'salePriceStr',
      title: '售价(元)',
      align: 'center',
    },
    {
      dataIndex: 'totalServiceFeeStr',
      title: '总服务费(元)',
      align: 'center',
      width: 130,
    },
    {
      dataIndex: 'channelServiceFeeStr',
      title: '渠道推广费(元)',
      align: 'center',
      width: 130,
    },
    {
      dataIndex: 'platformServiceFeeStr',
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
      dataIndex: 'apprStatusName',
      title: '审核状态',
      align: 'center',
    },
    {
      dataIndex: 'apprDateStr',
      title: '审核时间',
      align: 'center',
      render: (_, record) => record.apprDateStr || record.apprDate,
    },
    // {
    //   dataIndex: 'updateDateStr',
    //   title: '修改时间',
    //   align: 'center',
    // },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (e) => (
        <>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              history.push(`/web/supplier/goods/goodsmgr/detail?goodsCode=${e.goodsCode}&disabled=1`)
            }}
          >
            详情
          </a>

          {e.apprStatus == 90 && (
            <a onClick={() => editModalController.controller.open(e)} style={{ marginLeft: 10 }}>
              修改
            </a>
          )}

          {e.apprStatus == 10 && (
            <Popconfirm
              title="请选择通过或驳回该商品"
              cancelText="审核驳回"
              okText="审核通过"
              onCancel={() => approvalStatusUpdateAction(e, '93')}
              onConfirm={() => editModalController.controller.open(e)}
            >
              <a style={{ marginLeft: 10 }}>审核</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ]

  const approvalStatusUpdateAction = async (item, apprStatus) => {
    const { skuCode, channelServiceFee, platformServiceFee, technicalServiceFee } = item
    await approvalStatusUpdate({
      skuCode,
      apprStatus,
      channelServiceFee,
      technicalServiceFee,
      platformServiceFee,
    })
    getData()
  }

  const {
    tableId,
    currentPage,
    setCurrentPage,
    currentPageSize,
    setCurrentPageSize,
    tableData,
    tableTotalNum,
    isTableLoading,
    getData,
    search,
    showColumns,
    columnsState,
    setColumnsState,
    tableWidth,
  } = useTable({
    rowKey,
    ajax: getTableAjax,
    columns,
    columnsWidth: 200,
    responseDeal,
  })
  const editModalController = useModalController({
    onEditSuccess: getData,
  })

  const responseDeal = (list) => {
    return list
  }

  const searchFormJsx = [
    // <Form.Item name="startDate" key="startDate" initialValue={moment().add(-30, 'days')}>
    //   <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期" />
    // </Form.Item>,
    // <Form.Item key="startDate" name="endDate" initialValue={moment()}>
    //   <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期" />
    // </Form.Item>,
    <Form.Item key="goodsCode" name="goodsCode">
      <Input placeholder="商品编码" />
    </Form.Item>,
    <Form.Item key="goodsName" name="goodsName">
      <Input placeholder="商品名称" />
    </Form.Item>,
    <Form.Item key="skuCode" name="skuCode">
      <Input placeholder="sku编码" />
    </Form.Item>,
    <Form.Item key="skuName" name="skuName">
      <Input placeholder="sku名称" />
    </Form.Item>,
    <Form.Item key="supplierOrgCode" name="supplierOrgCode">
      <FetchSelect
        api="/web/system/supplier/getSupplierPaggingList"
        formData={{
          page: 1,
          rows: 10000,
        }}
        dealResFunc={(data) => data?.data || []}
        valueKey="orgCode"
        textKey="orgName"
        placeholder="供应商"
        showSearch
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      />
    </Form.Item>,
    <Form.Item key="apprStatus" name="apprStatus">
      <FetchSelect api={api_common.getSysCodeByParamApi} formData={{ codeParam: 'APPRAISE_STATUS' }} valueKey="codeKey" textKey="codeValue" placeholder="审核状态" />
    </Form.Item>,
  ]

  const searchActionsJsx = [
    <Button
      type="ghost"
      key="submit"
      onClick={() => {
        searchFormRef.resetFields()
      }}
      disabled={isTableLoading}
    >
      重置
    </Button>,
    <Button
      type="primary"
      key="query"
      onClick={() => {
        search()
      }}
      disabled={isTableLoading}
    >
      查询
    </Button>,
  ]

  function getTableAjax({ page, pageSize }) {
    return new Promise(async (resolve) => {
      const values = searchFormRef.getFieldsValue()
      for (let i in values) {
        let v = values[i]
        values[i] = values[i] || ''
      }
      // values.startDate = moment(values.startDate).format('YYYY-MM-DD')
      // values.endDate = moment(values.endDate).format('YYYY-MM-DD')
      const data = await getList({
        page,
        rows: pageSize,
        ...values,
      })
      return resolve({
        list: data?.data || [],
        total: data?.rowTop || 0,
      })
    })
  }

  return (
    <>
      <Card>
        <SearchForm form={searchFormRef} submitterItems={searchActionsJsx}>
          {searchFormJsx}
        </SearchForm>
        <Table
          id={tableId}
          rowKey={rowKey}
          columns={columns}
          dataSource={tableData}
          loading={isTableLoading}
          pagination={{
            showQuickJumper: true,
            current: currentPage,
            pageSize: currentPageSize,
            total: tableTotalNum,
          }}
          onChange={({ current, pageSize }) => {
            setCurrentPage(current)
            setCurrentPageSize(pageSize)
          }}
          scroll={{ x: tableWidth }}
        />
      </Card>
      <EditModal {...editModalController} />
    </>
  )
}

// export default Index

export default connect(({ login }) => ({
  login,
}))(Index)
