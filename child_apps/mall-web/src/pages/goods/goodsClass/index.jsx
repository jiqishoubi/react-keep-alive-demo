import React, { useState, useRef, useEffect } from 'react'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Upload, Table } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { history, Link } from 'umi'
import ProTable from '@ant-design/pro-table'
import SearchForm from '@/components/SearchForm'
import useTable from '@/hooks/useTable'
import request from '@/utils/requestw'
import FetchSelect from '@/components/FetchSelect'
import { getList, getAllList, updateStatus, remove } from './services'
import EditModal from './editModal'
import InfoModal from './InfoModal'
import { connect } from 'dva'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'

const title = '商品分类管理'
const rowKey = 'id'

function Index(props) {
  const { dispatch } = props
  const [searchFormRef] = Form.useForm()
  const editModalRef = useRef() //编辑Modal
  const infoModalRef = useRef() //详情Modal
  function updateStatusAction(item) {
    const statusText = item.disabled == '0' ? '失效' : '生效'
    Modal.confirm({
      title: '提示信息',
      content: `是否确认变更为${statusText}?`,
      onOk: async () => {
        await updateStatus({
          groupCode: item.groupCode,
          disabled: item.disabled == 0 ? 1 : 0,
        })
        getData()
      },
    })
  }
  const removeAction = (item) => {
    Modal.confirm({
      title: '提示信息',
      content: `是否要删除该记录吗?`,
      onOk: async () => {
        await remove({
          groupCode: item.groupCode,
        })
        getData()
      },
    })
  }
  const columns = [
    { dataIndex: 'groupName', title: '分类名称', align: 'center' },
    {
      dataIndex: 'groupImg',
      title: '图片',
      align: 'center',
      render: (e) => <Image width={80} height={80} src={e} preview={true} />,
    },
    { dataIndex: 'groupOrder', title: '排序', align: 'center' },
    {
      dataIndex: 'disabled',
      title: '状态',
      align: 'center',
      render: (e) => (e == 0 ? '生效' : '失效'),
    },
    {
      title: '操作',
      align: 'center',
      width: 150,
      render: (_, item, index) => {
        return (
          <Row gutter={10} justify="center">
            <Col>
              {/* <a style={{ marginLeft: 10 }} onClick={() => infoModalRef.current.show(item)}>详情</a> */}
              <a style={{ marginLeft: 10 }} onClick={() => editModalRef.current.show(item)}>
                编辑
              </a>
              <a style={{ marginLeft: 10 }} onClick={() => updateStatusAction(item)}>
                {item.disabled == 1 ? '生效' : '失效'}
              </a>
              {/* <a style={{ marginLeft: 10 }} onClick={() => removeAction(item)}>
                删除
              </a> */}
            </Col>
          </Row>
        )
      },
    },
  ]

  const {
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
    tableId,
  } = useTable({
    rowKey,
    ajax: getTableAjax,
    columns,
    columnsWidth: 200,
    responseDeal,
  })

  const responseDeal = (list) => {
    return list
  }

  const searchFormJsx = [
    // <Form.Item name="groupName" key="orgName">
    //   <Input placeholder="请输入名称" allowClear />
    // </Form.Item>,
    <Form.Item name="disabled" key="disabled">
      <Select placeholder="请选择状态" allowClear>
        <Option value={'0'}>生效</Option>
        <Option value={'1'}>失效</Option>
      </Select>
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
        groupLevel: 0,
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
        />
      </Card>
      {/* <InfoModal ref={infoModalRef} /> */}
      <EditModal ref={editModalRef} submitCompleted={getData} />
    </>
  )
}

// export default Index

export default connect(({ login }) => ({
  login,
}))(Index)
