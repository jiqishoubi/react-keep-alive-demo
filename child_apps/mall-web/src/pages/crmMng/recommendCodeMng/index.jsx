import { useEffect } from 'react'
import { Table, Form, Row, Col, Input } from 'antd'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import AddModal from './AddModal'
import QRCodeModal from '@/components/modal/QRCodeModal'
import useTable from '@/hooks/useTable'
import useModalController from '@/hooks/useModalController'
import requestw from '@/utils/requestw'
import { mConfirm } from '@/utils/utils'

function Index(props) {
  console.log('推荐码管理 页面 props', props)
  const [searchFormRef] = Form.useForm()
  const columns = [
    { title: '推荐人', dataIndex: 'distributeName', width: 130 },
    { title: '推荐人编码', dataIndex: 'distributeCode' },
    { title: '推广方式', dataIndex: 'recommendTypeName', width: 130 },
    { title: '推广医生', dataIndex: 'doctorName', width: 130 },
    { title: '所属医生集团', dataIndex: 'doctorOrgName' },
    { title: '推荐人手机号', dataIndex: 'distributePhoneNumber' },
    { title: '创建时间', dataIndex: 'createDateStr' },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 120,
      render: (_, record) => {
        return (
          <Row gutter={10}>
            <Col>
              <a
                onClick={() => {
                  handleDelete(record)
                }}
              >
                删除
              </a>
            </Col>
            <Col>
              <a
                onClick={() => {
                  QRCodeModalController.controller.open({
                    title: '推荐码',
                    url: record.recommendUrl,
                    desc: `${record.doctorName}-${record.recommendTypeName}-${record.distributeName}`,
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
    manul: props.controller, // 说明是在modal中
  })
  function getDataAjax({ page, pageSize }) {
    const values = searchFormRef.getFieldsValue()
    return requestw({
      url: '/web/system/recommend/queryPage',
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
  var QRCodeModalController = useModalController()

  function handleDelete(record) {
    mConfirm(`确认删除？`, () => {
      return requestw({
        url: '/web/system/recommend/deleteRecommend',
        data: {
          recommendCode: record.recommendCode,
        },
        isNeedCheckResponse: true,
        errMsg: true,
      }).then(getData)
    })
  }

  // 当这个page作为一个组件在modal中打开时
  useEffect(() => {
    if (props.distributeCode) {
      searchFormRef.setFieldsValue({ distributeCode: props.distributeCode })
      getData()
    }
  }, [props.distributeCode])

  return (
    <>
      <Form className="global_searchForm_box" form={searchFormRef}>
        <Row gutter={10}>
          <Col span={4}>
            <Form.Item name="distributeName">
              <Input placeholder="推广人姓名" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="distributeCode">
              <Input placeholder="推广人编码" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="distributePhoneNumber">
              <Input placeholder="推广人手机号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="doctorCode">
              <FetchSelect
                placeholder="推广医生"
                api="/web/system/recommend/getDoctorList"
                valueKey="doctorCode"
                textKey="doctorName"
                showSearch
                filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="recommendType">
              <FetchSelect placeholder="推广方式" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'RECOMMEND_TYPE' }} />
            </Form.Item>
          </Col>

          {/* 操作 */}
          <Col>
            <CustomButton isHaveBottom={true} onClick={() => searchFormRef?.resetFields()}>
              重置
            </CustomButton>
          </Col>
          <Col>
            <CustomButton isHaveBottom={true} type="primary" onClick={search}>
              查询
            </CustomButton>
          </Col>
          <Col>
            <CustomButton isHaveBottom={true} type="primary" onClick={() => addModalController.controller.open()}>
              生成推荐码
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
      <QRCodeModal {...QRCodeModalController} />
    </>
  )
}
export default Index
