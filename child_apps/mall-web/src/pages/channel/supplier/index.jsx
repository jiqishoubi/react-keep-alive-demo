import React, { useState, useRef } from 'react'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Upload, Table } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { history, Link } from 'umi'
import ProTable from '@ant-design/pro-table'
import SearchForm from '@/components/SearchForm'
import useTable from '@/hooks/useTable'
import request from '@/utils/request'
import FetchSelect from '@/components/FetchSelect'
import { getList } from './services'
import EditModal from './editModal'
import InfoModal from './InfoModal'

const title = '供应商管理'
const tableId = 'supplier'
const rowKey = 'id'

function Index(props) {
  const [searchFormRef] = Form.useForm()
  const editModalRef = useRef() //编辑Modal
  const infoModalRef = useRef() //详情Modal

  const columns = [
    { dataIndex: 'orgName', title: '供应商名称', align: 'center' },
    { dataIndex: 'orgCode', title: '供应商编码', align: 'center', width: 180 },
    { dataIndex: 'appName', title: '小程序名称', align: 'center' },
    { dataIndex: 'adminName', title: '管理员姓名', align: 'center' },
    { dataIndex: 'adminPhoneNumber', title: '管理员电话', align: 'center' },
    { dataIndex: 'createDateStr', title: '创建时间', align: 'center' },
    { dataIndex: 'statusName', title: '状态', align: 'center' },
    {
      title: '操作',
      align: 'center',
      width: 150,
      render: (_, item, index) => {
        return (
          <Row gutter={10} justify="center">
            <Col>
              <a style={{ marginLeft: 10 }} onClick={() => infoModalRef.current.show(item)}>
                详情
              </a>
              <a style={{ marginLeft: 10 }} onClick={() => editModalRef.current.show(item)}>
                编辑
              </a>
            </Col>
          </Row>
        )
      },
    },
  ]

  const { currentPage, setCurrentPage, currentPageSize, setCurrentPageSize, tableData, tableTotalNum, isTableLoading, getData, search, showColumns, columnsState, setColumnsState, tableWidth } =
    useTable({
      tableId,
      rowKey,
      ajax: getTableAjax,
      columns,
      columnsWidth: 200,
    })

  const searchFormJsx = [
    <Form.Item name="supplierName" key="orgName">
      <Input placeholder="请输入名称" allowClear />
    </Form.Item>,
    <Form.Item name="supplierCode" key="supplierCode">
      <Input placeholder="请输入供应商编码" allowClear />
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
    <Button type="primary" key="insert" onClick={() => editModalRef.current.show({})} disabled={isTableLoading}>
      新增
    </Button>,
  ]

  function getTableAjax({ page, pageSize }) {
    return new Promise(async (resolve) => {
      const values = searchFormRef.getFieldsValue()
      for (let i in values) {
        let v = values[i]
        values[i] = values[i] || ''
      }
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
        />
      </Card>
      <InfoModal ref={infoModalRef} />
      <EditModal ref={editModalRef} submitCompleted={getData} />
    </>
  )
}

export default Index
