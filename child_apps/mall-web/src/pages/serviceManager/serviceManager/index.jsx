import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Row, Select, Space, Table, Col, DatePicker, Modal, Radio, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import moment from 'moment'
import { getMedicalList, getServiceTaskDetail, exportTradeReport, getExportInfo, getPagingList, getMedicalDepartList, doctorQueryList, queryPage } from './service'

import requestw from '@/utils/requestw'
import FetchSelect from '@/components/FetchSelect'
import { getSysCodeByParam } from '@/services/common'
import BUpload from '@/components/BUpload'
import api_common from '@/services/api/common'
import { getOrgKind } from '@/utils/utils'
import api_channel from '@/services/api/channel'
const Index = () => {
  const [form] = Form.useForm()
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

  //医院
  const [hospital, setHospital] = useState([])

  // 科室
  const [family, setFamily] = useState([])

  // 医生
  const [doctor, setDoctor] = useState([])

  // 任务
  const [task, setTask] = useState([])

  // 详情
  const [detailModal, openDetailModal] = useState(false)

  // 详情参数
  const [detailRecord, setDetailRecord] = useState({})
  const [promoteData, setPromoteData] = useState([])

  useEffect(() => {
    getPagingList_()
    //获取订单状态
    onFinish()

    getMedicalList_()
    selectChange()

    //获取订单状态
    getSysCodeByParam_('SERVER_TASK_TYPE').then((res) => {
      if (res && res.code === '0') {
        setTask(res.data)
      }
    })
  }, [])

  // 封装获取订单状态
  async function getSysCodeByParam_(codeParam, inCode, notCode) {
    let cs = {
      codeParam,
      inCode,
      notCode,
    }
    let res = await getSysCodeByParam(cs)
    return res
  }

  //获取医院
  const getMedicalList_ = async () => {
    let res = await getMedicalList()
    if (res && res.code == '0') {
      setHospital(res.data)
      setFamily([])
      setDoctor([])
    }
  }
  //获取科室
  const getMedicalDepartList_ = async (values) => {
    let res = await getMedicalDepartList(values)
    if (res && res.code == '0') {
      form.setFieldsValue({
        doctorCode: '',
        medicalDepartCode: '',
      })
      setFamily(res.data)
      setDoctor([])
    }
  }
  //获取医生
  const doctorQueryList_ = async (values) => {
    let res = await doctorQueryList(values)
    if (res && res.code == '0') {
      form.setFieldsValue({
        doctorCode: '',
      })
      setDoctor(res.data)
    }
  }
  //医院改变
  const medicalChange = () => {
    let values = form.getFieldsValue()
    getMedicalDepartList_(values)
  }

  // 科室改变
  const departChange = () => {
    let values = form.getFieldsValue()
    doctorQueryList_(values)
  }

  const columns = [
    {
      dataIndex: 'orgCode',
      title: '提报编号',
      align: 'center',
      fixed: 'left',
    },
    {
      dataIndex: 'taskTypeName',
      title: '任务名称',
      align: 'center',
      width: 88,
    },
    // getOrgKind().isAdmin
    //   ? {
    //       dataIndex: 'orgName',
    //       title: '推广公司',
    //       align: 'center',
    //       width: 88,
    //     }
    //   : null,
    {
      dataIndex: 'userName',
      title: '推广人',
      align: 'center',
    },
    {
      dataIndex: 'userPhoneNumber',
      title: '手机号',
      align: 'center',
    },
    {
      dataIndex: 'medicalName',
      title: '拜访医院',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'medicalDepartName',
      title: '拜访科室',
      align: 'center',
      width: 88,
    },
    {
      dataIndex: 'medicalDoctorName',
      title: '拜访医生',
      align: 'center',
      width: 88,
    },

    {
      dataIndex: 'submitDateStr',
      title: '提交时间',
      align: 'center',
    },

    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return (
          <Button
            type="link"
            onClick={() => {
              minuteClick(e)
            }}
          >
            详细
          </Button>
        )
      },
    },
  ]

  const minuteClick = async (e) => {
    let res = await getServiceTaskDetail({ taskNo: e.taskNo })
    if (res && res.code == '0') {
      let data = JSON.parse(JSON.stringify(res.data))
      if (detailRecord.taskType == 'VISIT_TASK') {
        let File = []
        let visistFile = JSON.parse(data.attrMap?.visistFile)
        visistFile.map((r) => {
          return File.push(r.url)
        })

        data['visistFile'] = File.join(',')
        data['signAddress'] = JSON.parse(data.attrMap?.signAddress)

        data['visitImage'] = data.attrMap?.visitImage
        setDetailRecord(data)
      } else {
        let File = []
        let visistFile = JSON.parse(data.attrMap?.meetingFile ? data.attrMap?.meetingFile : data.attrMap?.visistFile)
        visistFile.map((r) => {
          return File.push(r.url)
        })
        data['visistFile'] = File.join(',')
        data['signAddress'] = ''
        data['visitImage'] = data.attrMap?.meetingImage
        data['meetingDate'] = data.attrMap?.meetingDate
        setDetailRecord(data)
      }

      openDetailModal(true)
    }
  }
  const resetSearch = () => {
    form.resetFields()
  }

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setTableLoading(true)
    let values = form.getFieldsValue()
    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
    }
    setOldData(data)

    // let res = await queryListAjax(data);
    let res = await queryPage(data)

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
  const selectChange = async (code) => {
    let url = ''

    getOrgKind().isAdmin ? (url = '/web/admin/member/getDistributeHeadList') : (url = '/web/staff/member/getDistributeHeadList')

    let res = await requestw({
      url,
      data: { orgCode: code },
    })
    if (res && res.code === '0' && res.data) {
      setPromoteData(res.data)
    }
  }

  const fetchOnChange = async (code) => {
    form.setFieldsValue({
      userCode: '',
    })
    selectChange(code)
  }
  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <Row gutter={[15, 5]}>
              <Col span={4}>
                <Form.Item name="phoneNumber">
                  <Input placeholder="手机号" />
                </Form.Item>
              </Col>
              {getOrgKind().isAdmin && (
                <Col span={4}>
                  <Form.Item name="orgCode" style={{ marginBottom: 10 }}>
                    <FetchSelect
                      onChange={fetchOnChange}
                      placeholder="推广公司"
                      api={api_channel.queryPromotionCompanyList}
                      valueKey="orgCode"
                      textKey="orgName"
                      //搜索
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={4}>
                <Form.Item shouldUpdate name="userCode" style={{ marginBottom: 10 }}>
                  <Select showArrow={true} placeholder="推广人" onChange={medicalChange} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {promoteData.map((obj) => (
                      <Select.Option key={obj.personCode} value={obj.personCode}>
                        {obj.personName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="medicalCode">
                  <Select showArrow={true} placeholder="所属医院" onChange={medicalChange}>
                    {hospital.map((obj) => (
                      <Select.Option key={obj.medicalCode} value={obj.medicalCode}>
                        {obj.medicalName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="medicalDepartCode">
                  <Select showArrow={true} placeholder="所属科室" onChange={departChange}>
                    {family.map((obj) => (
                      <Select.Option key={obj.medicalDepartCode} value={obj.medicalDepartCode}>
                        {obj.medicalDepartName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="medicalDoctorCode">
                  <Select showArrow={true} placeholder="所属医生">
                    {doctor.map((obj) => (
                      <Select.Option key={obj.doctorCode} value={obj.doctorCode}>
                        {obj.doctorName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="taskType">
                  <Select showArrow={true} placeholder="所属任务">
                    {task.map((obj) => (
                      <Select.Option key={obj.codeKey} value={obj.codeKey}>
                        {obj.codeValue}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
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

      <Modal
        destroyOnClose={true}
        title="详情"
        onCancel={() => {
          openDetailModal(false)
          setDetailRecord({})
        }}
        visible={detailModal}
        width="750px"
        height="600px"
        footer={null}
        className="positionre"
      >
        {/*taskType: "VISIT_TASK"*/}
        {/*taskTypeName: "拜访任务*/}
        {/* detailRecord */}
        <div>
          <div>
            <div style={{ fontSize: 18 }}>{detailRecord.taskType == 'VISIT_TASK' ? '拜访' : '参会'}医院</div>
            <div style={{ marginTop: 6 }}>{detailRecord.medicalName}</div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 18 }}>{detailRecord.taskType == 'VISIT_TASK' ? '拜访' : '参会'}科室</div>
            <div style={{ marginTop: 6 }}>{detailRecord.medicalDepartName}</div>
          </div>
          {detailRecord.medicalDoctorName && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 18 }}>{detailRecord.taskType == 'VISIT_TASK' ? '拜访' : '参会'}医生</div>
              <div style={{ marginTop: 6 }}>{detailRecord.medicalDoctorName}</div>
            </div>
          )}
          {/*visistFile  positionTime*/}
          {detailRecord.signAddress && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 18 }}>{detailRecord.taskType == 'VISIT_TASK' ? '拜访' : '参会'}签到</div>
              <div style={{ marginTop: 6 }}>{detailRecord.signAddress.position + detailRecord.signAddress.positionTime}</div>
            </div>
          )}
          {detailRecord.taskType == 'MEETING_TASK' && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 18 }}>参会时间</div>
              <div style={{ marginTop: 6 }}>{detailRecord.meetingDate}</div>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 18 }}>{detailRecord.taskType == 'VISIT_TASK' ? '拜访' : '参会'}图片</div>
            <BUpload
              value={detailRecord.visitImage}
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
              length={8}
              disabled={true}
            />
          </div>
          {detailRecord.visistFile && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 18 }}>{detailRecord.taskType == 'VISIT_TASK' ? '拜访' : '参会'}文件</div>
              <BUpload
                value={detailRecord.visistFile}
                valueType="string<,>"
                api={api_common.uploadApi}
                type="img"
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'GoodsImage',
                  }
                }}
                length={8}
                disabled={true}
              />
            </div>
          )}
        </div>
      </Modal>
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
    </>
  )
}
export default Index
