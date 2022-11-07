import { useEffect, useRef, useState } from 'react'
import { connect } from 'dva'
import { useHistory } from 'react-router-dom'
import { Table, Form, Row, Col, Input, DatePicker, List, Space, Descriptions, Button, message, Modal, Radio, Select } from 'antd'
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import GoodsGroupsForSearch from '@/components/goods/GoodsGroupsForSearch'
import FormModal from '@/components/modal/FormModal'
import useTable from '@/hooks/useTable'
import requestw from '@/utils/requestw'
import { mConfirm, pathimgHeader, pathVideoHeader, localDB, haveCtrlElementRight, getOrgKind } from '@/utils/utils'
import moment from 'moment'
import { getRefundTableUrl, getDetailPath, isRefundPageType } from './func'
import { getLoginUserInfo } from '@/utils/consts'

function Index(props) {
  const history = useHistory()
  const [searchFormRef] = Form.useForm()
  const refundApprovalModalRef = useRef(null)
  const [isApprovalSuccess, setIsApprovalSuccess] = useState(-1)

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
    //table宽度
    tableWidth,
    //批量操作
    selectedRows,
    selectedRowKeys,
    setSelectedRows,
    updateSelectedRows,
  } = useTable({
    rowKey,
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
      // 商品一二级分类
      groupCode: restValues.groupCode,
      childGroupCode: restValues.subGroupCode,
    }
    return requestw({
      url: getRefundTableUrl(),
      data: postData,
      isNeedCheckResponse: true,
    }).then((data) => ({ list: data?.data ?? [], total: data?.rowTop ?? 0 }))
  }

  // 去订单详情
  function handleGoDetail(record) {
    history.push(`${getDetailPath()}?tradeNo=${record.tradeNo}`)
  }

  return (
    <>
      <Form className="global_searchForm_box" form={searchFormRef}>
        <Row gutter={10}>
          <Col span={3}>
            <Form.Item name="dateType" initialValue="order">
              <Select placeholder="请选择">
                <Select.Option value="order">订单时间</Select.Option>
                <Select.Option value="express">物流时间</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="dateRange" initialValue={[moment().subtract(30, 'days'), moment()]}>
              <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="tradeNo">
              <Input placeholder="订单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="orderNo">
              <Input placeholder="售后单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="custName">
              <Input placeholder="用户姓名" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="custMobile">
              <Input placeholder="用户手机号" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="orderStatus">
              <FetchSelect placeholder="订单状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'DISPUTE_ORDER_STATUS' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="orderType">
              <FetchSelect placeholder="售后类型" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'DISPUTE_ORDER_TYPE' }} />
            </Form.Item>
          </Col>
          {getOrgKind().isAdmin && (
            <>
              <Col span={3}>
                <Form.Item name="supplierOrgCode">
                  <FetchSelect
                    placeholder="供应商"
                    api="/web/system/supplier/getSupplierPaggingList"
                    formData={{
                      page: 1,
                      rows: 99999,
                    }}
                    dealResFunc={(data) => data?.data || []}
                    valueKey="orgCode"
                    textKey="orgName"
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="orgCode">
                  <FetchSelect
                    placeholder="商城"
                    api="/web/system/doctor/getDoctorMallList"
                    valueKey="orgCode"
                    textKey="orgName"
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  />
                </Form.Item>
              </Col>
            </>
          )}

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
        </Row>
      </Form>

      <List
        className="global_table_box"
        rowKey={rowKey}
        itemLayout="vertical"
        dataSource={tableData}
        loading={isTableLoading}
        renderItem={(record) => {
          const descriptionsColumns = [
            { label: '订单编号', key: 'tradeNo' },
            { label: '售后单号', key: 'orderNo' },
            { label: '退款总价', key: 'refundFee', render: (item) => '' + (+item / 100).toFixed(2) },
            { label: '退款类型', key: 'orderTypeStr' },
            { label: '创建时间', key: 'orderDateStr' },
            { label: '售后状态', key: 'orderStatusStr' },
            // { label: '退款进度', key: 'refundStatusStr' },
            { label: '来源', key: 'orderFrom' },
            // { label: '退款理由', key: 'disputeReason' },
            { label: '供应商', key: 'supplierOrgName' },
            { label: '商城名称', key: 'orgName' },
            { label: '用户姓名', key: 'custName' },
            { label: '用户手机号', key: 'custMobile' },
          ]
          const goodsColumns = [
            {
              title: '商品图片',
              dataIndex: '_name',
              render: (v, skuRecord) => {
                return <img src={skuRecord.skuImg} style={{ width: 56, height: 56 }} />
              },
            },
            { title: '商品名称', dataIndex: 'skuName' },
            { title: '商品类型', dataIndex: 'goodsTypeName' },
            { title: '商品数量', dataIndex: 'skuCount' },
            { title: '单价', dataIndex: 'skuPriceStr' },
          ]
          return (
            <List.Item key={record.id} style={{ marginBottom: 15 }}>
              <Descriptions size="small" column={6}>
                {descriptionsColumns.map((item, index) => {
                  return (
                    <Descriptions.Item key={index} label={item.label}>
                      {item?.render ? item.render(record[item.key]) : record[item.key]}
                    </Descriptions.Item>
                  )
                })}
              </Descriptions>
              {/* 操作 */}
              <Row gutter={10} justify="end" style={{ marginBottom: 12 }}>
                <Col>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleGoDetail(record)
                    }}
                  >
                    订单详情
                  </Button>
                </Col>
                {isRefundPageType('供应商端-售后订单') &&
                getLoginUserInfo()?.orgCode &&
                (record?.supplierOrgCode == getLoginUserInfo().orgCode || // 数据有供应商的情况 // 数据无供应商（原saas数据）
                  record?.orgCode == getLoginUserInfo().orgCode) ? (
                  //如果是直接退款 审批后直接走微信退款 售后订单完成 如果是退货退款 商家进入待用户发货状态 用户进入待发货状态 商家确认收货后 售后订单完成
                  <>
                    {['20'].includes(record.orderStatus) && (
                      <Col>
                        <Button type="primary" onClick={() => refundApprovalModalRef.current.open(record)}>
                          审核
                        </Button>
                      </Col>
                    )}
                    {['50'].includes(record.orderStatus) && (
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            handleFinishOrder(record)
                          }}
                        >
                          确认收货
                        </Button>
                      </Col>
                    )}
                  </>
                ) : null}
              </Row>
              {/* 操作 end */}
              {/* <Table
                rowKey="id"
                size="small"
                columns={goodsColumns}
                dataSource={record.tradeGoodsList ?? []}
                pagination={false}
                footer={() => `合计：数量：${record.tradeGoodsList?.length ?? 0} 总价：${record.tradeFeeStr}`}
              /> */}
            </List.Item>
          )
        }}
        pagination={{
          showQuickJumper: true,
          current: currentPage,
          pageSize: currentPageSize,
          total: tableTotalNum,
          showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setCurrentPage(page)
            setCurrentPageSize(pageSize)
          },
        }}
      />

      {/* 退款审核 */}
      <FormModal
        ref={refundApprovalModalRef}
        title="售后审核"
        ajax={({ auditStatus, auditReason = '' }, { orderNo }) => {
          const postData = {
            orderNo,
            auditStatus,
            auditReason,
          }
          return requestw({
            url: '/web/supplier/disputeOrder/auditDisputeOrderStatus',
            data: postData,
            errMsg: true,
          })
        }}
        onSuccessCallback={() => {
          getData()
        }}
      >
        <Form.Item label="是否受理" name="auditStatus" rules={[{ required: true, message: '请选择' }]}>
          <Radio.Group onChange={({ target }) => setIsApprovalSuccess(target.value)}>
            <Radio value={1}>审核通过</Radio>
            <Radio value={0}>驳回</Radio>
          </Radio.Group>
        </Form.Item>
        {isApprovalSuccess == 0 && (
          <Form.Item label="驳回原因" name="auditReason" rules={[{ required: true, message: '请输入驳回原因' }]}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        )}
      </FormModal>
    </>
  )
}

export default connect(({ login }) => ({
  login,
}))(Index)
