import { Form, Radio, Input, Select, Space, Button, message, Checkbox, Table, Modal } from 'antd'

import React, { useEffect, useState } from 'react'
import { CaretDownOutlined, RedoOutlined } from '@ant-design/icons'

import ClientNew from '@/components/Client/ClientManageNew'
import { getMemberListPaging, getdeleteMember } from '@/services/client'
import { useGetRow } from '@/hooks/useGetRow'

function clientManage() {
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

  //主页面是否展示
  const [init, setinit] = useState(true)

  //删除是否展示
  const [deleteshow, setdeleteshow] = useState(false)
  //删除是否展示
  const [deleteTD, setdeleteID] = useState()
  //展示ID

  const [personCodeTD, setpersonCodeID] = useState()
  //新增名单展示
  const [newClient, setnewClient] = useState(false)
  //Table数据
  const [tradeList, settradeList] = useState(false)

  //修改展示
  // const [revamp, setrevamp] = useState(true);

  //身份类型
  const optionss = [
    { label: '员工', value: 'STAFF' },
    { label: 'PLUS会员', value: 'PRIVATE_MEMBER' },
  ]

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
      dataIndex: 'personCode',
      title: '客户ID',
      align: 'center',
    },
    {
      dataIndex: 'memberTypeName',
      title: '身份类型',
      align: 'center',
    },
    {
      dataIndex: 'weiXinName',
      title: '姓名/名称',
      align: 'center',
    },
    {
      align: 'center',
      title: '添加时间',
      dataIndex: 'createDateStr',
    },
    {
      align: 'center',

      title: '有效期',
      render: (e) => {
        return (
          <div>
            {e && e.memberTypeName && e.memberTypeName === '内部员工' ? (
              '长期'
            ) : (
              <div>
                <span>{e.effectDateStr}</span>
                <span>至</span> <span>{e.expireDateStr}</span>
              </div>
            )}
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
            <a style={{ cursor: 'pointer' }} onClick={() => removerClient(e)}>
              删除
            </a>
          </div>
        )
      },
    },
  ])

  //删除
  function removerClient(e) {
    let removerID = e.id
    setdeleteID(removerID)
    setpersonCodeID(e.personCode)
    setdeleteshow(true)
  }
  //确认删除
  async function removerClientID(e) {
    let ID = { id: e }
    let res = await getdeleteMember(ID)
    if (res && res.code === '0') {
      message.success('删除成功')
      setdeleteshow(false)
      onFinish({})
    } else {
      message.error('删除失败')
    }
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //点击改变页数
  useEffect(() => {
    document.getElementById('clientManageinit').click()
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

    let res = await getMemberListPaging(values)
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

  function onChangeNew(e) {
    if (e === '0') {
      setnewClient(false)
      setinit(true)
      document.getElementById('clientManageinit').click()
    } else {
      setnewClient(false)
      setinit(true)
    }
  }
  // function onChangeRevamp() {
  //   setrevamp(false);
  //   setnewClient(false);
  //   setinit(true);
  // }
  return (
    <div>
      {init ? (
        <div className="headBac">
          <Form form={form} name="basic" onFinish={onFinish}>
            <div className="head">
              <div className="flexjss">
                <Form.Item name="personCode" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="客户ID" />
                </Form.Item>

                <Form.Item name="weiXinName" style={{ width: 220, marginRight: '10px' }}>
                  <Input placeholder="姓名/名称" />
                </Form.Item>

                <Form.Item name="memberType" style={{ width: 220, marginRight: '10px' }}>
                  <Select showArrow={true} placeholder="身份类型" allowClear={true}>
                    <Option value="STAFF">员工</Option>
                    <Option value="PRIVATE_MEMBER">PLUS会员</Option>
                  </Select>
                </Form.Item>
              </div>

              <Space>
                <Button
                  style={{ borderRadius: '4px' }}
                  onClick={() => {
                    setinit(false), setnewClient(true)
                  }}
                  type="primary"
                  size="middle"
                >
                  新增名单
                </Button>
                <Button id="clientManageinit" type="primary" style={{ borderRadius: '4px' }} size="middle" htmlType="submit">
                  查询
                </Button>
                <Button style={{ borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>
              </Space>
            </div>
          </Form>
          <div>
            <Table rowClassName={useGetRow} style={{ margin: '23px 20px' }} pagination={paginationProps} onChange={pageChange} loading={loading} columns={columns} dataSource={tradeList} />
            {/*<div>{tableListTotalNum ? <p className="allNums_">共{tableListTotalNum}条</p> : ''}</div>*/}
          </div>
        </div>
      ) : (
        ''
      )}

      {/*//新增类型*/}
      {newClient ? <ClientNew onChangeNew={onChangeNew} /> : ''}
      {/*//修改类型*/}
      {/*{revamp ? <ClientManageRevamp options={options} onChangeRevamp={onChangeRevamp} /> : ''}*/}

      <Modal
        centered={true}
        title="提示"
        visible={deleteshow}
        onCancel={() => setdeleteshow(false)}
        onOk={() => {
          removerClientID(deleteTD)
        }}
        cancelText="取消"
        okText="确定"
      >
        <p>
          是否确认删除客户
          <span style={{ color: 'red', fontSize: '19px' }}>{personCodeTD}</span>
          的该条记录？
        </p>
      </Modal>
    </div>
  )
}
export default clientManage
