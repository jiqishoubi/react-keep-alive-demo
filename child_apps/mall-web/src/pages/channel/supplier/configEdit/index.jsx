import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Radio, Tabs, Divider, InputNumber, message } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import BUpload from '@/components/BUpload'
import TagsInput from '@/components/TagsInput'
import request from '@/utils/request'
import api_common from '@/services/api/common'
import { getInfo, updateBaseConfig, updateWechatConfig } from './services'
import { create, update as updateBaseConfigForAdmin, getInfo as getInfoForAdmin, createWechatConfig, updateWechatConfig as updateWechatConfigForAdmin } from '../services'
import { isNumber, isString } from 'lodash'
const { TabPane } = Tabs
const moduleId = 'supplierCode'
const modalWidth = '90%'
const formSpan = { labelCol: { span: 6 }, wrapperCol: { span: 12 } }
const getPageConfig = () => {
  if (window.location.pathname.indexOf('/web/supplier/org/suppliermgr') > -1) {
    return {
      isAdmin: false,
      isSupplier: true,
    }
  }
  if (window.location.pathname.indexOf('/web/system/org/suppliermgr') > -1) {
    return {
      isAdmin: true,
      isSupplier: false,
    }
  }
}
const Index = (props, ref) => {
  const [show, setShow] = useState(false)
  const [tabKey, setTabKey] = useState('base') //base 基础信息 wechat 小程序信息
  const [info, setInfo] = useState({})
  const [form] = Form.useForm()
  const [formWechatRef] = Form.useForm()

  const [ifStartPage, setIfStartPage] = useState('-1')
  const [isNeedPostage, setIsNeedPostage] = useState(false)
  const [isCreateMall, setIsCreateMall] = useState('0') // 是否需要建立商城 '1' '0'
  const [submitLoading, setSubmitLoading] = useState(false)
  const config = getPageConfig()

  useEffect(() => {
    if (tabKey == 'base') {
      getSupplierInfo()
      form.setFieldsValue(info)
    }
    if (tabKey == 'wechat') {
      formWechatRef.setFieldsValue(info)
    }
  }, [tabKey])

  const getSupplierInfo = async () => {
    let res
    if (config.isAdmin) {
      if (props?.code) {
        res = await getInfoForAdmin({
          supplierCode: props.code,
        })
      } else {
        res = {
          isAdd: true,
        }
      }
    } else {
      res = await getInfo()
    }
    const params = await loadParamsDeal(res)
    setInfo(params)
    form.setFieldsValue(params)
    formWechatRef.setFieldsValue(params)
    setIsNeedPostage(params.ifShip == 0)
    setIfStartPage(params.ifStartPage)
    setIsCreateMall(params.ifCreateMall)
  }

  const loadParamsDeal = async (params) => {
    let res = params
    if (!params.isAdd) {
      // 编辑
      res = { ...res.attrMap, ...res }
      res.supplierCode = res.orgCode
      res.supplierName = res.orgAlias
      res.staffName = res.adminName
      res.phoneNumber = res.adminPhoneNumber
      res.staffLoginName = res.adminLoginName
      res.baseInfoComplete = res?.wechatConfigDTO ? true : false
      if (res?.wechatConfigDTO) {
        res.baseInfoComplete = true
        res = { ...res.wechatConfigDTO, ...res }
      } else {
        res.baseInfoComplete = false
      }
      res.ifStartPage = '' + res.ifStartPage
      res.groupStyle = res.GROUP_STYLE // 小程序类目样式
      res.orgIcon = res.org_icon
      // 结算账户配置
      res.settleAccountCompanyName = res.SETTLE_ACCOUNT_COMPANY_NAME
      res.corporateAccountName = res.CORPORATE_ACCOUNT_NAME
      res.settleAccountBankName = res.SETTLE_ACCOUNT_BANK_NAME
      return res
    } else {
      params.baseInfoComplete = false
      return params
    }
  }

  const submitParamsDeal = (data) => {
    for (let i in data) {
      data[i] = data[i] ?? '' // 如果用三元 会删除掉 0
    }
    data.freightFee = +data.freightFeeStr * 100 || 0
    if (data.freightOverFeeStr) data.freightOverFee = +data.freightOverFeeStr * 100 // freightOverFee 不能传0
    if (!info.isAdd) {
      data[moduleId] = info[moduleId]
    }
    return data
  }

  const submitWechatParamsDeal = (data) => {
    for (let i in data) {
      data[i] = data[i] ? data[i] : ''
    }

    // data.appId = ' '
    // data.appSecret = ' '

    data.mchId = ' '
    data.secretKey = ' '
    data.certUrl = ' '

    data[moduleId] = info[moduleId]
    data.disabled = 0
    data.ifSplitBill = 0

    return data
  }

  // 提交1
  const submitBaseInfo = async () => {
    var data = await form.validateFields()
    data = submitParamsDeal(data)
    setSubmitLoading(true)
    let res
    if (config.isAdmin) {
      res = info?.isAdd ? await create(data) : await updateBaseConfigForAdmin(data)
    } else {
      res = await updateBaseConfig(data)
    }
    setSubmitLoading(false)
    if (res?.code == 0) {
      message.success(res.message || '操作成功')
      if (info.isAdd) {
        setInfo({
          ...info,
          ...data,
          baseInfoComplete: true,
          supplierCode: res.data.orgCode,
          isAdd: false,
        })
      }
      if (isCreateMall == '1') {
        setTabKey('wechat')
      } else {
        props?.submitCompleted && props.submitCompleted()
      }
    } else {
      message.warning(res.message || '操作失败')
    }
  }

  // 提交2
  const submitWechatConfig = async () => {
    var data = await formWechatRef.validateFields()
    data = submitWechatParamsDeal(data)
    setSubmitLoading(true)

    let res
    if (config.isAdmin) {
      res = info?.wechatConfigDTO ? await updateWechatConfigForAdmin(data) : await createWechatConfig(data)
    } else {
      res = await updateWechatConfig(data)
    }
    setSubmitLoading(false)
    if (res?.code == 0) {
      message.success(res.message || '操作成功')
      props?.submitCompleted && props.submitCompleted()
    } else {
      message.warning(res.message || '操作失败')
    }
  }

  return (
    <>
      <Card>
        <Tabs activeKey={tabKey} onChange={setTabKey}>
          <TabPane tab="基础信息" key="base" />
          {isCreateMall == '1' && <TabPane tab="小程序信息" disabled={info.isAdd && !info.baseInfoComplete} key="wechat" />}
        </Tabs>

        {/* 基础信息 */}
        {tabKey == 'base' && (
          <Form name="basic" {...formSpan} autoComplete="off" form={form}>
            <Divider orientation="left" style={{ marginBottom: 30 }}>
              供应商信息
            </Divider>
            <Form.Item name="supplierName" label="供应商名称" rules={[{ required: true, message: '请输入供应商名称' }]}>
              <Input disabled={!info.isAdd} placeholder="请输入供应商名称" allowClear />
            </Form.Item>
            <Form.Item label="供应商图标" name="orgIcon" rules={[{ required: true, message: '请上传供应商图标' }]}>
              <BUpload
                valueType="string"
                type="img"
                api={api_common.uploadApi}
                length={1}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'companyCard',
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="supplierType" label="供应商类型" rules={[{ required: true, message: '请选择供应商类型' }]}>
              <FetchSelect api={api_common.getSysCodeByParamApi} formData={{ codeParam: 'SUPPLIER_TYPE' }} valueKey="codeKey" textKey="codeValue" disabled={!info.isAdd} />
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.supplierType != curValues.supplierType}>
              {(form) => {
                const supplierType = form.getFieldValue('supplierType')
                return supplierType == 'THIRD_PLATFORM' ? (
                  <Form.Item name="chnlAppId" label="第三⽅⼩程序" rules={[{ required: true, message: '请选择第三⽅⼩程序' }]}>
                    <FetchSelect api={api_common.getSysCodeByParamApi} formData={{ codeParam: 'THIRD_PARTY_APP_ID' }} valueKey="codeKey" textKey="codeValue" disabled={!info.isAdd} />
                  </Form.Item>
                ) : null
              }}
            </Form.Item>
            <Form.Item name="staffName" label="管理员名称" rules={[{ required: true, message: '请输入管理员名称' }]}>
              <Input disabled={!info.isAdd} placeholder="请输入管理员名称" allowClear />
            </Form.Item>
            <Form.Item name="phoneNumber" label="管理员手机号" rules={[{ required: true, message: '请输入管理员手机号' }]}>
              <Input disabled={!info.isAdd} placeholder="请输入管理员手机号" maxLength={11} allowClear />
            </Form.Item>
            <Form.Item name="staffLoginName" label="管理员登录账号" rules={[{ required: true, message: '请输入管理员登录账号' }]}>
              <Input disabled={!info.isAdd} placeholder="请输入管理员登录账号" allowClear />
            </Form.Item>
            <Form.Item label="企业营业执照" name="enterpriseBusinessLicense" rules={[{ required: true, message: '请上传企业营业执照' }]}>
              <BUpload
                valueType="string"
                type="img"
                api={api_common.uploadApi}
                length={1}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'companyCard',
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="客服热线" name="customerServiceHotline">
              <Input placeholder="请输入客服热线" maxLength={20} allowClear />
            </Form.Item>
            <Form.Item label="是否建立商城" name="ifCreateMall" rules={[{ required: true, message: '请选择是否建立商城' }]} initialValue="0">
              <Radio.Group
                onChange={(e) => {
                  const v = e.target.value
                  setIsCreateMall(v)
                }}
              >
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
            {isCreateMall == '1' && (
              <Form.Item name="groupStyle" label="商城类目样式" rules={[{ required: false, message: '请选择商城类目样式' }]}>
                <FetchSelect api={api_common.getSysCodeByParamApi} formData={{ codeParam: 'ORG_GROUP_STYLE' }} valueKey="codeKey" textKey="codeValue" />
              </Form.Item>
            )}
            <Form.Item name="technicalServiceRate" label="技术服务费率%" rules={[{ required: true, message: '请输入技术服务费率' }]}>
              <InputNumber placeholder="请输入技术服务费率" min={0} precision={0} disabled={!info.isAdd} style={{ width: 200 }} />
            </Form.Item>

            {!info.isAdd && getPageConfig().isAdmin && (
              <Form.Item label="默认医生" name="defaultDoctor">
                <FetchSelect
                  api="/web/system/doctor/getDoctorList"
                  valueKey="doctorCode"
                  textKey="doctorName"
                  formData={{
                    doctorMallCode: info.orgCode,
                    page: 1,
                    rows: 9999,
                  }}
                  getReady={(formData) => formData.doctorMallCode}
                  dealResFunc={(data) => data?.data ?? []}
                  placeholder="请选择默认医生"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                />
              </Form.Item>
            )}
            <Form.Item label="药房编码" name="drugStoreCode">
              <Input placeholder="请输入药房编码" allowClear />
            </Form.Item>

            <Divider orientation="left" style={{ marginBottom: 30 }}>
              退货信息
            </Divider>

            <Form.Item label="是否包邮" name="ifShip" rules={[{ required: true, message: '请选择是否包邮' }]}>
              <Radio.Group onChange={({ target }) => setIsNeedPostage(+target.value ? false : true)}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
            {isNeedPostage && (
              <>
                <Form.Item name="freightFeeStr" label="邮费" rules={[{ required: true, message: '请输入邮费' }]}>
                  <InputNumber placeholder="请输入技术服务费率" min={0} precision={2} addonAfter={'元'} />
                </Form.Item>
                <Form.Item name="freightOverFeeStr" label="满">
                  <InputNumber placeholder="请输入包邮金额" min={0} precision={2} addonAfter={'元包邮'} />
                </Form.Item>
              </>
            )}
            <Form.Item label="收件人姓名" name="recipientName" rules={[{ required: true, message: '请输入收件人姓名' }]}>
              <Input placeholder="请输入收件人姓名" maxLength={20} allowClear />
            </Form.Item>
            <Form.Item label="收件人手机号" name="recipientPhone" rules={[{ required: true, message: '请输入收件人手机号' }]}>
              <Input placeholder="请输入收件人手机号" maxLength={11} allowClear />
            </Form.Item>
            <Form.Item label="退货地址" name="returnAddress" rules={[{ required: true, message: '请输入退货地址' }]}>
              <Input placeholder="请输入退货地址" maxLength={200} allowClear />
            </Form.Item>

            <Divider orientation="left" style={{ marginBottom: 30 }}>
              结算账户配置
            </Divider>

            <Form.Item label="公司名称" name="settleAccountCompanyName" rules={[{ required: true, message: '请输入公司名称' }]}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="对公账户" name="corporateAccountName" rules={[{ required: true, message: '请输入对公账户' }]}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="银行名称" name="settleAccountBankName" rules={[{ required: true, message: '请输入银行名称' }]}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>

            <Button style={{ marginLeft: 'calc(25%)' }} type="primary" onClick={submitBaseInfo} loading={submitLoading}>
              提交{isCreateMall == '1' && '，继续下一步'}
            </Button>
          </Form>
        )}

        {/* 小程序信息 */}
        {tabKey == 'wechat' && isCreateMall == '1' && (
          <Form name="wechat" {...formSpan} autoComplete="off" form={formWechatRef}>
            <Divider orientation="left" style={{ marginBottom: 30 }}>
              小程序信息
            </Divider>
            <Form.Item label="是否有启动页" name="ifStartPage" rules={[{ required: true, message: '请选择是否有启动页' }]} onChange={({ target }) => setIfStartPage(target.value)}>
              <Radio.Group>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
            {ifStartPage == 1 && (
              <Form.Item label="启动页图片" name="startPageImg" rules={[{ required: true, message: '请上传启动页图片' }]}>
                <BUpload
                  valueType="string"
                  type="img"
                  api={api_common.uploadApi}
                  length={1}
                  getPostData={(e) => {
                    const file = e.file
                    return {
                      fileExt: file.type.split('/')[1],
                      fileType: 'setupPage',
                    }
                  }}
                />
              </Form.Item>
            )}
            <Form.Item label="小程序热词" name="hotWord">
              <TagsInput form={formWechatRef} options={{ placeholder: '请输入小程序热词 按回车添加热词' }} />
            </Form.Item>
            {/* 
              @RequestParam(value = "mchAppId", required = false) String mchAppId,//特约服务商商户APP_ID @RequestParam(value = "subAppId", required = false) String subAppId,//子商户APP_ID
              @RequestParam(value = "subMchId", required = false) String subMchId,//子商户ID
             */}
            <Form.Item label="小程序APPID" name="appId" rules={[{ required: true, message: '请输入小程序APPID' }]}>
              <Input placeholder="请输入小程序APPID" maxLength={40} allowClear />
            </Form.Item>
            <Form.Item label="小程序秘钥" name="appSecret" rules={[{ required: true, message: '请输入小程序秘钥' }]}>
              <Input placeholder="请输入小程序秘钥" maxLength={40} allowClear />
            </Form.Item>

            {/* 
            <Divider orientation="left" style={{ marginBottom: 30 }}>
              微信商户信息
            </Divider>
            <Form.Item label="微信商户号" name="mchId" rules={[{ required: true, message: '请输入微信商户号' }]}>
              <Input placeholder="请输入微信商户号" maxLength={40} allowClear />
            </Form.Item>
            <Form.Item label="微信秘钥" name="secretKey" rules={[{ required: true, message: '请输入微信秘钥' }]}>
              <Input placeholder="请输入微信秘钥" maxLength={40} allowClear />
            </Form.Item>
            <Form.Item label="微信证书" name="certUrl" rules={[{ required: true, message: '请上传微信证书' }]}>
              <BUpload
                valueType="string"
                type="file"
                api={api_common.uploadApi}
                length={1}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'companyWechatCertFile',
                  }
                }}
              />
            </Form.Item>
             */}

            <Divider orientation="left" style={{ marginBottom: 30 }}>
              小程序分享设置
            </Divider>
            <Form.Item label="分享小程序名称" name="appName" rules={[{ required: true, message: '请输入分享标题' }]}>
              <Input placeholder="请输入分享标题" maxLength={40} allowClear />
            </Form.Item>
            <Form.Item label="分享描述信息" name="shareDesc" rules={[{ required: true, message: '请输入分享描述信息' }]}>
              <Input placeholder="请输入分享描述信息" maxLength={40} allowClear />
            </Form.Item>
            <Form.Item label="分享信息logo" name="shareLogo" rules={[{ required: true, message: '请上传分享信息logo' }]}>
              <BUpload
                valueType="string"
                type="img"
                api={api_common.uploadApi}
                length={1}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'share-logo',
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="分享信息图片" name="shareImage" rules={[{ required: true, message: '请上传分享信息图片' }]}>
              <BUpload
                valueType="string"
                type="img"
                api={api_common.uploadApi}
                length={1}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'share-img',
                  }
                }}
              />
            </Form.Item>
            <div style={{ marginLeft: 'calc(25%)' }}>
              <Button onClick={() => setTabKey('base')}>上一步</Button>
              <Button style={{ marginLeft: 20 }} type="primary" onClick={submitWechatConfig} loading={submitLoading}>
                提交
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </>
  )
}

export default Index
