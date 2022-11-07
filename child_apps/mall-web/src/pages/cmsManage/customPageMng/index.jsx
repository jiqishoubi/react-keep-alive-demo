import React, { useEffect, useState, useRef } from 'react'
import { router } from 'umi'
import { Form, DatePicker, Input, Select, Space, Button, Radio, Table, Modal, message, InputNumber } from 'antd'
import AddModal from './AddModal'
import moment from 'moment'
import { fetchAjax, deleteCustomPageAjax } from './services'
import Categoory from '@/components/marketing/Category'
import { useGetRow } from '@/hooks/useGetRow'
import { getOrgKind, mConfirm } from '@/utils/utils'

const { TextArea } = Input
const { Option } = Select

function couponManage() {
  const [form] = Form.useForm()
  const addModalRef = useRef()

  //分页
  const [pageNum, setpageNum] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //上次的查询数据
  const [oldData, setoldData] = useState('')
  //监空是否点击了分页
  const [clickPag, setclickPag] = useState()
  //table 数据
  const [tradeList, settradeList] = useState([])
  //table loding 展示
  const [loading, setloading] = useState(false)

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
      dataIndex: 'templateName',
      title: '名称',
      align: 'center',
    },
    {
      dataIndex: 'createDateStr',
      title: '创建时间',
      align: 'center',
    },
    {
      align: 'center',
      title: '操作',
      render: (record) => {
        return (
          <div>
            <a
              onClick={() => {
                addModalRef.current?.open({ record })
              }}
            >
              {getOrgKind().isCompany ? '编辑名称' : '查看名称'}
            </a>
            <a
              onClick={() => {
                router.push({
                  pathname: '/diy/activeEditorUsed',
                  query: {
                    isAdd: '0',
                    type: 'customPage',
                    templateCode: record.templateCode,
                  },
                })
              }}
              style={{ marginLeft: 10 }}
            >
              {getOrgKind().isCompany ? '编辑页面' : '查看页面'}
            </a>
            {getOrgKind().isCompany && (
              <a
                onClick={() => {
                  deleteRecord(record)
                }}
                style={{ marginLeft: 10 }}
              >
                删除
              </a>
            )}
          </div>
        )
      },
    },
  ])

  //点击改变页数
  useEffect(() => {
    document.getElementById('couponManageinit').click()
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageSize(e.pageSize)
    setpageNum(e.current)
    setclickPag(e.current)
    window.scrollTo(0, 0)
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
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
    values['rows'] = pageSize

    const postData = {
      ...values,
    }

    setloading(true)
    const data = await fetchAjax(postData)
    setloading(false)
    settradeList(data.data ?? [])
    settableListTotalNum(data.rowTop || 0)
  }

  //modal
  //新增
  const clickAdd = () => {
    addModalRef.current?.open()
  }
  const onAddSuccess = () => {
    addModalRef.current?.close()
    document.getElementById('couponManageinit').click()
  }
  const deleteRecord = (record) => {
    mConfirm('确认删除？', async () => {
      const postData = {
        templateCode: record.templateCode,
      }
      const res = await deleteCustomPageAjax(postData)

      document.getElementById('couponManageinit').click()
    })
  }

  return (
    <div>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item name="templateName" style={{ width: 220, marginRight: '10px' }}>
                <Input placeholder="名称" />
              </Form.Item>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                重置
              </Button>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} id="couponManageinit" type="primary" size="middle" htmlType="submit">
                查询
              </Button>

              <Button style={{ borderRadius: '4px' }} onClick={clickAdd} type="primary" size="middle">
                新建页面
              </Button>
            </div>
          </div>
        </Form>

        <div className="positionre">
          <Table rowKey="id" rowClassName={useGetRow} columns={columns} dataSource={tradeList} pagination={paginationProps} onChange={pageChange} loading={loading} style={{ margin: '23px  20px' }} />
        </div>
      </div>

      {/* 模态 */}
      <AddModal
        onRef={(e) => {
          addModalRef.current = e
        }}
        onSuccess={onAddSuccess}
      />
    </div>
  )
}
export default couponManage
