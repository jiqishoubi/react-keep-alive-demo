import React, { useRef } from 'react'
import moment from 'moment'
import { Form, DatePicker, Input, Select, Row, Col, Button, Table, Modal, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import useTable from '@/hooks/useTable'
import FetchSelect from '@/components/FetchSelect'
import ApproveModal from './components/ApproveModal'
import { queryListAjax, deleteDistributeAjax } from './services'
import api_common from '@/services/api/common'

const { RangePicker } = DatePicker
const { Option } = Select

const tableId = 'channel_joinauth_table'
const rowKey = 'distributeCode'

const Index = () => {
  const [searchFormRef] = Form.useForm()
  const approveModalRef = useRef()

  const columns = [
    { title: '成员名称', dataIndex: 'personName' },
    { title: '联系电话', dataIndex: 'personPhoneNumber', width: 150 },
    { title: '成员状态', dataIndex: 'statusName', width: 100 },
    { title: '提交时间', dataIndex: 'createDateStr' },
    {
      title: '操作',
      dataIndex: 'options',
      width: 80,
      render: (_, record) => {
        return (
          <>
            {record.status == '0' && (
              <a
                onClick={() => {
                  approveModalRef.current?.open(record.distributeCode, record?.developCode)
                }}
              >
                审核
              </a>
            )}
            <a
              onClick={() => {
                deleteRecord(record)
              }}
              style={{ marginLeft: 10 }}
            >
              删除
            </a>
          </>
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
    //批量操作
    selectedRows,
    selectedRowKeys,
    setSelectedRows,
    updateSelectedRows,
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
    if (searchValues.dateRange && searchValues.dateRange[0]) {
      postData.startDate = searchValues.dateRange[0].format('YYYY-MM-DD')
      postData.endDate = searchValues.dateRange[1].format('YYYY-MM-DD')
      delete postData.dateRange
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

  //删除
  function deleteRecord(record) {
    Modal.confirm({
      title: '提示',
      content: '确认删除？',
      onOk() {
        return new Promise(async (resolve) => {
          const res = await deleteDistributeAjax({
            distributeCode: record.distributeCode,
          })
          if (!res || res.code !== '0') {
            message.warning((res && res.message) || '网络异常')
            return resolve()
          }
          message.success('操作成功')
          resolve()
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }

  /**
   * 表格
   */
  const onTableChange = ({ current, pageSize }) => {
    setCurrentPage(current)
    setCurrentPageSize(pageSize)
  }

  return (
    <div className="headBac">
      <div className="positionre" style={{ marginLeft: '20px' }}>
        <Form form={searchFormRef} name="basic" style={{ border: '1px solid #FEFFFE' }}>
          <div style={{ marginTop: '23px' }}>
            <Row gutter={[15, 22]} justify="start">
              <Col span={6}>
                <Form.Item name="dateRange" initialValue={[moment().subtract(30, 'days'), moment()]} style={{ marginBottom: 0 }}>
                  <RangePicker style={{ width: '100%' }} allowClear={false} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="personPhoneNumber" style={{ marginBottom: 0 }}>
                  <Input allowClear={true} placeholder="联系电话" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="personName" style={{ marginBottom: 0 }}>
                  <Input allowClear={true} placeholder="成员名称" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="status" style={{ marginBottom: 0 }}>
                  <FetchSelect placeholder="成员状态" api={api_common.getSysCodeByParamApi} formData={{ codeParam: 'DISTRIBUTE_STATUS' }} valueKey="codeKey" textKey="codeValue" />
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
      <ApproveModal
        ref={approveModalRef}
        onSuccess={() => {
          setSelectedRows([])
          getData()
        }}
      />
    </div>
  )
}

export default Index
