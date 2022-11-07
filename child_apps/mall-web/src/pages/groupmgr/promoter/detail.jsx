import { Form, Input, Button, Table, message, Modal, Select } from 'antd'

import React, { useEffect, useRef, useState } from 'react'
import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'

import { useGetRow } from '@/hooks/useGetRow'
import { getSelectedListPaging, deleteLearn } from './service'

function Detail(props) {
  const [queryForm] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  //分页
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)

  //table loding 展示
  const [loading, setloading] = useState(false)
  const [tradeList, settradeList] = useState([])
  //删除分类
  const [deleteDatum, setdeleteDatum] = useState(false)
  //唯一数据
  const [soleDatum, setsoleDatum] = useState({})

  const columns = [
    {
      dataIndex: 'phoneNumber',
      title: '账号',
      align: 'center',
    },
    {
      dataIndex: 'personName',
      title: '姓名/名称',
      align: 'center',
    },
    {
      dataIndex: 'distributeLevelName',
      title: '合伙人类型',
      align: 'center',
    },

    // {
    //     align: 'center',
    //     title: '所属推广人',
    //     dataIndex: 'developPersonName',
    // },
    // {
    //     align: 'center',
    //     title: '上级合伙人',
    //     dataIndex: 'parentPersonName',
    // },
    {
      align: 'center',
      title: '加入时间',
      dataIndex: 'createDateStr',
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            <a
              onClick={() => {
                deleteDatums(e)
              }}
            >
              删除
            </a>
          </div>
        )
      },
    },
  ]

  //deleteDatum
  function deleteDatums(e) {
    setsoleDatum(e)
    setdeleteDatum(true)
  }
  //确认删除
  async function deleteDatumTrue() {
    let res = await deleteLearn({
      groupCode: soleDatum.groupCode,
      id: soleDatum.id,
    })
    if (res && res.code === '0') {
      setdeleteDatum(false)
      message.success(res.message ? res.message : '操作成功')
      queryOnFinish()
    } else {
      message.error(res.message ? res.message : '操作失败')
    }
  }

  //点击改变页数
  useEffect(() => {
    queryOnFinish()
  }, [])

  //重置一下
  function resetSearch() {
    queryForm.resetFields()
  }

  const queryOnFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setloading(true)

    let values = queryForm.getFieldsValue()
    let postData = {
      page: pageRef.current,
      rows: pageSizeRef.current,
      ...values,
      groupCode: props.location.query.groupCode,
    }
    let res = await getSelectedListPaging(postData)
    if (res && res.code === '0') {
      settradeList(res.data.data)
      settableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setloading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  return (
    <div>
      <div className="headBac">
        <Form form={queryForm} onFinish={queryOnFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item style={{ marginRight: 10 }} name="distributeName">
                <Input placeholder="请输入推广人名称" />
              </Form.Item>
              <Form.Item style={{ marginRight: 10 }} name="distributePhoneNumber">
                <Input placeholder="请输入推广人手机号" />
              </Form.Item>

              <>
                <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: 8, marginRight: 10 }} id="orderProfitinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
              </>
            </div>
          </div>
        </Form>
        <div>
          <Table
            rowKey="id"
            rowClassName={useGetRow}
            style={{ margin: '23px  20px' }}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              current: pageRef.current,
              pageSize: pageSizeRef.current,
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

      <Modal
        centered={true}
        visible={deleteDatum}
        title="提示信息"
        cancelText="取消"
        okText="确定"
        onOk={deleteDatumTrue}
        onCancel={() => {
          setdeleteDatum(false)
        }}
      >
        <p>是否确认删除 </p>
        {/* {soleDatum.learnTitle}  */}
      </Modal>
    </div>
  )
}
export default Detail
