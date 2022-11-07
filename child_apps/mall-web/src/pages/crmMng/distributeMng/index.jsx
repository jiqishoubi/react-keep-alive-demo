import { Table, Form, Row, Col, Input } from 'antd'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import AddModal from './AddModal'
import getPageModal from '@/components/modal/getPageModal'
import Page_recommendCodeMng from '@/pages/crmMng/recommendCodeMng'
import useTable from '@/hooks/useTable'
import useModalController from '@/hooks/useModalController'
import requestw from '@/utils/requestw'
import { mConfirm } from '@/utils/utils'

const PageModal_recommendCodeMng = getPageModal(Page_recommendCodeMng)

function Index() {
  const [searchFormRef] = Form.useForm()

  const pageModalController_recommendCodeMng = useModalController() // 推荐码 page

  const columns = [
    { title: '推广人', dataIndex: 'distributeName', width: 140 },
    { title: '推广人编码', dataIndex: 'distributeCode' },
    { title: '所属代理商', dataIndex: 'orgName' },
    { title: '推广人手机号', dataIndex: 'phoneNumber', width: 130 },
    { title: '状态', dataIndex: 'statusName', width: 90 },
    { title: '创建时间', dataIndex: 'createDateStr' },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 120,
      render: (_, record) => {
        const toggleStatusText = record.status == '2' ? '失效' : '生效'
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
            <Col>
              <a
                onClick={() => {
                  pageModalController_recommendCodeMng.controller.open({
                    distributeCode: record.distributeCode,
                  })
                }}
              >
                推荐码
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
      url: '/web/system/distribute/queryPage',
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
    const toggleStatusText = record.status == '2' ? '失效' : '生效'
    mConfirm(`确认${toggleStatusText}？`, () => {
      return requestw({
        url: '/web/system/distribute/updateDistributeStatus',
        data: {
          distributeCode: record.distributeCode,
          status: record.status == '2' ? '3' : '2', // 状态(非空 2-有效 3-失效)
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
            <Form.Item name="distributeCode">
              <Input placeholder="推广人编码" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="distributeName">
              <Input placeholder="推广人姓名" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="phoneNumber">
              <Input placeholder="推广人手机号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="orgCode">
              <FetchSelect
                placeholder="代理商"
                api="/web/system/distribute/getPromotionCompanyList"
                valueKey="orgCode"
                textKey="orgName"
                showSearch
                filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="status">
              <FetchSelect placeholder="状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'DISTRIBUTE_STATUS' }} />
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
      <PageModal_recommendCodeMng {...pageModalController_recommendCodeMng} />
    </>
  )
}
export default Index
