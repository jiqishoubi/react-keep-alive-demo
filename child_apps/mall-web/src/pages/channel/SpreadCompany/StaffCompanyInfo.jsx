import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Modal, Button, message, Space, Table, Radio, InputNumber, Row, Col, Spin, Select } from 'antd'
import { useRequest } from 'ahooks'
import BUpload from '@/components/BUpload'
import { getPromotionCompanyInfor, updatePromotionCompany } from './service'
import api_common from '@/services/api/common'
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import FetchSelect from '@/components/FetchSelect'
import requestw from '@/utils/requestw'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

const layoutFail = {
  wrapperCol: { offset: 8, span: 8 },
}

function Index() {
  const [formRef] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)

  const [formInitialValues, setFormInitialValues] = useState(undefined)
  const [introduce, setIntroduce] = useState('1')
  const [special, setSpecial] = useState(1)
  const [ifSplitBill, setIfSplitBill] = useState(1)
  const [frontPageShow, setFrontPageShow] = useState('0')
  const [shipShow, setShipShow] = useState('0')
  const [membership, setMembership] = useState('0')
  const [memberQcodeImg, setMemberQcodeImg] = useState('')
  const [memberOrgCode, setMemberOrgCode] = useState('')
  /**
   * 请求
   */

  //获取信息
  const {
    data: companyInfo,
    loading: loading_get,
    run: run_get,
  } = useRequest(getPromotionCompanyInfor, {
    initialData: {},
    formatResult: (res) => {
      let obj = {}
      if (res && res.code == '0' && res.data) {
        obj = res.data
      }
      return obj
    },
    onSuccess: () => {
      renderBack()
    },
  })

  //提交修改
  const { loading: loading_submit, run: run_submit } = useRequest(updatePromotionCompany, {
    manual: true,
  })

  /**
   * 方法
   */

  function renderBack() {
    const formData = {
      ...companyInfo,
      merchantName: companyInfo.mchName,
      merchantCode: companyInfo.mchCode,
      secretKey: companyInfo.threeDesKey,
      catchOutMethod: companyInfo.catchOutMethod == 'ALIPAY' ? '1' : '0',
      hotWordStr: companyInfo.hotWordStr?.split(','),
      defaultDistributeCode: companyInfo.attrMap?.DEFAULT_SALE_PERSON_MEMBER,
      mpMsgOrderUnpay: companyInfo.attrMap?.MP_MSG_ORDER_UNPLAY,
      mpMsgOrderDeliver: companyInfo.attrMap?.MP_MSG_ORDER_DELIVER,
    }
    if (formData.ifMembership === '1') getQcode(formData.orgCode)
    setIntroduce(companyInfo.introduce)
    setFrontPageShow(companyInfo.ifUseFrontPage)
    setShipShow(companyInfo.ifShip)
    setSpecial(Number(companyInfo.ifTyWxMch))
    setMemberOrgCode(companyInfo.orgCode)
    setIfSplitBill(Number(companyInfo.ifSplitBill))
    setFormInitialValues(formData)
    setMembership(formData.ifMembership)

    formRef.setFieldsValue(formData)
  }

  function clickEdit() {
    setIsEdit(true)
  }

  function clickCancel() {
    formRef.resetFields()
    setIsEdit(false)
  }

  async function clickSubmit() {
    const values = await formRef.validateFields()
    values['freightOverFee'] = values.freightOverFeeStr && Number(values.freightOverFeeStr * 100)
    values['freightFee'] = values.freightFeeStr && Number(values.freightFeeStr * 100)
    run_submit(values).then((res) => {
      if (res && res.code == '0') {
        //修改成功
        message.success('修改成功')
        clickCancel()
        run_get()
      } else {
        message.warning((res && res.message) || '网络异常')
      }
    })
  }
  const introduceChange = (e) => {
    setIntroduce(e.target.value)
  }

  const frontPageChange = (e) => {
    setFrontPageShow(e.target.value)
  }
  //控制邮费字段
  const shipChange = (e) => {
    setShipShow(e.target.value)
  }

  const getQcode = async (orgCode) => {
    const res = await requestw({
      url: '/web/company/getOrgMembershipQrCode',
      data: { orgCode: memberOrgCode || orgCode },
    })
    if (res?.code === '0') {
      setMemberQcodeImg(res.data)
    } else {
      setMemberQcodeImg('')
    }
  }

  const memberChange = async (e) => {
    const { value } = e.target

    if (value === '1') getQcode()

    setMembership(value)
  }

  /**
   * 渲染
   */

  return (
    <>
      <div style={{ width: '85%', margin: '0 auto' }}>
        <div style={{ minHeight: '65vh' }}>
          <Form form={formRef} {...layout} labelAlign="right" initialValues={formInitialValues} style={{ display: loading_get ? 'none' : 'block' }}>
            <div className="fontMb">
              {/* 基本信息 */}
              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">基本信息</div>
              </Form.Item>
              <Form.Item name="orgName" label="企业名称" rules={[{ required: isEdit, message: '请输入企业名称' }]}>
                <Input placeholder="请输入企业名称" readOnly={!isEdit} bordered={isEdit} />
              </Form.Item>
              <Form.Item name="hotLine" label="企业客服热线" rules={[{ required: true, message: '企业客服热线不能为空' }]}>
                <Input placeholder="请输入企业客服热线" readOnly={!isEdit} bordered={isEdit} />
              </Form.Item>
              {/*{!isEdit && (*/}
              {/*  <Form.Item name="defaultDistributeCode" label="默认合伙人">*/}
              {/*    <Input  bordered={isEdit} />*/}
              {/*  </Form.Item>*/}
              {/*)}*/}
              <Form.Item name="expressPersonPhoneNumber" label="收件人手机号" rules={[{ required: true, message: '收件人手机号不能为空' }]}>
                <Input readOnly={!isEdit} bordered={isEdit} />
              </Form.Item>
              <Form.Item name="expressPersonName" label="收件人姓名" rules={[{ required: true, message: '收件人姓名不能为空' }]}>
                <Input readOnly={!isEdit} bordered={isEdit} />
              </Form.Item>
              <Form.Item name="expressAddressInfo" label="退货地址" rules={[{ required: true, message: '退货地址不能为空' }]} style={{ marginBottom: 20 }}>
                <Input.TextArea readOnly={!isEdit} bordered={isEdit} />
              </Form.Item>

              <Form.Item name="defaultDistributeCode" label="默认合伙人">
                <FetchSelect
                  disabled={!isEdit}
                  placeholder="请选择默认合伙人"
                  api="/web/staff/member/getSalePersonList"
                  valueKey="distributeCode"
                  textKey="personPhoneNumber"
                  //搜索
                  showSearch
                  filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">小程序设置</div>
              </Form.Item>
              <Form.Item name="mallType" label="商城类型" initialValue="ordinary">
                <Radio.Group>
                  <Radio value="ordinary">普通版</Radio>
                  <Radio value="doctor">医生版</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="joinMe" label="是否有加入我们" initialValue="0">
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="ifFission" label="是否裂变" initialValue="1">
                <Radio.Group>
                  <Radio value="0">是</Radio>
                  <Radio value="1">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="displaySale" label="是否显示销售佣金" initialValue="1">
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="report" label="是否提报管理" initialValue="1">
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="introduce" label="是否有加入介绍" initialValue="1">
                <Radio.Group onChange={introduceChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="加入封面" name="cover" rules={[{ required: true, message: '请上传加入封面图片' }]}>
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
              {introduce == '1' ? (
                <Form.Item label="介绍图片" name="introduceImg">
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
              ) : null}

              <Form.Item name="ifUseFrontPage" label="是否有启动页" initialValue="0">
                <Radio.Group onChange={frontPageChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              {frontPageShow == '1' ? (
                <Form.Item label="启动页图片" name="frontPagePic" rules={[{ required: true, message: '请上传启动页图片' }]}>
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
              ) : null}
              <Form.Item name="ifMembership" label="是否有会员" initialValue="0">
                <Radio.Group onChange={memberChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              {membership === '1' && (
                <Form.Item name="memberQcode" label="企业会员太阳码">
                  {memberQcodeImg ? <img onClick={() => window.open(memberQcodeImg)} alt="" style={{ width: 100, height: 100, cursor: 'pointer' }} src={memberQcodeImg} /> : '太阳码生成失败！'}
                </Form.Item>
              )}

              <Form.Item name="ifShip" label="是否包邮" initialValue="1">
                <Radio.Group onChange={shipChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>

              {shipShow === '0' ? (
                <>
                  <Form.Item label="邮费" name="freightFeeStr" rules={[{ required: true, message: '请输入邮费' }]}>
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item label="满" colon={false}>
                    <Form.Item noStyle name="freightOverFeeStr" style={{ marginBottom: 0 }}>
                      <InputNumber precision={2} min={0} />
                    </Form.Item>
                    <span>元包邮</span>
                  </Form.Item>
                </>
              ) : null}

              <Form.Item name="mpMsgOrderUnpay" label="付款提醒模板ID">
                <Input readOnly={true} bordered={false} />
              </Form.Item>

              <Form.Item name="mpMsgOrderDeliver" label="发货提醒模板ID">
                <Input readOnly={true} bordered={false} />
              </Form.Item>

              <Form.List name="hotWordStr">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        wrapperCol={{
                          xs: { span: 16, offset: 8 },
                          sm: { span: 16, offset: 8 },
                        }}
                        required={false}
                        key={field.key}
                        style={{ marginBottom: 6 }}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: '请输入',
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="请输入" readOnly={!isEdit} bordered={isEdit} style={{ width: '60%' }} />
                        </Form.Item>
                        {fields.length > 1 && isEdit && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                      </Form.Item>
                    ))}
                    <Form.Item
                      wrapperCol={{
                        xs: { span: 16, offset: 8 },
                        sm: { span: 16, offset: 8 },
                      }}
                    >
                      <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />} disabled={!isEdit}>
                        添加热词
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>

              {/* 商户信息 */}
              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">乐薪商户</div>
              </Form.Item>
              <Form.Item name="merchantName" label="商户名称">
                <Input readOnly={true} bordered={false} />
              </Form.Item>
              <Form.Item name="merchantCode" label="商户编码">
                <Input readOnly={true} bordered={false} />
              </Form.Item>
              <Form.Item name="appKey" label="appKey">
                <Input readOnly={true} bordered={false} />
              </Form.Item>
              <Form.Item name="secretKey" label="加密秘钥">
                <Input readOnly={true} bordered={false} />
              </Form.Item>
              {/* 提现设置 */}
              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">微信商户</div>
              </Form.Item>
              {/*<Form.Item name="catchOutMethod" label="提现方式" initialValue="1">*/}
              {/*  <Radio.Group disabled={!isEdit}>*/}
              {/*    <Radio value="1">支付宝</Radio>*/}
              {/*    <Radio value="0">银行卡</Radio>*/}
              {/*  </Radio.Group>*/}
              {/*</Form.Item>*/}
              <Form.Item name="weCharAppId" label="小程序appId">
                <Input readOnly={true} bordered={false} />
              </Form.Item>
              <Form.Item name="weCharAppSecret" label="小程序AppSecret">
                <Input readOnly={true} bordered={false} />
              </Form.Item>

              {special ? (
                <>
                  <Form.Item name="weCharCode" label="服务商商户">
                    <Input readOnly={true} bordered={false} />
                  </Form.Item>
                  <Form.Item name="weCharSubMchId" label="特约商户子商户号">
                    <Input readOnly={true} bordered={false} />
                  </Form.Item>
                  {ifSplitBill ? (
                    <>
                      <Form.Item style={{ marginBottom: 0 }} label="分账比例">
                        <Form.Item
                          name="splitBillPct"
                          rules={[{ required: true, message: '请输入分账比例' }]}
                          style={{
                            display: 'inline-block',
                            width: 'calc(20% - 8px)',
                          }}
                        >
                          <Input readOnly={true} bordered={false} />
                        </Form.Item>
                        <Form.Item
                          style={{
                            display: 'inline-block',
                            width: 'calc(50% - 8px)',
                          }}
                        >
                          %
                        </Form.Item>
                      </Form.Item>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <Form.Item name="weCharCode" label="微信商户号">
                    <Input readOnly={true} bordered={false} />
                  </Form.Item>
                  <Form.Item name="weCharSecretKey" label="微信密钥">
                    <Input readOnly={true} bordered={false} />
                  </Form.Item>
                  <Form.Item label="微信证书" name="weCharCertificate">
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
                      disabled={true}
                    />
                  </Form.Item>
                </>
              )}
              <Form.Item name="quota" label="每月提现总额上限(元)" rules={[{ required: true, message: '请输入每月提现总额上限' }]}>
                <InputNumber min={0} readOnly={!isEdit} bordered={isEdit} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="minMoney" label="最低提现金额(元)" rules={[{ required: true, message: '请输入最低提现金额' }]}>
                <InputNumber min={0} readOnly={!isEdit} bordered={isEdit} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="maxMoney" label="最大提现金额(元)" rules={[{ required: true, message: '请输入最大提现金额' }]}>
                <InputNumber min={0} readOnly={!isEdit} bordered={isEdit} style={{ width: '100%' }} />
              </Form.Item>
              {/* 小程序设置 */}
              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">小程序设置</div>
              </Form.Item>

              <Form.Item name="shareName" label="小程序名称" rules={[{ required: true, message: '请输入小程序名称' }]}>
                <Input readOnly={!isEdit} bordered={isEdit} />
              </Form.Item>
              <Form.Item name="shareDesc" label="分享信息描述" rules={[{ required: true, message: '请输入分享信息描述' }]}>
                <Input readOnly={!isEdit} bordered={isEdit} />
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
              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">邀请合伙人设置</div>
              </Form.Item>

              <Form.Item name="saleDesc" label="邀请合伙人信息描述" rules={[{ required: true, message: '请输入邀请合伙人信息描述' }]}>
                <Input readOnly={!isEdit} bordered={isEdit} />
              </Form.Item>
              <Form.Item label="邀请合伙人分享图片" name="saleImage" rules={[{ required: true, message: '请上传邀请合伙人分享图片' }]}>
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

              {/* 操作 */}
              <Form.Item {...layoutFail}>
                <Row gutter={10}>
                  {!isEdit && (
                    <Col>
                      <Button type="primary" onClick={clickEdit}>
                        编辑
                      </Button>
                    </Col>
                  )}
                  {isEdit && (
                    <Fragment>
                      <Col>
                        <Button onClick={clickCancel}>取消</Button>
                      </Col>
                      <Col>
                        <Button type="primary" onClick={clickSubmit} loading={loading_submit}>
                          保存
                        </Button>
                      </Col>
                    </Fragment>
                  )}
                </Row>
              </Form.Item>
            </div>
          </Form>

          {loading_get && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default Index
