import React, { useState, useEffect, useRef } from 'react'
import { Button, Form, Input, Space, Table, Modal, Select, message } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { connect } from 'dva'
import { useGetRow } from '@/hooks/useGetRow'
import { getUrlParam } from '@/utils/utils'
import ChannelAdd from './components/ChannelAdd/index'
import { getGoodsPagingList, getGoodsExportInfo, exclusiveGoods } from '@/services/order'
import lodash from 'lodash'
import { getSkuListPaging, batchOperateSkuDiy, deleteSkuDiy, ifHaveDiySkuPrice } from '@/pages/channel/SCSpecGoods/service'
import api_channel from '@/services/api/channel'
import { getOrgKind } from '@/utils/utils'
const Index = (props) => {
  const [form] = Form.useForm()
  const { Option } = Select
  const {
    dispatch,
    spreadCompanySpecGoodsMngModel: { page, pageSize, recordTotalNum, list, oldData, searchParams },

    loadingTable,
  } = props

  const orgCode = getUrlParam('orgCode')
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)
  const [pagingLoading, setPagingLoading] = useState(false)
  const formRef = useRef()

  const [channelShow, setChannelShow] = useState(false)
  const [channelData, setChannelData] = useState()
  const [ifHave, setIfHave] = useState()

  const optionArr = [
    { textkey: '0', value: '是' },
    { textkey: '1', value: '否' },
  ]

  const rowKey = 'goodsCode'
  const [selectedData, setSelectedData] = useState([])
  const selectedRowKeys = selectedData.map((row) => row[rowKey])

  useEffect(() => {
    if (orgCode) {
      dispatch({
        type: 'spreadCompanySpecGoodsMngModel/qureyData',
        payload: {
          searchParams: { distributeOrgCode: orgCode },
        },
      })

      form.setFieldsValue({
        distributeOrgCode: orgCode,
      })
    }

    getPagingList_()
    return () => {
      dispatch({ type: 'spreadCompanySpecGoodsMngModel/initialSava' })
    }
  }, [])

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = JSON.parse(JSON.stringify(oldData))

    let res = await exclusiveGoods(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getGoodsExportInfo({ exportCode: code })
        if (res2.code === '0' && res2.data.status === '90') {
          clearInterval(interTimes)

          getPagingList_()
          setPagingLoading(false)
        }
      }, 1000)
      setinterTime(interTimes)
      clearInterval(interTime)
    } else {
      clearInterval(interTime)
      message.error(res.message)
      setPagingLoading(false)
    }
  }

  //导出表头
  const pagingColumns = [
    {
      title: '导出任务编码',
      align: 'center',
      dataIndex: 'exportCode',
    },
    {
      title: '导出时间',
      align: 'center',
      dataIndex: 'exportDateStr',
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishDateStr',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'statusName',
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return e.status === '90' ? (
          <a
            onClick={() => {
              window.location.href = e.exportFileUrl
            }}
          >
            下载Excel
          </a>
        ) : (
          ''
        )
      },
    },
  ]

  //导出历史订单获取
  const getPagingList_ = async (value) => {
    setpagingShow(true)
    let res = await getGoodsPagingList(value)
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  const resetSearch = () => {
    form.resetFields()
  }

  //查询
  const onFinish = (value) => {
    dispatch({
      type: 'spreadCompanySpecGoodsMngModel/qureyData',
      payload: {
        page: 1,
        pageSize: 20,
        searchParams: value,
      },
    })
  }

  /**
   * 表格
   */
  const onPageChange = (newPage, newPageSize) => {
    dispatch({
      type: 'spreadCompanySpecGoodsMngModel/changePage',
      payload: {
        page: newPage,
        pageSize: newPageSize,
      },
    })
  }

  //关闭配置
  const closeModal = () => {
    setChannelShow(false)
  }

  //渠道配置点击
  const channelClick = async (e) => {
    if (!searchParams.distributeOrgCode) return

    let havaData = {
      goodsCode: e.goodsCode,
      personCode: searchParams.distributeOrgCode,
    }

    let resData = await ifHaveDiySkuPrice(havaData)

    if (resData && resData.code === '0') {
      setIfHave(resData.data)
    }

    let postData = {
      goodsCode: e.goodsCode,
      ...searchParams,
    }

    let res = await getSkuListPaging(postData)

    if (res && res.code === '0' && res.data) {
      if (res.data.data) {
        setChannelData(res.data.data)
        setChannelShow(true)
      } else {
        message.warn('该商品不可设置，无SKU')
      }
    } else {
      message.error(res.message)
    }
  }
  //渠道价配置完成
  const channelOk = async (values) => {
    let res = await batchOperateSkuDiy({ skuDiyListStr: values })
    if (res && res.code === '0') {
      message.success('设置成功')
      closeModal()
      dispatch({
        type: 'spreadCompanySpecGoodsMngModel/qureyData',
      })
    }
  }

  //渠道价取消
  const oncancelPrice = async (values) => {
    let res = await deleteSkuDiy(values)
    if (res && res.code === '0') {
      message.success('设置成功')
      closeModal()
    }
  }

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'goodsName',
      align: 'center',
    },
    {
      title: '是否专营',
      dataIndex: 'goodsExist',
      align: 'center',
    },

    {
      align: 'center',
      title: '价格(元)',
      dataIndex: 'minSalePrice',
      render: (r) => {
        return Number(r / 100)
      },
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
      title: '操作',
      align: 'center',
      width: 170,
      render: (record) => {
        return (
          <>
            {record.goodsExist === '是' ? (
              <a onClick={() => deleteClick([record])} style={{ marginLeft: 10 }}>
                取消专营
              </a>
            ) : (
              <a onClick={() => addGoods([record])} style={{ marginLeft: 10 }}>
                设为专营
              </a>
            )}
            &nbsp;&nbsp;
            <a onClick={() => channelClick(record)} style={{ marginLeft: 10 }}>
              渠道配置
            </a>
          </>
        )
      },
    },
  ]
  //添加专营商品
  const addGoods = (selectGoodKey) => {
    let code = searchParams.distributeOrgCode
    if (!code) {
      message.warn('请选择推广公司')
      return
    }

    let keys = []
    if (selectGoodKey && selectGoodKey.length > 0) {
      selectGoodKey.map((r) => {
        keys.push(r.goodsCode)
      })
      dispatch({
        type: 'spreadCompanySpecGoodsMngModel/addGoods',
        payload: {
          keys: keys,
        },
      })
      setSelectedData([])
    }
  }
  //取消专营
  const deleteClick = (selectData) => {
    let data = []
    let jsonDat = JSON.parse(JSON.stringify(selectData))
    let code = searchParams.distributeOrgCode
    if (!code) {
      message.warn('请选择推广公司')
      return
    }

    if (jsonDat && jsonDat.length > 0) {
      jsonDat.map((r) => {
        data.push({
          goodsCode: r.goodsCode,
          personType: 'ORG',
          personCode: code,
        })
      })
    } else {
      message.warn('请选择推广公司')
      return
    }
    data = JSON.stringify(data)

    dispatch({
      type: 'spreadCompanySpecGoodsMngModel/cancel',
      payload: {
        goodsRightdataListStr: data,
      },
    })
    setSelectedData([])
  }
  // 取消渠道价
  const batchDeleteSkuDiy = async () => {
    let data = []
    let jsonDat = JSON.parse(JSON.stringify(selectedData))
    let code = searchParams.distributeOrgCode
    if (!code) {
      message.warn('请选择推广公司')
      return
    }

    if (jsonDat && jsonDat.length > 0) {
      jsonDat.map((r) => {
        data.push({
          goodsCode: r.goodsCode,
          personCode: code,
          personType: 'ORG',
        })
      })
    }
    data = JSON.stringify(data)

    dispatch({
      type: 'spreadCompanySpecGoodsMngModel/batchDeleteSkuDiy',
      payload: { skuDiyListStr: data },
    })

    setSelectedData([])
  }

  //table批量设置
  const rowSelection = {
    selectedRowKeys,
    getCheckboxProps: (record) => {
      return {
        disabled: false,
      }
    },
    onSelect: (row, isSelected, _) => {
      updateSelectedRows(isSelected, [row])
    },
    onSelectAll: (isSelected, _, changeRows) => {
      updateSelectedRows(isSelected, changeRows)
    },
  }

  //批量
  const updateSelectedRows = (isSelected, list) => {
    let arr = []
    if (isSelected) {
      arr = _.uniqBy([...selectedData, ...list], rowKey)
    } else {
      arr = _.differenceBy(selectedData, list, rowKey) // 从第一个数组删除第二个数组中的元素
    }
    setSelectedData(arr)
  }

  return (
    <>
      <div className="headBac">
        <Form ref={formRef} form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item name="distributeOrgCode" required rules={[{ required: true, message: '请选择推广公司' }]} style={{ width: 240, marginRight: '10px' }}>
                <FetchSelect api={api_channel.queryPromotionCompanyList} valueKey="orgCode" textKey="orgName" placeholder="推广公司" />
              </Form.Item>
              <Form.Item name="goodsName" style={{ width: 240, marginRight: 10 }}>
                <Input placeholder="商品名称" allowClear />
              </Form.Item>

              <Form.Item name="goodsType" style={{ width: 240, marginRight: 10 }}>
                <Select showArrow={true} placeholder="商品类型" allowClear={true}>
                  <Option value="PUBLIC">普通商品</Option>
                  <Option value="THIRD_PARTY">第三方商品</Option>
                </Select>
              </Form.Item>
              <Form.Item name="supplierCode" style={{ width: 240, marginRight: 10 }}>
                <FetchSelect api={getOrgKind().isAdmin ? '/web/admin/supplier/getList' : '/web/staff/supplier/getList'} valueKey="orgCode" textKey="orgName" placeholder="商品供应商" />
              </Form.Item>

              <Form.Item name="ifGoodsRight" style={{ width: 240, marginRight: 10 }}>
                <Select placeholder="是否专营" showArrow={true} allowClear={true}>
                  {optionArr.map((obj, index) => {
                    return (
                      <Option key={index} value={obj.textkey}>
                        {obj.value}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>

              <Button style={{ borderRadius: 8, marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                重置
              </Button>
              <Button style={{ borderRadius: 8, marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                查询
              </Button>

              <Button
                style={{ borderRadius: '4px', marginRight: 10 }}
                onClick={() => {
                  if (!formRef.current.getFieldValue().distributeOrgCode) {
                    message.warn('请选择推广公司')
                    return
                  }
                  seteduce(true)
                }}
                className="buttonNoSize"
                size="middle"
              >
                导出
              </Button>

              <Button
                style={{ borderRadius: 8, marginRight: 10 }}
                type="primary"
                size="middle"
                onClick={() => {
                  addGoods(selectedData)
                }}
              >
                批量专营
              </Button>
              <Button
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
                size="middle"
                onClick={() => {
                  deleteClick(selectedData)
                }}
              >
                取消专营
              </Button>
              <Button onClick={batchDeleteSkuDiy} style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle">
                取消配置
              </Button>
            </div>
          </div>
        </Form>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '23px  20px' }}
          rowKey="goodsCode"
          columns={columns}
          dataSource={list}
          loading={loadingTable}
          rowSelection={rowSelection}
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

      <ChannelAdd personCode={searchParams.distributeOrgCode} closeModal={closeModal} visible={channelShow} onOk={channelOk} channelData={channelData} onCancel={oncancelPrice} ifHave={ifHave} />

      <Modal
        destroyOnClose={true}
        title="导出"
        onCancel={() => {
          seteduce(false)
          setPagingLoading(false)
          clearInterval(interTime)
        }}
        visible={educe}
        width="800px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form name="basic" onFinish={educeFinish}>
            <Form.Item wrapperCol={{ span: 3, offset: 21 }}>
              <Button
                onClick={() => {
                  getPagingList_()
                }}
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
              >
                刷新
              </Button>
            </Form.Item>

            <div>
              <Table loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={pagingColumns} dataSource={pagingList} />
            </div>

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={pagingLoading} disabled={pagingLoading} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定导出
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 130 }}
                onClick={() => {
                  clearInterval(interTime)
                  setPagingLoading(false)
                  seteduce(false)
                }}
                type="primary"
              >
                关闭
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  )
}
export default connect(({ spreadCompanySpecGoodsMngModel, loading }) => {
  return {
    spreadCompanySpecGoodsMngModel,
    loadingTable: loading.effects['spreadCompanySpecGoodsMngModel/fetch'],
  }
})(Index)
