import { Button, Form, Input, message, Modal, Radio, Table } from 'antd'
import React, { useEffect, useState } from 'react'

import { getDisputeTradeGoodsList, getDisputeOrderExamine } from '@/services/afterSale'
import { useGetRow } from '@/hooks/useGetRow'
function afterMinute(props) {
  const { TextArea } = Input
  //分页
  const [pageNum, setpageNum] = useState(1)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table Data
  const [data, setdata] = useState([])
  //唯一数据
  const [onlydata, setonlydata] = useState([])
  //审核确认弹窗
  const [aftershow, setaftershow] = useState(false)

  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['20'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }
  const [operateColumns] = useState([
    {
      className: 'datumsShow',
      dataIndex: 'orderNo',
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
      dataIndex: 'skuPriceStr',
      title: '商品价格(元)',
    },
    {
      className: 'datumsShow',
      align: 'center',
      dataIndex: 'custName',
      title: '优惠分摊金额(元)',
    },
    {
      className: 'datumsShow',
      align: 'center',
      dataIndex: 'refundFeeStr',
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
      dataIndex: 'skuCount',
      title: '售后申请数量',
    },
  ])

  useEffect(() => {
    minute()
  }, [pageNum])

  async function minute() {
    let data = {
      tradeNo: props.tradeNo,
    }
    let res = await getDisputeTradeGoodsList(data)

    if (res && res.code === '0') {
      setonlydata(res.data)
      setdata(res.data.goodsList)
    } else {
      message.error(res.message)
    }
  }

  async function onFinish(values) {
    if (!values.processNote) {
      message.error('审核意见不能为空')
      return
    }

    values['orderNO'] = onlydata.orderNo
    if (!values.orderStatus) {
      values['orderStatus'] = 29
    }
    let res = await getDisputeOrderExamine(values)
    if (res && res.code === '0') {
      message.success(res.message)
      setaftershow(false)
      props.afterMinuteChange(0)
    } else {
      message.error(res.message)
    }
  }

  return (
    <>
      <div>
        <Form>
          <div className="fontMb">
            <Form.Item>
              <div className="marginlr20">基本信息</div>
            </Form.Item>
            <div style={{ marginLeft: '100px' }}>
              <div className="flexjs">
                <Form.Item
                  label="申&nbsp;&nbsp;请&nbsp;&nbsp;人"
                  style={{
                    marginBottom: '15px',
                    width: '400px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.personName : ''}</span>
                </Form.Item>

                <Form.Item
                  label="联&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人"
                  style={{
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ marginLeft: 10 }}>{onlydata ? onlydata.custName : ''}</span>
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  label="申请时间"
                  style={{
                    marginBottom: '15px',
                    width: '400px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.orderDateStr : ''}</span>
                </Form.Item>

                <Form.Item
                  label="售后订单类型"
                  style={{
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.orderTypeStr : ''}</span>
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  label="申请原因"
                  style={{
                    marginBottom: '15px',
                    width: '400px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.disputeReasonStr : ''}</span>
                </Form.Item>

                <Form.Item
                  label="联&nbsp;系&nbsp;人&nbsp;手&nbsp;机"
                  style={{
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.custMobile : ''}</span>
                </Form.Item>
              </div>
              <div className="flexjs">
                <Form.Item
                  label="问题描述"
                  style={{
                    marginBottom: '20px',
                    width: '1000px',
                  }}
                >
                  <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.disputeContent : ''}</span>
                </Form.Item>
              </div>
            </div>
          </div>

          {onlydata.orderTypeStr === '仅退款' ? (
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
                      label="联系地址"
                      style={{
                        marginBottom: '15px',
                        width: '1000px',
                      }}
                    >
                      <span>
                        {onlydata ? (
                          <div style={{ marginLeft: '10px' }}>
                            <span>{onlydata.provinceName} </span>
                            <span>{onlydata.eparchyName}</span>
                            <span>{onlydata.cityName}</span>
                          </div>
                        ) : (
                          ''
                        )}
                      </span>
                    </Form.Item>
                  </div>

                  <div className="flexjs">
                    <Form.Item
                      label="收货地址"
                      style={{
                        marginBottom: '15px',
                        width: '1000px',
                      }}
                    >
                      <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.address : ''}</span>
                    </Form.Item>
                  </div>
                  <div className="flexjs">
                    <Form.Item
                      label="物流公司"
                      style={{
                        marginBottom: '20px',
                        width: '400px',
                      }}
                    >
                      <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.expressCompany : ''}</span>
                    </Form.Item>
                    <Form.Item
                      label="物流单号"
                      style={{
                        marginBottom: '15px',
                      }}
                    >
                      <span style={{ marginLeft: 10 }}>{onlydata ? onlydata.expressNo : ''}</span>
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
              <Table
                rowClassName={useGetRow}
                //待修改
                pagination={false}
                disabled={true}
                columns={operateColumns}
                dataSource={data}
              />
            </div>
          </div>
          <div style={{ margin: '20px  0px' }}>
            {props.examineShow ? (
              <div style={{ margin: '50px  0px' }}>
                <div className="flexjc">
                  <Button
                    type="primary"
                    style={{
                      width: '120px',
                      marginRight: '100px',
                      borderRadius: '4px',
                    }}
                    onClick={() => setaftershow(true)}
                  >
                    审核
                  </Button>
                  <Button type="primary" style={{ width: '120px', borderRadius: '4px' }} onClick={() => props.afterMinuteChange(0)}>
                    返回
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="primary" style={{ width: '120px', borderRadius: '4px', marginLeft: 20 }} onClick={() => props.afterMinuteChange(1)}>
                返回
              </Button>
            )}
          </div>
        </Form>
      </div>

      <Modal destroyOnClose={true} centered={true} title="提示信息" visible={aftershow} onCancel={() => setaftershow(false)} footer={null} width={600}>
        <Form onFinish={onFinish}>
          <div style={{ marginLeft: 80 }}>
            <Form.Item
              name="orderStatus"
              required
              rules={[{ required: true, message: '请选择' }]}
              initialValue={29}
              style={{
                width: '400px',
                marginBottom: '20px',
              }}
            >
              <Radio.Group>
                <Radio value={29}>审核通过</Radio>
                <Radio value={93}>未通过</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="审核意见"
              name="processNote"
              required
              rules={[{ required: true, message: '请输入审核意见' }]}
              style={{
                marginBottom: '60px',
                width: '400px',
              }}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </div>

          <div className="flexjc">
            <Button
              style={{
                width: '100px',
                marginRight: '60px',
                borderRadius: '4px',
              }}
              type="primary"
              htmlType="submit"
            >
              确定
            </Button>
            <Button type="primary" style={{ width: '100px', borderRadius: '4px' }} onClick={() => setaftershow(false)}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
export default afterMinute
