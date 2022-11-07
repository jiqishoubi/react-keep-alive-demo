import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, Form, Row, Col, Input, Select, Image } from 'antd'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import GoodsGroupsForSearch from '@/components/goods/GoodsGroupsForSearch'
import useTable from '@/hooks/useTable'
import requestw from '@/utils/requestw'
import { mConfirm, pathimgHeader, pathVideoHeader, localDB, haveCtrlElementRight } from '@/utils/utils'
import AddModal from './AddModal'
import useModalController from '@/hooks/useModalController'

function Index() {
  const history = useHistory()
  const [searchFormRef] = Form.useForm()

  const columns = [
    { title: '通知名称', dataIndex: 'noticeTitle' },
    { title: '通知封面', dataIndex: 'noticeImage', render: (v) => <Image src={v} style={{ maxHeight: 60 }}></Image> },
    { title: '创建时间', dataIndex: 'createDateStr' },
    { title: '状态', dataIndex: 'disabled', width: 90, render: (v) => (v == 0 ? '有效' : '失效') },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 90,
      render: (_, record) => {
        const toggleStatusText = record.disabled == '0' ? '失效' : '生效' // 0 1
        return (
          <Row gutter={10}>
            <Col>
              <a
                onClick={() => {
                  addModalController.controller.open(record)
                }}
              >
                编辑
              </a>
            </Col>
            <Col>
              <a
                onClick={() => {
                  toggleStatus(record)
                }}
              >
                {toggleStatusText}
              </a>
            </Col>
          </Row>
        )
      },
    },
  ]

  const {
    tableId,
    rowKey,
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
    rowKey,
    columns,
    ajax: getDataAjax,
  })
  function getDataAjax({ page, pageSize }) {
    const values = searchFormRef.getFieldsValue()
    return requestw({
      url: '/web/system/notice/getNoticePaging',
      data: {
        page,
        rows: pageSize,
        ...values,
      },
      isNeedCheckResponse: true,
    }).then((data) => ({ list: data?.data ?? [], total: data?.rowTop ?? 0 }))
  }

  var addModalController = useModalController({
    onAddSuccess: search,
    onEditSuccess: getData,
  }) // 新建、编辑 modal

  function toggleStatus(record) {
    const toggleStatusText = record.disabled == '0' ? '失效' : '生效' // 0 1
    mConfirm(`确认${toggleStatusText}？`, () => {
      return requestw({
        url: '/web/system/notice/updateNoticeDisabled',
        data: {
          noticeCode: record.noticeCode,
          // disabled: record.disabled == '0' ? '1' : '0', // 消息通知状态(0:有效，1:失效)(非空)
        },
        isNeedCheckResponse: true,
        errMsg: true,
      }).then(getData)
    })
  }

  return (
    <>
      <Form className="global_searchForm_box" form={searchFormRef}>
        <Row gutter={10}>
          <Col span={4}>
            <Form.Item name="noticeTitle">
              <Input placeholder="通知名称" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="disabled">
              <Select placeholder="状态">
                <Select.Option value="0">有效</Select.Option>
                <Select.Option value="1">失效</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* 操作 */}
          <Col>
            <CustomButton isHaveBottom={true} onClick={() => searchFormRef?.resetFields()}>
              重置
            </CustomButton>
          </Col>
          <Col>
            <CustomButton type="primary" isHaveBottom={true} onClick={search}>
              查询
            </CustomButton>
          </Col>
          <Col>
            <CustomButton type="primary" isHaveBottom={true} onClick={() => addModalController.controller.open()}>
              新建
            </CustomButton>
          </Col>
        </Row>
      </Form>
      <Table
        className="global_table_box"
        size="small"
        id={tableId}
        rowKey={rowKey}
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
        onChange={({ current, pageSize }) => {
          setCurrentPage(current)
          setCurrentPageSize(pageSize)
        }}
        scroll={{ x: tableWidth }}
      />
      <AddModal {...addModalController} />
    </>
  )
}
export default Index
