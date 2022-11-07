import { Button, DatePicker, Form, Input, message, Select, Space, Table, Modal } from 'antd'
import moment from 'moment'
import { getToday } from '@/utils/utils'
import AntdDraggableModal from 'antd-draggable-modal'
import React, { useEffect, useState } from 'react'
import { initDistributeMemberPage, getDistributeMemberList, createDistributeMember, queryPromotionCompanyList, deleteDistributeMember } from '@/services/channel'
import { getSysCodeByParam } from '@/services/common'
import { CaretDownOutlined, DownloadOutlined, RedoOutlined } from '@ant-design/icons'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
import { useGetRow } from '@/hooks/useGetRow'
import debounce from 'lodash/debounce'
import requestw from '@/utils/requestw'
import Upload from '@/components/T-Upload4'
import { getImportData, getImportStatus, togetherCreateMember } from '@/services/order'
import api_channel from '@/services/api/channel'

moment.locale('zh-cn')

function user() {
  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  }
  const { RangePicker } = DatePicker
  const { Option } = Select
  const [form] = Form.useForm()
  const [creatForm] = Form.useForm()
  const { TextArea } = Input
  //init
  const [init, setinit] = useState(true)
  //table loding 展示
  const [loading, setloading] = useState(false)
  //页面
  const [pageNum, setpageNum] = useState(1)

  const [pageSize, setpageSize] = useState(20)
  //user状态
  const [userStatus, setuserStatus] = useState([])
  //userlist
  const [userlist, setuserlist] = useState([
    { name: '推广人', value: 'DISTRIBUTE_HEAD' },
    { name: '合伙人', value: 'SALE_PERSON' },
    { name: '合伙人分身', value: 'SALE_PERSON_SHADOW' },
  ])
  //userdata
  const [userdata, setuserdata] = useState([])
  //创建是否显示
  const [noOrder, setnoOrder] = useState(false)

  //only数据e
  const [onlydata, setonlydata] = useState([])
  //only数据e
  const [onlyinit, setonlyinit] = useState(false)

  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState()
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
  //s时间变化存储
  const [dates, setDates] = useState([])

  //推广公司数据
  const [supplierData, setsupplierData] = useState([])

  const [querysupplierData, setquerysupplierData] = useState([])

  const [deleteShow, setDeleteShow] = useState(false)

  //批量model展示
  const [visible, setVisible] = useState(false)
  //批量结果model展示
  const [visibleResult, setVisibleResult] = useState(true)

  const [visibleLoding, setVisibleLoding] = useState(false)

  const [visibleData, setVisibleData] = useState([])

  const [myVar, setmyVar] = useState()

  const [visibleNumber, setVisibleNumber] = useState(false)
  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  // 封装获取订单状态
  async function getSysCodeByParam_(codeParam, inCode, notCode) {
    let cs = {
      codeParam,
      inCode,
      notCode,
    }
    let res = await getSysCodeByParam(cs)
    return res
  }

  useEffect(() => {
    // 状态
    getSysCodeByParam_('DISTRIBUTE_STATUS').then((res) => {
      if (res && res.code === '0') {
        setuserStatus(res.data)
      } else {
      }
    })
    querycreateSupplier_()
    createSupplier_()
  }, [])

  async function onFinish(values) {
    delete values.page
    let news = JSON.stringify(values)

    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['page'] = 1
    } else {
      values['page'] = pageNum
    }

    setloading(true)
    if (!values['times']) {
      delete values.times
    } else {
      values['startDate'] = values['times'][0].format('YYYY-MM-DD')
      values['endDate'] = values['times'][1].format('YYYY-MM-DD')
      delete values.times
    }

    values['rows'] = pageSize
    for (let key in values) {
      if (values[key] instanceof Array) {
        values[key] = values[key].join(',')
      }
    }
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }

    let res = await requestw({
      url: api_channel.getDistributeMemberList(),
      data: {
        ...values,
      },
    })
    if (res && res.code === '0') {
      settableListTotalNum(res.data.rowTop)
      setuserdata(res.data.data)
    } else {
      settableListTotalNum(0)
      message.error(res.message)
    }
    setloading(false)
  }

  async function creaetonFinish(values) {
    for (let key in values) {
      if (values[key] instanceof Array) {
        values[key] = values[key].join(',')
      }
    }
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }

    // let res = await createDistributeMember(values);
    let res = await requestw({
      url: '/web/distribute/member/createDistributeMember',
      data: {
        ...values,
      },
    })

    if (res && res.code === '0') {
      setnoOrder(false)
      message.success(res.message)
      document.getElementById('userinit').click()
    } else {
      message.error(res.message)
    }
  }

  const [columns] = useState([
    {
      align: 'center',
      dataIndex: 'personPhoneNumber',
      title: '账号',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'personName',
      title: '姓名/名称',
      key: 'key',
    },
    {
      align: 'center',
      dataIndex: 'distributeTypeName',
      title: '类型',
      key: 'key',
    },
    {
      dataIndex: 'createDateStr',
      title: '加入时间',
      align: 'center',
      key: 'key',
    },

    {
      align: 'center',
      dataIndex: 'developPersonAllName',
      title: '所属推广人',
      render: (e) => {
        return e ? e : '--'
      },
    },
    {
      dataIndex: 'statusName',
      title: '状态',
      align: 'center',
      key: 'key',
    },
    {
      dataIndex: 'parentPersonName',
      title: '上级合伙人',
      align: 'center',
      key: 'key',
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            <a
              onClick={() => {
                miutionClick(e)
              }}
            >
              详情
            </a>
            &nbsp; &nbsp;
            <a
              onClick={() => {
                deleteClick(e)
              }}
            >
              删除
            </a>
          </div>
        )
      },
    },
  ])
  //点击改变页数
  useEffect(() => {
    document.getElementById('userinit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }
  //详情被点击
  function miutionClick(e) {
    setonlydata(e)
    setonlyinit(true)
    setinit(false)
    window.scroll(0, 0)
  }
  const deleteClick = (e) => {
    setonlydata(e)
    setDeleteShow(true)
  }

  const deleteClickEnsure = async () => {
    let res = await deleteDistributeMember({
      distributeCode: onlydata.distributeCode,
    })
    if (res && res.code === '0') {
      message.success(res.message)
      setDeleteShow(false)
    } else {
      message.warning(res.message)
      setDeleteShow(false)
    }

    onFinish(JSON.parse(oldData))
    form.setFieldsValue(JSON.parse(oldData))
  }

  ///时间选择限制
  // const disabledDate = current => {
  //   if (!dates || dates.length === 0) {
  //     return false;
  //   }
  //
  //   const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
  //   const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
  //   return tooEarly || tooLate;
  // };

  //推广公司查询
  async function querycreateSupplier_(value) {
    let data = { companyName: value }
    let res = await queryPromotionCompanyList(data)
    if (res && res.code === '0') {
      {
        res.data !== null ? setquerysupplierData(res.data) : setquerysupplierData([])
      }
    }
  }

  //推广公司防抖
  const querysudelayedChange = debounce(querycreateSupplier_, 800)
  //推广公司输入框改变
  const querysuhandleChange = (event) => {
    querysudelayedChange(event)
  }

  //创建推广公司查询
  async function createSupplier_(value) {
    let data = { companyName: value }
    let res = await queryPromotionCompanyList(data)
    if (res && res.code === '0') {
      {
        res.data !== null ? setsupplierData(res.data) : setsupplierData([])
      }
    }
  }

  //创建推广公司防抖
  const sudelayedChange = debounce(createSupplier_, 800)
  //创建推广公司输入框改变
  const suhandleChange = (event) => {
    sudelayedChange(event)
  }

  //批量发货
  const visibleFinish = async (values) => {
    if (!visibleResult) {
      setVisibleResult(true)
      return
    }
    setVisibleLoding(true)
    let code = values.expressNo[0].code

    let res = await togetherCreateMember({ operDataKey: code })

    if (res && res.code === '0') {
      creatForm.setFieldsValue({ expressNo: '' })
      let oper = res.data.OPER_CODE

      let myVars = setInterval(async () => {
        let data = await getImportStatus({ operCode: oper })

        if (data.data === '2') {
          clearInterval(myVars)
          clearInterval(myVar)
          let oldData = await getImportData({ operCode: oper })

          setVisibleNumber(oldData.data[oldData.data.length - 1].SUCCESS_COUNT)
          let x = oldData.data.slice(0, oldData.data.length - 1)
          let y = []
          x.map((r) => {
            y.push(r)
          })

          setVisibleData(y)

          setVisibleLoding(false)
          setVisibleResult(false)
        }
      }, 1000)

      setmyVar(myVars)
    } else {
      message.error(res.message)
      setVisibleLoding(false)
    }
  }
  const copy = (id) => {
    let copyDOM = document.getElementById(id) //需要复制文字的节点
    let range = document.createRange() //创建一个range
    window.getSelection().removeAllRanges() //清楚页面中已有的selection
    range.selectNode(copyDOM) // 选中需要复制的节点
    window.getSelection().addRange(range) // 执行选中元素
    let successful = document.execCommand('copy') // 执行 copy 操作
    if (successful) {
      message.success('复制成功！')
    } else {
      message.error('复制失败，请手动复制！')
    }
    // 移除选中的元素
    window.getSelection().removeAllRanges()
  }
  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item name="times" style={{ width: 260, marginRight: '10px' }}>
                  <RangePicker
                    // disabledDate={disabledDate}
                    onCalendarChange={(value) => {
                      setDates(value)
                    }}
                    showToday={true}
                    locale={locale}
                    allowClear={true}
                  />
                </Form.Item>
                <Form.Item name="distributeType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="成员类型" allowClear={true}>
                    {userlist.map((r) => (
                      <Option key={r.value} value={r.value}>
                        {r.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="成员状态" allowClear={true}>
                    {userStatus.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="personPhoneNumber" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="联系电话" />
                </Form.Item>

                <Form.Item name="personName" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="成员名称" />
                </Form.Item>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} id="userinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginRight: 10 }}
                  type="primary"
                  onClick={() => {
                    setnoOrder(true)
                  }}
                >
                  创建推广人
                </Button>

                {/*<Button size="middle">导出</Button>*/}
                <Button onClick={() => setVisible(true)} style={{ borderRadius: '4px' }} className="buttonNoSize" size="middle">
                  批量创建
                </Button>
              </div>
            </div>
          </Form>

          <div>
            <Table style={{ margin: '23px  20px' }} rowClassName={useGetRow} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={userdata} />
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
                    label="账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.personPhoneNumber : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.personAllName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.distributeTypeName : ''}</span>
                  </Form.Item>
                  <Form.Item
                    label="账号状态"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.statusName : ''}</span>
                  </Form.Item>
                  {/*<Form.Item label="邀&nbsp;&nbsp;请&nbsp;&nbsp;人">*/}
                  {/*  <span style={{ marginLeft: '10px' }}>{onlydata ? '' : ''}</span>*/}
                  {/*</Form.Item>*/}
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="加入时间"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.createDateStr : ''}</span>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="fontMb">
              <Form.Item>
                <div className="marginlr20">渠道信息</div>
              </Form.Item>

              <div style={{ marginLeft: '100px' }}>
                <div className="flexjs">
                  <Form.Item
                    label="下一级数量"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '12px' }}>{onlydata ? onlydata.childrenCount : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="上级合伙人"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.parentPersonName : ''}</span>
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

      <Modal destroyOnClose={true} centered={true} title="创建推广人" visible={noOrder} onCancel={() => setnoOrder(false)} width="500px" footer={null}>
        <>
          <div className="positionre" style={{ height: '400px' }}>
            <div style={{ position: 'absolute', top: '8px', left: '70px' }}>
              <Form onFinish={creaetonFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                <Form.Item label="推广人手机号" rules={[{ required: true, message: '推广人手机号不能为空' }]} style={{ width: '400px' }} name="phoneNumber">
                  <Input placeholder="请输入推广人手机号" style={{ width: '160px' }} />
                </Form.Item>

                <Form.Item name="name" label="推广人姓名" rules={[{ required: true, message: '推广人姓名不能为空' }]} style={{ width: '400px' }}>
                  <Input placeholder="请输入推广人姓名" style={{ width: '160px' }} />
                </Form.Item>
                {/* <Form.Item
                  name="distributeOrgCode"
                  label="推广公司"
                  rules={[{ required: true, message: '推广公司不能为空' }]}
                  style={{ width: '400px' }}
                >
                  <Select
                    style={{ width: '160px' }}
                    showArrow={true}
                    placeholder="输入关键字查询"
                    allowClear={true}
                    showSearch
                    filterOption={false}
                    onSearch={suhandleChange}
                  >
                    {supplierData.map(r => (
                      <Option key={r.orgCode} value={r.orgCode}>
                        {r.orgName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item> */}

                <Form.Item label="密码" name="initPassword" style={{ width: '400px' }}>
                  <Input placeholder="初始默认密码(123456)" style={{ width: '160px' }} />
                </Form.Item>

                <Form.Item>
                  <Button style={{ borderRadius: '4px' }} className="positionmf" type="primary" htmlType="submit">
                    确定
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </>
      </Modal>

      <Modal centered={true} title="提示" visible={deleteShow} onCancel={() => setDeleteShow(false)} onOk={deleteClickEnsure} cancelText="取消" okText="确定">
        <p>是否确认删除该用户?</p>
      </Modal>

      {/*///批量创建*/}
      <Modal
        destroyOnClose={true}
        title="批量创建推广人"
        onCancel={() => {
          creatForm.setFieldsValue({ expressNo: '', orgCode: '' })
          setVisible(false)
          setVisibleResult(true)
          setVisibleLoding(false)
          clearInterval(myVar)
          if (!visibleResult) {
            onFinish({})
          }
        }}
        visible={visible}
        width="600px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form preserve={false} {...layout} name="basic" form={creatForm} onFinish={visibleFinish}>
            {visibleResult ? (
              <>
                <Form.Item wrapperCol={{ span: 8 }} label="创建推广人信息模板">
                  <div
                    onClick={() => {
                      window.location.href = 'https://filedown.bld365.com/bldmall/template/批量创建推广人.xls'
                    }}
                    className="formwork"
                  >
                    <DownloadOutlined />
                    模板下载
                  </div>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 8 }} name="expressNo" label="批 量 推 广 人 信 息" rules={[{ required: true, message: '请上传批量信息' }]}>
                  <Upload type="CREATE_MEMBER" length={1} />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                  <div>本次批量创建成功{visibleNumber}条!</div>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                  <div id="lose">
                    {visibleData.length ? (
                      <div
                        onClick={() => {
                          copy('lose')
                        }}
                      >
                        失败:
                      </div>
                    ) : null}

                    {visibleData.map((r) => {
                      return (
                        <>
                          <span>{r.DATA_COL1}</span>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <span>{r.RESULT_NOTE}</span>
                          <span>,</span>
                          <br />
                        </>
                      )
                    })}
                  </div>
                </Form.Item>
              </>
            )}

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={visibleLoding} disabled={visibleLoding} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                {visibleResult ? '确定' : '继续批量创建'}
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 80 }}
                onClick={() => {
                  setVisible(false)
                  setVisibleResult(true)
                  clearInterval(myVar)
                  if (!visibleResult) {
                    onFinish({})
                  }
                }}
                type="primary"
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </div>
  )
}
export default user
