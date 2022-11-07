import { Form, DatePicker, Input, Space, Button, Table, message, Modal, Select } from 'antd'

import React, { useEffect, useRef, useState } from 'react'
import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'

import { useGetRow } from '@/hooks/useGetRow'
import { getLearnGroupListPaging, deleteLearnGroup, createLearnGroup, updateLearnGroup } from '@/services/datum'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'
import { PlusOutlined } from '@ant-design/icons'

function datum() {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
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
  //删除分类
  const [deleteDatum, setdeleteDatum] = useState(false)
  //编辑分类
  const [alterDatum, setalterDatum] = useState(false)
  //唯一数据
  const [soleDatum, setsoleDatum] = useState(false)

  const columns = [
    {
      dataIndex: 'learnGroupTypeName',
      title: '所属客户端',
      align: 'center',
    },
    // { dataIndex: 'learnGroupCode', title: '编号', align: 'center' },
    {
      dataIndex: 'learnGroupName',
      title: '分类名称',
      align: 'center',
    },
    {
      dataIndex: 'orgName',
      title: '推广公司',
      align: 'center',
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            <a
              onClick={() => {
                alterDatums(e)
              }}
            >
              编辑
            </a>
            &nbsp;&nbsp;
            {haveCtrlElementRight('zlfl-del-btn') ? (
              <a
                onClick={() => {
                  deleteDatums(e)
                }}
              >
                删除
              </a>
            ) : (
              ''
            )}
          </div>
        )
      },
    },
  ]

  //编辑
  function alterDatums(e) {
    form.setFieldsValue(e)
    setnewSupplier(true)
    setsoleDatum(e)
    setalterDatum(true)
  }

  //deleteDatum
  function deleteDatums(e) {
    setsoleDatum(e)
    setdeleteDatum(true)
  }

  //确认删除
  async function deleteDatumTrue() {
    let res = await deleteLearnGroup({
      learnGroupCode: soleDatum.learnGroupCode,
    })
    if (res && res.code === '0') {
      setdeleteDatum(false)
      message.success(res.message)
      queryOnFinish()
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
    queryOnFinish()
  }, [])

  //创建类目
  async function creaetonFinish(value) {
    let res
    if (alterDatum) {
      value['learnGroupCode'] = soleDatum.learnGroupCode
      res = await updateLearnGroup(value)
    } else {
      res = await createLearnGroup(value)
    }

    if (res && res.code === '0') {
      message.success(res.message)
      setnewSupplier(false)
      queryOnFinish()
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
    }

    let res = await getLearnGroupListPaging(postData)
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
              {getOrgKind().isAdmin && (
                <Form.Item name="orgCode" style={{ width: 220, marginRight: '10px' }}>
                  <FetchSelect
                    placeholder="推广公司"
                    api={api_channel.queryPromotionCompanyList}
                    valueKey="orgCode"
                    textKey="orgName"
                    //搜索
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  />
                </Form.Item>
              )}
              {getOrgKind().isAdmin && (
                <>
                  <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                    重置
                  </Button>
                  <Button style={{ borderRadius: 8, marginRight: 10 }} id="orderProfitinit" type="primary" size="middle" htmlType="submit">
                    查询
                  </Button>
                </>
              )}

              {!getOrgKind().isAdmin && (
                <Button
                  style={{ borderRadius: '4px' }}
                  onClick={() => {
                    setnewSupplier(true)
                    setalterDatum(false)
                    resetSearch()
                  }}
                  type="primary"
                  size="middle"
                >
                  新建分类
                </Button>
              )}
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
        title={alterDatum ? '编辑分类' : '新增分类'}
        footer={null}
        visible={newSupplier}
        onCancel={() => {
          setnewSupplier(false)
        }}
      >
        <>
          <Form form={form} {...layout} onFinish={creaetonFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Form.Item name="learnGroupType" label="所属客户端" rules={[{ required: true, message: '请选择所属客户端' }]}>
              <Select showArrow={true} placeholder="请选择" allowClear={true}>
                <Option key="0" value="MALL">
                  商城端
                </Option>
                <Option key="1" value="DISTRIBUTION">
                  分销端
                </Option>
              </Select>
            </Form.Item>

            <Form.Item name="learnGroupName" label="分类名称" rules={[{ required: true, message: '分类名称不能为空' }]}>
              <Input placeholder="请输入分类名称" />
            </Form.Item>

            <Form.Item {...tailLayout} style={{ marginTop: 40 }}>
              <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 88 }}
                onClick={() => {
                  setnewSupplier(false)
                }}
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

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
        <p>是否确认删除分类</p>
      </Modal>
    </div>
  )
}

export default datum
