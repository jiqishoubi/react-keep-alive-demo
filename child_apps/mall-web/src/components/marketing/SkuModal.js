import { Button, Form, Input, message, Modal, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getSkuList } from '@/services/marketing'
import { useGetRow } from '@/hooks/useGetRow'

function sku(props) {
  //sku选择数据

  //skuTable数据
  const [skuData, setskuData] = useState([])

  //多选项目
  const [scopeCode, setscopeCode] = useState()
  //sku选择数据
  const [oldskuData, setoldskuData] = useState([])
  //skuloaading
  const [skuLoading, setskuLoading] = useState(false)
  //skus上次values
  const [oldskuvalues, setoldskuvalues] = useState([])
  //sku数据总量
  const [skutableListTotalNum, setskutableListTotalNum] = useState(0)
  //中转站code
  const [oldscopeCode, setoldscopeCode] = useState([])
  const [skupageNum, setskupageNum] = useState(0)
  const skupaginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: skutableListTotalNum,
    pageSizeOptions: ['5'],
    defaultPageSize: 5,
    current: skupageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const [skuColumns] = useState([
    // {
    //   align: 'center',
    //   title: '选择',
    //   render: e => {
    //     return (
    //       <div>
    //         <Checkbox
    //           onChange={() => {
    //             skuOnChang(e);
    //           }}
    //         ></Checkbox>
    //       </div>
    //     );
    //   },
    // },
    {
      dataIndex: 'skuCode',
      title: 'SKU编号',
      align: 'center',
    },
    {
      dataIndex: 'skuName',
      title: 'SKU名称',
      align: 'center',
    },
  ])
  //sku查询
  //sku分页
  function skuPageChange(e) {
    let values = oldskuvalues
    setskupageNum(e.current)

    values['page'] = e.current
    skuOnFinish(values)
  }
  //sku查询
  async function skuOnFinish(values) {
    setskuLoading(true)
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
    setoldskuvalues
    let news = JSON.stringify(values)
    let old = JSON.stringify(oldskuvalues)
    if (news !== old) {
      setoldskuvalues(values)
      values['page'] = 1
      setskupageNum(1)
    } else {
      values['page'] = page
    }

    values['rows'] = 5

    let res = await getSkuList(values)
    if (res && res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].skuCode
        }
        setskuData(len)
      }

      setskutableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setskuLoading(false)
  }
  //初始化
  useEffect(() => {
    skuOnFinish({})
  }, [])

  useEffect(() => {
    props.skuDatas(scopeCode, oldskuData)
  }, [oldskuData])

  //sku选择

  const skugoryRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let data = oldscopeCode
      data[skupageNum] = selectedRowKeys
      setoldscopeCode(data)
      let y = data.reduce((a, b) => a.concat(b), [])

      setscopeCode(y)
      setoldskuData(y)
    },
  }

  return (
    <>
      <Form onFinish={skuOnFinish}>
        <div>
          <Space>
            <Form.Item name="skuName" style={{ width: 210 }}>
              <Input placeholder="请输入SKU名称" />
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
            ...skugoryRowSelection,
          }}
          onChange={skuPageChange}
          pagination={skupaginationProps}
          loading={skuLoading}
          columns={skuColumns}
          dataSource={skuData}
        />
      </div>
    </>
  )
}
export default sku
