import { Table, Form, Row, Col, Input, DatePicker } from 'antd'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import useTable from '@/hooks/useTable'
import useExport from '@/hooks/useExport'
import requestw from '@/utils/requestw'
import { mConfirm } from '@/utils/utils'
import moment from 'moment'

function Index() {
  const [searchFormRef] = Form.useForm()
  const columns = [
    {
      dataIndex: 'tradeUserName',
      title: '买家',
      width: 110,
      fixed: 'left',
    },
    {
      dataIndex: 'receivePerson',
      title: '收货人',
      width: 110,
    },
    {
      dataIndex: 'goodsName',
      title: '商品名',
      width: 200,
    },
    {
      dataIndex: 'goodsProperty',
      title: '商品规格',
    },
    {
      dataIndex: 'skuCount',
      title: '商品数量',
      width: 90,
    },
    {
      dataIndex: 'skuPrice',
      title: '单价(元)',
    },
    {
      dataIndex: 'totalSkuPrice',
      title: '商品总价(元)',
    },
    {
      dataIndex: 'totalTradePrice',
      title: '订单金额(元)',
    },
    {
      dataIndex: 'orgName',
      title: '企业名称',
      width: 200,
    },
    {
      dataIndex: 'supplierOrgName',
      title: '供应商名称',
      width: 200,
    },
    {
      dataIndex: 'tradeNo',
      title: '订单编号',
      width: 180,
    },
    {
      dataIndex: 'tradeDate',
      title: '下单时间',
    },
    {
      dataIndex: 'paymentNo',
      title: '支付单号',
      width: 190,
    },
    {
      dataIndex: 'paymentState',
      title: '支付状态',
      width: 90,
    },
    {
      dataIndex: 'tradeStatus',
      title: '订单状态',
      width: 90,
    },
    {
      dataIndex: 'finishDate',
      title: '完成时间',
    },
    {
      dataIndex: 'tradeFee',
      title: '订单费用(元)',
    },
    {
      dataIndex: 'serviceFee',
      title: '总服务费(元)',
    },
    {
      dataIndex: 'developPerson',
      title: '推广人',
      width: 120,
    },
    {
      dataIndex: 'manageServiceFee',
      title: '推广人佣金(元)',
    },
    {
      dataIndex: 'doctorName',
      title: '医生',
      width: 120,
    },
    {
      dataIndex: 'saleRewardFee',
      title: '医生佣金',
    },
    {
      dataIndex: 'totalManageServiceFee',
      title: '推广人佣金合计(元)',
    },
    {
      dataIndex: 'totalSaleRewardFee',
      title: '医生佣金合计(元)',
    },
    {
      dataIndex: 'distributeName',
      title: '患者推广人',
      width: 200,
    },
    {
      dataIndex: 'channelRewardFee',
      title: '患者推广人佣金(元)',
    },
    {
      dataIndex: 'totalChannelRewardFee',
      title: '患者推广人佣金合计(元)',
    },
    {
      dataIndex: 'channelServiceFee',
      title: '渠道服务费(元)',
    },
    {
      dataIndex: 'platformServiceFee',
      title: '平台推广费(元)',
    },
    {
      dataIndex: 'totalPlatformServiceFee',
      title: '平台推广费合计(元)',
    },
    {
      dataIndex: 'technicalServiceFee',
      title: '技术服务费(元)',
    },
    {
      dataIndex: 'totalTechnicalServiceFee',
      title: '技术服务费合计(元)',
    },
    {
      dataIndex: 'technicalServiceRate',
      title: '技术服务费率',
      width: 90,
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
    columns,
    columnsWidth: 150,
    rowKey: 'tradeNo',
    ajax: getDataAjax,
  })
  function getDataAjax({ page, pageSize }) {
    const { dateRange, ...restValues } = searchFormRef.getFieldsValue()
    const postData = {
      page,
      rows: pageSize,
      startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      ...restValues,
    }
    exportController.setQueryData(postData)
    return requestw({
      url: '/web/system/tradeSettle/queryPage',
      data: postData,
      isNeedCheckResponse: true,
    }).then((data) => ({ list: data?.data ?? [], total: data?.rowTop ?? 0 }))
  }

  const exportController = useExport({ rawData: tableData, exportApi: '/web/system/tradeSettle/exportTradeSettleList' })

  return (
    <>
      <Form className="global_searchForm_box" form={searchFormRef}>
        <Row gutter={10}>
          <Col span={6}>
            <Form.Item name="dateRange" initialValue={[moment().subtract(30, 'days'), moment()]}>
              <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="tradeNo">
              <Input placeholder="订单号" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="goodsName">
              <Input placeholder="商品名称" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="orgCode">
              <FetchSelect
                placeholder="商城"
                api="/web/system/supplier/getOrgMallList"
                valueKey="orgCode"
                textKey="orgName"
                allowClear
                showSearch
                filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="supplierOrgCode">
              <FetchSelect
                placeholder="供应商"
                api="/web/system/supplier/getSupplierList"
                valueKey="orgCode"
                textKey="orgName"
                allowClear
                showSearch
                filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="tradeStatus">
              <FetchSelect placeholder="订单状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'TRADE_STATUS' }} />
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
            <CustomButton type="primary" isHaveBottom={true} onClick={exportController.handleExport}>
              导出
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
    </>
  )
}
export default Index
