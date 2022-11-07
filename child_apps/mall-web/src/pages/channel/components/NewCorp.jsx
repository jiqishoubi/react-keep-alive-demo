import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
import { Form, Input, InputNumber, Radio, Checkbox, Row, Col } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import requestw from '@/utils/requestw'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

const NewCorp = forwardRef((props, ref) => {
  const { isEdit, supplierList, recordData } = props
  const [newForm] = Form.useForm()
  const [radioShow, setRadioShow] = useState(true)
  const [record, setRecord] = useState(true)
  const [shipShow, setShipShow] = useState('0')

  const [membership, setMembership] = useState('0')
  const [memberQcodeImg, setMemberQcodeImg] = useState('')
  const [memberOrgCode, setMemberOrgCode] = useState('')

  useEffect(() => {
    setShipShow(recordData.ifShip)
    setMemberOrgCode(recordData.orgCode)
    setMembership(recordData.ifMembership)
    if (recordData.ifMembership === '1' && recordData.orgCode) getQcode(recordData.orgCode)
  }, [recordData])

  useEffect(() => {
    if (!isEdit && supplierList && Array.isArray(supplierList) && supplierList.length) {
      const data = []
      supplierList.filter((r) => data.push(r.orgCode))
      newForm.setFieldsValue({
        supplierListStr: data,
      })
    }
  }, [supplierList])

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

  const checkOnChange = (checkedValues) => {
    if (recordData.supplierListStr && record) {
      let data = recordData.supplierListStr.split(',')
      let checkData = checkedValues[0]
      if (data.indexOf(checkData) === -1 && checkData !== undefined) {
        data.push(checkData)
      }
      newForm.setFieldsValue({
        supplierListStr: data,
      })
      setRecord(false)
    }
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

  return (
    <>
      <div>
        <Form ref={ref} form={newForm} {...layout} labelAlign="right">
          <div>
            {/* 基本信息 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20" style={{ margin: 0 }}>
                企业信息
              </div>
            </Form.Item>
            {/*<div className="newflex"></div>*/}
            <Form.Item name="orgName" label="企业名称" rules={[{ required: true, message: '企业名称不能为空' }]}>
              <Input />
            </Form.Item>
            {!isEdit && (
              <>
                <Form.Item name="staffName" label="企业管理员姓名" rules={[{ required: true, message: '企业管理员姓名不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="staffPhoneNumber" label="企业管理员电话" rules={[{ required: true, message: '企业管理员电话不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="staffLoginName" label="企业管理员登录账号" rules={[{ required: true, message: '企业管理员登录账号不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="staffPassword" label="登录密码" rules={[{ required: true, message: '登录密码不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="confirmStaffPassword" label="确认密码" rules={[{ required: true, message: '密码不能为空' }]}>
                  <Input />
                </Form.Item>
              </>
            )}

            <Form.Item name="hotLine" label="企业客服热线" rules={[{ required: true, message: '企业客服热线不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="expressPersonPhoneNumber" label="收件人手机号" rules={[{ required: true, message: '收件人手机号不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="expressPersonName" label="收件人姓名" rules={[{ required: true, message: '收件人姓名不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="expressAddressInfo" label="退货地址" rules={[{ required: true, message: '退货地址不能为空' }]} style={{ marginBottom: 20 }}>
              <Input.TextArea />
            </Form.Item>

            {isEdit && (
              <Form.Item name="defaultDistributeCode" label="默认合伙人">
                <FetchSelect
                  placeholder="请选择默认合伙人"
                  api="/web/admin/member/getSalePersonList"
                  valueKey="distributeCode"
                  textKey="personPhoneNumber"
                  formData={{
                    orgCode: recordData.orgCode,
                  }}
                  //搜索
                  showSearch
                  filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                />
              </Form.Item>
            )}
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
            <Form.Item name="report" label="是否拥有服务管理" initialValue="1">
              <Radio.Group>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="ifMembership" label="是否有会员" initialValue="0">
              <Radio.Group onChange={memberChange}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
            {membership === '1' && memberOrgCode && (
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
            {supplierList.length ? (
              <Form.Item name="supplierListStr" label="选择供应商">
                <Checkbox.Group style={{ width: '100%' }} onChange={checkOnChange}>
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
            ) : null}

            {/* 推广公司设置 */}
            {!isEdit && (
              <>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <div className="marginlr20" style={{ margin: 0 }}>
                    分润配置
                  </div>
                </Form.Item>
                <Form.Item name="ifSubmitProfitConfig" label="是否配置分润比例" initialValue={1}>
                  <Radio.Group onChange={radioChange}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>

                {radioShow ? (
                  <>
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
          </div>
        </Form>
      </div>
    </>
  )
})

export default NewCorp
