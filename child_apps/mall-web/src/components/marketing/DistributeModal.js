import { Button, Form, Input, message, Modal, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getuserListPaging } from '@/services/marketing'
import { useGetRow } from '@/hooks/useGetRow'

function distribute(props) {
  //派发人的展示

  //sdistributeable数据
  const [distributeData, setdistributeData] = useState([])
  //distribute选择数据
  const [olddistributeData, setolddistributeData] = useState([])
  //distributeloaading
  const [distributeLoading, setdistributeLoading] = useState(false)
  //distribute上次values
  const [olddistributevalues, setolddistributevalues] = useState([])
  //distribute数据总量
  const [distributeableListTotalNum, setdistributetableListTotalNum] = useState(0)
  const [distributepageNum, setdistributepageNum] = useState(0)
  //中转站code
  const [oldscopeCode, setoldscopeCode] = useState([])
  //中转站name
  const [oldscopeName, setoldscopeName] = useState([])
  //多选项目
  const [scopeCode, setscopeCode] = useState()
  //distribute发放人
  const distributepaginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: distributeableListTotalNum,
    pageSizeOptions: ['5'],
    defaultPageSize: 5,
    current: distributepageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  useEffect(() => {
    distributeOnFinish({})
  }, [])

  useEffect(() => {
    props.distributeDatas(scopeCode, olddistributeData)
  }, [olddistributeData])

  const [distributeColumns] = useState([
    // {
    //   align: 'center',
    //   title: '选择',
    //   render: e => {
    //     return (
    //       <div>
    //         <Checkbox
    //           onChange={() => {
    //             distributeOnChang(e);
    //           }}
    //         ></Checkbox>
    //       </div>
    //     );
    //   },
    // },
    {
      dataIndex: 'userName',
      title: '名称',
      align: 'center',
    },
    {
      dataIndex: 'phoneNumber',
      title: '手机号',
      align: 'center',
    },
  ])
  //发放人查询
  //发放人分页
  function distributeChange(e) {
    let values = olddistributevalues
    values['page'] = e.current
    setdistributepageNum(e.current)

    distributeOnFinish(values)
  }
  //发放人查询
  async function distributeOnFinish(values) {
    setdistributeLoading(true)
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }

    let page
    if (values && values.page) {
      page = values.page
      delete values.page
    }

    let news = JSON.stringify(values)
    let old = JSON.stringify(olddistributevalues)
    if (news !== old) {
      setolddistributevalues(values)
      values['page'] = 1
      setdistributepageNum(1)
    } else {
      values['page'] = page
    }

    values['rows'] = 5

    let res = await getuserListPaging(values)
    if (res && res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].userCode
        }
        setdistributeData(len)
      }

      setdistributetableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setdistributeLoading(false)
  }
  //发放人选择
  const distributeRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let data = oldscopeCode
      let dataname = []
      for (let i = 0; i < selectedRows.length; i++) {
        dataname.push(selectedRows[i].phoneNumber)
      }
      //传递出去的name
      let codeName = oldscopeName
      codeName[distributepageNum] = dataname

      setoldscopeName(codeName)
      let x = codeName.reduce((a, b) => a.concat(b), [])
      setolddistributeData(x)
      ///传递出去的code
      data[distributepageNum] = selectedRowKeys
      setoldscopeCode(data)
      let y = data.reduce((a, b) => a.concat(b), [])

      setscopeCode(y)
    },
    selectedRowKeys: scopeCode,
  }

  return (
    <>
      <Form onFinish={distributeOnFinish}>
        <div>
          <Space>
            <Form.Item name="phoneNumber" style={{ width: 210 }}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item name="userName" style={{ width: 210 }}>
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Space>
          <Button style={{ marginLeft: '10px', borderRadius: '4px' }} type="primary" size="middle" htmlType="submit">
            查询
          </Button>
        </div>
      </Form>
      <div className="positionre">
        <Table
          rowClassName={useGetRow}
          rowSelection={{
            type: 'checkbox',
            ...distributeRowSelection,
          }}
          onChange={distributeChange}
          pagination={distributepaginationProps}
          loading={distributeLoading}
          columns={distributeColumns}
          dataSource={distributeData}
        />
      </div>
    </>
  )
}
export default distribute
