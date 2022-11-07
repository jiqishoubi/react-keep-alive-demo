import { Table, Form, Row, Col, Input } from 'antd'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import AddModal from './AddModal'
import useTable from '@/hooks/useTable'
import useModalController from '@/hooks/useModalController'
import requestw from '@/utils/requestw'
import { mConfirm } from '@/utils/utils'

function Index() {
  const [searchFormRef] = Form.useForm()
  const columns = [
    { title: '代理商名称', dataIndex: 'orgName' },
    { title: '代理商简称', dataIndex: 'orgAlias', width: 160 },
    { title: '代理商编码', dataIndex: 'orgCode' },
    { title: '状态', dataIndex: 'statusName' },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 100,
      render: (_, record) => {
        const toggleStatusText = record.status == '0' ? '失效' : '生效'
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
      url: '/web/system/promotionCompany/queryPage',
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
    const toggleStatusText = record.status == '0' ? '失效' : '生效'
    mConfirm(`确认${toggleStatusText}？`, () => {
      return requestw({
        url: '/web/system/promotionCompany/updatePromotionCompanyStatus',
        data: {
          orgCode: record.orgCode,
          status: record.status == '0' ? '3' : '0', // 状态(非空 0-有效 3-失效)
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
            <Form.Item name="orgName">
              <Input placeholder="代理商名称" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="orgAlias">
              <Input placeholder="代理商简称" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="orgCode">
              <Input placeholder="代理商编码" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="status">
              <FetchSelect placeholder="状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'ORG_STATUS' }} />
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
