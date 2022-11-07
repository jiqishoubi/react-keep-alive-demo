import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Input, message, Modal, Row, Select, Table, Tree } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import {
  exportTradeReport,
  getExportInfo,
  getPagingList,
  queryListAjax,
  queryMedicalListAjax,
  MedicalInsertAjax,
  MedicalUpdateAjax,
  creatInsertAjax,
  updateAjax,
  deleteMedical,
  getMedical,
  getMedicalDepart,
  updateMedicalDoctor,
  updateMedicalDoctorStatus,
} from '@/pages/hospital/hospitalManage/service'
import FetchSelect from '@/components/FetchSelect'

const Index = () => {
  const [form] = Form.useForm()
  const [addform] = Form.useForm()
  const [etidForm] = Form.useForm()
  const [alterForm] = Form.useForm()
  const [hospitalForm] = Form.useForm()

  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [recordTotalNum, setRecordTotalNum] = useState()

  //订单状态
  const [tableLoading, setTableLoading] = useState(false)
  //导出数据
  const [oldData, setOldData] = useState()
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const [tableList, setTabbleList] = useState([])
  const [treeData, setTreeData] = useState()
  //唯一数据
  const [selectData, setSelectData] = useState({})
  const [addShow, setAddShow] = useState(false)
  const [etid, setEtid] = useState(false)
  const [alter, setAlter] = useState(false)
  const [hospitalShow, setHospitalShow] = useState(false)
  const [isHospital, setIsHospital] = useState(true)

  //医院
  const [hospitalList, setHospitalList] = useState([])
  //科室
  const [sectionList, setSectionList] = useState([])
  const [doctorData, setDoctorData] = useState({})

  useEffect(() => {
    getPagingList_()
    //获取订单状态
    onFinish()
    queryMedicalListAjax_()

    return () => {
      setTreeData([])
      setTabbleList([])
    }
  }, [])

  const columns = [
    {
      dataIndex: 'doctorName',
      title: '医生姓名',
      align: 'center',
    },
    {
      dataIndex: 'phoneNumber',
      title: '联系电话',
      align: 'center',
    },

    {
      dataIndex: 'medicalName',
      title: '所在医院',
      align: 'center',
    },
    {
      dataIndex: 'medicalDepartName',
      title: '科室',
      align: 'center',
    },
    {
      dataIndex: 'userName',
      title: '负责人',
      align: 'center',
    },
    {
      dataIndex: 'statusName',
      title: '状态',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                minuteClick(e)
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              onClick={() => {
                freezeClick(e)
              }}
            >
              {e.statusName == '失效' ? '解冻' : '冻结'}
            </Button>
          </>
        )
      },
    },
  ]

  const minuteClick = async (e) => {
    setDoctorData(e)
    await getMedicalList()
    await getMedicalDepartList(e.medicalCode)
    setAlter(true)
    alterForm.setFieldsValue({ ...e })
  }

  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = (key) => {
    pageRef.current = 1
    getTableList(selectData)
  }
  const getTableList = async (key) => {
    setTableLoading(true)
    let values = form.getFieldsValue()
    if (key) {
      values['medicalCode'] = key?.medicalCode || selectData.medicalCode
      if (key.medicalCode && key.medicalDepartCode) {
        values['medicalDepartCode'] = key?.medicalDepartCode || selectData.medicalDepartCode
      }
    }

    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    setOldData(data)
    let res = await queryListAjax(data)
    if (res && res.code === '0' && res.data) {
      setTabbleList(res.data.data)
      setRecordTotalNum(res.data.rowTop)
      setTableLoading(false)
    } else {
      message.warn(res.message)
    }
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  //获取树结构
  const queryMedicalListAjax_ = async () => {
    let res = await queryMedicalListAjax()
    if (res && res.code == '0') {
      setTreeData([...res.data])
    }
  }

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = oldData

    let res = await exportTradeReport(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getExportInfo({ exportCode: code })
        if (res2.code === '0' && res2.data.status === '90') {
          clearInterval(interTimes)
          getPagingList_()
          setPagingLoading(false)
        }
      }, 1000)
      setinterTime(interTimes)
      clearInterval(interTime)
    } else {
      clearInterval(interTime)
      message.error(res.message)
      setPagingLoading(false)
    }
  }

  //导出表头
  const pagingColumns = [
    {
      title: '导出任务编码',
      align: 'center',
      dataIndex: 'exportCode',
    },
    {
      title: '导出时间',
      align: 'center',
      dataIndex: 'exportDateStr',
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishDateStr',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'statusName',
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return e.status === '90' ? (
          <a
            onClick={() => {
              window.location.href = e.exportFileUrl
            }}
          >
            下载Excel
          </a>
        ) : (
          ''
        )
      },
    },
  ]

  //导出历史订单获取
  const getPagingList_ = async (value) => {
    setpagingShow(true)
    let res = await getPagingList(value)
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  //点击树
  const onSelect = async (selectedKeys, info) => {
    if (info.selectedNodes.length) {
      if (selectedKeys[0] == '1') {
        setSelectData(info.selectedNodes[0])
        getTableList(false)
      } else {
        setSelectData(info.selectedNodes[0])
        getTableList(info.selectedNodes[0])
      }
    }
  }

  //添加科室
  const addFinish = async (values) => {
    let medicalCode = selectData.key
    values['medicalCode'] = medicalCode

    let res = await MedicalInsertAjax(values)
    if (res && res.code == '0') {
      message.success(res.message)
      setAddShow(false)
      queryMedicalListAjax_()
    }
  }

  //科室编辑
  const etidFinish = async (values) => {
    values['medicalCode'] = selectData.medicalCode
    values['medicalDepartCode'] = selectData.medicalDepartCode
    let res = await MedicalUpdateAjax(values)
    if (res && res.code == '0') {
      message.success(res.message)
      setEtid(false)
      queryMedicalListAjax_()
    }
  }

  //添加医院
  const hospitalFinish = async (values) => {
    if (isHospital) {
      let res = await creatInsertAjax(values)
      if (res && res.code == '0') {
        message.success(res.message || '成功')
        setHospitalShow(false)
        queryMedicalListAjax_()
      } else {
        message.warn(res.message)
      }
    } else {
      values['medicalCode'] = selectData.medicalCode
      let res = await updateAjax(values)
      if (res && res.code == '0') {
        message.success(res.message || '成功')
        setHospitalShow(false)
        queryMedicalListAjax_()
      } else {
        message.warn(res.message)
      }
    }
  }
  //删除医院
  const deleteClick = async () => {
    Modal.confirm({
      title: '提示',
      content: '是否删除医院',
      onOk: async () => {
        let res = await deleteMedical({ medicalCode: selectData.medicalCode })
        if (res && res.code == '0') {
          message.success(res.message || '成功')
          setHospitalShow(false)
          queryMedicalListAjax_()
        } else {
          message.warn(res.message)
        }
      },
      onCancel: () => {},
    })
  }

  //修改
  const alterFinish = async (values) => {
    values['doctorCode'] = doctorData.doctorCode
    let res = await updateMedicalDoctor(values)
    if (res && res.code == '0') {
      setAlter(false)
      setDoctorData({})
      message.success(res.message)
      getTableList()
    }
  }
  //冻结
  const freezeClick = async (e) => {
    let values = {}
    values['doctorCode'] = e.doctorCode
    values['status'] = e.statusName == '失效' ? '0' : '1'
    Modal.confirm({
      title: '提示',
      content: e.statusName == '失效' ? '是否解冻' : '是否冻结',
      onOk: async () => {
        // ：0：有效，1：失效
        let res = await updateMedicalDoctorStatus(values)
        if (res && res.code == '0') {
          message.success(res.message)
          getTableList()
        } else {
          message.warn(res.message)
        }
      },
      onCancel: () => {},
    })
  }

  ///医院科室联动
  const typeIdChange = async (e) => {
    alterForm.setFieldsValue({ medicalDepartCode: '' })
    await getMedicalDepartList(e)
  }
  //获取医院列表

  const getMedicalList = async () => {
    setSectionList([])
    let res = await getMedical()
    if (res && res.code == '0') {
      setHospitalList(res.data)
    }
  }
  //获取科室列表
  const getMedicalDepartList = async (value) => {
    let postData = {
      medicalCode: value,
    }
    let res = await getMedicalDepart(postData)
    if (res && res.code == '0') {
      setSectionList(res.data)
    }
  }

  //顶部编辑被点击
  const etidCick = () => {
    if (selectData.medicalType) {
      setIsHospital(false)
      setHospitalShow(true)
      hospitalForm.setFieldsValue({
        ...selectData,
      })
    } else {
      setEtid(true)
      etidForm.setFieldsValue({ ...selectData })
    }
  }

  //添加下级被点击
  const addClick = () => {
    if (selectData.title == '总部') {
      setIsHospital(true)
      setHospitalShow(true)
    } else {
      setAddShow(true)
      addform.setFieldsValue({
        ...selectData,
      })
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'inline-block',
          width: '20%',
          borderRight: '14px solid #F2F2F2',
          minHeight: '100vh',
        }}
      >
        <Tree style={{ display: 'inline-block', marginTop: 20 }} showLine={{ showLeafIcon: false }} defaultExpandedKeys={['0-0-0']} onSelect={onSelect} treeData={treeData} />
      </div>

      <div style={{ flex: '1 0 0' }}>
        <div style={{ minHeight: 60, borderBottom: '14px solid #F2F2F2' }}>
          <Row gutter={[15, 10]} wrap={false} justify="space-between" align="middle" style={{ marginTop: 8 }}>
            <Col span={5} offset={1}>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>{selectData?.title}</div>
            </Col>
            <Col span={(selectData?.key && selectData?.medicalType && 10) || (selectData?.key && 6) || 4}>
              {selectData.key && selectData.title && (
                <>
                  {selectData.key != 1 && (
                    <Button style={{ borderRadius: '4px', marginRight: 12 }} size="middle" type={'primary'} onClick={etidCick}>
                      编辑
                    </Button>
                  )}
                  {(selectData.medicalType || selectData.title == '总部') && (
                    <Button
                      style={{ borderRadius: '4px', marginRight: 12 }}
                      size="middle"
                      type="primary"
                      onClick={() => {
                        addClick()
                      }}
                    >
                      添加下级
                    </Button>
                  )}
                  {selectData.medicalType && (
                    <Button
                      style={{ borderRadius: '4px', marginRight: 12 }}
                      size="middle"
                      type="primary"
                      onClick={() => {
                        deleteClick()
                      }}
                    >
                      删除医院
                    </Button>
                  )}
                </>
              )}

              <Button
                style={{ borderRadius: '4px' }}
                size="middle"
                onClick={() => {
                  seteduce(true)
                  getPagingList_()
                }}
              >
                导出
              </Button>
            </Col>
          </Row>
        </div>

        <div style={{ width: '100%' }}>
          <div className="headBac">
            <Form form={form} name="basic" onFinish={onFinish}>
              <div className="head">
                <Row gutter={[15, 0]} wrap={false}>
                  <Col span={5}>
                    <Form.Item name="doctorName">
                      <Input placeholder="医生姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name="phoneNumber">
                      <Input placeholder="手机号码" />
                    </Form.Item>
                  </Col>
                  <Col span={5} offset={9}>
                    <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                      重置
                    </Button>
                    <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                      查询
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
            <Table
              rowClassName={useGetRow}
              style={{ margin: '23px  20px' }}
              columns={columns}
              dataSource={tableList}
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
          </div>
        </div>
      </div>

      <Modal
        destroyOnClose={true}
        title="导出"
        onCancel={() => {
          seteduce(false)
          setPagingLoading(false)
          clearInterval(interTime)
        }}
        visible={educe}
        width="800px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form name="basic" onFinish={educeFinish}>
            <Form.Item wrapperCol={{ span: 3, offset: 21 }}>
              <Button
                onClick={() => {
                  getPagingList_()
                }}
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
              >
                刷新
              </Button>
            </Form.Item>

            <div>
              <Table loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={pagingColumns} dataSource={pagingList} />
            </div>

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={pagingLoading} disabled={pagingLoading} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定导出
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 130 }}
                onClick={() => {
                  clearInterval(interTime)
                  setPagingLoading(false)
                  seteduce(false)
                }}
                type="primary"
              >
                关闭
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      {/*医院弹窗*/}
      {hospitalShow && (
        <Modal
          destroyOnClose={true}
          title="医院"
          onCancel={() => {
            setHospitalShow(false)
          }}
          visible={hospitalShow}
          width="400px"
          height="400px"
          footer={null}
          className="positionre"
        >
          <>
            <Form onFinish={hospitalFinish} form={hospitalForm} preserve={false}>
              <Row gutter={[15, 0]}>
                <Col span={18} offset={3}>
                  <Form.Item label="医院名称" name="medicalName" rules={[{ required: true, message: '请输入医院名称' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={18} offset={3}>
                  <Form.Item label="医院简称" name="medicalNickName" rules={[{ required: true, message: '请输入医院简称' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={18} offset={3}>
                  <Form.Item label="医院类型" name="medicalType" rules={[{ required: true, message: '请选择医院类型' }]}>
                    <Select showArrow={true} placeholder="请选择医院类型">
                      <Select.Option key={'PUBLIC'} value={'PUBLIC'}>
                        公立医院
                      </Select.Option>
                      <Select.Option key={'PRIVATE'} value={'PRIVATE'}>
                        私立医院
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col offset={6}>
                  <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                    确定
                  </Button>
                  <Button
                    style={{ borderRadius: '4px', marginLeft: 88 }}
                    onClick={() => {
                      setHospitalShow(false)
                    }}
                    type="primary"
                  >
                    取消
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        </Modal>
      )}

      {/*//添加科室*/}
      {addShow && (
        <Modal
          destroyOnClose={true}
          title="添加下级"
          onCancel={() => {
            setAddShow(false)
          }}
          visible={addShow}
          width="400px"
          height="400px"
          footer={null}
          className="positionre"
        >
          <>
            <Form onFinish={addFinish} form={addform} preserve={false}>
              <Row gutter={[15, 0]}>
                <Col span={18} offset={3}>
                  <Form.Item label="医院名称" name="title">
                    <Input disabled={true} bordered={false} />
                  </Form.Item>
                </Col>
                <Col span={18} offset={3}>
                  <Form.Item label="下级名称" name="medicalDepartName" rules={[{ required: true, message: '请输入下级名称' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col offset={6}>
                  <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                    确定
                  </Button>
                  <Button
                    style={{ borderRadius: '4px', marginLeft: 88 }}
                    onClick={() => {
                      setAddShow(false)
                    }}
                    type="primary"
                  >
                    取消
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        </Modal>
      )}

      {etid && (
        <Modal
          destroyOnClose={true}
          title="编辑"
          onCancel={() => {
            setEtid(false)
          }}
          visible={etid}
          width="400px"
          height="400px"
          footer={null}
          className="positionre"
        >
          <>
            <Form onFinish={etidFinish} form={etidForm} preserve={false}>
              <Row gutter={[15, 0]}>
                <Col span={18} offset={3}>
                  <Form.Item label="科室名称" name="medicalDepartName" rules={[{ required: true, message: '请输入科室名称' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col offset={6}>
                  <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                    确定
                  </Button>
                  <Button
                    style={{ borderRadius: '4px', marginLeft: 88 }}
                    onClick={() => {
                      setEtid(false)
                    }}
                    type="primary"
                  >
                    取消
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        </Modal>
      )}

      {alter && (
        <Modal
          destroyOnClose={true}
          title="修改"
          onCancel={() => {
            setAlter(false)
          }}
          visible={alter}
          width="600px"
          height="600px"
          footer={null}
          className="positionre"
        >
          <>
            <Form onFinish={alterFinish} form={alterForm} labelAlign="right" labelCol={{ span: 5, offset: 3 }} preserve={false}>
              <Form.Item wrapperCol={{ span: 12 }} label="医生名称" name="doctorName" rules={[{ required: true, message: '请输入医生名称' }]}>
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12 }} label="联系电话" name="phoneNumber" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="userCode" label="所属推广人" wrapperCol={{ span: 12 }} rules={[{ required: true, message: '请选择所属推广人' }]}>
                <FetchSelect
                  placeholder="推广人"
                  api="/web/staff/member/getDistributeHeadList"
                  valueKey="personCode"
                  textKey="personName"
                  //搜索
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12 }} label="所属医院" name="medicalCode" rules={[{ required: true, message: '请选择所属医院' }]}>
                <Select showArrow={true} disabled placeholder="请选择所属医院" onChange={typeIdChange}>
                  {hospitalList.map((obj) => (
                    <Select.Option key={obj.id} value={obj.medicalCode}>
                      {obj.medicalName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="所属科室" wrapperCol={{ span: 12 }} name="medicalDepartCode" rules={[{ required: true, message: '请选择所属科室' }]}>
                <Select showArrow={true} disabled placeholder="请选择所属科室">
                  {sectionList.map((obj) => (
                    <Select.Option key={obj.id} value={obj.medicalDepartCode}>
                      {obj.medicalDepartName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Row>
                <Col offset={6}>
                  <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                    确定
                  </Button>
                  <Button
                    style={{ borderRadius: '4px', marginLeft: 88 }}
                    onClick={() => {
                      setAlter(false)
                    }}
                    type="primary"
                  >
                    取消
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        </Modal>
      )}
    </div>
  )
}
export default Index
