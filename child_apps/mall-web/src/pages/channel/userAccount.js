import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Select, Space, Table, Row, Col, Card } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import TotalAccount from './components/TotalAccount'
import CustomButton from '@/components/customComponents/CustomButton'
import TableModal from '@/components/modal/TableModal'
import useModalController from '@/hooks/useModalController'
import { useGetRow } from '@/hooks/useGetRow'
import { useRequest } from 'ahooks'
import requestw from '@/utils/requestw'
import useParamsTable from '@/hooks/useParamsTable'

function Index() {
  const [form] = Form.useForm()
  const { search, getData, tableProps, setFilters } = useParamsTable({ searchForm: form, defaultPageSize: 20, ajax: getTableData })

  const detailFlowModalController = useModalController()

  /**
   * 请求
   */
  const {
    data: totalAccount,
    loading: loading_totalAccount,
    run: getTotalAccount,
  } = useRequest(
    (values) => {
      return requestw({
        url: '/web/system/distributeBalance/getDistributeBalanceTotal',
        data: values,
      })
    },
    { manual: true }
  )

  const columns = [
    {
      dataIndex: 'distributeName',
      title: '推广人',
      align: 'center',
    },
    {
      dataIndex: 'phoneNumber',
      title: '手机号码',
      align: 'center',
    },
    {
      dataIndex: 'orgName',
      title: '代理商',
      align: 'center',
    },
    {
      dataIndex: 'incomeFeeStr',
      title: '分润金额(元)',
      align: 'center',
    },
    {
      dataIndex: 'cashTotalFeeStr',
      title: '已提现金额(元)',
      align: 'center',
    },
    {
      dataIndex: 'balanceFeeStr',
      title: '账户余额(元)',
      align: 'center',
    },
    {
      dataIndex: 'cashApprFeeStr',
      title: '待审核金额(元)',
      align: 'center',
    },
    {
      dataIndex: 'actions',
      title: '操作',
      align: 'center',
      render: (_, record) => {
        return <a onClick={() => handleDetailFlow(record)}>详情</a>
      },
    },
  ]

  async function getTableData({ page, pageSize }) {
    const values = await form.getFieldsValue()

    let postData = {
      page: page,
      rows: pageSize,
      ...values,
    }
    setFilters(values) // 给 useParamsTable 的地址栏 记录 filters

    // 请求
    getTotalAccount(values)
    return requestw({
      url: '/web/system/distributeBalance/queryPage',
      data: postData,
      isNeedCheckResponse: true,
    })
  }

  // 详情流水
  function handleDetailFlow(record) {
    detailFlowModalController.controller.open({ record })
  }

  return (
    <Card>
      <Form form={form} name="basic">
        <Row gutter={10}>
          <Col span={4}>
            <Form.Item name="phoneNumber">
              <Input placeholder="推广人电话" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="distributeName">
              <Input placeholder="推广人姓名" />
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
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
          <Col>
            <CustomButton isHaveBottom={true} type="default" onClick={() => form.resetFields()}>
              重置
            </CustomButton>
          </Col>
          <Col>
            <CustomButton isHaveBottom={true} type="primary" onClick={search}>
              查询
            </CustomButton>
          </Col>
        </Row>
      </Form>

      <TotalAccount
        items={[
          { title: '分润金额（元）', value: totalAccount?.totalIncomeFeeStr ?? '0.00' },
          { title: '已提现金额（元）', value: totalAccount?.totalCashFeeStr ?? '0.00' },
          { title: '账户余额（元）', value: totalAccount?.totalBalanceFeeStr ?? '0.00' },
          { title: '待审核金额（元）', value: totalAccount?.totalCashApprFeeStr ?? '0.00' },
        ]}
      />

      <Table style={{ marginTop: 15 }} rowKey="id" rowClassName={useGetRow} columns={columns} {...tableProps} />

      {/* 模态 */}
      <TableModal
        {...detailFlowModalController}
        title="账户余额流水清单"
        columns={[
          { title: '推广人', dataIndex: '' },
          { title: '时间', dataIndex: '' },
          { title: '订单号', dataIndex: '' },
          { title: '类型', dataIndex: '' },
          { title: '金额', dataIndex: '' },
          { title: '账户余额', dataIndex: '' },
          { title: '状态', dataIndex: '' },
        ]}
        getDataAjax={({ page, pageSize }) => {
          const distributeCode = detailFlowModalController.controller.payload?.record?.distributeCode
          return requestw({
            url: '/web/system/distributeBalance/queryDetailPage',
            data: {
              page,
              rows: pageSize,
              distributeCode,
            },
          })
        }}
      />
    </Card>
  )
}
export default Index
