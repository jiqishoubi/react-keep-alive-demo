import React from 'react'
import { Form, DatePicker, Input, Select, Row, Col, Button, Table } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import useTable from '@/hooks/useTable'
import useImportModal from './components/useImportModal'
import useDetailModal from './components/useDetailModal'
import { queryListAjax } from './services'

const { RangePicker } = DatePicker
const { Option } = Select

const tableId = 'order_batchimportorder_table'
const rowKey = 'operCode'

//下载模板
const clickDownloadTemplate = () => {
  const file = require('../../../assets/PC端批量下单模板.xlsx')
  window.open(file, '_blank')
}

const Index = () => {
  const [searchFormRef] = Form.useForm()

  const { openDetailodal, closDetailModal, DetailModal } = useDetailModal()

  const columns = [
    { title: '订单批次', dataIndex: 'operCode' },
    { title: '订单数量', dataIndex: 'dataCount', width: 150 },
    { title: '成功数量', dataIndex: 'dataCountSuccess', width: 100 },
    { title: '失败数量', dataIndex: 'dataCountError', width: 100 },
    { title: '完成进度', dataIndex: 'statusName', width: 100 },
    { title: '提交时间', dataIndex: 'operDate' },
    { title: '完成时间', dataIndex: 'finishDate' },
    {
      title: '操作',
      dataIndex: 'options',
      width: 80,
      // fixed: 'right',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              openDetailodal(record)
            }}
          >
            详情
          </a>
        )
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
    const searchValues = searchFormRef.getFieldsValue()
    const postData = {
      ...searchValues,
      page: page,
      rows: pageSize,
    }
    return queryListAjax(postData).then((res) => {
      let resObj = {
        list: [],
        total: 0,
      }
      if (res && res.code == '0' && res.data && res.data.data) {
        resObj = {
          list: res.data.data,
          total: res.data.rowTop,
        }
      }
      return resObj
    })
  }

  /**
   * 搜索form
   */
  const onClickReset = () => {
    searchFormRef.resetFields()
  }

  const onClickSearch = () => {
    search()
  }

  /**
   * 表格
   */
  const onTableChange = ({ current, pageSize }) => {
    setCurrentPage(current)
    setCurrentPageSize(pageSize)
  }

  const { openImportodal, closImportModal, ImportModal } = useImportModal({
    onSuccess: () => {
      getData()
    },
  })

  return (
    <div className="headBac">
      <div className="positionre" style={{ marginLeft: '20px' }}>
        <Form form={searchFormRef} name="basic" style={{ border: '1px solid #FEFFFE' }}>
          <div style={{ marginTop: '23px' }}>
            <Row gutter={[15, 22]} justify="start">
              <Col span={6}>
                <Form.Item name="dateRange" style={{ marginBottom: 0 }}>
                  <RangePicker style={{ width: '100%' }} allowClear={true} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="operCode" style={{ marginBottom: 0 }}>
                  <Input allowClear={true} placeholder="订单批次" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="status" style={{ marginBottom: 0 }}>
                  <Select showArrow={true} listHeight={250} listItemHeight={10} allowClear={true} placeholder="完成进度">
                    <Option value="2">成功</Option>
                    <Option value="3">失败</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col>
                <Button style={{ borderRadius: 8 }} size="middle" onClick={onClickReset}>
                  重置
                </Button>
              </Col>
              <Col>
                <Button style={{ borderRadius: 8 }} type="primary" size="middle" onClick={onClickSearch}>
                  查询
                </Button>
              </Col>
              <Col>
                <Button style={{ borderRadius: 8 }} type="primary" size="middle">
                  导出
                </Button>
              </Col>
              <Col>
                <Button style={{ borderRadius: 8 }} type="primary" size="middle" onClick={clickDownloadTemplate}>
                  下载模板
                </Button>
              </Col>
              <Col>
                <Button style={{ borderRadius: 8 }} type="primary" size="middle" onClick={openImportodal}>
                  批量导入
                </Button>
              </Col>
              <Col>
                <Button style={{ borderRadius: 8 }} type="primary" size="middle" onClick={getData}>
                  刷新表格
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>

      <Table
        style={{ margin: '23px  20px' }}
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

      {/* 模态 */}
      {ImportModal}
      {DetailModal}
    </div>
  )
}

export default Index
