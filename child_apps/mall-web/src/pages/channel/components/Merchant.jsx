import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
import { Form, Input, InputNumber, Radio, Row, Select } from 'antd'
import BUpload from '@/components/BUpload'
import api_common from '@/services/api/common'
import { getWXMchList } from '@/pages/channel/SpreadCompany/service'
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

const Merchant = forwardRef((props, ref) => {
  const { isEdit, supplierList, recordData } = props

  const [newForm] = Form.useForm()
  const [merchantActive, setMerchantActive] = useState(recordData.ifTyWxMch || '1')
  const [account, setAccount] = useState(recordData.ifSplitBill === 0 ? 0 : 1)
  const [merchantData, setMerchantData] = useState([])

  useEffect(() => {
    getWXMchList_()
  }, [])
  //是否特约商户改变
  const merchantChange = (e) => {
    setMerchantActive(e.target.value)
  }
  //是否分账改变
  const accountChange = (e) => {
    setAccount(e.target.value)
  }
  //获取特约商户下拉
  const getWXMchList_ = async () => {
    let res = await getWXMchList()
    if (res && res.code === '0') {
      setMerchantData(res.data)
    }
  }

  return (
    <>
      <div>
        <Form ref={ref} form={newForm} {...layout} labelAlign="right">
          <div>
            {/* 商户信息 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20" style={{ margin: 0 }}>
                商户信息
              </div>
            </Form.Item>
            <Form.Item name="mchName" label="商户名称(乐薪)" rules={[{ required: true, message: '商户名称不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="mchCode" label="商户编码(乐薪)" rules={[{ required: true, message: '商户编码不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="appKey" label="乐薪APP_KEY" rules={[{ required: true, message: '乐薪APP_KEY不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="threeDesKey" label="乐薪des密匙" rules={[{ required: true, message: '乐薪des密匙不能为空' }]}>
              <Input />
            </Form.Item>
            {/*<Form.Item name="catchOutMethod" label="提现方式" initialValue="1">*/}
            {/*  <Radio.Group>*/}
            {/*    <Radio value="1">支付宝</Radio>*/}
            {/*    <Radio value="0">银行卡</Radio>*/}
            {/*  </Radio.Group>*/}
            {/*</Form.Item>*/}

            <Form.Item name="quota" label="每月提现总额上限(元)" rules={[{ required: true, message: '请输入每月提现总额上限' }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="minMoney" label="最低提现金额(元)" rules={[{ required: true, message: '请输入最低提现金额' }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="maxMoney" label="最大提现金额(元)" rules={[{ required: true, message: '请输入最大提现金额' }]}>
              <InputNumber min={0} />
            </Form.Item>
            {/* 联系信息 */}

            {/* 提现设置 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20" style={{ margin: 0 }}>
                提现设置
              </div>
            </Form.Item>
            <Form.Item name="weCharAppId" label="小程序appId" rules={[{ required: true, message: '请输入小程序appId' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="weCharAppSecret" label="小程序AppSecret" rules={[{ required: true, message: '请输入小程序AppSecret' }]}>
              <Input />
            </Form.Item>

            <Form.Item name="ifTyWxMch" label="是否为特约商户" initialValue="1" rules={[{ required: true, message: '请选择' }]}>
              <Radio.Group onChange={merchantChange}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
            {merchantActive == '0' ? (
              <>
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
              </>
            ) : (
              <>
                <Form.Item name="specialWeCharCode" label="服务商商户" rules={[{ required: true, message: '请选择服务商商户' }]}>
                  <Select>
                    {merchantData.map((r) => (
                      <Select.Option key={r.wxMchId} value={r.wxMchId}>
                        {r.wxMchName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="weCharSubMchId" label="特约商户子商户号" rules={[{ required: true, message: '请输入特约商户商户号' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="ifSplitBill" label="是否分账" rules={[{ required: true, message: '请选择是否分账' }]} initialValue={1}>
                  <Radio.Group onChange={accountChange}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                {account === 1 ? (
                  <>
                    <Form.Item style={{ marginBottom: 0 }} label="分账比例">
                      <Form.Item
                        name="splitBillPct"
                        rules={[{ required: true, message: '请输入分账比例' }]}
                        style={{
                          display: 'inline-block',
                          width: 'calc(20% - 8px)',
                          marginBottom: 6,
                        }}
                      >
                        <InputNumber style={{ width: '100%' }} min={0} max={10} step="0.01" precision={2} />
                      </Form.Item>
                      <Form.Item
                        style={{
                          display: 'inline-block',
                          width: 'calc(50% - 8px)',
                          margin: '0 8px',
                        }}
                      >
                        % &nbsp; &nbsp; 分账比例不能超过10%！
                      </Form.Item>
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

export default Merchant
