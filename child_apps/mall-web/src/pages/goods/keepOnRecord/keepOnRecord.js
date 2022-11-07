import { Form, DatePicker, Input, Select, Button, Table, Space, message } from 'antd'

import { useGetRow } from '@/hooks/useGetRow'
import React, { useEffect, useState } from 'react'
import { getChinaPortGoodsRecordPaging, getChinaPortGoodsRecordInfor } from '@/services/goods'

function client() {
  const [form] = Form.useForm()

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

  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: tableListTotalNum,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const [columns] = useState([
    {
      dataIndex: 'goodsRecordName',
      title: '商品名称',
      align: 'center',
    },
    {
      dataIndex: 'goodsRecordCode',
      title: '信息编号',
      align: 'center',
    },
    {
      align: 'center',
      dataIndex: 'warehouseName',
      title: '仓库名',
    },
    {
      align: 'center',
      dataIndex: 'warehouseCode',
      title: '仓库编码',
    },
    {
      align: 'center',
      dataIndex: 'brand',
      title: '品牌',
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
  ])

  useEffect(() => {
    let url = window.location.href
    let code
    if (url.indexOf('?') != -1) {
      let str = url.substr(1)
      let strs = str.split('&')
      strs[0].split('=')[1]
      code = strs[0].split('=')[1]
    }

    if (code) {
      getTradeInfo_({ goodsRecordCode: code })
    }
  }, [])
  //点击查看详情
  async function getTradeInfo_(e) {
    let goodsRecordCode = e.goodsRecordCode
    let res = await getChinaPortGoodsRecordInfor({
      goodsRecordCode: goodsRecordCode,
    })
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
    let url = window.location.href
    let code
    if (url.indexOf('?') != -1) {
      var str = url.substr(1)
      var strs = str.split('&')
      strs[0].split('=')[1]
      code = strs[0].split('=')[1]
    }
    if (!values['times']) {
      delete values.times
    } else {
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

    if (code) {
      values.goodsRecordCode = code
      form.setFieldsValue({ goodsRecordCode: code })
    }
    let res = await getChinaPortGoodsRecordPaging(values)

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

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item name="goodsName" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="商品名称" allowClear />
                </Form.Item>

                <Form.Item name="warehouseCode" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="仓库编码" allowClear />
                </Form.Item>
                <Form.Item name="goodsRecordCode" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="信息编号" allowClear />
                </Form.Item>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>

                <Button style={{ borderRadius: '4px' }} id="clientinit" type="primary" size="middle" htmlType="submit">
                  查询
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
                    label="商&nbsp;&nbsp;&nbsp;&nbsp;品&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;&nbsp;称"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.goodsName : ''}</span>
                  </Form.Item>
                  <Form.Item
                    label="商&nbsp;&nbsp;&nbsp;&nbsp;品&nbsp;&nbsp;&nbsp;&nbsp;编&nbsp;&nbsp;&nbsp;&nbsp;码"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.gcode : ''}</span>
                  </Form.Item>
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="备 案 信 息 编 码"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.goodsRecordCode : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="发 货 仓 库 编 码"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.warehouseCode : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="物 流 企 业 名 称"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.logisticsName : ''}</span>
                  </Form.Item>
                  <Form.Item
                    label="物 流 企 业 编 码"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.logisticsCode : ''}</span>
                  </Form.Item>
                  {/* <Form.Item
                    label="申 报 海 关 编 码"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>
                      {onlydata ? onlydata.customsCode : ''}
                    </span>
                  </Form.Item> */}
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="账&nbsp;&nbsp;&nbsp;&nbsp;册&nbsp;&nbsp;&nbsp;&nbsp;序&nbsp;&nbsp;&nbsp;&nbsp;号"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.emsNo : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="账 册 备 案 料 号"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.itemRecordNo : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.brand : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="商 品 规 格 型 号"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.gmodel : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;国"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.country : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.city : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="有&nbsp;&nbsp;&nbsp;&nbsp;效&nbsp;&nbsp;&nbsp;&nbsp;天&nbsp;&nbsp;&nbsp;&nbsp;数"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.effectDays : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="运&nbsp;&nbsp;&nbsp;&nbsp;输&nbsp;&nbsp;&nbsp;&nbsp;方&nbsp;&nbsp;&nbsp;&nbsp;式"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.trafMode : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="计&nbsp;&nbsp;&nbsp;&nbsp;量&nbsp;&nbsp;&nbsp;&nbsp;单&nbsp;&nbsp;&nbsp;&nbsp;位"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.unit : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="法 定 计 量 单 位"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.unit1 : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="第 二 计 量 单 位"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.unit2 : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;途"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.usageCote : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="产&nbsp;&nbsp;&nbsp;&nbsp;品&nbsp;&nbsp;&nbsp;&nbsp;条&nbsp;&nbsp;&nbsp;&nbsp;码"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.barCode : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="箱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;规"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.cartonSpec : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="长（单位：CM）"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.length : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="宽（单位：CM）"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.width : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="高（单位：CM）"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.height : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="毛重（单位：KG）"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.grossWeight : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="运 输 单 元 体 积"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.expressVolume : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="运 输 单 元 重 量"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.expressWeight : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="起&nbsp;&nbsp;&nbsp;&nbsp;运&nbsp;&nbsp;&nbsp;&nbsp;国&nbsp;&nbsp;&nbsp;&nbsp;家"
                    style={{
                      marginBottom: '15px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.trafCountry : ''}</span>
                  </Form.Item>

                  <Form.Item
                    label="注&nbsp;&nbsp;&nbsp;&nbsp;册&nbsp;&nbsp;&nbsp;&nbsp;国&nbsp;&nbsp;&nbsp;&nbsp;家&nbsp;&nbsp;&nbsp;&nbsp;"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <span style={{ marginLeft: '22px' }}>{onlydata ? onlydata.regCountry : ''}</span>
                  </Form.Item>
                </div>

                <div className="flexjs">
                  <Form.Item
                    label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注"
                    style={{
                      marginBottom: '20px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.remark : ''}</span>
                  </Form.Item>

                  {/* <Form.Item label="身份证号码">
                    <span style={{ marginLeft: '10px' }}>{onlydata ? onlydata.psptNo : ''}</span>
                  </Form.Item> */}
                </div>
                <div className="flexjs">
                  <Form.Item
                    label="内&nbsp;&nbsp;&nbsp;&nbsp;容&nbsp;&nbsp;&nbsp;&nbsp;成&nbsp;&nbsp;&nbsp;&nbsp;分"
                    style={{
                      marginBottom: '20px',
                      width: '400px',
                    }}
                  >
                    <span style={{ marginLeft: '20px' }}>{onlydata ? onlydata.componentNote : ''}</span>
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
    </div>
  )
}
export default client
