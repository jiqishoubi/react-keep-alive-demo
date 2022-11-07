import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, Form, Row, Col, Input, Select, message } from 'antd'
import CustomButton from '@/components/customComponents/CustomButton'
import FetchSelect from '@/components/FetchSelect'
import GoodsGroupsForSearch from '@/components/goods/GoodsGroupsForSearch'
import useTable from '@/hooks/useTable'
import { useActivate } from '@/components/react-keep-alive'
import requestw from '@/utils/requestw'
import { mConfirm, pathimgHeader, pathVideoHeader, localDB, keepAlivePage, haveCtrlElementRight, getOrgKind } from '@/utils/utils'
import { getDetailPath, getTableUrl, isPageType } from './func'

const { Option } = Select

function Index() {
  const history = useHistory()
  const [searchFormRef] = Form.useForm()

  const columns = [
    {
      title: '商品名称',
      dataIndex: '_name',
      width: 230,
      render: (v, record) => {
        const src = record.goodsImg.split(',')[0].indexOf('http') > -1 ? record.goodsImg.split(',')[0] : pathimgHeader + record.goodsImg.split(',')[0]
        return (
          <Row type="flex" align="middle" style={{ flexWrap: 'nowrap' }}>
            {src && <img style={{ width: '80px', height: '80px', marginRight: '10px' }} src={src} />}
            <span>{record.goodsName}</span>
          </Row>
        )
      },
    },
    ...(isPageType('供应商端-商城商品') ? [{ title: '供应商', dataIndex: 'orgName' }] : []),
    { title: '商品类型', dataIndex: 'goodsTypeName', width: 110 },
    { title: '商品编码', dataIndex: 'goodsCode' },
    {
      title: '一级分类',
      dataIndex: 'groupName',
      width: 130,
      render: (v, record) => {
        const groupNameArr = (record.goodsGroupRelationList ?? []).map((item) => item.groupName)
        return (
          <>
            {groupNameArr.map((str, index) => (
              <div key={index}>{str}</div>
            ))}
          </>
        )
      },
    },
    {
      title: '二级分类',
      dataIndex: 'childGroupName',
      width: 130,
      render: (v, record) => {
        const subGroupNameArr = (record.goodsGroupRelationList ?? []).map((item) => item.subGroupName)
        return (
          <>
            {subGroupNameArr.map((str, index) => (
              <div key={index}>{str}</div>
            ))}
          </>
        )
      },
    },
    { title: '创建时间', dataIndex: 'createDateStr' },
    { title: '状态', dataIndex: 'statusName', width: 90 },
    ...(isPageType('供应商端-商品管理')
      ? [
          { title: '审核状态', dataIndex: 'apprStatusName', width: 90 },
          {
            title: '操作',
            dataIndex: 'actions',
            width: 100,
            render: (_, record) => {
              const toggleStatusText = record.status == '0' ? '失效' : '生效' // （codeParam=GOODS_STATUS， 0-有效，1-待审核，2-审核失败，3-无效）
              return (
                <Row gutter={10}>
                  <Col>
                    <a
                      onClick={() => {
                        history.push(`/web/supplier/goods/goodsmgr/detail?goodsCode=${record.goodsCode}`)
                      }}
                    >
                      编辑
                    </a>
                  </Col>
                  {record.apprStatus == '90' && (
                    <Col>
                      <a
                        onClick={() => {
                          toggleStatus(record)
                        }}
                      >
                        {toggleStatusText}
                      </a>
                    </Col>
                  )}
                </Row>
              )
            },
          },
        ]
      : []),
    ...(isPageType('供应商端-商城商品')
      ? [
          {
            title: '操作',
            dataIndex: 'actions',
            width: 120,
            render: (_, record) => {
              const toggleStatusText = record.status == '0' ? '下架' : '上架' // 0上架  3下架
              return (
                <Row gutter={10}>
                  <Col>
                    <a
                      onClick={() => {
                        history.push(`/web/supplier/goods/mallgoodsmgr/detail?goodsCode=${record.goodsCode}`)
                      }}
                    >
                      编辑
                    </a>
                  </Col>
                  <Col>
                    <a
                      onClick={() => {
                        toggleStatusForMall(record)
                      }}
                    >
                      {toggleStatusText}
                    </a>
                  </Col>
                  <Col>
                    <a
                      onClick={() => {
                        deleteMallGoods(record)
                      }}
                    >
                      删除
                    </a>
                  </Col>
                </Row>
              )
            },
          },
        ]
      : []),
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
    setTableData,
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
      url: getTableUrl(),
      data: {
        page,
        rows: pageSize,
        ...values,
        // 商品一二级分类
        goodsGroupCodeListStr: JSON.stringify(values.goodsGroupCode ? [values.goodsGroupCode] : []),
        subGoodsGroupCodeListStr: JSON.stringify(values.subGoodsGroupCode ? [values.subGoodsGroupCode] : []),
      },
      isNeedCheckResponse: true,
    }).then((data) => ({ list: data?.data ?? [], total: data?.rowTop ?? 0 }))
  }

  function toggleStatus(record) {
    const toggleStatusText = record.status == '0' ? '失效' : '生效'
    mConfirm(`确认${toggleStatusText}？`, () => {
      return requestw({
        url: '/web/supplier/goods/updateSupplierGoodsStatus',
        data: {
          goodsCode: record.goodsCode,
          status: record.status == '0' ? '3' : '0',
        },
        isNeedCheckResponse: true,
        errMsg: true,
      }).then(getData)
    })
  }

  function toggleStatusForMall(record) {
    const toggleStatusText = record.status == '0' ? '下架' : '上架' // 0上架  3下架
    mConfirm(`确认${toggleStatusText}？`, () => {
      return requestw({
        url: '/web/mall/goods/updateGoodsStatus',
        data: {
          goodsCode: record.goodsCode,
          status: record.status == '0' ? '3' : '0',
        },
        isNeedCheckResponse: true,
        errMsg: true,
      }).then(getData)
    })
  }

  // 删除 商城商品
  function deleteMallGoods(record) {
    requestw({
      url: '/web/mall/goods/deleteGoods',
      data: { goodsCode: record.goodsCode },
      isNeedCheckResponse: true,
      errMsg: true,
    }).then((data) => {
      message.success('删除成功')
      setTableData(tableData.filter((item) => item.goodsCode !== record.goodsCode))
    })
  }

  // options: isAddSuccess isEditSuccess
  useActivate('supplier_goodsMng', (options) => {
    if (options.isAddSuccess) {
      // 新建成功
      search()
    } else if (options.isEditSuccess) {
      // 编辑成功
      getData()
    }
  })

  return (
    <>
      <Form className="global_searchForm_box" form={searchFormRef}>
        <Row gutter={10}>
          <Col span={4}>
            <Form.Item name="goodsName">
              <Input placeholder="商品名称" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="goodsCode">
              <Input placeholder="商品编码" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="goodsType">
              <FetchSelect placeholder="商品类型" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'GOODS_TYPE' }} />
            </Form.Item>
          </Col>
          <GoodsGroupsForSearch />
          {isPageType('供应商端-商品管理') && (
            <>
              <Col span={4}>
                <Form.Item name="status">
                  <FetchSelect placeholder="状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'GOODS_STATUS' }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="apprStatus">
                  <FetchSelect placeholder="审核状态" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'APPRAISE_STATUS' }} />
                </Form.Item>
              </Col>
            </>
          )}
          {isPageType('供应商端-商城商品') && (
            <Col span={4}>
              <Form.Item name="status">
                <Select placeholder="状态">
                  <Option value="0">上架</Option>
                  <Option value="3">下架</Option>
                </Select>
              </Form.Item>
            </Col>
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
          {isPageType('供应商端-商品管理') && (
            <Col>
              <CustomButton type="primary" isHaveBottom={true} onClick={() => history.push(getDetailPath())}>
                新建
              </CustomButton>
            </Col>
          )}
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
