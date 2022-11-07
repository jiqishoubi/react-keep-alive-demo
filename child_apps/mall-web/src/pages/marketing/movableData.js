import { Form, DatePicker, Input, Select, Space, Button, Table, message } from 'antd'

import React, { useEffect, useState } from 'react'

import { getActiveList } from '@/services/marketing'

import { useGetRow } from '@/hooks/useGetRow'
import { CaretDownOutlined } from '@ant-design/icons'
function movableData() {
  const [form] = Form.useForm()
  const { Option } = Select
  //分页
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState('')
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
  //table loding 展示
  const [loading, setloading] = useState(false)
  //详情页面啊是否展示
  const [onlyinit, setonlyinit] = useState(false)

  //主页面是否展示
  const [init, setinit] = useState(true)
  const [tradeList, settradeList] = useState([])
  //onlydata详情页面的数据
  const [onlyData, setonlyData] = useState()

  const { RangePicker } = DatePicker
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
      dataIndex: 'activeCode',
      title: '活动编号',
      align: 'center',
    },
    {
      dataIndex: 'activeName',
      title: '活动名称',
      align: 'center',
    },
    {
      align: 'center',
      title: '活动类型',
      dataIndex: 'activeTypeName',
    },
    {
      align: 'center',

      title: '活动状态',
      render: (e) => {
        return <div>{e.disabled === 0 ? <span>正常</span> : <span>下线</span>}</div>
      },
    },
    {
      align: 'center',
      dataIndex: 'tradeCount',
      title: '参与人数',
    },
  ])

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //点击改变页数
  useEffect(() => {
    document.getElementById('movableDatainit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  //表单数据
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
    let res = await getActiveList(values)
    if (res && res.code === '0') {
      settradeList(res.data.data)
      settableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setloading(false)
  }
  //组件回流
  function minute() {
    setonlyinit(false)
    setinit(true)
  }

  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item name="activeCode" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="活动编号" />
                </Form.Item>

                <Form.Item name="activeName" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="活动名称" />
                </Form.Item>
                <Form.Item name="disabled" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="活动状态" allowClear={true}>
                    <Option value={0}>正常</Option>
                    <Option value={1}>下线</Option>
                  </Select>
                </Form.Item>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} id="movableDatainit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
              </div>
            </div>
          </Form>
          <div className="positionre">
            <Table rowClassName={useGetRow} style={{ margin: '20px  20px' }} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={tradeList} />
            {/*<div>{tableListTotalNum ? <p className="allNums_">共{tableListTotalNum}条</p> : ''}</div>*/}
          </div>
        </div>
      ) : (
        ''
      )}

      {/*{onlyinit ? <MovableDataMinute minute={minute} onlyData={onlyData} /> : ''}*/}
    </div>
  )
}
export default movableData
