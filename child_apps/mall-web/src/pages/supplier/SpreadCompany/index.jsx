import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Modal, Button, message, Space, Table, Radio, InputNumber, Row, Col, Spin } from 'antd'
import { useRequest } from 'ahooks'
import BUpload from '@/components/BUpload'
import { haveCtrlElementRight } from '@/utils/utils'
import { getSupplierInfo, supplierUpdate } from './service'
import api_common from '@/services/api/common'

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

  /**
   * 请求
   */

  //获取信息
  const {
    data: companyInfo,
    loading: loading_get,
    run: run_get,
  } = useRequest(getSupplierInfo, {
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

  /**
   * 方法
   */

  function renderBack() {
    let data
    data = companyInfo
    const formData = {
      ...data,
      merchantName: data.mchName,
      merchantCode: data.mchCode,
      secretKey: data.threeDesKey,
      catchOutMethod: data.catchOutMethod == 'ALIPAY' ? '1' : '0',
    }
    setFormInitialValues(formData)
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
              <Form.Item name="orgName" label="企业名称">
                <Input bordered={false} disabled={true} />
              </Form.Item>
              <Form.Item name="orgDesc" label="企业描述">
                <Input bordered={false} disabled={true} />
              </Form.Item>
              <Form.Item label="企业图标" name="orgIcon">
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
              {/* <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">微信配置信息</div>
              </Form.Item>
              <Form.Item name="subMchId" label="子商户号">
                <Input bordered={false} disabled={true} />
              </Form.Item> */}
              {/*/!* 商户信息 *!/*/}
              {/*<Form.Item wrapperCol={{ span: 24 }}>*/}
              {/*  <div className="marginlr20">商户信息</div>*/}
              {/*</Form.Item>*/}
              {/*<Form.Item*/}
              {/*  name="merchantName"*/}
              {/*  label="商户名称"*/}
              {/*  rules={[{ required: isEdit, message: '请输入商户名称' }]}*/}
              {/*>*/}
              {/*  <Input placeholder="请输入商户名称" readOnly={!isEdit} bordered={isEdit} />*/}
              {/*</Form.Item>*/}
              {/*<Form.Item*/}
              {/*  name="merchantCode"*/}
              {/*  label="商户编码"*/}
              {/*  rules={[{ required: isEdit, message: '请输入商户编码' }]}*/}
              {/*>*/}
              {/*  <Input placeholder="请输入商户编码" readOnly={!isEdit} bordered={isEdit} />*/}
              {/*</Form.Item>*/}
              {/*<Form.Item*/}
              {/*  name="appKey"*/}
              {/*  label="appKey"*/}
              {/*  rules={[{ required: isEdit, message: '请输入appKey' }]}*/}
              {/*>*/}
              {/*  <Input placeholder="请输入appKey" readOnly={!isEdit} bordered={isEdit} />*/}
              {/*</Form.Item>*/}
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
