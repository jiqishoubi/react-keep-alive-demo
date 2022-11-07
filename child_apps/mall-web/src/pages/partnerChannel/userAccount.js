import { Button, Form, Input, message, Select, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { CaretDownOutlined, RedoOutlined } from '@ant-design/icons'
import { useGetRow } from '@/hooks/useGetRow'
import requestw from '@/utils/requestw'
import api_channel from '@/services/api/channel'

function userAccout() {
  const [form] = Form.useForm()
  //页数
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  //状态
  const [loading, setloading] = useState(false)
  //accountData 数据
  const [accountData, setaccountData] = useState([])

  //userlist
  const [userlist, setuserlist] = useState([
    { name: '推广人', value: 'DISTRIBUTE_HEAD' },
    { name: '推广公司(企业)', value: 'DISTRIBUTE_COMPANY' },
    { name: '推广公司(个体工商户)', value: 'DISTRIBUTE_MERCHANT' },
    { name: '合伙人', value: 'SALE_PERSON' },
  ])

  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState('')
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
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
      dataIndex: 'personPhoneNumber',
      title: '账号',
      align: 'center',
      key: 'key',
    },
    {
      dataIndex: 'personName',
      title: '姓名/名称',
      align: 'center',
    },
    {
      dataIndex: 'distributeTypeName',
      title: '类型',
      align: 'center',
    },

    {
      align: 'center',
      dataIndex: 'totalAmountStr',
      title: '账户余额(元)',
    },
    {
      align: 'center',
      dataIndex: 'balanceStr',
      title: '可提现金额(元)',
    },
    {
      align: 'center',
      dataIndex: 'virtualStr',
      title: '待结算金额(元)',
    },
  ])

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //点击改变页数
  useEffect(() => {
    document.getElementById('userAccointinit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  async function onFinish(values) {
    delete values.nowPage
    let news = JSON.stringify(values)

    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['nowPage'] = 1
    } else {
      values['nowPage'] = pageNum
    }

    setloading(true)

    values['rowsPage'] = pageSize
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

    const res = await requestw({
      url: api_channel.getUserAccountListPagingApi(),
      data: {
        ...values,
      },
    })
    if (res && res.code === '0') {
      setaccountData(res.data.data)
      settableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
      settableListTotalNum(0)
    }

    setloading(false)
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item name="distributeType" style={{ width: 220, marginRight: '10px' }}>
                <Select showArrow={true} placeholder="类型" allowClear={true}>
                  {userlist.map((r) => (
                    <Option key={r.value} value={r.value}>
                      {r.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="userName" style={{ width: 220, marginRight: '10px' }}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item name="phoneNumber" style={{ width: 220, marginRight: '10px' }}>
                <Input placeholder="账号" />
              </Form.Item>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                重置
              </Button>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} id="userAccointinit" type="primary" size="middle" htmlType="submit">
                查询
              </Button>
            </div>
          </div>
        </Form>

        <div>
          <Table style={{ margin: '23px  20px' }} rowClassName={useGetRow} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={accountData} />
        </div>
      </div>
    </>
  )
}
export default userAccout
