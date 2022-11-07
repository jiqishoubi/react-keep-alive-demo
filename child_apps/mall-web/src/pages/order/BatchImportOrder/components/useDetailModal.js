import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Form, Input, message, Table, Row, Col, Button, Select } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import useTable from '@/hooks/useTable'
import { getTradeBatchOperDataPagingAjax } from '../services'

const { Option } = Select

const tableId = 'order_batchimportorder_detailmodal_table'
const rowKey = 'id'

function useDetailModal(options) {
  const [searchFormRef] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [lookingRecord, setLookingRecord] = useState(null)

  //方法
  /**
   * @param {object} lookingRecord
   */
  const openModal = (lookingRecord = null) => {
    setVisible(true)
    setLookingRecord(lookingRecord)
  }
  const closeModal = useCallback(() => {
    setVisible(false)
    setLookingRecord(null)
  }, [])

  const columns = [
    { title: '合伙人', key: 'DATA_COL1', dataIndex: 'DATA_COL1', width: 120 },
    { title: '商品', key: 'DATA_COL2', dataIndex: 'DATA_COL2', width: 230 },
    { title: '商品规格', key: 'DATA_COL14', dataIndex: 'DATA_COL14' },
    { title: '数量', key: 'DATA_COL3', dataIndex: 'DATA_COL3', width: 100 },
    { title: '收货人', key: 'DATA_COL4', dataIndex: 'DATA_COL4' },
    { title: '联系电话', key: 'DATA_COL5', dataIndex: 'DATA_COL5' },
    {
      title: '地址',
      key: 'address',
      width: 250,
      ellipsis: true,
      render: (record) => {
        return `${record.DATA_COL6 || ''}${record.DATA_COL7 || ''}${record.DATA_COL8 || ''}${record.DATA_COL9 || ''}`
      },
    },
    { title: '跨境姓名', key: 'DATA_COL10', dataIndex: 'DATA_COL10' },
    { title: '身份证', key: 'DATA_COL11', dataIndex: 'DATA_COL11' },
    {
      title: '状态',
      key: 'STATUS',
      dataIndex: 'STATUS',
      width: 70,
      fixed: 'right',
      render: (v) => {
        return v == '2' ? '成功' : '失败'
      },
    },
    {
      title: '失败原因',
      key: 'RESULT_NOTE',
      width: 180,
      fixed: 'right',
      render: (record) => {
        return record.STATUS == '2' ? null : record.RESULT_NOTE
      },
    },
  ]

  const {
    //表格
    currentPage,
    currentPageSize,
    tableData,
    tableTotalNum,
    isTableLoading,
    //方法
    setCurrentPage,
    setCurrentPageSize,
    getData, //刷新表格 页码不变
    search, //刷新表格 页码变成1
    //columns
    showColumns,
    //table宽度
    tableWidth,
  } = useTable({
    tableId,
    rowKey,
    columns,
    ajax: getDataAjax,
  })

  /**
   * 表格查询ajax  // 传出来page 和 pageSize
   * { ()=>Promise<{ list,total }> }
   * @param {object} args
   * @param {number} args.page
   * @param {number} args.pageSize
   */
  function getDataAjax({ page, pageSize }) {
    if (!lookingRecord) {
      return new Promise((resolve) =>
        resolve({
          list: [],
          total: 0,
        })
      )
    }
    const searchValues = searchFormRef.getFieldsValue()
    const postData = {
      ...searchValues,
      page: page,
      rows: pageSize,
      operCode: lookingRecord && lookingRecord.operCode,
    }
    return getTradeBatchOperDataPagingAjax(postData).then((res) => {
      let resObj = {
        list: [],
        total: 0,
      }
      if (res && res.code == '0' && res.data && res.data.list) {
        resObj = {
          list: res.data.list,
          total: res.data.paging.rowTop,
        }
      }
      return resObj
    })
  }

  /**
   * 表格
   */
  const onTableChange = ({ current, pageSize }) => {
    setCurrentPage(current)
    setCurrentPageSize(pageSize)
  }

  useEffect(() => {
    if (lookingRecord) {
      getData()
    }
  }, [lookingRecord])

  const ModalDom = (
    <Modal title="详情" visible={visible} destroyOnClose maskClosable={false} onCancel={closeModal} onOk={closeModal} width={1100} centered>
      <div className="positionre" style={{ marginLeft: '20px' }}>
        <Form form={searchFormRef} name="basic" style={{ border: '1px solid #FEFFFE' }}>
          <div style={{ marginTop: 10 }}>
            <Row gutter={[15, 22]} justify="start">
              <Col span={4}>
                <Form.Item name="status" style={{ marginBottom: 0 }}>
                  <Select showArrow={true} listHeight={250} listItemHeight={10} allowClear={true} placeholder="完成进度">
                    <Option value="2">成功</Option>
                    <Option value="3">失败</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col>
                <Button style={{ borderRadius: 8 }} type="primary" size="middle" onClick={search}>
                  查询
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>

      <Table
        style={{ margin: '10px  20px' }}
        id={tableId}
        rowKey={rowKey}
        rowClassName={useGetRow}
        columns={showColumns}
        dataSource={tableData}
        loading={isTableLoading}
        pagination={{
          showQuickJumper: true,
          current: currentPage,
          pageSize: currentPageSize,
          total: tableTotalNum,
          showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
        }}
        onChange={onTableChange}
        scroll={{ x: tableWidth }}
      />
    </Modal>
  )

  return {
    openDetailodal: openModal,
    closDetailModal: closeModal,
    DetailModal: ModalDom,
  }
}

export default useDetailModal
