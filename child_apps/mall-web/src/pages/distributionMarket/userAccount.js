import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Select, Space, Table, Row, Col } from 'antd'
import { CaretDownOutlined, RedoOutlined } from '@ant-design/icons'
import FetchSelect from '@/components/FetchSelect'
import TotalAccount from './components/TotalAccount'
import { useGetRow } from '@/hooks/useGetRow'
import { useRequest } from 'ahooks'
import { getOrgKind } from '@/utils/utils'
import { getUserAccountListPaging, getUserAccountTotalAjax } from '@/services/channel'
import api_channel from '@/services/api/channel'

const { Option } = Select

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

  /**
   * 请求
   */
  const {
    data: totalAccount,
    loading: loading_totalAccount,
    run: getTotalAccount,
  } = useRequest(getUserAccountTotalAjax, {
    manual: false,
    initialData: {
      BALANCE_TOTAL: '00.00',
      VIRTUAL_TOTAL: '00.00',
      WITHDRAWAL_TOTAL: '00.00',
    },
    formatResult: (res) => {
      if (res && res.code == '0' && res.data) {
        return res.data
      }
    },
  })

  const [columns] = useState([
    {
      dataIndex: 'personPhoneNumber',
      title: '账号',
      align: 'center',
      key: 'personPhoneNumber',
    },
    {
      dataIndex: 'personName',
      title: '姓名/名称',
      align: 'center',
      key: 'personName',
    },
    {
      dataIndex: 'distributeTypeName',
      title: '类型',
      align: 'center',
      key: 'distributeTypeName',
    },
    {
      align: 'center',
      title: '可提现金额(元)',
      key: 'balanceStr',
      dataIndex: 'balanceStr',
    },
    {
      align: 'center',
      title: '不可提现金额(元)',
      key: 'virtualStr',
      dataIndex: 'virtualStr',
    },
    {
      align: 'center',
      title: '已提现金额(元)',
      key: 'withdrawalStr',
      dataIndex: 'withdrawalStr',
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

    getTotalAccount(values)
    const res = await getUserAccountListPaging(values)
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
              {getOrgKind().isAdmin && (
                <Form.Item name="orgCode">
                  <FetchSelect
                    placeholder="推广公司"
                    api={api_channel.queryPromotionCompanyList}
                    valueKey="orgCode"
                    textKey="orgName"
                    //搜索
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    style={{ width: 220, marginRight: 10 }}
                  />
                </Form.Item>
              )}
              <Form.Item name="distributeType">
                <Select showArrow={true} placeholder="类型" allowClear={true} style={{ width: 220, marginRight: 10 }}>
                  {userlist.map((r) => (
                    <Option key={r.value} value={r.value}>
                      {r.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="userName">
                <Input placeholder="请输入姓名" style={{ width: 220, marginRight: 10 }} />
              </Form.Item>
              <Form.Item name="phoneNumber">
                <Input placeholder="账号" style={{ width: 220, marginRight: 10 }} />
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

        <TotalAccount
          items={[
            { title: '未入账金额（元）', value: totalAccount.VIRTUAL_TOTAL },
            { title: '可提现金额（元）', value: totalAccount.BALANCE_TOTAL },
            { title: '已提现金额（元）', value: totalAccount.WITHDRAWAL_TOTAL },
          ]}
          style={{ margin: '0 20px' }}
        />

        <div>
          <Table style={{ margin: '23px  20px' }} rowClassName={useGetRow} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={accountData} />
        </div>
      </div>
    </>
  )
}
export default userAccout
