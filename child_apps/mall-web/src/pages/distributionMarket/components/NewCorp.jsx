import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
import { Button, Form, Input, message, InputNumber, Radio, Select, Space, Image, Checkbox, Row, Col } from 'antd'
import UploadImg from '@/components/T-Upload2'
import BUpload from '@/components/BUpload'
import { router } from 'umi'
import { createPromotionCompany, updatePromotionCompany, getUiTemplateList, supplierGetList } from '../SpreadCompany/service'
import api_common from '@/services/api/common'

const { TextArea } = Input
const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

const NewCorp = forwardRef((props, ref) => {
  const { isEdit, supplierList } = props
  const [newForm] = Form.useForm()
  const [radioShow, setRadioShow] = useState(true)

  //控制分润字段
  const radioChange = (e) => {
    if (e.target.value) {
      setRadioShow(true)
    } else {
      setRadioShow(false)
    }
  }

  //合伙人联动设置cobber
  const cobberLinkageX = (e) => {
    let number = 100 - Number(e)

    if (number) {
      if (number === 100 && e !== 0) {
        newForm.setFieldsValue({
          sale1stRewardPct: '',
          sale2ndRewardPct: '',
        })
      } else if (0 < number && number <= 100) {
        newForm.setFieldsValue({
          sale2ndRewardPct: number,
        })
      } else {
        newForm.setFieldsValue({
          sale2ndRewardPct: '',
          sale1stRewardPct: '',
        })
      }
    } else {
      if (number === 0) {
        newForm.setFieldsValue({
          sale2ndRewardPct: number,
        })
      } else {
        newForm.setFieldsValue({
          sale2ndRewardPct: '',
          sale1stRewardPct: '',
        })
      }
    }
  }

  const cobberLinkageY = (e) => {
    let number = 100 - Number(e)
    if (number) {
      if (number === 100 && e !== 0) {
        newForm.setFieldsValue({
          sale1stRewardPct: '',
          sale2ndRewardPct: '',
        })
      } else if (0 < number && number <= 100) {
        if (number === 100) {
          newForm.setFieldsValue({
            sale2ndRewardPct: '0',
          })
        }
        newForm.setFieldsValue({
          sale1stRewardPct: number,
        })
      } else {
        newForm.setFieldsValue({
          sale2ndRewardPct: '',
          sale1stRewardPct: '',
        })
      }
    } else {
      if (number === 0) {
        newForm.setFieldsValue({
          sale1stRewardPct: number,
        })
      } else {
        newForm.setFieldsValue({
          sale2ndRewardPct: '',
          sale1stRewardPct: '',
        })
      }
    }
  }

  return (
    <>
      <div>
        <Form ref={ref} form={newForm} {...layout} labelAlign="right">
          <div className="fontMb">
            {/* 基本信息 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">基本信息</div>
            </Form.Item>
            <div className="newflex"></div>
            <Form.Item name="orgName" label="企业名称" rules={[{ required: true, message: '企业名称不能为空' }]}>
              <Input />
            </Form.Item>
            {/* 推广公司设置 */}
            {!isEdit && (
              <>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <div className="marginlr20">分润配置</div>
                </Form.Item>
                <Form.Item name="ifSubmitProfitConfig" label="是否配置分润比例" initialValue={1}>
                  <Radio.Group onChange={radioChange}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                {radioShow ? (
                  <>
                    <Form.Item name="distributeChildRewardPct" label="推广人分润比例(%)" rules={[{ required: true, message: '请输入推广人分润比例' }]}>
                      <InputNumber precision={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="一级合伙人佣金比例(%)" name="sale1stRewardPct" rules={[{ required: true, message: '请输入一级合伙人佣金比例' }]}>
                      <InputNumber onChange={cobberLinkageX} precision={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="二级合伙人佣金比例(%)" name="sale2ndRewardPct" rules={[{ required: true, message: '请输入二级合伙人佣金比例' }]}>
                      <InputNumber onChange={cobberLinkageY} precision={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </>
                ) : null}
              </>
            )}
            {/* 商户信息 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">商户信息</div>
            </Form.Item>
            <Form.Item name="merchantName" label="商户名称" rules={[{ required: true, message: '商户名称不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="merchantCode" label="商户编码" rules={[{ required: true, message: '商户编码不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="appKey" label="appKey" rules={[{ required: true, message: 'appKey不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="secretKey" label="加密密匙" rules={[{ required: true, message: '加密密匙不能为空' }]}>
              <Input />
            </Form.Item>
            {/* 联系信息 */}
            {!isEdit && (
              <>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <div className="marginlr20">联系信息</div>
                </Form.Item>
                <Form.Item name="loginName" label="登录账号" rules={[{ required: true, message: '登录账号不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="密码" rules={[{ required: true, message: '密码不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="staffName" label="联系姓名" rules={[{ required: true, message: '联系姓名不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="联系电话" rules={[{ required: true, message: '联系电话不能为空' }]}>
                  <Input />
                </Form.Item>
              </>
            )}
            {/* 提现设置 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">提现设置</div>
            </Form.Item>
            <Form.Item name="catchOutMethod" label="提现方式" initialValue="1">
              <Radio.Group>
                <Radio value="1">支付宝</Radio>
                <Radio value="0">银行卡</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="weCharCode" label="微信商户号" rules={[{ required: true, message: '请输入微信商户号' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="weCharSecretKey" label="微信密钥" rules={[{ required: true, message: '请输入微信密钥' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="微信证书" name="weCharCertificate" rules={[{ required: true, message: '请上传微信证书' }]}>
              <BUpload
                valueType="string"
                type="file"
                api={api_common.uploadApi}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'saasFile',
                  }
                }}
                length={5}
              />
            </Form.Item>
            {/* 小程序设置 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">小程序设置</div>
            </Form.Item>
            <Form.Item name="weCharAppId" label="小程序appId" rules={[{ required: true, message: '请输入小程序appId' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="weCharAppSecret" label="小程序AppSecret" rules={[{ required: true, message: '请输入小程序AppSecret' }]}>
              <Input />
            </Form.Item>
            {/* 小程序分享设置 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">小程序分享设置</div>
            </Form.Item>
            <Form.Item name="shareName" label="分享信息名称" rules={[{ required: true, message: '请输入分享信息名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="shareDesc" label="分享信息描述" rules={[{ required: true, message: '请输入分享信息描述' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="分享信息logo" name="shareLogo" rules={[{ required: true, message: '请上传分享信息logo' }]}>
              <BUpload
                valueType="string"
                type="img"
                api={api_common.uploadApi}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'saasFile',
                  }
                }}
                length={1}
              />
            </Form.Item>
            <Form.Item label="分享信息图片" name="shareImage" rules={[{ required: true, message: '请上传分享信息图片' }]}>
              <BUpload
                valueType="string"
                type="img"
                api={api_common.uploadApi}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'saasFile',
                  }
                }}
                length={1}
              />
            </Form.Item>
            {supplierList.length ? (
              <>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <div className="marginlr20">供应商选择</div>
                </Form.Item>
                <Form.Item name="supplierListStr" label="供应商">
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row gutter={[16, 16]}>
                      {supplierList.map((r) => {
                        return (
                          <Col span={12}>
                            <Checkbox value={r.orgCode}>{r.orgName}</Checkbox>
                          </Col>
                        )
                      })}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </>
            ) : null}
          </div>
        </Form>
      </div>
    </>
  )
})

export default NewCorp
