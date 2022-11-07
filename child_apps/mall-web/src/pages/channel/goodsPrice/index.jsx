import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { router, Link } from 'umi'
import { Card, Button, Form, Input, Space, Table, Modal, Row, Col, message, Select } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { connect } from 'dva'
import { useGetRow } from '@/hooks/useGetRow'
import { getUrlParam, localDB } from '@/utils/utils'
import api_channel from '@/services/api/channel'
import { getOrgKind } from '@/utils/utils'
const getOrgCode = () => {
  let orgCode = ''
  orgCode = localDB.getItem('sctemplate_orgCode')
  localDB.deleteItem('sctemplate_orgCode')
  return orgCode || ''
}

const Index = (props) => {
  const oldOrgCode = useMemo(() => {
    return getOrgCode()
  }, [])
  const [form] = Form.useForm()

  const orgCode = getUrlParam('orgCode')

  const {
    dispatch,
    spreadCompanyGoodsPriceModel: { page, pageSize, recordTotalNum, list, searchParams },
    //loading
    loadingTable,
  } = props

  //form
  const [curOrg, setCurOrg] = useState(oldOrgCode)

  useEffect(() => {
    if (orgCode) {
      form.setFieldsValue({
        distributeOrgCode: orgCode,
      })
      dispatch({
        type: 'spreadCompanyGoodsPriceModel/qureyData',
        payload: { searchParams: { distributeOrgCode: orgCode } || {} },
      })
    } else {
      form.setFieldsValue({
        ...searchParams,
      })
      dispatch({ type: 'spreadCompanyGoodsPriceModel/fetch' })
    }
  }, [])

  /**
   * 查询
   */
  const resetSearch = () => {
    form.resetFields()
  }

  //查询
  const onFinish = (value) => {
    dispatch({
      type: 'spreadCompanyGoodsPriceModel/qureyData',
      payload: {
        page: 1,
        pageSize: 20,
        searchParams: value,
      },
    })
  }

  const onOrgCodeChange = (code, org) => {
    setCurOrg(org)
  }

  /**
   * 表格
   */
  const onPageChange = (newPage, newPageSize) => {
    dispatch({
      type: 'spreadCompanyGoodsPriceModel/changePage',
      payload: {
        page: newPage,
        pageSize: newPageSize,
      },
    })
  }

  const goEdit = (record) => {
    dispatch({
      type: 'spreadCompanyGoodsPriceModel/save',
      payload: {
        itemData: record,
      },
    })
    router.push({
      pathname: '/web/company/cmsmgr/goodsPrice/revamp',
      query: {
        orgCode: curOrg,
      },
    })
  }

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
    },
    {
      title: '规格',
      dataIndex: 'skuName',
      align: 'center',
    },

    {
      title: '商品类型',
      dataIndex: 'goodsTypeName',
      align: 'center',
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      align: 'center',
    },
    {
      title: '原价(元) ',
      dataIndex: 'salePrice',
      align: 'center',
      render: (record) => {
        return <>{Number(record) / 100}</>
      },
    },
    {
      title: '渠道费(元)',
      dataIndex: 'distributeRewardFee',
      align: 'center',
      render: (record) => {
        return <>{Number(record) / 100}</>
      },
    },
    {
      title: '推广费(元)',
      dataIndex: 'saleRewardFee',
      align: 'center',
      render: (record) => {
        return <>{Number(record) / 100}</>
      },
    },

    {
      title: '渠道价(元)',
      dataIndex: 'diySalePrice',
      align: 'center',
      render: (record) => {
        return <>{Number(record) / 100}</>
      },
    },
    {
      title: '渠道推广费(元)',
      dataIndex: 'diyDistributeRewardFee',
      align: 'center',
      render: (record) => {
        return <>{Number(record) / 100}</>
      },
    },
    {
      title: '渠道分销佣金(元)',
      dataIndex: 'diySaleRewardFee',
      align: 'center',
      render: (record) => {
        return <>{Number(record) / 100}</>
      },
    },

    {
      title: '操作',
      align: 'center',
      width: 88,
      render: (record) => {
        return (
          <>
            <a
              onClick={() => {
                goEdit(record)
              }}
              style={{ marginLeft: 10 }}
            >
              管理
            </a>
          </>
        )
      },
    },
  ]

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item name="distributeOrgCode" required rules={[{ required: true, message: '请选择推广公司' }]} style={{ width: 240, marginRight: '10px' }} initialValue={oldOrgCode || undefined}>
                <FetchSelect api={api_channel.queryPromotionCompanyList} valueKey="orgCode" textKey="orgName" placeholder="推广公司" onChange={onOrgCodeChange} />
              </Form.Item>
              <Form.Item name="goodsName" style={{ width: 240, marginRight: '10px' }}>
                <Input placeholder="商品名称" allowClear />
              </Form.Item>
              <Form.Item name="goodsType" style={{ width: 240, marginRight: '10px' }}>
                <Select placeholder="商品类型" allowClear={true}>
                  <Option value="PUBLIC">普通商品</Option>
                  <Option value="THIRD_PARTY">第三方商品</Option>
                </Select>
              </Form.Item>
              <Form.Item name="supplierCode" style={{ width: 240, marginRight: '10px' }}>
                <FetchSelect api={getOrgKind().isAdmin ? '/web/admin/supplier/getList' : '/web/staff/supplier/getList'} valueKey="orgCode" textKey="orgName" placeholder="商品供应商" />
              </Form.Item>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                重置
              </Button>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                查询
              </Button>
            </div>
          </div>
        </Form>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '23px  20px' }}
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loadingTable}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: page,
            pageSize: pageSize,
            total: recordTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: onPageChange,
          }}
        />
      </div>
    </>
  )
}

export default connect(({ spreadCompanyGoodsPriceModel, loading }) => {
  return {
    spreadCompanyGoodsPriceModel,
    loadingTable: loading.effects['spreadCompanyGoodsPriceModel/fetch'],
  }
})(Index)
