import { useEffect, useRef, useState } from 'react'
import { getFirstGroupList, createGroup, updateGroupStatus, deleteGroup, updateGroup } from '../services/goods'
import { Button, message, Form, Input, Table, Modal, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import UploadImg from '@/components/T-Upload2'
import './goodsClass_localName.less'
import { useGetRow } from '@/hooks/useGetRow'
import React from 'react'
import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'

function goodsClass() {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8 },
  }
  const tailLayout = {
    wrapperCol: { offset: 6, span: 16 },
  }

  const { TextArea } = Input
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(5)

  //单个类目数据（部分一二级）
  const [GroupData, setGroupData] = useState([])
  //控制头部展示
  const [foot, setfoot] = useState(true)
  //是否展示新增
  const [newsist, setnewsist] = useState(false)
  //修改
  const [revamp, setrevamp] = useState(false)
  //table数据
  const [tradeList, settradeList] = useState([])
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table loding 展示
  const [loading, setloading] = useState(false)
  //删除弹窗
  const [deleteshow, setdeleteshow] = useState(false)

  const columns = [
    {
      dataIndex: 'groupName',
      title: '分类名称',
      align: 'center',
      width: '120px',
    },
    {
      title: '二级分类数量',
      align: 'center',
      render: (e) => {
        return <>{e.children ? <span>{e.children.length}</span> : ''}</>
      },
    },
    {
      dataIndex: 'disabled',
      title: '状态',
      align: 'center',
      render: (e) => {
        return <>{e === 0 ? <span>未禁用</span> : <span>已禁用</span>}</>
      },
    },
    {
      dataIndex: 'groupOrder',
      title: '排序',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',

      render: (e) => {
        return (
          <>
            {!e.parentGroup && (
              <a
                onClick={() => {
                  setGroupData(e), setnewsist(true), setfoot(false)
                }}
              >
                新增
              </a>
            )}
            &nbsp;&nbsp;
            <a
              onClick={() => {
                revamps(e)
              }}
            >
              编辑
            </a>
            &nbsp;&nbsp;
            {e.disabled === 0 ? (
              <a
                onClick={() => {
                  updateGroupStatus_(e)
                }}
              >
                禁用
              </a>
            ) : (
              <a
                onClick={() => {
                  noupdateGroupStatus_(e)
                }}
              >
                解禁
              </a>
            )}
            &nbsp;&nbsp;
            <a
              onClick={() => {
                ondeletesshow(e)
              }}
            >
              删除
            </a>
            &nbsp;&nbsp;
          </>
        )
      },
    },
  ]
  if (haveCtrlElementRight('splm-czqx-btn')) {
    columns.push()
  }

  //查询一级类目
  async function getFirstGroupList_() {
    let queryValues = queryForm.getFieldsValue()
    let values = {
      page: pageRef.current,
      rows: pageSizeRef.current,
      ...queryValues,
    }
    setloading(true)
    let res = await getFirstGroupList(values)

    if (res && res.code !== '0') {
      message.error(res.message)
    } else {
      settradeList(res.data.data)
      settableListTotalNum(res.data.rowTop)
    }
    setloading(false)
  }

  //删除弹窗
  const ondeletesshow = (e) => {
    setGroupData(e)
    setdeleteshow(true)
  }

  //删除该类目
  async function deleteGroup_(e) {
    let res = await deleteGroup({ groupCode: GroupData.groupCode })
    if (res && res.code === '0') {
      message.success('删除成功')

      getFirstGroupList_()
      // getGroupCount_();
      setdeleteshow(false)
    } else {
      message.error(res.message)
    }
  }

  //禁用该类目
  async function updateGroupStatus_(e) {
    setGroupData(e)
    let values = {
      disabled: 1,
      groupCode: e.groupCode,
    }

    let res = await updateGroupStatus(values)

    if (res && res.code === '0') {
      message.success('禁用成功')
      getFirstGroupList_()
      // getGroupCount_();
    } else {
      message.error(res.message)
    }
  }
  //解禁该类目
  async function noupdateGroupStatus_(e) {
    setGroupData(e)
    let values = {
      disabled: 0,
      groupCode: e.groupCode,
    }

    let res = await updateGroupStatus(values)

    if (res && res.code === '0') {
      message.success('解禁成功')
      getFirstGroupList_()
      // getGroupCount_();
    } else {
      message.error(res.message)
    }
  }
  //数据初始化
  useEffect(() => {
    getTableList()
    setGroupData()
  }, [])

  //获取二级类目
  // useEffect(() => {
  //   getSecondGroupLists_();
  // }, [groupCode]);

  //修改按钮
  function revamps(e) {
    setGroupData(e)
    setrevamp(true)
    setTimeout(() => {
      form.setFieldsValue({
        ...e,
      })
    }, 0)

    setfoot(false)

    setnewsist(false)
  }
  //新建单数据
  async function onFinish(values) {
    if (GroupData) {
      values['parentGroup'] = GroupData.groupCode
    }

    let res = await createGroup(values)
    if (res && res.code === '0') {
      message.success('新增成功')
      setnewsist(false)
      getFirstGroupList_()
      setfoot(true)
    } else {
      message.error(res.message)
    }
  }

  //修改表单数据
  async function newonFinish(values) {
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }
    values['groupCode'] = GroupData.groupCode

    let res = await updateGroup(values)
    if (res && res.code === '0') {
      message.success('修改成功')
      setrevamp(false)
      getFirstGroupList_()
      setfoot(true)
    } else {
      message.error(res.message)
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
    getFirstGroupList_()
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  const groupName = (value) => {
    let name = ''
    tradeList.map((r) => {
      if (r.parentGroup === value) {
        name = r.groupName
      }
    })
    return name
  }

  return (
    <div>
      {revamp ? (
        <Form {...layout} name="basic" form={form} onFinish={newonFinish}>
          <div className="fontMb">
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">基本信息</div>
            </Form.Item>

            {GroupData ? GroupData.parentGroup ? <Form.Item label="上级类目">{groupName(GroupData.parentGroup)}</Form.Item> : '' : ''}

            <Form.Item label="类目层级">
              <div>{GroupData ? (GroupData.parentGroup ? '二级类目' : '一级类目') : ''}</div>
            </Form.Item>

            <Form.Item label="类目名称" name="groupName">
              <Input wrapperCol={{ span: 20 }} />
            </Form.Item>

            <Form.Item label="类目排序" wrapperCol={{ span: 8 }} name="groupOrder">
              <InputNumber style={{ width: '100%' }} precision={0} />
            </Form.Item>
            <Form.Item name="remark" label="备注">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                style={{ borderRadius: '4px', width: 120, marginBottom: 100 }}
                onClick={() => {
                  form.resetFields()
                  setfoot(true), setrevamp(false)
                }}
              >
                返回
              </Button>
              <Button
                style={{
                  borderRadius: '4px',
                  marginLeft: 60,
                  marginTop: 40,
                  width: 120,
                }}
                type="primary"
                htmlType="submit"
              >
                确定
              </Button>
            </Form.Item>
          </div>
        </Form>
      ) : (
        ''
      )}

      {/*编辑类目*/}
      {newsist ? (
        <Form {...layout} name="basic" onFinish={onFinish}>
          <div className="fontMb">
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">新增分类</div>
            </Form.Item>
            {GroupData ? (
              <Form.Item label="上级类目" name="parentGroup">
                {GroupData ? <div>{GroupData.groupName ? GroupData.groupName : 'SAAS商城'}</div> : ''}
              </Form.Item>
            ) : (
              ''
            )}

            <Form.Item label="类目层级">
              <div>{GroupData ? <div>{GroupData.parentGroup ? '' : '二级类目'}</div> : '一级类目'}</div>
            </Form.Item>

            <Form.Item label="类目名称" name="groupName" rules={[{ required: true, message: '类目名称不能为空' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="排序" wrapperCol={{ span: 8 }} rules={[{ required: true, message: '类目排序不能为空' }]} name="groupOrder">
              <InputNumber style={{ width: '100%' }} precision={0} />
            </Form.Item>
            <Form.Item name="remark" label="备注">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                style={{
                  borderRadius: '4px',
                  width: 120,
                  marginBottom: '100px',
                }}
                onClick={() => {
                  setfoot(true), setnewsist(false)
                }}
              >
                返回
              </Button>
              <Button
                style={{
                  borderRadius: '4px',
                  marginLeft: 60,
                  marginTop: 40,
                  width: 120,
                }}
                type="primary"
                htmlType="submit"
              >
                确定
              </Button>
            </Form.Item>
          </div>
        </Form>
      ) : (
        ''
      )}

      {/*//首页内容*/}

      {foot && (
        <div style={{ margin: '30px 20px', background: '#FEFFFE' }}>
          <Form form={queryForm} onFinish={queryOnFinish}>
            <div className="head">
              <div className="flexjss">
                {getOrgKind().isAdmin && (
                  <>
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
                    <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                      重置
                    </Button>
                    <Button style={{ borderRadius: 8, marginRight: 10 }} id="orderProfitinit" type="primary" size="middle" htmlType="submit">
                      查询
                    </Button>
                  </>
                )}
                <Button
                  style={{ borderRadius: '4px' }}
                  type="primary"
                  onClick={() => {
                    setGroupData(), setnewsist(true), setfoot(false)
                  }}
                >
                  <PlusOutlined />
                  新增类目
                </Button>
              </div>
            </div>
          </Form>

          <Table
            loading={loading}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              current: pageRef.current,
              pageSize: pageSizeRef.current,
              total: tableListTotalNum,
              showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
              onChange: onPageChange,
            }}
            rowClassName={useGetRow}
            style={{ margin: '20px  20px' }}
            columns={columns}
            dataSource={tradeList}
          />
        </div>
      )}

      <Modal centered={true} title="提示" visible={deleteshow} onCancel={() => setdeleteshow(false)} onOk={deleteGroup_} cancelText="取消" okText="确定">
        <p>是否确认删除该分类</p>
      </Modal>
    </div>
  )
}
export default goodsClass
