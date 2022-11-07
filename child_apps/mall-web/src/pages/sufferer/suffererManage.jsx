import { Form, Input, Button, Table, message, Modal, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { haveCtrlElementRight } from '@/utils/utils'
import { useGetRow } from '@/hooks/useGetRow'
import { getLearnListPagingPatient, createLearnPatient, updateLearnPatient, deleteLearnPatient, getSoftTextList, getLearnGroupList, getSoftTextPaging } from './services'
import BUpload from '@/components/BUpload'
import api_common from '@/services/api/common'

function suffererManage() {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [form] = Form.useForm()
  const { Option } = Select
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
  const [soleDatum, setsoleDatum] = useState({})
  //分类数据
  const [classData, setclassData] = useState([])
  const [textData, setTextData] = useState([])
  const [activeData, setActiveData] = useState([])

  const [pageTypeShow, setPageTypeShow] = useState(0)

  const columns = [
    {
      dataIndex: 'meansTitle',
      title: '资料名称',
      align: 'center',
    },
    {
      align: 'center',
      title: '资料分类',
      dataIndex: 'meansGroupName',
    },
    {
      align: 'center',
      title: '页面类型',
      dataIndex: 'meansFileTypeName',
    },
    {
      align: 'center',
      title: '页面名称',
      dataIndex: 'meansFileName',
    },
    {
      dataIndex: 'meansOrder',
      title: '排序',
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

  //编辑资料
  function alterDatums(e) {
    let data = e
    data['order'] = data.learnOrder
    setsoleDatum(data)
    setalterDatum(true)
    setnewSupplier(true)
    setPageTypeShow(e.meansFileType)

    setTimeout(() => {
      form.setFieldsValue({
        ...e,
        remark: e.remark,
        meansCode: Number(e.meansCode),
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
    let res = await deleteLearnPatient({ meansCode: soleDatum.meansCode })
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
    values['learnType'] = 'PATIENT'
    let res = await getLearnListPagingPatient(values)

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

  //点击改变页数
  useEffect(() => {
    onFinish()
    softTextList()
    selectOnChange()
    activeTextList()
  }, [])

  //创建文件
  async function creaetonFinish(values) {
    values['meansType'] = 'PRODUCT_SHARE'

    let res
    if (alterDatum) {
      values['meansCode'] = soleDatum.meansCode
      res = await updateLearnPatient(values)
    } else {
      res = await createLearnPatient(values)
    }

    if (res.code === '0') {
      message.success(res.message)
      setnewSupplier(false)
      onFinish()
    } else {
      message.error(res.message)
    }
  }

  //获取分类列表
  const selectOnChange = async () => {
    let res = await getLearnGroupList()
    if (res.code === '0') {
      if (res.data === null) {
        setclassData([])
      } else {
        setclassData(res.data)
      }
    } else {
      message.error(res.message)
    }
  }
  //获取活动列表
  const softTextList = async () => {
    let res = await getSoftTextList()
    if (res.code === '0') {
      if (res.data === null) {
        setTextData([])
      } else {
        setTextData(res.data)
      }
    } else {
      message.error(res.message)
    }
  }
  // 获取文章列表
  const activeTextList = async () => {
    let res = await getSoftTextPaging()
    if (res.code === '0') {
      if (res.data === null) {
        setActiveData([])
      } else {
        setActiveData(res.data)
      }
    } else {
      message.error(res.message)
    }
  }
  //pageTypeChange
  const pageTypeChange = (e) => {
    setPageTypeShow(e)
    form.setFieldsValue({ learnLinkCode: '' })
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
            添加文件
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

      <Modal
        title={alterDatum ? '编辑资料' : '新增资料'}
        footer={null}
        visible={newSupplier}
        onCancel={() => {
          setnewSupplier(false)
        }}
      >
        <>
          <Form form={form} {...layout} onFinish={creaetonFinish} labelCol={{ span: 6 }} preserve={false} wrapperCol={{ span: 16 }}>
            <Form.Item name="meansGroup" label="资料分类" rules={[{ required: true, message: '资料分类不能为空' }]}>
              <Select showArrow={true} placeholder="请选择资料分类" allowClear={true}>
                {classData.map((r) => (
                  <Option key={r.meansGroupCode} value={r.meansGroupCode}>
                    {r.meansGroupName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="meansTitle" label="资料名称" rules={[{ required: true, message: '资料名称不能为空' }]}>
              <Input placeholder="请输入资料名称" />
            </Form.Item>
            <Form.Item name="meansOrder" label="资料排序" rules={[{ required: true, message: '软文排序不能为空' }]}>
              <Input placeholder="请输入软文排序" />
            </Form.Item>

            <Form.Item name="meansFileType" label="页面类型" rules={[{ required: true, message: '页面类型不能为空' }]} initialValue={'ACTIVE_PAGE'}>
              <Select onChange={pageTypeChange}>
                <Select.Option value={'ACTIVE_PAGE'}>活动页面</Select.Option>
                <Select.Option value={'ARTICAL_PAGE'}>文章列表</Select.Option>
              </Select>
            </Form.Item>
            {pageTypeShow === 'ARTICAL_PAGE' ? (
              <>
                <>
                  <Form.Item name="meansFileUrl" label="文章页面" rules={[{ required: true, message: '请选择文章页面' }]}>
                    <Select placeholder="请选择文章页面">
                      {activeData.map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.textName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              </>
            ) : (
              <>
                <Form.Item name="meansFileUrl" label="活动页面" rules={[{ required: true, message: '请选择活动页面' }]}>
                  <Select placeholder="请选择活动页面">
                    {textData.map((r) => (
                      <Option key={r.id} value={r.id}>
                        {r.templateName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}

            <Form.Item label="封面图片" name="remark" rules={[{ required: true, message: '请上传图片' }]}>
              <BUpload
                valueType="string<,>"
                type="img"
                api={api_common.uploadApi}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'GoodsImage',
                  }
                }}
                length={1}
              />
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
        <p>是否确认删除文件 {soleDatum.learnTitle} </p>
      </Modal>
    </div>
  )
}

export default suffererManage
