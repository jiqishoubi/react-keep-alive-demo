import { Form, Input, Button, Table, message, Modal, InputNumber } from 'antd'

import React, { useEffect, useRef, useState } from 'react'

import { useGetRow } from '@/hooks/useGetRow'
import { getLearnPatientGroupListPaging, deleteLearnGroup, createLearnGroup, updateLearnGroup } from './services'

function sufferer() {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [form] = Form.useForm()
  //分页
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
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
      dataIndex: 'meansGroupName',
      title: '分类名称',
      align: 'center',
    },
    { dataIndex: 'meansGroupOrder', title: '排序', align: 'center' },
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

  useEffect(() => {
    onFinish()
  }, [])

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

  //确认删除  value['learnGroupCode'] = soleDatum.learnGroup;
  async function deleteDatumTrue() {
    let res = await deleteLearnGroup({
      meansGroupCode: soleDatum.meansGroupCode,
    })
    if (res.code === '0') {
      setdeleteDatum(false)
      message.success(res.message)
      onFinish()
    } else {
      message.error(res.message)
    }
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //表单数据
  function onFinish() {
    pageRef.current = 1
    getTableList()
  }

  const getTableList = async () => {
    setloading(true)
    let values = {}
    values['page'] = pageRef.current
    values['rows'] = pageSizeRef.current
    let res = await getLearnPatientGroupListPaging(values)
    if (res.code === '0') {
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

  //创建类目
  async function creaetonFinish(value) {
    let res
    value['meansGroupType'] = 'PRODUCT_SHARE'
    if (alterDatum) {
      value['meansGroupCode'] = soleDatum.meansGroupCode
      res = await updateLearnGroup(value)
    } else {
      res = await createLearnGroup(value)
    }

    if (res.code === '0') {
      message.success(res.message)
      setnewSupplier(false)
      onFinish()
    } else {
      message.warn(res.message || '失败')
    }
  }

  return (
    <div>
      <div className="headBac">
        <div className="head">
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
        </div>

        <div>
          <Table
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
              // onShowSizeChange:onShowSizeChange
            }}
            loading={loading}
            columns={columns}
            dataSource={tradeList}
          />
        </div>
      </div>

      {newSupplier && (
        <Modal
          title={alterDatum ? '编辑分类' : '新增分类'}
          footer={null}
          visible={newSupplier}
          onCancel={() => {
            setnewSupplier(false)
          }}
        >
          <>
            <Form form={form} {...layout} preserve={false} onFinish={creaetonFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
              <Form.Item name="meansGroupName" label="分类名称" rules={[{ required: true, message: '分类名称不能为空' }]}>
                <Input placeholder="请输入分类名称" />
              </Form.Item>
              <Form.Item name="meansGroupOrder" label="排序" rules={[{ required: true, message: '请输入排序' }]}>
                <InputNumber placeholder="请输入排序" style={{ width: '100%' }} />
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
      )}

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

export default sufferer
