import { useEffect, useRef, useState } from 'react'
import { connect } from 'dva'
import { useHistory } from 'react-router-dom'
import { Table, Form, Row, Col, Input, DatePicker, List, Space, Descriptions, Button, message, Modal, Radio } from 'antd'
import { MessageOutlined, LikeOutlined, StarOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import GoodsGroupsForSearch from '@/components/goods/GoodsGroupsForSearch'
import FormModal from '@/components/modal/FormModal'
import useTable from '@/hooks/useTable'
import useExport from '@/hooks/useExport'
import requestw from '@/utils/requestw'
import { mConfirm, pathimgHeader, pathVideoHeader, localDB, haveCtrlElementRight, getOrgKind } from '@/utils/utils'
import { getLoginUserInfo } from '@/utils/consts'
import moment from 'moment'
import { getTableUrl, getDetailPath, isPageType, apiConfirmTrade } from './func'
import api_common from '@/services/api/common'

/**
 *
 */
function Index(props) {
  const history = useHistory()
  const [searchFormRef] = Form.useForm()
  const [refundForm] = Form.useForm()
  const cancelOrderModalRef = useRef(null)
  const expressTradeModalRef = useRef(null)
  const updateExpressModalRef = useRef(null)
  const refundModalRef = useRef(null)
  const [refundOrderType, setRefundOrderType] = useState(null)

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
      groupCode: restValues.goodsGroupCode,
      childGroupCode: restValues.subGoodsGroupCode,
    }
    exportController.setQueryData(postData)
    return requestw({
      url: getTableUrl(),
      data: postData,
      isNeedCheckResponse: true,
    }).then((data) => ({ list: data?.data ?? [], total: data?.rowTop ?? 0 }))
  }

  const exportController = useExport({ rawData: tableData, exportApi: isPageType('平台端-交易订单') ? '/web/system/trade/exportTradeList' : '/web/supplier/trade/exportTradeList' })

  // 去订单详情
  function handleGoDetail(record) {
    history.push(`${getDetailPath()}?tradeNo=${record.tradeNo}`)
  }

  // 取消订单
  function handleCancelOrder(record) {
    cancelOrderModalRef.current.open({ tradeNo: record.tradeNo })
  }

  // 发货
  function handleExpressTrade(record) {
    expressTradeModalRef.current.open({ tradeNo: record.tradeNo })
  }

  // 修改物流信息
  function handleUpdateExpress(record) {
    updateExpressModalRef.current.open(
      { tradeNo: record.tradeNo },
      {
        expressNo: record.expressNo ?? undefined,
        expressCompany: record.expressCompany ?? undefined,
        expressStatus: record.expressStatus ?? undefined,
      }
    )
  }

  // 确认收货
  function handleConfirmTrade(record) {
    mConfirm('确认收货？', () => {
      return requestw({
        url: apiConfirmTrade(),
        data: {
          tradeNo: record.tradeNo,
          resultNote: '',
        },
        isNeedCheckResponse: true,
        errMsg: true,
      }).then(() => {
        message.success('操作成功')
        getData()
      })
    })
  }

  // 医生集团列表：/web/system/doctor/getCompanyList
  // 推广人列表：/web/system/doctor/getDeveloperList
  // orgCode 商城列表:/web/system/doctor/getDoctorMallList

  return (
    <>
      <Form className="global_searchForm_box" form={searchFormRef}>
        <Row gutter={10}>
          <Col span={3}>
            <Form.Item name="dateType" initialValue="TRADE">
              <FetchSelect placeholder="日期类型" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'TRADE_DATE_TYPE' }} />
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
            <Form.Item name="supplierOrgCode">
              <FetchSelect
                placeholder="供应商"
                api="/web/system/supplier/getSupplierPaggingList"
                formData={{
                  page: 1,
                  rows: 9999,
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
            <Form.Item name="distributeCode">
              <FetchSelect
                placeholder="推广人"
                api="/web/system/doctor/getDeveloperList"
                valueKey="distributeCode"
                textKey="distributeName"
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="custName">
              <Input placeholder="收货人" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="custMobile">
              <Input placeholder="收货人手机号" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="goodsName">
              <Input placeholder="商品名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="goodsType">
              <FetchSelect placeholder="商品类型" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'GOODS_TYPE' }} />
            </Form.Item>
          </Col>
          <GoodsGroupsForSearch colSpan={3} />
          <Col span={3}>
            <Form.Item name="expressStatus">
              <FetchSelect placeholder="物流状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'TRADE_EXPRESS_STATUS' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="tradeStatus">
              <FetchSelect placeholder="订单状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'TRADE_STATUS' }} />
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
          <Col span={3}>
            <Form.Item name="doctorOrgCode">
              <FetchSelect
                placeholder="医生集团"
                api="/web/system/doctor/getCompanyList"
                valueKey="orgCode"
                textKey="orgName"
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
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

      <List
        className="global_table_box"
        rowKey={rowKey}
        itemLayout="vertical"
        dataSource={tableData}
        loading={isTableLoading}
        renderItem={(record) => {
          const descriptionsColumns = [
            { label: '订单编号', key: 'tradeNo' },
            { label: '下单时间', key: 'tradeDateStr' },
            { label: '供应商', key: 'supplierOrgName' },
            { label: '商城名称', key: 'orgName' },
            { label: '订单总价', key: 'tradeFeeStr' },
            { label: '订单状态', key: 'tradeStatusName' },
            { label: '医生', key: 'doctorName' },
            { label: '医生集团', key: 'doctorOrgName' },
            { label: '推广人', key: 'distributeName' },
            { label: '代理商', key: 'distributeCompanyName' },
            { label: '用户', key: 'custName' },
            { label: '用户手机号', key: 'custMobile' },
            { label: '收货地址', key: 'allAddress' },
          ]
          const goodsColumns = [
            {
              title: '商品图片',
              dataIndex: '_name',
              render: (v, skuRecord) => {
                return <img src={skuRecord.skuImg} style={{ width: 56, height: 56 }} />
              },
            },
            { title: '商品名称', dataIndex: 'goodsName' },
            { title: '规格名称', dataIndex: 'skuName' },
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
                      {record[item.key]}
                    </Descriptions.Item>
                  )
                })}
              </Descriptions>

              <Table
                rowKey="id"
                size="small"
                columns={goodsColumns}
                dataSource={record.tradeGoodsList ?? []}
                pagination={false}
                footer={() => `合计：数量：${record.tradeGoodsList?.length ?? 0} 总价：${record.tradeFeeStr}`}
              />
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

                {isPageType('平台端-交易订单') && (
                  <>
                    {Number(record.tradeStatus) === 59 && haveCtrlElementRight('ddgl-confirmTrade-btn') && (
                      <Col>
                        <Button type="primary" onClick={() => handleConfirmTrade(record)}>
                          确认收货
                        </Button>
                      </Col>
                    )}
                  </>
                )}

                {isPageType('供应商端-交易订单') && getLoginUserInfo()?.orgCode && record?.supplierOrgCode == getLoginUserInfo().orgCode && (
                  <>
                    {/* 仅当 tradeStatus = 0(订单提交), 10(待支付), 19(已支付), 20(待审批), 50(待发货)时,可操作 */}
                    {['0', '10', '19', '20'].includes(record.tradeStatus) && (
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            handleCancelOrder(record)
                          }}
                        >
                          取消订单
                        </Button>
                      </Col>
                    )}

                    {/* {['40','50','90'].includes(record.tradeStatus) && props?.login?.loginInfo?.orgCode && record?.supplierOrgCode == props.login.loginInfo.orgCode && (
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => refundModalRef.current.open(record)}
                        >
                          发起售后
                        </Button>
                      </Col>
                    )} */}

                    {/* （订单状态 待发货:tradeStatus=='50' ，物流状态 未发货 expressStatus=='0'） */}
                    {record.tradeStatus == '50' && record.expressStatus == '0' && (
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            handleExpressTrade(record)
                          }}
                        >
                          发货
                        </Button>
                      </Col>
                    )}

                    {/* (注:仅当 tradeStatus = 59(已发货)时,可操作) */}
                    {Number(record.tradeStatus) > 59 && haveCtrlElementRight('ddgl-updateExpress-btn') && (
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            handleUpdateExpress(record)
                          }}
                        >
                          修改物流信息
                        </Button>
                      </Col>
                    )}

                    {/* 注:仅当 tradeStatus = 831(取消待审批) 时 */}
                    {/* {record.tradeStatus == '831' && (
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            handleUpdateExpress(record)
                          }}>
                          审核退款
                        </Button>
                      </Col>
                    )} 
                    */}

                    {Number(record.tradeStatus) === 59 && haveCtrlElementRight('ddgl-confirmTrade-btn') && (
                      <Col>
                        <Button type="primary" onClick={() => handleConfirmTrade(record)}>
                          确认收货
                        </Button>
                      </Col>
                    )}
                  </>
                )}
                {/* 操作 end */}
              </Row>
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

      {/* 模态 */}
      {/* 取消订单 modal */}
      <FormModal
        ref={cancelOrderModalRef}
        title="取消订单"
        ajax={(values, params) => {
          const postData = {
            tradeNo: params.tradeNo,
            ...values,
          }
          return requestw({
            url: '/web/supplier/trade/cancelTrade',
            data: postData,
            isNeedCheckResponse: true,
            errMsg: true,
          })
        }}
        onSuccessCallback={() => {
          getData()
        }}
      >
        <Form.Item label="取消原因" name="resultNote" rules={[{ required: true, message: '请输入取消原因' }]}>
          <Input.TextArea placeholder="请输入" allowClear />
        </Form.Item>
      </FormModal>
      {/* 订单发货modal */}
      <FormModal
        ref={expressTradeModalRef}
        title="发货"
        ajax={(values, params) => {
          const postData = {
            tradeNo: params.tradeNo,
            ...values,
          }
          return requestw({
            url: '/web/supplier/trade/expressTrade',
            data: postData,
            isNeedCheckResponse: true,
            errMsg: true,
          })
        }}
        onSuccessCallback={() => {
          getData()
        }}
      >
        <Form.Item label="物流单号" name="expressNo" rules={[{ required: true, message: '请输入物流单号' }]}>
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item label="物流公司" name="expressCompany" rules={[{ required: true, message: '请输入物流单号' }]}>
          <FetchSelect
            api="/web/supplier/trade/getExpressCompanyList"
            valueKey="expressCode"
            textKey="expressName"
            showSearch
            filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          />
        </Form.Item>
      </FormModal>
      {/* 修改物流信息modal */}
      <FormModal
        ref={updateExpressModalRef}
        title="修改物流信息"
        ajax={(values, params) => {
          const postData = {
            tradeNo: params.tradeNo,
            ...values,
          }
          return requestw({
            url: '/web/supplier/trade/updateTradeExpress',
            data: postData,
            isNeedCheckResponse: true,
            errMsg: true,
          })
        }}
        onSuccessCallback={() => {
          getData()
        }}
      >
        <Form.Item label="物流单号" name="expressNo" rules={[{ required: true, message: '请输入物流单号' }]}>
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item label="物流公司" name="expressCompany" rules={[{ required: true, message: '请输入物流单号' }]}>
          <FetchSelect
            api="/web/supplier/trade/getExpressCompanyList"
            valueKey="expressCode"
            textKey="expressName"
            showSearch
            filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          />
        </Form.Item>
        <Form.Item label="物流状态" name="expressStatus">
          <FetchSelect api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'TRADE_EXPRESS_STATUS' }} />
        </Form.Item>
      </FormModal>

      <FormModal
        ref={refundModalRef}
        title="发起售后"
        ajax={(values, params) => {
          const postData = {
            tradeNo: params.tradeNo,
            orderType: values?.orderType,
            disputeReason: values?.disputeReason || '',
            disputeContent: values?.disputeContent || '',
            expressCompany: values?.expressCompany || '',
            expressNo: values?.expressNo || '',
          }
          return requestw({
            url: isPageType('平台端-交易订单') ? '/web/system/trade/createDisputeOrder' : '/web/supplier/trade/createDisputeOrder',
            data: postData,
            isNeedCheckResponse: true,
            errMsg: true,
          })
        }}
        onSuccessCallback={() => {
          getData()
        }}
      >
        <Form.Item label="退款类型" name="orderType" rules={[{ required: true, message: '请选择退款类型' }]}>
          <FetchSelect api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'DISPUTE_ORDER_TYPE' }} onChange={(v) => setRefundOrderType(v)} />
        </Form.Item>
        <Form.Item label="退款原因" name="disputeReason" rules={[{ required: true, message: '请输入退款原因' }]}>
          <Input placeholder="请输入退款原因" allowClear />
        </Form.Item>
        {refundOrderType != 'REFUND_ONLY' && (
          <>
            <Form.Item label="退款说明" name="disputeContent">
              <Input placeholder="请输入退款说明" allowClear />
            </Form.Item>
            <Form.Item label="物流公司" name="expressCompany">
              <Input placeholder="请输入物流公司" allowClear />
            </Form.Item>
            <Form.Item label="物流号码" name="expressNo">
              <Input placeholder="请输入物流号码" allowClear />
            </Form.Item>
          </>
        )}
      </FormModal>
    </>
  )
}

export default connect(({ login }) => ({
  login,
}))(Index)
