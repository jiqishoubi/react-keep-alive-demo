import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Row, Select, Space, Table, Col, DatePicker, Modal, Radio, message, Checkbox, InputNumber, Tooltip } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { queryListAjax, exportTradeReport, getExportInfo, getPagingList, removeAjax, revampAjax } from './service'
import { router } from 'umi'
import FetchSelect from '@/components/FetchSelect'
import requestw from '@/utils/requestw'
import BigNumber from 'bignumber.js'
const { confirm } = Modal
const Index = () => {
  const [form] = Form.useForm()
  const [alterForm] = Form.useForm()

  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [recordTotalNum, setRecordTotalNum] = useState()

  //订单状态
  const [tableLoading, setTableLoading] = useState(false)
  //导出数据
  const [oldData, setOldData] = useState()
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const [tableList, setTabbleList] = useState([])
  const [alter, setAlter] = useState(false)
  const [selectData, setSelectData] = useState({})
  const [selectList, setselectList] = useState([])

  useEffect(() => {
    getPagingList_()
    //获取订单状态
    onFinish()
    getSelectList()
  }, [])

  useEffect(() => {
    getPagingList_()
    //获取订单状态
    onFinish()
  }, [])

  const columns = [
    {
      dataIndex: 'goodsCode',
      title: '商品编码',
      align: 'center',
      fixed: 'left',
    },
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
    },

    {
      dataIndex: 'skuCode',
      title: 'SKU编码',
      align: 'center',
    },
    {
      dataIndex: 'skuName',
      title: 'SKU名称',
      align: 'center',
    },
    {
      dataIndex: 'groupName',
      title: '分组名称',
      align: 'groupName',
    },
    {
      dataIndex: 'salePriceStr',
      title: '售价(元)',
      align: 'center',
    },

    {
      dataIndex: 'distributeRewardFeeStr',
      title: '渠道费(元)',
      align: 'center',
    },
    {
      dataIndex: 'saleRewardFeeStr',
      title: '推广费(元)',
      align: 'center',
    },
    {
      dataIndex: 'priority',
      title: '优先级',
      align: 'center',
    },
    {
      dataIndex: 'updateDateStr',
      title: '修改时间',
      align: 'center',
    },
    {
      title: '详细',
      align: 'center',
      render: (e) => {
        return (
          <>
            <Button
              type="link"
              style={{ marginLeft: 0 }}
              onClick={() => {
                minuteClick(e)
              }}
            >
              修改
            </Button>
            {e.salePersonCode == 'ZZZZZZ' ? null : (
              <Button
                type="link"
                onClick={() => {
                  removeClick(e)
                }}
              >
                删除
              </Button>
            )}
          </>
        )
      },
    },
  ]
  //修改
  const minuteClick = (e) => {
    setSelectData(e)
    e.salePrice = e.salePriceStr
    e.distributeRewardFee = e.distributeRewardFeeStr
    e.saleRewardFee = e.saleRewardFeeStr
    setAlter(true)
    alterForm.setFieldsValue({ ...e })
  }
  //删除
  const removeClick = async (e) => {
    confirm({
      title: '确认删除么?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      async onOk() {
        let postData = { priceCode: e.priceCode }
        let res = await removeAjax(postData)
        if (res && res.code == '0') {
          message.success('成功')
          getTableList()
        } else {
          message.warn(res.message)
        }
      },
      onCancel() {},
    })
  }

  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setTableLoading(true)
    let values = form.getFieldsValue()
    values.startDate = moment(values.startDate).format('YYYY-MM-DD')
    values.endDate = moment(values.endDate).format('YYYY-MM-DD')
    let data = {
      ...values,
      ifDefault: values.ifDefault && values.ifDefault[0],
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    setOldData(data)

    let res = await queryListAjax(data)

    if (res && res.code === '0' && res.data) {
      setTabbleList(res.data.data)
      setRecordTotalNum(res.data.rowTop)
      setTableLoading(false)
    } else {
      message.warn(res.message)
    }
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  //修改操作
  const alterFinish = async (values) => {
    values['priceCode'] = selectData.priceCode
    values['saleRewardFee'] = Math.round(Number(values.saleRewardFee) * 100)
    values['distributeRewardFee'] = Math.round(Number(values.distributeRewardFee) * 100)
    values['salePrice'] = Math.round(Number(values.salePriceStr) * 100)
    values['serviceFee'] = Math.round(Number(values.serviceFeeStr) * 100)
    values['totalRewardFee'] = Math.round(Number(values.totalRewardFeeStr) * 100)

    let res = await revampAjax(values)
    if (res && res.code == '0') {
      message.success('成功')
      setAlter(false)
      getTableList()
    } else {
      message.warn(res.message)
    }
  }

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = oldData

    let res = await exportTradeReport(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getExportInfo({ exportCode: code })
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

  const getSelectList = async () => {
    let res = await requestw({
      url: '/web/staff/group/getGroupList',
      data: {
        groupType: 'SKU_PRICE',
      },
    })
    if (res.code == '0') {
      // this.setState({
      setselectList(res.data)
      // });
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
    let res = await getPagingList(value)
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  // 费用改变
  const feeStrChange = () => {
    if (!selectData.supplierSkuCode) return
    const { distributeRewardFee, saleRewardFee, totalRewardFeeStr } = alterForm.getFieldsValue()
    const fee = Number(distributeRewardFee) + Number(saleRewardFee)

    if (Number(totalRewardFeeStr)) {
      if (fee > Number(totalRewardFeeStr)) {
        message.warn('渠道推广费=管理服务费+推广费+渠道费')
      }
    } else {
      if (Number(totalRewardFeeStr) === 0) {
        message.warn('渠道推广费=管理服务费+推广费+渠道费')
      } else {
        message.warn('渠道推广费不存在')
      }
      alterForm.setFieldsValue({
        distributeRewardFee: 0,
        saleRewardFee: 0,
      })
    }
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={[15, 1]}>
              <Col span={3}>
                <Form.Item name="startDate" initialValue={moment().add(-30, 'days')}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择开始日期" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="endDate" initialValue={moment()}>
                  <DatePicker style={{ marginBottom: '0px', width: '100%' }} format={'YYYY-MM-DD'} placeholder="请选择结束日期" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="goodsCode">
                  <Input placeholder="商品编码" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="goodsName">
                  <Input placeholder="商品名称" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="skuCode">
                  <Input placeholder="商品SKU编码" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="skuName">
                  <Input placeholder="SKU名称" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="groupCode">
                  {/* <Input placeholder="分组" /> */}
                  <Select placeholder="请选择分组">
                    {selectList &&
                      selectList.map((obj, index) => (
                        <Option key={index} value={obj.groupCode}>
                          {obj.groupName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="ifDefault">
                  {/* <Input placeholder="是否查询默认价格" /> */}
                  <Checkbox.Group>
                    <Checkbox value="1" placeholder="">
                      是否查询默认价格
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginRight: 10 }}
                  size="middle"
                  onClick={() => {
                    router.push({
                      pathname: '/web/company/goodsmgr/batchImport',
                    })
                  }}
                >
                  导入
                </Button>
                <Button
                  style={{ borderRadius: '4px' }}
                  size="middle"
                  onClick={() => {
                    seteduce(true)
                    getPagingList_()
                  }}
                >
                  导出
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
        <Table
          rowClassName={useGetRow}
          style={{ margin: '23px  20px' }}
          columns={columns}
          dataSource={tableList}
          loading={tableLoading}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageRef.current,
            pageSize: pageSizeRef.current,
            total: recordTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: onPageChange,
            // onShowSizeChange:onShowSizeChange
          }}
        />
      </div>
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

      <Modal
        destroyOnClose={true}
        title="修改"
        onCancel={() => {
          setAlter(false)
        }}
        visible={alter}
        width="460px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form onFinish={alterFinish} form={alterForm} labelAlign="right" labelCol={{ span: 8, offset: 1 }}>
            <Form.Item wrapperCol={{ span: 12 }} label="商品名称" name="goodsName">
              <Input bordered={false} disabled={true} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12 }} label="商品编码" name="goodsCode">
              <Input bordered={false} disabled={true} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 12 }} label="SKU名称" name="skuName">
              <Input bordered={false} disabled={true} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12 }} label="SKU编码" name="skuCode">
              <Input bordered={false} disabled={true} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 13 }} label="分组名称" name="groupName">
              <Input bordered={false} disabled={true} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 13 }} label="渠道推广费" name="totalRewardFeeStr" initialValue={0}>
              <InputNumber style={{ width: '100%' }} min={0} readOnly={selectData.supplierSkuCode} bordered={!selectData.supplierSkuCode} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 13 }} label="售价" name="salePriceStr" rules={[{ required: true, message: '请输入售价' }]}>
              <InputNumber style={{ width: '100%' }} min={0} disabled={selectData.supplierSkuCode} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 13 }} label="渠道费" name="distributeRewardFee" rules={[{ required: true, message: '请输入渠道费' }]}>
              <InputNumber onChange={feeStrChange} style={{ width: '100%' }} min={0.0} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 13 }} label="推广费" name="saleRewardFee" rules={[{ required: true, message: '请输入推广费' }]}>
              <InputNumber onChange={feeStrChange} style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              shouldUpdate={(prevValues, curValues) =>
                prevValues.distributeRewardFee !== curValues.distributeRewardFee || prevValues.saleRewardFee !== curValues.saleRewardFee || prevValues.totalRewardFeeStr !== curValues.totalRewardFeeStr
              }
            >
              {(alterForm) => {
                const { distributeRewardFee, saleRewardFee, totalRewardFeeStr } = alterForm.getFieldsValue()
                if (!(distributeRewardFee === undefined && saleRewardFee === undefined && totalRewardFeeStr === undefined)) {
                  let fee =
                    (new BigNumber(totalRewardFeeStr || 0).times(100).toNumber() -
                      new BigNumber(distributeRewardFee || 0).times(100).toNumber() -
                      new BigNumber(saleRewardFee || 0).times(100).toNumber()) /
                    100
                  fee = Math.round(fee * 100) / 100
                  if (fee >= 0) {
                    alterForm.setFieldsValue({ serviceFeeStr: fee })
                  } else {
                    if (!isNaN(fee)) {
                      alterForm.setFieldsValue({ serviceFeeStr: 0 })
                    }
                  }
                }
                return (
                  <Form.Item
                    wrapperCol={{ span: 13 }}
                    labelCol={{ span: 9 }}
                    label={<Tooltip title={'管理服务费=渠道推广费-渠道费-推广费'}>管理服务费</Tooltip>}
                    name="serviceFeeStr"
                    rules={[{ required: true, message: '请输入管理服务费' }]}
                    style={{ width: '100%' }}
                  >
                    <InputNumber style={{ width: '100%' }} disabled />
                  </Form.Item>
                )
              }}
            </Form.Item>
            <Row>
              <Col offset={6}>
                <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                  确定
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginLeft: 120 }}
                  onClick={() => {
                    setAlter(false)
                  }}
                  type="primary"
                >
                  取消
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      </Modal>
    </>
  )
}
export default Index
