import React, { Component, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'dva'
import { router } from 'umi'
import { Card, Select, Form, Button, Row, Table, Modal, message, Input, DatePicker } from 'antd'
import FComponent from '@/pages/customizeForm/cstmFormComponents_edit/FComponent'
import TransferModal from '@/components/Modal/TransferModal'
import TSkuSelect from '@/components/goods/T-Sku-Select'
import useMissionSelect from './hook/useMissionSelect'
import useEditModal from './hook/useEditModal'
import requestw from '@/utils/requestw'
import api_tibao from '@/services/api/tibao'
import { checkFormUniqueAjax } from '@/services/common'
import { mConfirm } from '@/utils/utils'
import { dealReportList } from '@/pages/customizeForm/utils_customizeForm'
import { getSkuObj } from '@/pages/customizeForm/tibao_detail_utils'
import { getComponent } from '@/pages/miniapp/Editor/components/components_map'
// import { preDealcustomFormList} from '@/pages/customizeForm/tibao_detail_utils';

const { Option } = Select
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 17,
  },
}

//transferModal
const commonColumns = [
  {
    dataIndex: 'employeeName',
    title: '姓名',
    width: 70,
  },
  {
    dataIndex: 'mobilePhone',
    title: '手机号',
  },
]

const leftColumns = [
  ...commonColumns,
  {
    dataIndex: 'enrollStatus',
    title: '状态',
    render: (v) => {
      return v == '1' ? '已报名' : '未报名'
    },
  },
]

const rightColumnsTransferModal = commonColumns //右侧只负责显示的columns

const Add = (props) => {
  const { login } = props

  const [formRef] = Form.useForm()
  const [formEditRef] = Form.useForm()
  const transferModalRef = useRef()

  const {
    missionSelectList,
    getMissionSelect,
    loadingMissionSelect,
    missionSelectedValue,
    setMissionSelectedValue,
    missionSelectedRecord,
    formContent,
    specs, //规格
  } = useMissionSelect()
  const [formContentForm, setFormContentForm] = useState({}) //左侧form值
  const [tableData, setTableData] = useState([])
  const { showEditModal, openEditModal, closeEditModal, lookingRecord, haveChange, setHaveChange } = useEditModal()
  const [specsPrice, setSpecsPrice] = useState(0) //多规格的钱数
  const [salePrices, setsalePrice] = useState(0) //多规格的销售钱数
  const [formCount, setFormCount] = useState(1) //数量
  const [missionInfo, setMissionInfo] = useState()
  const [ifFillInDate, setIfFillInDate] = useState('0')
  // const [formListLocation , setFormListLocation] =useState({})
  let formListLocation = {}
  let insertReportInfo = {}

  //是否有任务类的唯一表单
  const isHaveUniqueReport =
    formContent &&
    formContent.some((item) => {
      return item.label_unique && item.uniqueCheck && item.uniqueCheck.length && item.uniqueCheck.indexOf('REPORT') > -1
    })

  let showPrice = 0
  if (missionSelectedRecord) {
    if (specs) {
      showPrice = specsPrice
    } else {
      showPrice = missionSelectedRecord.missionBudget
    }
  }

  let salePrice = 0
  if (missionSelectedRecord) {
    if (specs) {
      salePrice = salePrices
    } else {
      salePrice = missionSelectedRecord.missionBudget
    }
  }

  useEffect(() => {
    if (props.location.query.id) {
      getMissionInfo()
    }
    getComponent()
    getMissionSelect()
  }, [])

  const getComponent = async () => {
    let postData = {
      companyCode: props.login.loginInfo.COMPANY_CODE,
    }

    let res = await requestw({
      url: '/company/getByCode',
      type: 'post',
      data: postData,
    })
    if (res.code == '200') {
      setIfFillInDate(res.data.attrMap.ifFillInDate)
    }
  }

  const xuanzerenwuChange = (v) => {
    //一、清空下面的form
    const values = formRef.getFieldsValue()
    if (values.createTime) {
      delete values.createTime
    }
    let arr = []
    for (let key in values) {
      if (key !== 'xuanzerenwu') {
        arr.push(key)
      }
    }
    formRef.resetFields(arr)
    setMissionSelectedValue(v)
    //清空下面的form end
    //二、清空右面的table
    setTableData([])
  }

  const preDealcustomFormLists = (arr, formValueJson) => {
    let valueObj = {}
    if (formValueJson) {
      try {
        valueObj = JSON.parse(formValueJson || '{}')
      } catch (e) {}
    }

    //方法
    const getValueFromValueObj = (keyStr, idKey) => {
      let v = ''
      for (let key in valueObj) {
        const parentStamp = idKey && idKey.split('_')[1]
        const firstNameKey = key.split('_')[0]
        const childStamp = key.split('_')[1]
        if (firstNameKey == keyStr && childStamp == parentStamp) {
          v = valueObj[key] || ''
          break
        }
      }
      return v
    }

    //处理customFormList
    let arr2 = JSON.parse(JSON.stringify(arr))
    arr2.forEach((item, index) => {
      let idKey = item.id
      let nameType = item.name //location input
      //定位
      if (nameType == 'location') {
        let position = getValueFromValueObj('location-position', idKey)
        let positionTime = getValueFromValueObj('location-positionTime', idKey)
        let latitude = getValueFromValueObj('location-latitude', idKey)
        let longitude = getValueFromValueObj('location-longitude', idKey)
        if (position || positionTime || latitude || longitude) {
          let valueTempObj = {
            position,
            positionTime,
            latitude,
            longitude,
          }
          item.valueTemp = JSON.stringify(valueTempObj)
          formListLocation = item

          let obj = {}
          obj[idKey] = {
            address: JSON.parse(item.valueTemp).position,
          }
          formRef.setFieldsValue({
            ...obj,
          })
        }
      }
      //时间区间
      else if (nameType == 'rangepicker') {
        let startDate = getValueFromValueObj('rangepicker-startDate', idKey)
        let endDate = getValueFromValueObj('rangepicker-endDate', idKey)
        if (startDate || endDate) {
          item.valueTemp = startDate + ',' + endDate
        }
      } else {
        item.valueTemp = valueObj[idKey] || ''
      }
    })

    return arr2
  }

  const queryEmployeeList = async (name, taskCode) => {
    let res = await requestw({
      url: '/employee/queryEmployeeList',
      data: {
        employeeName: name,
        missionCode: taskCode, //missionSelectedRecord.missionCode,
      },
    })
    if (res.code == '200') {
      setTableData(res.data)
    }
  }

  const getMissionInfo = async () => {
    let res = await requestw({
      url: '/reportAudit/getById',
      data: { id: props.location.query.id },
    })
    if (res.code == '200') {
      setMissionInfo(res.data[0])
      let formValueJson = JSON.parse(res.data[0].formValueJson)
      let arr = JSON.parse(res.data[0].formJson)
      let formList = preDealcustomFormLists(arr, res.data[0].formValueJson)
      insertReportInfo = res.data[0]
      queryEmployeeList(res.data[0].userName, res.data[0].taskCode)

      // let dataObj={
      //   companyCode:insertReportInfo.companyCode,
      //   key:insertReportInfo.userId,

      // }

      // setTableData(data)
      // let obj={}
      // formList.map(item=>{
      //   if (item.name=="location") {
      //     // setFormListLocation(item)
      //     obj=item
      //   }
      // })
      // formListLocation=obj
      formRef.setFieldsValue({
        ...formValueJson,
        createTime: moment(res.data[0].modifyTimeStr),
        xuanzerenwu: res.data[0].taskCode,
        selectedSku: res.data[0].specsValueJson,
      })
      xuanzerenwuChange(res.data[0].taskCode)
    }
  }

  const onFormChange = (changedValues) => {
    for (let key in changedValues) {
      if (key && key.indexOf('count') > -1) {
        setFormCount(changedValues[key])
      }
    }
  }

  const onTSkuSelectChange = (v) => {
    setSpecsPrice(v.price)
    setsalePrice(v.salePrice)
  }

  //添加人员
  const clickAddStaff = async (record) => {
    const values = await formRef.validateFields()
    setFormContentForm(values)
    transferModalRef.current.open()
  }

  const onTransferModalSuccess = (keys, rows) => {
    return new Promise((resolve) => {
      let tableDataNew = _.cloneDeep(tableData)
      rows.forEach((obj) => {
        if (tableDataNew.find((itm) => itm.employeeCode == obj.employeeCode)) {
        } else {
          tableDataNew.push(obj)
        }
      })
      setTableData(tableDataNew)
      resolve(true)
    })
  }

  //表格
  const rightColumns1 = [
    {
      dataIndex: 'employeeName',
      title: '姓名',
    },
    {
      dataIndex: 'mobilePhone',
      title: '手机号',
    },
  ]

  const rightColumns1Option = {
    // dataIndex: 'caozuo',
    // title: '操作',
    // render: (v, record) => {
    //   return (
    //     <a
    //       onClick={() => {
    //         openEditModal(record);
    //         const contentForm = record.staffContentForm || formContentForm;
    //         if (formEditRef) formEditRef.setFieldsValue({ ...contentForm });
    //       }}
    //     >
    //       修改
    //     </a>
    //   );
    // },
  }
  const rightColumns = isHaveUniqueReport ? [...rightColumns1] : [...rightColumns1, rightColumns1Option]

  //修改modal
  const editStaff = async () => {
    if (!haveChange) {
      closeEditModal()
      return
    }
    const values = await formEditRef.validateFields()
    let tableDataTemp = tableData
    tableDataTemp.forEach((obj) => {
      if (obj.employeeCode == lookingRecord.employeeCode) {
        delete obj.staffContentForm
        obj.staffContentForm = values
      }
    })
    setTableData(tableDataTemp)
    closeEditModal()
  }

  //最后统一校验 表单唯一性 true能用，通过
  const checkFormUnique = (values) => {
    return new Promise(async (resolve) => {
      const values1 = await formRef.validateFields()
      const filterArr = formContent.filter((item) => {
        return item.label_unique && item.uniqueCheck && item.uniqueCheck.length && item.uniqueCheck.indexOf('REPORT') > -1
      })
      if (!filterArr.length) {
        resolve(true)
        return
      }
      //需要校验
      let flag = false
      const postDataArr = filterArr.map((item) => {
        let postDataObj = {
          companyCode: login.loginInfo.COMPANY_CODE,
          type: 'REPORT',
          controlText: item.label,
          controlId: item.id,
          valueTemp: values1[item.id] ? values1[item.id] : '',
        }
        const skuObj = (values.selectedSku && getSkuObj(values.selectedSku)) || {}
        postDataObj = {
          ...postDataObj,
          ...skuObj,
        }
        return postDataObj
      })
      const postData = {
        checkListJsonStr: JSON.stringify(postDataArr),
      }
      const res = await checkFormUniqueAjax(postData) //是否能用
      if (res && res.code == 200 && res.data) {
        flag = true
      }
      if (!flag) {
        message.warning((res && res.message) || '表单内容不唯一')
      }
      resolve(flag)
    })
  }

  //最后提交
  const submit = async () => {
    const values1 = await formRef.validateFields()
    let createTime = values1.createTime?.format('YYYY-MM-DD hh:mm:ss')
    delete values1.createTime
    //校验唯一
    const resUnique = await checkFormUnique(values1)

    if (!resUnique) return
    values1.showPrice = showPrice.indexOf('-') != '-1' ? 0 : showPrice
    values1.salePrice = salePrice && salePrice.indexOf('-') != '-1' ? 0 : salePrice
    mConfirm('确认提交？', async () => {
      let reportList = dealReportList({
        showPrice,
        salePrice: salePrice ? salePrice : 0,
        selectedSku: values1.selectedSku,
        formContent, //左侧自定义表单
        formContentForm: formRef.getFieldsValue(), //左侧自定义表单 的值
        tableData, //右侧人员
      })

      let postData = {
        taskCode: missionSelectedRecord.missionCode, //  必填 任务编码
        createTime,
        reportListJsonStr: JSON.stringify(reportList), // 提报内容json 必填
      }
      // if (formRef.getFieldsValue()?.createTime) {
      //   postData.createTime = formRef.getFieldsValue().createTime;
      // }
      if (props.location.query.id) {
        // postData.id=missionInfo.id
        // postData.companyCode=missionInfo.companyCode
        // postData.orderNumber=missionInfo.orderNumber
        // postData.rejectReason=missionInfo.rejectReason
        postData = {
          createTime,
          taskCode: missionSelectedRecord.missionCode, //  必填 任务编码
          id: missionInfo.id,
          companyCode: missionInfo.companyCode,
          orderNumber: missionInfo.orderNumber,
          rejectReason: missionInfo.rejectReason,
          finishInfo: reportList[0].finishInfo,
          formValueJson: reportList[0].formValueJson,
          reportListJsonStr: JSON.stringify(reportList), // 提报内容json 必填
        }
      }
      let url = api_tibao.copyReportApi
      if (props.location.query.id) {
        url = '/reportAudit/updateRejectReport'
      }
      const res = await requestw({
        url: url,
        data: postData,
      })
      if (!res || res.code !== 200) {
        message.warning((res && res.message) || '网络异常')
        return
      }

      //成功
      Modal.info({
        title: '提示',
        content: (res && res.message) || '操作成功',
        onOk() {
          router.goBack()
        },
      })
    })
  }

  /**
   * 渲染
   */
  //默认值
  const getInitialValue = (item) => {
    if (item.name.indexOf('count') > -1) {
      return 1
    } else if (item.name.indexOf('radio') > -1) {
      return item.value && item.value[0]
    } else {
      return undefined
    }
  }

  const loginInfo = props.login.loginInfo

  const { COMPANY_TYPE } = loginInfo || {}

  return (
    <>
      <Card title="新增提报">
        <Form form={formRef} {...formItemLayout} onValuesChange={onFormChange} style={{ width: 700 }}>
          {ifFillInDate == '1' ? (
            <Form.Item label="提报时间" required name="createTime" rules={[{ required: true, message: '请先提报时间' }]}>
              <DatePicker showTime />
            </Form.Item>
          ) : (
            ''
          )}

          <Form.Item label="提报任务" required name="xuanzerenwu" rules={[{ required: true, message: '请先选择任务' }]}>
            <Select
              placeholder="请选择任务"
              loading={loadingMissionSelect}
              disabled={props.location.query.id}
              onChange={(v) => {
                xuanzerenwuChange(v)
              }}
            >
              {missionSelectList &&
                missionSelectList.map((obj, index) => (
                  <Option key={index} value={obj.missionCode}>
                    {obj.missionTitle}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {/* 价格 */}
          {missionSelectedRecord && <Form.Item label="价格">{showPrice ? <div>{Number(showPrice.indexOf('-') != '-1' ? '0' : showPrice) * formCount}元</div> : <div>-</div>}</Form.Item>}

          {missionSelectedRecord && COMPANY_TYPE && COMPANY_TYPE == 'SERVICE' && specs && (
            <Form.Item label="销售价格">
              <div>{salePrice && Number(salePrice.indexOf('-') != '-1' ? '0' : salePrice) * formCount}元</div>
            </Form.Item>
          )}

          {/* 规格 */}
          <div>
            {specs ? (
              <Form.Item label="规格" name="selectedSku" required rules={[{ required: true, message: '请选择规格' }]}>
                <TSkuSelect val={insertReportInfo && insertReportInfo.specification && JSON.parse(insertReportInfo.specification)} specs={specs} onChange={onTSkuSelectChange} />
              </Form.Item>
            ) : null}
          </div>

          <div>
            {(formContent &&
              formContent.map((item, index) => (
                <Form.Item
                  key={index}
                  label={<div style={{ width: '100%', whiteSpace: 'normal' }}>{item.label}</div>}
                  name={item.id}
                  required={item.isRequired}
                  rules={[
                    {
                      required: item.isRequired,
                      message: '请输入' + item.label,
                    },
                  ]}
                  initialValue={getInitialValue(item)}
                >
                  <FComponent key={index} formListLocation={formListLocation} item={item} keyIndex={index} />
                </Form.Item>
              ))) ||
              null}
          </div>
        </Form>

        {/* 模态 */}
        {/* 人员选择器 */}
        <TransferModal
          onRef={(e) => {
            transferModalRef.current = e
          }}
          keyStr="employeeCode"
          leftColumns={leftColumns}
          rightColumns={rightColumnsTransferModal}
          api="/employee/queryEmployeeList"
          getPostDataFunc={(searchValues, p) => {
            let postData = {
              missionCode: missionSelectedRecord.missionCode,
              ...searchValues,
            }
            if (postData.mobilePhone) postData.mobilePhone = postData.mobilePhone.replace(/\s/gi, '').replace(/，/g, ',') || ''
            if (postData.employeeName) postData.employeeName = postData.employeeName.replace(/\s/gi, '').replace(/，/g, ',') || ''
            return postData
          }}
          searchFormRender={(p) => {
            return (
              <Row>
                <Form.Item label={<div style={{ width: 69 }}>手机号</div>} name="mobilePhone" style={{ marginBottom: 16 }}>
                  <TextArea placeholder="请输入手机号，支持用逗号分隔" allowClear maxLength={500} style={{ width: 230, minHeight: 57 }} />
                </Form.Item>
                <Form.Item label={<div style={{ width: 69 }}>姓名</div>} name="employeeName" style={{ marginBottom: 16 }}>
                  <TextArea placeholder="请输入姓名，支持用逗号分隔" allowClear maxLength={200} style={{ width: 230, minHeight: 57 }} />
                </Form.Item>
                <Form.Item label={<div style={{ width: 69 }}>状态</div>} name="isEnroll" style={{ marginBottom: 16 }}>
                  <Select placeholder="请选择状态" allowClear style={{ width: 230 }}>
                    <Option value="0">未报名</Option>
                    <Option value="1">已报名</Option>
                  </Select>
                </Form.Item>
              </Row>
            )
          }}
          onOk={onTransferModalSuccess}
          maxTargetKeysLength={isHaveUniqueReport ? 1 : false}
        />

        {/* 人员 修改modal */}
        {lookingRecord && (
          <Modal title="修改完工报告" visible={showEditModal} onCancel={closeEditModal} onOk={editStaff} destroyOnClose={true} forceRender width={600}>
            <Form
              form={formEditRef}
              onValuesChange={() => {
                setHaveChange(true)
              }}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 17 }}
            >
              {(formContent &&
                formContent.map((item, index) => {
                  return (
                    <Form.Item key={index} label={item.label} name={item.id} required={item.isRequired} rules={[{ required: item.isRequired }]}>
                      <FComponent key={index} item={item} />
                    </Form.Item>
                  )
                })) ||
                null}
            </Form>
          </Modal>
        )}
      </Card>

      <Card title="用工信息">
        <div style={{ paddingLeft: 24, width: 600 }}>
          <Row type="flex" justify="space-between" style={{ marginBottom: 24 }}>
            {props.location.query.id ? '' : <Button onClick={clickAddStaff}>添加用工</Button>}
            {tableData.length ? (
              <Button type="primary" onClick={submit}>
                提交提报
              </Button>
            ) : null}
          </Row>

          <div style={{ width: 600 }}>
            <Table rowKey="employeeCode" columns={rightColumns} dataSource={tableData} pagination={true} />
          </div>
        </div>
      </Card>
    </>
  )
}

export default connect(({ login }) => ({
  login,
}))(Add)
