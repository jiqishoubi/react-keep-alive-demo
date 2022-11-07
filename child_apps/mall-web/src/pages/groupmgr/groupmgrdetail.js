import { Form, Input, Button, Table, message, Modal, Select } from 'antd'

import React, { useEffect, useRef, useState } from 'react'
import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'

import { useGetRow } from '@/hooks/useGetRow'
import {
  getSelectedListPaging,
  // createLearn,
  // updateLearn,
  deleteLearn,
  getLearnGroupList,
  getLearnGroupListPaging,
} from '@/services/groupmgr'
import UploadImg from '@/components/T-Upload2'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'
function datumManage(props) {
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

  const [tradeList, settradeList] = useState([])
  //创建分类
  const [newSupplier, setnewSupplier] = useState(false)
  //删除分类
  const [deleteDatum, setdeleteDatum] = useState(false)

  //编辑分类
  const [alterDatum, setalterDatum] = useState(false)
  //唯一数据
  const [soleDatum, setsoleDatum] = useState({})
  //分类数据
  const [classData, setclassData] = useState([])

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
    // {
    //   dataIndex: 'phoneNumber',
    //   title: '手机号',
    //   align: 'center',
    // },
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
    // {
    //   align: 'center',
    //   title: '状态',
    //   dataIndex: 'learnFileType',
    // },
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
            {/* <a
              onClick={() => {
                alterDatums(e);
              }}
            >
              编辑
            </a>
            &nbsp;&nbsp; */}
            {/* {haveCtrlElementRight('xyzl-del-btn') ? ( */}
            <a
              onClick={() => {
                deleteDatums(e)
              }}
            >
              删除
            </a>
            {/* ) : (
              ''
            )} */}
          </div>
        )
      },
    },
  ]
  //编辑资料
  function alterDatums(e) {
    setsoleDatum(e)
    setalterDatum(true)
    setnewSupplier(true)
    setTimeout(() => {
      form.setFieldsValue({
        ...e,
        groupImg: [e.learnFileUrl],
      })
    }, 0)
  }

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
  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //点击改变页数
  useEffect(() => {
    queryOnFinish()
  }, [])
  //创建文件
  async function creaetonFinish(value) {
    if (!value.groupImg[0].url) {
      let url = value.groupImg[0]
      let type = url.split('.')
      value['learnFileUrl'] = url
      value['learnFileType'] = type[type.length - 1]
    } else {
      let url = value.groupImg[0].url
      let type = url.split('.')
      value['learnFileUrl'] = url
      value['learnFileType'] = type[type.length - 1]
    }

    {
      alterDatum ? (value['learnCode'] = soleDatum.learnCode) : ''
    }
    delete value.groupImg
    let res
    if (alterDatum) {
      res = await updateLearn(value)
    } else {
      res = await createLearn(value)
    }

    if (res && res.code === '0') {
      message.success(res.message)
      setnewSupplier(false)
      queryOnFinish()
    } else {
      message.error(res.message)
    }
  }

  //获取分类列表
  const selectOnChange = async (e) => {
    form.setFieldsValue({
      learnTitle: '',
      learnGroup: '',
    })
    let res = await getLearnGroupList({ learnGroupType: e })
    if (res && res.code === '0') {
      if (res.data === null) {
        setclassData([])
      } else {
        setclassData(res.data)
      }
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
        title={alterDatum ? '编辑资料' : '新增资料'}
        footer={null}
        visible={newSupplier}
        onCancel={() => {
          setnewSupplier(false)
        }}
      >
        <>
          <Form form={form} {...layout} onFinish={creaetonFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Form.Item name="learnType" label="所属客户端" rules={[{ required: true, message: '请选择所属客户端' }]}>
              <Select showArrow={true} placeholder="请选择" allowClear={true} onChange={selectOnChange}>
                <Option key="0" value="MALL">
                  商城端
                </Option>
                <Option key="1" value="DISTRIBUTION">
                  营销端
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="learnTitle" label="资料名称" rules={[{ required: true, message: '资料名称不能为空' }]}>
              <Input placeholder="请输入资料名称" />
            </Form.Item>

            <Form.Item name="learnGroup" label="资料分类" rules={[{ required: true, message: '资料分类不能为空' }]}>
              <Select showArrow={true} placeholder="请选择资料分类" allowClear={true}>
                {classData.map((r) => (
                  <Option key={r.learnGroupCode} value={r.learnGroupCode}>
                    {r.learnGroupName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item rules={[{ required: true, message: '资料不能为空' }]} label="上传资料" name="groupImg">
              <UploadImg length={1} />
            </Form.Item>
            <Form.Item style={{ color: '#6F6F6F' }}>
              <span>*文件格式必须是pdf和视频格式，且不大于10M！</span>
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
        <p>是否确认删除 </p>
        {/* {soleDatum.learnTitle}  */}
      </Modal>
    </div>
  )
}
export default datumManage
