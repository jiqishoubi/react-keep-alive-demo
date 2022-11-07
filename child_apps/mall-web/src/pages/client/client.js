import { Form, DatePicker, Input, Select, Button, Table, Space, message, Col, Modal } from 'antd'
import moment from 'moment'
import { useGetRow } from '@/hooks/useGetRow'
import React, { useEffect, useState } from 'react'

import { getClientQuery, getqueryCustomerInfor, exportTradeReport, getExportInfo, getPagingList } from '@/services/client'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

function client() {
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const { Option } = Select
  //分页
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)

  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState()
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
  //table loding 展示
  const [loading, setloading] = useState(false)
  //详情页面啊是否展示
  const [onlyinit, setonlyinit] = useState(false)
  //详情页面数据
  const [onlydata, setonlydata] = useState([])

  //数据
  const [tradeList, settradeList] = useState([])

  //主页面是否展示
  const [init, setinit] = useState(true)

  //导出数据
  const [educe, seteduce] = useState(false)
  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const columns = [
    {
      dataIndex: 'userCode',
      title: '客户ID',
      align: 'center',
    },
    {
      dataIndex: 'userName',
      title: '姓名/名称',
      align: 'center',
    },
    {
      dataIndex: 'phoneNumber',
      title: '手机号',
      align: 'center',
    },

    {
      dataIndex: 'sourceMode',
      align: 'center',
      title: '来源方式',
    },
    {
      dataIndex: 'vipName',
      align: 'center',
      title: '会员',
      render: (r) => {
        return r ? r : '--'
      },
    },
    {
      align: 'center',
      dataIndex: 'createDateStr',
      title: '首次登陆时间',
    },
    {
      align: 'center',
      dataIndex: 'ifAuth',
      title: '实名认证状态',
    },
    {
      align: 'center',
      dataIndex: 'lastFinishDate',
      title: '最后一次消费时间',
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

  //点击查看详情
  async function getTradeInfo_(e) {
    let userCode = e.userCode
    let res = await getqueryCustomerInfor({ userCode: userCode })
    if (res && res.code === '0') {
      setonlydata(res.data)
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

  //点击改变页数
  useEffect(() => {
    document.getElementById('clientinit').click()
  }, [clickPag, pageSize])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  //表单数据
  async function onFinish(values) {
    if (!values['times']) {
      delete values.times
    } else {
      values['startTime'] = values['times'][0].format('YYYY-MM-DD')
      values['endTime'] = values['times'][1].format('YYYY-MM-DD')
      delete values.times
    }
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

    let res = await getClientQuery(values)

    if (res && res.code === '0' && res.data && res.data.data) {
      settradeList(res.data.data)
      setloading(false)
      settableListTotalNum(res.data.rowTop)
    } else {
      settableListTotalNum(0)
      settradeList([])
    }

    setloading(false)
  }
  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = JSON.parse(oldData)

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

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item name="times" style={{ width: 260, marginRight: '10px' }}>
                  <RangePicker placeholder={['首次登录时间', '首次登录时间']} showToday={true} locale={locale} allowClear={false} />
                </Form.Item>

                <Form.Item name="userCode" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="客户ID" allowClear />
                </Form.Item>

                <Form.Item name="weiXinName" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="姓名/名称" allowClear />
                </Form.Item>
                <Form.Item name="phoneNumber" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="手机号" allowClear />
                </Form.Item>
                <Form.Item name="distributeCode" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="来源方式" allowClear={true}>
                    <Option value="自然流量">自然流量</Option>
                    <Option value="被邀请人">被邀请</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="ifAuth" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="实名认证状态" allowClear={true}>
                    <Option value="0">已认证</Option>
                    <Option value="1">未认证</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="ifVip" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="会员" allowClear={true}>
                    <Option value="0">非会员</Option>
                    <Option value="1">会员</Option>
                  </Select>
                </Form.Item>
                <Button style={{ borderRadius: 8, marginRight: 10 }} id="clientinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
                <Button style={{ borderRadius: 8, marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>

                <Button
                  style={{ borderRadius: '4px' }}
                  size="middle"
                  onClick={() => {
                    getPagingList_()
                    seteduce(true)
                  }}
                >
                  导出
                </Button>
              </div>
            </div>
          </Form>
          <div className="positionre">
            <Table rowClassName={useGetRow} style={{ margin: '23px  20px' }} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={tradeList} />
            {/*<div>{tableListTotalNum ? <p className="allNums_">共{tableListTotalNum}条</p> : ''}</div>*/}
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
                    label="客 &nbsp;&nbsp; &nbsp; 户 &nbsp; &nbsp; ID"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.userCode : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="实 名&nbsp;认 证"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.ifAuth : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 称"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.userAlias : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="客 户&nbsp;姓 名"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.realName : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="首次登陆时间"
                    style={{
                      marginBottom: '20px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.createDateStr : ''}</span>
                  </Form.Item>

                  <Form.Item label="身份证号码">
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.psptNo : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="会&nbsp; 员&nbsp; 名&nbsp; 称"
                    style={{
                      marginBottom: '20px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata.personVipDTO ? onlydata.personVipDTO.vipName : ''}</span>
                  </Form.Item>

                  <Form.Item label="会员发展人">
                    <span style={{ marginLeft: '10px' }}>{onlydata.personVipDTO ? onlydata.personVipDTO.vipFromUserName : ''}</span>
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="fontMb" style={{ marginTop: '30px' }}>
              <Form.Item>
                <div className="marginlr20">其他信息</div>
              </Form.Item>

              <div style={{ marginLeft: '100px' }}>
                <div className="flexjs">
                  <Form.Item
                    label="来源方式"
                    style={{
                      marginBottom: '20px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.sourceMode : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="上次消费时间"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.lastFinishDate : ''}</span>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div>
              <Button
                style={{ width: 100, borderRadius: 8, marginLeft: 20 }}
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
export default client
