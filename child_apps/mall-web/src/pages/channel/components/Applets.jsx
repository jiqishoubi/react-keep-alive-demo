import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
import { Button, Form, Input, Radio } from 'antd'
import BUpload from '@/components/BUpload'
import api_common from '@/services/api/common'
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

const Applets = forwardRef((props, ref) => {
  const { isEdit, supplierList, recordData } = props
  const [newForm] = Form.useForm()
  const [introduce, setIntroduce] = useState(recordData.introduce)
  const [frontPageShow, setFrontPageShow] = useState('0')

  useEffect(() => {
    setFrontPageShow(recordData.ifUseFrontPage || '0')
  }, [recordData])
  const introduceChange = (e) => {
    setIntroduce(e.target.value)
  }

  const frontPageChange = (e) => {
    setFrontPageShow(e.target.value)
  }

  return (
    <>
      <div>
        <Form ref={ref} form={newForm} {...layout} labelAlign="right">
          <div>
            {/* 小程序设置 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20" style={{ margin: 0 }}>
                小程序设置
              </div>
            </Form.Item>
            <Form.Item name="ifH5" label="H5商场配置" initialValue="0" rules={[{ required: true, message: '乐薪des密匙不能为空' }]}>
              <Radio.Group>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="H5商场地址" wrapperCol={{ span: 24 }}>
              <Form.Item name="scode" style={{ display: 'inline-block', width: 'calc(66% - 8px)' }}>
                <Input bordered={false} disabled={true} />
              </Form.Item>
              {/*<Form.Item  style={{display: 'inline-block'}}>*/}
              {/*  <Button type='primary' style={{borderRadius:12}}>复制</Button>*/}
              {/*</Form.Item>*/}
            </Form.Item>
            <Form.Item name="introduce" label="是否有合伙人介绍" initialValue="1" rules={[{ required: true, message: '请选择' }]}>
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
              <Form.Item label="介绍图片" name="introduceImg" rules={[{ required: true, message: '请上传加入介绍图片' }]}>
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

            <Form.Item name="subscribeAppId" label="公众号AppId">
              <Input />
            </Form.Item>
            <Form.Item name="subscribeAppSecret" label="公众号AppSecret">
              <Input />
            </Form.Item>

            <Form.Item name="mpMsgOrderUnpay" label="付款提醒模板ID">
              <Input />
            </Form.Item>

            <Form.Item name="mpMsgOrderDeliver" label="发货提醒模板ID">
              <Input />
            </Form.Item>

            <Form.Item name="chnlCode" label="跳转渠道码">
              <Input />
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
                        <Input placeholder="请输入" style={{ width: '60%' }} />
                      </Form.Item>
                      {fields.length > 1 ? <MinusCircleOutlined onClick={() => remove(field.name)} /> : null}
                    </Form.Item>
                  ))}
                  <Form.Item
                    wrapperCol={{
                      xs: { span: 16, offset: 8 },
                      sm: { span: 16, offset: 8 },
                    }}
                  >
                    <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />}>
                      添加热词
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            {/* 小程序分享设置 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20" style={{ margin: 0 }}>
                小程序分享设置
              </div>
            </Form.Item>
            <Form.Item name="shareName" label="小程序名称" rules={[{ required: true, message: '请输入小程序名称' }]}>
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

            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20" style={{ margin: 0 }}>
                邀请合伙人设置
              </div>
            </Form.Item>
            <Form.Item name="saleDesc" label="邀请合伙人信息描述" rules={[{ required: true, message: '请输入邀请合伙人信息描述' }]}>
              <Input />
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
          </div>
        </Form>
      </div>
    </>
  )
})

export default Applets
