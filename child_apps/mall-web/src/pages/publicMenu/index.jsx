import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Input, message, Modal, Radio, Row, Table, InputNumber } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import { queryListAjax, submitMenu, createWechatMenu, updateWechatMenu, querySubmitLog, deleteWechatMenu } from './services.js'
import { router } from 'umi'

const Index = (props) => {
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [recordTotalNum, setRecordTotalNum] = useState('')
  const [recordShow, setRecordShow] = useState(false)
  const [recordLoading, setRecordLoading] = useState(false)
  const [recordData, setRecordData] = useState([])
  const [menuForm] = Form.useForm()
  const [menuShow, setMenuShow] = useState(false)
  const [radioIndex, setRadioIndex] = useState('miniprogram')

  const [viceCode, setViceCode] = useState({})
  const [isUpdate, setIsUpdate] = useState('')

  useEffect(() => {
    onFinish()
  }, [])

  const columns = [
    {
      dataIndex: 'menuName',
      title: '菜单名称',
      align: 'center',
    },
    {
      title: '排序',
      align: 'center',
      render: (e) => {
        return e.parentCode ? <span>{e.menuOrder}</span> : <span style={{ color: '#5ea9ff', fontSize: '18px' }}>{e.menuOrder}</span>
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return (
          <>
            {!e.parentCode && <a onClick={() => addClick(e, true)}>新增</a>}
            &nbsp;&nbsp;
            <a onClick={() => redact(e)}>编辑</a>
            &nbsp;&nbsp;
            <a
              onClick={() => {
                deleteMenu(e.menuCode)
              }}
            >
              删除
            </a>
          </>
        )
      },
    },
  ]

  //
  async function addClick(item, is) {
    setViceCode(item),
      router.push({
        pathname: '/web/company/menuConfig/addMenu',
        query: {
          menuCode: item.menuCode,
          isAdd: is,
          menuName: is ? item.menuName : '',
        },
      })
  }

  const recordColumns = [
    {
      dataIndex: 'DATE',
      title: '时间',
      align: 'center',
    },
    {
      dataIndex: 'CREATE_PERSON',
      title: '标题',
      align: 'center',
    },
  ]

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setTableLoading(true)
    let res = await queryListAjax()
    if (res && res.code === '0' && res.data && res.data.length) {
      let viceData = JSON.parse(JSON.stringify(res.data))
      viceData.map((e) => (e['children'] = e.subList))
      setTableData(viceData)
    }
    setTableLoading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }
  // radioChange
  const radioChange = (e) => {
    setRadioIndex(e.target.value)
  }
  // 编辑
  const redact = async (e) => {
    if (e.parentCode) {
      addClick(e, false)
      return
    }

    setRadioIndex(e.menuType)
    setViceCode(e)
    setIsUpdate(true)
    setMenuShow(true)
    let values = {}
    e.menuType === 'view' ? (values['menuUrlView'] = e.menuUrl) : (values['menuUrlMiniprogram'] = e.mpPagepath)
    e.parentCode ? ((values['childrenMenuName'] = e.menuName), (values['parentMenuName'] = e.parentName)) : (values['parentMenuName'] = e.menuName)

    menuForm.setFieldsValue({
      ...e,
      ...values,
    })
  }

  // 保存数据
  const setMenuData = async () => {
    let values = menuForm.getFieldsValue()
    values['menuUrl'] = '/pages/index/index'
    radioIndex === 'view' ? (values['menuUrl'] = values.menuUrlView) : (values['mpPagepath'] = values.menuUrlMiniprogram)
    values['menuType'] = radioIndex
    if (isUpdate) {
      viceCode.parentCode ? (values['menuName'] = values.childrenMenuName) : (values['menuName'] = values.parentMenuName)

      viceCode.parentCode ? (values['menuLevel'] = 2) : (values['menuLevel'] = 1)
      values['parentCode'] = viceCode.parentCode
      values['menuCode'] = viceCode.menuCode
    } else {
      viceCode.menuCode ? (values['menuName'] = values.childrenMenuName) : (values['menuName'] = values.parentMenuName)

      viceCode.menuCode ? (values['menuLevel'] = 2) : (values['menuLevel'] = 1)
      values['parentCode'] = viceCode.menuCode
    }

    let url = isUpdate ? updateWechatMenu : createWechatMenu
    let res = await url(values)
    if (res && res.code === '0') {
      message.success(res.message || '成功')
      menuForm.resetFields()
      setMenuShow(false)
      onFinish()
    } else {
      message.warn(res.message || '失败')
    }
  }
  //获取发布记录
  const getLog = async () => {
    let res = await querySubmitLog()
    if (res && res.code === '0') {
      setRecordData(res.data)
    }
    setRecordShow(true)
  }

  //发布菜单
  const popMenu = async () => {
    let res = await submitMenu()
    if (res && res.code === '0') {
      message.success(res.message || '成功')
    } else {
      message.warn('失败')
    }
  }
  // deleteWechatMenu 删除菜单
  const deleteMenu = async (menuCode) => {
    let res = await deleteWechatMenu({ menuCode })
    if (res && res.code === '0') {
      message.success(res.message || '成功')
      onFinish()
    } else {
      message.warn(res.message || '失败')
    }
  }

  return (
    <>
      <div className="headBac">
        <div className="head">
          <Row gutter={[15, 5]}>
            <Col>
              <Button
                style={{ borderRadius: '4px', marginRight: 10 }}
                size="middle"
                type="primary"
                onClick={() => {
                  setMenuShow(true), setIsUpdate(false), setViceCode({})
                }}
              >
                新增
              </Button>
              <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" onClick={popMenu}>
                发布菜单
              </Button>
              <Button
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
                size="middle"
                onClick={() => {
                  getLog()
                }}
              >
                发布记录
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          rowClassName={useGetRow}
          style={{ margin: '40px  20px' }}
          rowKey="menuCode"
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageRef.current,
            pageSize: pageSizeRef.current,
            total: recordTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: onPageChange,
          }}
        />
        <Modal
          destroyOnClose={true}
          title="发布记录"
          onCancel={() => {
            setRecordShow(false)
          }}
          visible={recordShow}
          width="600px"
          footer={null}
        >
          <>
            <div>
              <Table loading={recordLoading} rowClassName={useGetRow} pagination={false} columns={recordColumns} dataSource={recordData} scroll={{ y: 300 }} />
            </div>
          </>
        </Modal>

        {menuShow ? (
          <Modal
            destroyOnClose={true}
            title="菜单"
            onCancel={() => {
              menuForm.resetFields()
              setMenuShow(false)
            }}
            visible={menuShow}
            width="600px"
            onOk={() => {
              setMenuData()
            }}
          >
            <>
              <Form form={menuForm} wrapperCol={{ span: 10 }} labelCol={{ span: 8 }}>
                <Form.Item label={viceCode.parentCode ? '主菜单名称' : '菜单名称'} name="parentMenuName" rules={[{ required: true, message: '请输入主菜单名称' }]}>
                  <Input readOnly={viceCode.parentCode || (!isUpdate && viceCode.menuCode)} bordered={!(viceCode.parentCode || (!isUpdate && viceCode.menuCode))} />
                </Form.Item>
                {((viceCode.parentCode && isUpdate) || (!viceCode.parentCode && !isUpdate && viceCode.menuCode)) && (
                  <Form.Item label="子菜单名称" name="childrenMenuName" rules={[{ required: true, message: '请输入子菜单名称' }]}>
                    <Input />
                  </Form.Item>
                )}
                <Form.Item label="跳转类型" name="menuType" rules={[{ required: viceCode.menuCode, message: '跳转类型' }]} initialValue="miniprogram">
                  <Radio.Group onChange={radioChange}>
                    <Radio value="view">跳转页面</Radio>
                    <Radio value="miniprogram">跳转小程序</Radio>
                  </Radio.Group>
                </Form.Item>

                {radioIndex === 'view' ? (
                  <>
                    <Form.Item
                      label="页面地址"
                      name="menuUrlView"
                      rules={[
                        {
                          required: viceCode.menuCode,
                          message: '请输入页面地址',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      label="跳转页面"
                      name="menuUrlMiniprogram"
                      rules={[
                        {
                          required: viceCode.menuCode,
                          message: '请输入备用页面',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </>
                )}
                <Form.Item label="排序" name="menuOrder" rules={[{ required: true, message: '请输入排序' }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Form>
            </>
          </Modal>
        ) : null}
      </div>
    </>
  )
}
export default Index
