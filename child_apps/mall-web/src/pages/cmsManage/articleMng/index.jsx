import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import { Card, Button, Form, Input, Space, Popconfirm, Row, Col, message } from 'antd'
import ProTable from '@ant-design/pro-table'
import SearchForm from './components/SearchForm'
import AddPage from './components/AddPage'
import AddModal from './components/AddModal'
import EditorModal from './components/EditorModal'
import DetailModal from './components/DetailModal'
import MoreBtn from './components/MoreBtn'
import useAdd from './hook/useAdd'
import useSelectedRows from './hook/useSelectedRows'
import { getOrgKind, mConfirm } from '@/utils/utils'
import { deleteAjax } from './service'

const tableRowKey = 'id'

const columns1 = [
  {
    title: '文章名称',
    dataIndex: 'textName',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createDateStr',
    align: 'center',
  },
  {
    align: 'center',
    dataIndex: 'orgName',
    title: '供应商',
    width: 170,
    ellipsis: true,
  },
]

const Index = (props) => {
  const addModalRef = useRef()
  const detailModalRef = useRef()
  const editorModalRef = useRef()

  const { isShowAdd, lookingRecord, openAdd, closeAdd } = useAdd() //Add页面
  const { selectedRowKeys, selectedRows, setSelectedRows, updateSelectedRows } = useSelectedRows(tableRowKey)

  const {
    dispatch,
    cmsManageArticleMngModel: { page, pageSize, recordTotalNum, list },
    //loading
    loadingTable,
  } = props

  useEffect(() => {
    dispatch({ type: 'cmsManageArticleMngModel/setDefault' })
    dispatch({ type: 'cmsManageArticleMngModel/fetch' })
  }, [])

  //新增
  const clickAdd = () => {
    addModalRef.current?.open()
  }

  /**
   * 表格
   */
  const onPageChange = (newPage, newPageSize) => {
    try {
      if (newPageSize !== pageSize) {
        setSelectedRows([])
      }
    } catch (e) {}
    dispatch({
      type: 'cmsManageArticleMngModel/changePage',
      payload: {
        page: newPage,
        pageSize: newPageSize,
      },
    })
  }

  const clickMoreBtn = (key, record) => {
    if (key == 'toggleStatus') {
      dispatch({
        type: 'cmsManageArticleMngModel/toggleStatus',
        payload: record,
      })
    }
  }

  const clickDelete = (record) => {
    mConfirm('确认删除？', async () => {
      return deleteAjax({
        textCode: record.textCode,
      }).then(() => {
        message.success('操作成功')
        dispatch({ type: 'cmsManageArticleMngModel/fetch' })
      })
    })
  }

  const onAddSuccess = () => {
    closeAdd()
    dispatch({ type: 'cmsManageArticleMngModel/fetch' })
  }

  const onEditorSuccess = () => {
    dispatch({ type: 'cmsManageArticleMngModel/fetch' })
  }

  const columns2 = [
    ...columns1,
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            {!getOrgKind().isAdmin && (
              <a
                key="update"
                onClick={() => {
                  addModalRef.current?.open({ record })
                }}
              >
                编辑
              </a>
            )}
            &nbsp;&nbsp;
            <a
              key="editContent"
              onClick={() => {
                editorModalRef.current?.open({ record })
              }}
            >
              {(getOrgKind().isAdmin && '查看文章') || '编辑文章'}
            </a>
            &nbsp;&nbsp;
            <a
              key="revamp"
              onClick={() => {
                clickDelete(record)
              }}
            >
              删除
            </a>
          </>
        )
      },
    },
  ]

  return (
    <>
      <Card title="文章管理" style={{ display: isShowAdd ? 'none' : 'block' }}>
        <SearchForm onClickAdd={clickAdd} />

        <ProTable
          type="table"
          search={false}
          // //头部
          // headerTitle="推广公司管理"
          //工具栏 table 工具栏，设为 false 时不显示
          options={false}
          //数据
          rowKey={tableRowKey}
          columns={columns2}
          dataSource={list}
          loading={loadingTable}
          //分页
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: page,
            pageSize: pageSize,
            total: recordTotalNum,
            onChange: onPageChange,
            size: 'small',
            showTotal: (total, range) => `第${range[0]}-${range[1]}条/共${total}条`,
          }}
        />
      </Card>

      {/* Add页 */}
      {isShowAdd && <AddPage lookingRecord={lookingRecord} onCancel={closeAdd} onSuccess={onAddSuccess} />}
      <AddModal
        onRef={(e) => {
          addModalRef.current = e
        }}
        onSuccess={onAddSuccess}
      />
      {/* 详情 */}
      <DetailModal
        onRef={(e) => {
          detailModalRef.current = e
        }}
      />
      {/* 富文本编辑器 */}
      <EditorModal
        onRef={(e) => {
          editorModalRef.current = e
        }}
        onSuccess={onEditorSuccess}
      />
    </>
  )
}

export default connect(({ cmsManageArticleMngModel, loading }) => {
  return {
    cmsManageArticleMngModel,
    loadingTable: loading.effects['cmsManageArticleMngModel/fetch'],
  }
})(Index)
