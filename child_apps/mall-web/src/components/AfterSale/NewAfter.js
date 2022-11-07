import { Button, Form, Input, message, Modal, InputNumber, DatePicker, Select, Table, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { getToday, getYesterday } from '@/utils/utils'
import { getCreateDisputeOrder, getProvinceList, getparchyListByProvince, getCityListByEparchy } from '@/services/afterSale'

import NewPop from '@/components/AfterSale/NewPop'

import NewSubOrder from '@/components/AfterSale/NewSubOrder'
import { useGetRow } from '@/hooks/useGetRow'
import { CaretDownOutlined } from '@ant-design/icons'

function newAfter(props) {
  const [form] = Form.useForm()
  const { TextArea } = Input
  const orderRef = useRef(0)
  //分页
  const [pageNum, setpageNum] = useState(1)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table Data
  const [data, setdata] = useState([])

  //省
  const [provinceList, setprovinceList] = useState([])
  //市
  const [eparchyList, seteparchyList] = useState([])
  //区
  const [cityList, setcityList] = useState([])
  //新增弹窗
  const [newshow, setnewshow] = useState(false)
  //子订单展示弹窗
  const [newSubshow, setnewSubshow] = useState(false)
  //子组件pop传递回来的数据
  const [popData, setpopData] = useState()
  const [orderUserCode, setorderUserCode] = useState()

  //子组件SubOrde回流数据
  const [subOrdeData, setSubOrdeData] = useState([])
  //物流是否展示
  const [onlydshow, setonlydshow] = useState(true)
  //商品列表
  const [orderGood, setorderGood] = useState([])

  //售后标识Id
  const [afterID, setAfterID] = useState()
  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['20'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }
  const operateColumns = [
    {
      className: 'datumsShow',
      dataIndex: 'tradeNo',
      title: '订单编号',
      align: 'center',
    },
    {
      className: 'datumsShow',
      dataIndex: 'goodsCode',
      title: '商品编号',
      align: 'center',
    },
    {
      className: 'datumsShow',
      align: 'center',
      title: '商品名称',
      dataIndex: 'skuName',
    },
    {
      className: 'datumsShow',
      align: 'center',
      dataIndex: 'tradePriceStr',
      title: '商品价格(元)',
    },

    {
      className: 'datumsShow',
      align: 'center',
      dataIndex: 'totalPriceStr',
      title: '售后申请金额(元)',
    },
    {
      className: 'datumsShow',
      align: 'center',
      dataIndex: 'skuCount',
      title: '商品数量',
    },
    {
      className: 'datumsShow',
      align: 'center',
      title: '售后申请数量',
      render: (e) => {
        return e.skuCount === 1 ? (
          e.skuCount
        ) : (
          <div onChange={() => inputOnChange(e)}>
            <InputNumber ref={orderRef} min={1} max={e.skuCount} defaultValue={e.skuCount} onBlur={tableData} />
          </div>
        )
      },
    },
    {
      className: 'datumsShow',
      align: 'center',
      title: '操作',
      render: (e) => {
        return <a onClick={() => deleteOeder(e)}>删除</a>
      },
    },
  ]
  //删除子订单
  function deleteOeder(e) {
    let orderData = data
    let x = []
    orderData.map((r) => {
      r.id === e.id ? '' : x.push(r)
    })
    setdata(x)
    setorderGood(x)
  }

  //售后数据标识操作
  function inputOnChange(e) {
    setAfterID(e.id)
  }

  //售后Tables数据处理
  function tableData() {
    if (parseInt(orderRef.current.currentValue, 10)) {
      if (parseInt(orderRef.current.currentValue, 10) > orderRef.current.props.max) {
        let x = orderGood
        for (let i in x) {
          if (x[i].id === afterID) {
            delete x[i].skuCount
            x[i]['skuCount'] = parseInt(orderRef.current.props.max, 10)
          }
        }

        setorderGood(x)
      } else {
        let x = orderGood
        for (let i in x) {
          if (x[i].id === afterID) {
            delete x[i].skuCount
            x[i]['skuCount'] = parseInt(orderRef.current.currentValue, 10)
          }
        }

        setorderGood(x)

        let z = JSON.parse(JSON.stringify(data))
        for (let i in z) {
          if (z[i].key === afterID) {
            z[i].totalPriceStr = parseInt(orderRef.current.currentValue, 10) * z[i].tradePriceStr
          }
        }
        setdata(z)
      }
    } else {
      let x = orderGood
      for (let i in x) {
        if (x[i].id === afterID) {
          delete x[i].skuCount
          x[i]['skuCount'] = null
        }
      }

      setorderGood(x)
    }
  }

  //省
  async function getProvinceList_() {
    let res = await getProvinceList()

    if (res && res.code === '0') {
      setprovinceList(res.data)
    } else {
      message.error(res.message)
    }
  }
  //市
  async function getparchyListByProvince_(e) {
    let res = await getparchyListByProvince(e)

    if (res && res.code === '0') {
      seteparchyList(res.data)
    } else {
      message.error(res.message)
    }
  }
  //区
  async function getcityListByEparchy_(e) {
    let res = await getCityListByEparchy(e)

    if (res && res.code === '0') {
      setcityList(res.data)
    } else {
      message.error(res.message)
    }
  }
  //初始化
  useEffect(() => {
    getProvinceList_()
  }, [])

  //orderTypeChange 退单类型改变
  function orderTypeChange(e) {
    if (e === 'REFUND_RETURN') {
      setonlydshow(true)
    } else {
      setonlydshow(false)
    }
  }

  //新建订单
  async function onFinish(values) {
    if (orderGood.length) {
    } else {
      message.error('请选择订单')
      return
    }

    for (let i in orderGood) {
      if (!orderGood[i].skuCount) {
        message.error('售后申请数量不能为空')
        return
      }
    }

    let x = JSON.stringify(orderGood)
    values['orderUserCode'] = orderUserCode
    values['orderGoodsListStr'] = x

    let res = await getCreateDisputeOrder(values)

    if (res && res.code === '0') {
      props.newAfterChange(0)
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  }
  //省市联动
  function provinceChange(value) {
    form.setFieldsValue({
      eparchyCode: [],
      cityCode: [],
    })
    value ? getparchyListByProvince_({ provinceCode: value }) : ''
  }
  //市区联动
  function eparchyChange(value) {
    form.setFieldsValue({
      cityCode: [],
    })
    value ? getcityListByEparchy_({ eparchyCode: value }) : ''
  }
  //pop父子间通信
  function newPopChange(e, z) {
    setpopData(e)
    setorderUserCode(z)
  }
  ///suborder父子通信
  function newSubOrderChange(e) {
    setSubOrdeData(e)
    setorderGood(JSON.parse(JSON.stringify(e)))
  }

  return (
    <>
      <div>
        <Form form={form} onFinish={onFinish}>
          <div className="fontMb">
            <Form.Item>
              <div className="marginlr20">基本信息</div>
            </Form.Item>
            <div style={{ marginLeft: '100px' }}>
              <div className="flexjs">
                <Form.Item
                  required
                  rules={[{ required: true, message: '请选择申请时间' }]}
                  label="申请时间"
                  initialValue={moment(getToday(), 'YYYY/MM/DD')}
                  style={{
                    marginBottom: '15px',
                    width: '300px',
                  }}
                >
                  <DatePicker style={{ width: 170 }} disabled={true} />
                </Form.Item>

                <Form.Item
                  label="售后订单类型"
                  required
                  rules={[{ required: true, message: '请选择售后订单类型' }]}
                  name="orderType"
                  style={{
                    marginBottom: '20px',
                  }}
                >
                  <Select showArrow={true} style={{ width: '170px' }} placeholder="请选择售后订单类型" allowClear={true} onChange={orderTypeChange}>
                    <Option value="REFUND_ONLY">仅退款</Option>
                    <Option value="REFUND_RETURN">退款并退货</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  required
                  rules={[{ required: true, message: '请选择申请原因' }]}
                  label="申请原因"
                  name="disputeReason"
                  style={{
                    marginBottom: '15px',
                    width: '300px',
                  }}
                >
                  <Select showArrow={true} style={{ width: '170px' }} placeholder="请选择申请原因" allowClear={true}>
                    <Option value="DR01">商品损坏</Option>
                    <Option value="DR02">商品与描述不符</Option>
                    <Option value="DR03">质量问题</Option>
                    <Option value="DR04">不想要了</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="联&nbsp;系&nbsp;人&nbsp;手&nbsp;机"
                  required
                  rules={[{ required: true, message: '请填写联系人手机' }]}
                  name="custMobile"
                  style={{
                    marginBottom: '20px',
                  }}
                >
                  <Input style={{ width: '170px' }} />
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  label="联&nbsp;&nbsp;系&nbsp;&nbsp;人"
                  required
                  rules={[{ required: true, message: '请填写联系人' }]}
                  name="custName"
                  style={{
                    marginBottom: '15px',
                    width: '300px',
                  }}
                >
                  <Input style={{ width: '170px' }} />
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  required
                  rules={[{ required: true, message: '请填写问题描述' }]}
                  label="问题描述"
                  name="disputeContent"
                  style={{
                    marginBottom: '15px',
                    width: '560px',
                  }}
                >
                  <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
              </div>
            </div>
          </div>

          {!onlydshow ? (
            ''
          ) : (
            <>
              <div className="fontMb">
                <Form.Item>
                  <div className="marginlr20">物流信息</div>
                </Form.Item>
                <div style={{ marginLeft: '100px' }}>
                  <div className="flexjs">
                    <Form.Item
                      required
                      rules={[{ required: true, message: '联系地址不能为空' }]}
                      label="联系地址"
                      style={{
                        marginBottom: '15px',
                        width: '1100px',
                      }}
                    >
                      <Space>
                        <Form.Item name="provinceCode">
                          <Select showArrow={true} style={{ width: '170px' }} placeholder="请选择省份" allowClear={true} onChange={provinceChange}>
                            {provinceList.map((r) => (
                              <Option key={r.regionCode} value={r.regionCode}>
                                {r.regionName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item name="eparchyCode">
                          <Select showArrow={true} style={{ width: '170px' }} placeholder="请选择城市" allowClear={true} onChange={eparchyChange}>
                            {eparchyList.map((r) => (
                              <Option key={r.regionCode} value={r.regionCode}>
                                {r.regionName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item name="cityCode">
                          <Select showArrow={true} style={{ width: '170px' }} placeholder="请选择区" allowClear={true}>
                            {cityList.map((r) => (
                              <Option key={r.regionCode} value={r.regionCode}>
                                {r.regionName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item name="address">
                          <Input style={{ width: 400 }} placeholder="请输入详情地址" />
                        </Form.Item>
                      </Space>
                    </Form.Item>
                  </div>

                  <div className="flexjs">
                    <Form.Item
                      label="物流公司"
                      required
                      rules={[{ required: true, message: '请填写物流公司' }]}
                      name="expressCompany"
                      style={{
                        marginBottom: '15px',
                        width: '300px',
                      }}
                    >
                      <Input style={{ width: '170px' }} />
                    </Form.Item>
                    <Form.Item
                      label="物流单号"
                      name="expressNo"
                      required
                      rules={[{ required: true, message: '请填写物流单号' }]}
                      style={{
                        marginBottom: '20px',
                      }}
                    >
                      <Input style={{ width: '170px' }} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="fontMb">
            <Form.Item>
              <div className="marginlr20">商品信息</div>
            </Form.Item>
            <div>
              <Button
                type="primary"
                style={{
                  marginBottom: '20px',
                  marginLeft: '20px',
                  borderRadius: '4px',
                }}
                onClick={() => {
                  setnewshow(true)
                }}
              >
                选择订单
              </Button>
            </div>
            <div>
              <Table
                rowClassName={useGetRow}
                //待修改
                pagination={paginationProps}
                disabled={true}
                columns={operateColumns}
                dataSource={data}
              />
            </div>
          </div>
          <div style={{ margin: '70px  0px' }}>
            <div className="flexjc">
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '120px',
                  marginRight: '100px',
                  borderRadius: '4px',
                }}
                // onClick={() => setaftershow(true)}
              >
                确定
              </Button>
              <Button type="primary" style={{ width: '120px', borderRadius: '4px' }} onClick={() => props.newAfterChange(1)}>
                返回
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <Modal
        centered={true}
        title="选择订单"
        visible={newshow}
        onCancel={() => {
          setnewshow(false)
        }}
        onOk={() => {
          setnewshow(false)
          setnewSubshow(true)
        }}
        cancelText="取消"
        okText="确定"
        width={1000}
      >
        <NewPop newPopChange={newPopChange} />
      </Modal>

      <Modal
        destroyOnClose={true}
        centered={true}
        title="父单商品详情"
        visible={newSubshow}
        onCancel={() => {
          setnewSubshow(false)
        }}
        onOk={() => {
          setdata(subOrdeData)
          setnewSubshow(false)
        }}
        cancelText="取消"
        okText="确定"
        width={1000}
      >
        <NewSubOrder newSubOrderChange={newSubOrderChange} popData={popData} />
      </Modal>
    </>
  )
}
export default newAfter
