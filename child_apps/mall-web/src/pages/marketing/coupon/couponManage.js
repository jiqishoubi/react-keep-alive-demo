import { Form, Input, Select, Button, Table, message } from 'antd'

import React, { useEffect, useRef, useState } from 'react'

import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import { getTicketList, getTicketDetail, getSysCodeByParam } from '@/services/marketing'

import { useGetRow } from '@/hooks/useGetRow'
import { router } from 'umi'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'
function couponManage(props) {
  const [form] = Form.useForm()

  const { Option } = Select
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table loding 展示
  const [loading, setloading] = useState(false)
  //详情页面啊是否展示
  const [onlyinit, setonlyinit] = useState(false)
  //主页面是否展示
  const [init, setinit] = useState(true)
  //table 数据
  const [tradeList, settradeList] = useState([])
  //orderdata 详情数据
  const [onlydata, setonlydata] = useState([])
  //卡券类型
  const [category, setcategory] = useState([])
  //品类类型
  const [scope, setscope] = useState([])
  //适用范围
  const [detailName, setdetailName] = useState([])

  const columns = [
    {
      dataIndex: 'orgName',
      title: '推广公司',
      align: 'center',
      key: 'orgName',
    },
    {
      dataIndex: 'ticketCode',
      title: '卡券编号',
      align: 'center',
      key: 'ticketCode',
    },
    {
      dataIndex: 'ticketTypeName',
      title: '卡券类型',
      align: 'center',
      key: 'ticketTypeName',
    },

    {
      dataIndex: 'scopeTypeName',
      title: '适用品类',
      align: 'center',
      key: 'scopeTypeName',
    },
    {
      align: 'center',
      title: '卡券名称',
      dataIndex: 'ticketName',
      key: 'ticketName',
    },
    {
      align: 'center',
      dataIndex: 'ticketExplain',
      title: '面额',
      key: 'ticketExplain',
    },
    {
      align: 'center',
      title: '有效期',
      render: (e) => {
        return e.vaildDays ? (
          <>
            {e.vaildDays}
            <span>天</span>
          </>
        ) : (
          <div>
            <span>{e.effectDateStr}</span>
            <span>至</span>
            <span>{e.expireDateStr}</span>
          </div>
        )
      },
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => {
                getTradeInfo_(e)
              }}
            >
              详情
            </a>
          </div>
        )
      },
    },
  ]

  //卡券类型    TICKET_TYPE
  async function getcategory() {
    let res = await getSysCodeByParam({ codeParam: 'TICKET_TYPE' })
    if (res.code === '0') {
      setcategory(res.data)
    } else {
      message.error(res.message)
    }
  }

  //品类类型TICKET_SCOPE_TYPE
  async function getscope() {
    let res = await getSysCodeByParam({ codeParam: 'TICKET_SCOPE_TYPE' })

    if (res.code === '0') {
      setscope(res.data)
    } else {
      message.error(res.message)
    }
  }

  useEffect(() => {
    getcategory()
    getscope()
    onFinish()
  }, [])

  //点击查看详情
  async function getTradeInfo_(e) {
    let res = await getTicketDetail({ ticketCode: e.ticketCode })
    let x = []
    if (res.code === '0') {
      setonlydata(res.data)
      res.data.scopeList.map((r) => x.push(r.scopeDetail.detailName))
      setdetailName(x)
      setinit(false)
      setonlyinit(true)
      window.scrollTo(0, 0)
    } else {
      message.error(res.message)
    }
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }
  // 分页点击
  const pageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  //表单数据
  async function onFinish() {
    pageRef.current = 1
    getTableList()
  }

  const getTableList = async () => {
    setloading(true)
    let values = form.getFieldsValue()
    values['rows'] = pageRef
    values['page'] = pageSizeRef
    let res = await getTicketList(values)
    if (res.code === '0') {
      settradeList(res.data.data)
      settableListTotalNum(res.data.rowTop)
    }
    setloading(false)
  }

  //点击跳转新建
  const createrTicket = () => {
    router.push('/web/company/business/ticketmgr/creater')
  }

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item name="ticketCode" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="卡券编号" />
                </Form.Item>

                <Form.Item name="ticketName" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="卡券名称" />
                </Form.Item>

                <Form.Item name="scopeType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="适用品类" allowClear={true}>
                    {scope.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="ticketType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="卡券类型" allowClear={true}>
                    {category.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {getOrgKind().isAdmin && (
                  <Form.Item name="orgCode" style={{ width: 220, marginRight: '10px' }}>
                    <FetchSelect
                      placeholder="推广公司"
                      api={api_channel.queryPromotionCompanyList}
                      valueKey="orgCode"
                      textKey="orgName"
                      //搜索
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    />
                  </Form.Item>
                )}
                <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} id="couponManageinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>

                {haveCtrlElementRight('yhqgl-add-btn') && getOrgKind().isCompany && (
                  <Button
                    style={{ borderRadius: '4px', marginRight: 10 }}
                    onClick={() => {
                      createrTicket()
                    }}
                    type="primary"
                    size="middle"
                  >
                    新建优惠卡券
                  </Button>
                )}
              </div>
            </div>
          </Form>
          <div className="positionre">
            <Table
              style={{ margin: '23px  20px' }}
              rowClassName={useGetRow}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                current: pageRef.current,
                pageSize: pageSizeRef.current,
                total: tableListTotalNum,
                showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
                onChange: pageChange,
              }}
              loading={loading}
              columns={columns}
              dataSource={tradeList}
            />
          </div>
        </div>
      ) : (
        ''
      )}

      {onlyinit ? (
        <div>
          <Form>
            <div className="fontMb">
              <Form.Item>
                <div className="marginlr20">基本信息</div>
              </Form.Item>
              <div style={{ marginLeft: '100px' }}>
                <div className="flexjs">
                  <Form.Item
                    label="卡券编号"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.ticketCode : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="有&nbsp;&nbsp;效&nbsp;期"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <div style={{ marginLeft: '10px' }}>
                      {onlydata ? (
                        onlydata.vaildDays ? (
                          <div>
                            <span>{onlydata.vaildDays}天</span>
                          </div>
                        ) : (
                          <div>
                            <span>{onlydata.effectDateStr}</span>
                            <span>至</span>
                            <span>{onlydata.expireDateStr}</span>
                          </div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="卡券类型"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.ticketTypeName : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="生效时间"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.expireTypeName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="卡券名称"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.ticketName : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="适用品类"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.scopeTypeName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="卡券面额"
                    style={{
                      marginBottom: 0,
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.ticketExplain : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="适用范围"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <div style={{ marginLeft: '10px', marginTop: '6px' }}>
                      {detailName.map((r) => {
                        return <p>{r}</p>
                      })}
                    </div>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="说&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;明"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.remark : ''}</span>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div style={{ margin: '20px  20px' }}>
              <Button
                style={{ width: '100px', borderRadius: '4px' }}
                onClick={() => {
                  setonlyinit(false)
                  setinit(true)
                }}
                type="primary"
                htmlType="submit"
              >
                返回
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default couponManage
