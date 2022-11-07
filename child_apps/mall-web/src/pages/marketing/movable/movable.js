import { Form, Input, Select, Button, Table, Modal, message, Col, Row } from 'antd'

import React, { useEffect, useRef, useState } from 'react'

import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import { getActiveList, getActiveInfo, getupdateActiveStatus, getSysCodeByParam, exportTradeReport, getExportInfo, getPagingList } from '@/services/marketing'
import BUpload from '@/components/BUpload'
import { useGetRow } from '@/hooks/useGetRow'
import { router } from 'umi'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'
import api_common from '@/services/api/common'

function movable(props) {
  const [form] = Form.useForm()
  const { Option } = Select
  //分页
  const pageNum = useRef(1)
  const pageSize = useRef(20)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)

  const [loading, setloading] = useState(false)
  //详情页面啊是否展示
  const [onlyinit, setonlyinit] = useState(false)
  //详情页面数据
  const [onlydata, setonlydata] = useState([])

  //主页面是否展示
  const [init, setinit] = useState(true)

  //下线页面是否展示
  const [deleteshow, setdeleteshow] = useState(false)
  //
  const [deletename, setdeletename] = useState()

  //下线数据
  const [deleteData, setdeleteData] = useState()

  //Table数据
  const [tradeList, settradeList] = useState([])
  //活动类型
  const [movableType, setmovableType] = useState([])

  //导出数据
  const [oldData, setOldData] = useState()
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  //获取活动类型
  async function getSysCode() {
    let code = { codeParam: 'ACTIVE_TYPE' }
    let res = await getSysCodeByParam(code)
    if (res && res.code === '0') {
      setmovableType(res.data)
    } else {
      message.error(res.message)
    }
  }

  //初始化（获取活动类型）
  useEffect(() => {
    getSysCode()
    onFinish()
    getPagingList_()
  }, [])

  const columns = [
    {
      dataIndex: 'orgName',
      title: '推广公司',
      align: 'center',
    },
    {
      dataIndex: 'activeTypeName',
      title: '活动类型',
      align: 'center',
    },
    {
      align: 'center',
      title: '活动名称',
      dataIndex: 'activeName',
    },
    {
      align: 'center',

      title: '活动起止时间',
      render: (e) => {
        return (
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
      dataIndex: 'tradeCount',
      title: '领券人数',
    },

    {
      align: 'center',
      dataIndex: 'activePerson',
      title: '活动负责人',
    },
    {
      align: 'center',
      title: '活动状态',
      render: (e) => {
        return e.disabled === -1 ? '未发布' : e.disabled === 0 ? '上线' : e.disabled === 1 ? '下线' : ''
      },
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            {getOrgKind().isCompany && e.disabled === -1 && (
              <a
                onClick={() => {
                  settingMovable(e)
                }}
                style={{ cursor: 'pointer' }}
              >
                编辑
              </a>
            )}
            &nbsp;&nbsp;
            {haveCtrlElementRight('hdgl-down-btn') && getOrgKind().isCompany && e.disabled === -1 && (
              <a
                onClick={() => {
                  deleteMovable(e)
                }}
                style={{ cursor: 'pointer' }}
              >
                上线
              </a>
            )}
            {haveCtrlElementRight('hdgl-down-btn') && e.disabled === 0 && getOrgKind().isCompany && (
              <a
                onClick={() => {
                  deleteMovable(e)
                }}
                style={{ cursor: 'pointer' }}
              >
                下线
              </a>
            )}
            &nbsp; &nbsp;
            <a
              onClick={() => {
                goStatistics(e)
              }}
              style={{ cursor: 'pointer' }}
            >
              统计
            </a>
            &nbsp;&nbsp;
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
  //点击统计
  const goStatistics = (e) => {
    router.push({
      pathname: '/web/company/business/activityStatistics',
      query: { activeCode: e.activeCode },
    })
  }
  //点击查看详情
  async function getTradeInfo_(e) {
    if (e.activeType === 'GOODS_PRE_SALE') {
      router.push({
        pathname: '/web/company/distributemgr/channeltool/minute',
        query: { settingCode: e.activeCode, setting: true },
      })
    } else {
      let tradeNo = e.activeCode
      let res = await getActiveInfo({ activeCode: tradeNo })

      if (res && res.code === '0') {
        setonlydata(res.data)
        setinit(false)
        setonlyinit(true)
        window.scrollTo(0, 0)
      } else {
        message.error(res.message)
      }
    }
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //改变页数
  const onPageChange = (newPage, newPageSize) => {
    pageNum.current = newPage
    pageSize.current = newPageSize
    getSelectData()
  }
  const getSelectData = async () => {
    let values = form.getFieldsValue()
    setloading(true)
    values['page'] = pageNum.current
    values['rows'] = pageSize.current
    setOldData(values)
    let res = await getActiveList(values)
    if (res && res.code === '0') {
      settradeList(res.data.data)
      settableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setloading(false)
  }

  //表单数据
  async function onFinish() {
    pageNum.current = 1
    getSelectData()
  }

  //活动 下线
  function deleteMovable(e) {
    setdeleteshow(true)
    setdeletename(e.activeName)
    let status
    e.disabled === -1 ? (status = 0) : e.disabled === 0 ? (status = 1) : e.disabled === 1 ? (status = 0) : ''
    let data = {
      activeCode: e.activeCode,
      status: status,
    }
    setdeleteData(data)
  }

  //确认下线
  async function deleteMovableData() {
    let res = await getupdateActiveStatus(deleteData)
    if (res && res.code === '0') {
      setdeleteshow(false)
      onFinish()
    } else {
      message.warn(res.message)
    }
  }

  //编辑活动
  const settingMovable = (e) => {
    router.push({
      pathname: '/web/company/business/activemgr/create',
      query: { activeCode: e.activeCode },
    })
  }

  //新建活动
  const createrTicket = () => {
    router.push('/web/company/business/activemgr/create')
  }

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = oldData

    let res = await exportTradeReport(value)
    if (res.code === '0') {
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
    if (res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item name="activeType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="活动类型" allowClear={true}>
                    {movableType.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="activeName" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="活动名称" />
                </Form.Item>

                <Form.Item name="disabled" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="活动状态" allowClear={true}>
                    <Option value={-1}>未发布</Option>
                    <Option value={0}>上线</Option>
                    <Option value={1}>下线</Option>
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

                <Button type="primary" style={{ borderRadius: '4px', marginRight: 10 }} size="middle" htmlType="submit">
                  查询
                </Button>
                {haveCtrlElementRight('hdgl-add-btn') && getOrgKind().isCompany && (
                  <Button
                    style={{ borderRadius: '4px', marginRight: 10 }}
                    onClick={() => {
                      createrTicket()
                    }}
                    type="primary"
                    size="middle"
                  >
                    新建活动
                  </Button>
                )}

                <Button
                  style={{ borderRadius: '4px', marginRight: 10 }}
                  onClick={() => {
                    seteduce(true)
                  }}
                  className="buttonNoSize"
                  size="middle"
                >
                  导出
                </Button>
              </div>
            </div>
          </Form>
          <div>
            <Table
              rowClassName={useGetRow}
              style={{ margin: '23px  20px' }}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                current: pageNum.current,
                pageSize: pageSize.current,
                total: tableListTotalNum,
                showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
                onChange: onPageChange,
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
                    label="活&nbsp;动&nbsp;编&nbsp;号"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.activeCode : ''}</span>
                  </Form.Item>
                  <Form.Item
                    label="活动状态"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      {onlydata ? (
                        onlydata.disabled === 0 ? (
                          <span>上线</span>
                        ) : onlydata.disabled === -1 ? (
                          <span>未发布</span>
                        ) : (
                          <>{haveCtrlElementRight('hdgl-down-btn') ? <span>下线</span> : ''}</>
                        )
                      ) : null}
                    </span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="活&nbsp;动&nbsp;名&nbsp;称"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.activeName : ''}</span>
                  </Form.Item>
                  <Form.Item
                    label="活动类型"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.activeTypeName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="活&nbsp;动&nbsp;时&nbsp;间"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <div style={{ marginLeft: '10px' }}>
                      {onlydata ? (
                        <div>
                          {onlydata.effectDateStr}
                          <span>至</span>
                          <span>{onlydata.expireDateStr}</span>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </Form.Item>

                  <Form.Item
                    label="活动描述"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.activeDesc : ''}</span>
                  </Form.Item>
                </div>

                {(onlydata.activeType === 'LOGIN_GIFT' || onlydata.activeType === 'SHARE_GIFT' || onlydata.activeType === 'LUCK_DRAW_GIFT') && (
                  <div className="flexjs">
                    <Form.Item
                      label="活&nbsp;动&nbsp;优&nbsp;惠"
                      style={{
                        marginBottom: '15px',
                        width: '400px',
                      }}
                    >
                      <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.activeModeName : ''}</span>
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
                )}

                {onlydata ? (
                  onlydata.ticketDTO ? (
                    <div className="flexjs">
                      <Form.Item
                        label="优惠券类型"
                        style={{
                          marginBottom: '15px',
                          width: '400px',
                        }}
                      >
                        <div style={{ marginLeft: '10px' }}>{onlydata ? (onlydata.ticketDTO ? onlydata.ticketDTO.ticketTypeName : '') : ''}</div>
                      </Form.Item>

                      <Form.Item
                        label="优惠券编码"
                        style={{
                          marginBottom: '15px',
                        }}
                      >
                        <span>{onlydata ? (onlydata.ticketDTO ? onlydata.ticketDTO.ticketCode : '') : ''}</span>
                      </Form.Item>
                    </div>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}

                <div className="flexjs">
                  <Form.Item
                    label="活动负责人"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.activePerson : ''}</span>
                  </Form.Item>

                  {onlydata.activeTypeName === '员工内购' || onlydata.activeTypeName === 'PLUS会员' ? (
                    <Form.Item
                      label="可以叠加优惠券"
                      style={{
                        marginBottom: '15px',
                        width: '400px',
                      }}
                    >
                      <span>{onlydata ? onlydata.ifOverly === '0' ? <span>是</span> : <span>否</span> : ''}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      label="派&nbsp;&nbsp;发&nbsp;&nbsp;人"
                      style={{
                        marginBottom: '15px',
                      }}
                    >
                      <div style={{ marginLeft: '10px', marginTop: '6px' }}>
                        {onlydata.scopeNameList
                          ? onlydata.scopeNameList.map((r) => {
                              return <p>{r}</p>
                            })
                          : null}
                      </div>
                    </Form.Item>
                  )}
                </div>

                <div className="flexjs">
                  {onlydata.activeTypeName === '员工内购' || onlydata.activeTypeName === 'PLUS会员' ? (
                    <Form.Item
                      label="适&nbsp;用&nbsp;范&nbsp;围"
                      style={{
                        marginBottom: '15px',
                      }}
                    >
                      <div style={{ marginLeft: '10px', marginTop: '6px' }}>
                        {onlydata.scopeNameList.map((r) => {
                          return <p>{r}</p>
                        })}
                      </div>
                    </Form.Item>
                  ) : (
                    ''
                  )}

                  <Form.Item
                    label="活&nbsp;动&nbsp;海&nbsp;报"
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <BUpload
                      value={onlydata.activePoster}
                      valueType="string<,>"
                      type="img"
                      api=""
                      getPostData={(e) => {
                        const file = e.file
                        return {
                          fileExt: file.type.split('/')[1],
                          fileType: 'GoodsImage',
                        }
                      }}
                      length={8}
                      disabled={true}
                    />
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

      <Modal centered={true} title="提示信息" visible={deleteshow} onCancel={() => setdeleteshow(false)} onOk={deleteMovableData} cancelText="取消" okText="确定">
        <p>
          是否确认修改
          <span style={{ color: 'red', fontSize: '19px' }}>{deletename}</span>
          该活动？
        </p>
      </Modal>

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
    </div>
  )
}

export default movable
