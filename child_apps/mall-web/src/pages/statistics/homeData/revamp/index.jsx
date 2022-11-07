import { Form, Input, Button, Table, message, Modal, Select } from 'antd'

import React, { useEffect, useRef, useState } from 'react'
import { useGetRow } from '@/hooks/useGetRow'
import { getSelectedListPaging, deleteLearn, updateGroupTemplateData } from '../service'
import requestw from '@/utils/requestw'

function datumManage(props) {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const { Option } = Select

  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table loding 展示
  const [loading, setloading] = useState(false)

  const [tradeList, settradeList] = useState([])
  //创建分类
  const [newSupplier, setnewSupplier] = useState(false)
  const [optionArr, setOptionArr] = useState([])
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
      dataIndex: 'groupName',
      title: '分组',
      align: 'center',
    },

    {
      dataIndex: 'distributeLevelName',
      title: '合伙人类型',
      align: 'center',
    },

    {
      align: 'center',
      title: '所属推广人',
      dataIndex: 'developPersonName',
    },

    {
      align: 'center',
      title: '上级合伙人',
      dataIndex: 'parentPersonName',
    },
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
              移除
            </a>
          </div>
        )
      },
    },
  ]

  //获取样板
  const getOptions = async () => {
    const res = await requestw({
      url: '/web/staff/uiTemplateData/getList',
      data: {
        page: 1,
        rows: 200,
      },
    })
    let arr = []
    if (res && res.code === '0' && res.data) {
      arr = res.data
    }
    // }
    setOptionArr(arr)
  }

  //deleteDatum
  function deleteDatums(e) {
    Modal.confirm({
      title: '是否确认移除',
      onCancel: () => {},
      onOk: async () => {
        let res = await deleteLearn({ groupCode: e.groupCode, id: e.id })
        if (res && res.code === '0') {
          message.success(res.message ? res.message : '操作成功')
          queryOnFinish()
        } else {
          message.error(res.message ? res.message : '操作失败')
        }
      },
    })
  }

  //初始数据
  useEffect(() => {
    queryOnFinish()
    getOptions()
  }, [])

  //更新样板
  async function creaetonFinish() {
    let oldTemplateDataId = props.location.query.id
    let values = form.getFieldsValue()
    values['oldTemplateDataId'] = oldTemplateDataId
    let res = await updateGroupTemplateData(values)
    if (res && res.code === '0') {
      message.success(res.message || '成功')
      setnewSupplier(false)
      queryOnFinish()
    } else {
      message.success(res.message || '失败')
    }
  }

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
      templateDataId: props.location.query.id,
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
                <Input placeholder="请输入合伙人名称" />
              </Form.Item>
              <Form.Item style={{ marginRight: 10 }} name="distributePhoneNumber">
                <Input placeholder="请输入合伙人手机号" />
              </Form.Item>
              <>
                <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: 8, marginRight: 10 }} id="orderProfitinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
              </>

              <Button
                style={{ borderRadius: '4px' }}
                onClick={() => {
                  setnewSupplier(true)
                  resetSearch()
                }}
                type="primary"
                size="middle"
              >
                选择模板
              </Button>
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
        title="请选择要更换的样板"
        visible={newSupplier}
        onCancel={() => {
          setnewSupplier(false)
        }}
        onOk={() => creaetonFinish()}
        width={400}
        height={400}
      >
        <>
          <Form form={form} {...layout} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Form.Item label="样板" name="templateDataId" rules={[{ required: true, message: '请选择样板' }]}>
              <Select placeholder="请选择">
                {optionArr &&
                  optionArr.map((obj, ind) => (
                    <Option key={ind} value={obj.id}>
                      {obj.templateDataName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </div>
  )
}

export default datumManage
