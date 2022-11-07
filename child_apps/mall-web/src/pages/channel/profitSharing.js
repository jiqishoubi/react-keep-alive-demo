/**
 * 企业端 分润规则
 */
import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Modal, Button, message, Space, Table, Radio, InputNumber, Row, Col, Spin } from 'antd'
import { useRequest } from 'ahooks'
import BUpload from '@/components/BUpload'
import { getPromotionCompanyInfor, submitProfitConfig } from './SpreadCompany/service'
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
  const { loading: loading_submit, run: run_submit } = useRequest(submitProfitConfig, {
    manual: true,
  })

  /**
   * 方法
   */

  function renderBack() {
    const formData = {
      ...companyInfo,
      ifSubmitProfitConfig: companyInfo.distributeChildRewardPct || companyInfo.sale1stRewardPct || companyInfo.sale2ndRewardPct ? '1' : '0',
    }
    // try {
    //   const jsonObj = JSON.parse(companyInfo.distributeChildRewardPct);
    //   formData.distributeChildRewardPct = jsonObj.distributeChildRewardPct;
    // } catch (e) {}

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
      <div style={{ minHeight: '65vh' }}>
        <Form form={formRef} {...layout} labelAlign="right" initialValues={formInitialValues} style={{ display: loading_get ? 'none' : 'block' }}>
          <div className="fontMb">
            {/* 基本信息 */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">分润信息</div>
            </Form.Item>

            <Form.Item name="ifSubmitProfitConfig" label="是否配置分润比例" initialValue="1">
              <Radio.Group disabled={!isEdit}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.ifSubmitProfitConfig !== curValues.ifSubmitProfitConfig}>
              {(form) => {
                const ifSubmitProfitConfig = form.getFieldValue('ifSubmitProfitConfig')
                return (
                  ifSubmitProfitConfig == '1' && (
                    <>
                      <Form.Item name="distributeChildRewardPct" label="推广人分润比例(%)" rules={[{ required: true, message: '请输入推广人分润比例' }]}>
                        <InputNumber precision={0} max={100} style={{ width: '100%' }} disabled={!isEdit} />
                      </Form.Item>
                      <Form.Item
                        label="一级合伙人佣金比例(%)"
                        name="sale1stRewardPct"
                        rules={[
                          {
                            required: true,
                            message: '请输入一级合伙人佣金比例',
                          },
                        ]}
                      >
                        <InputNumber precision={0} max={100} style={{ width: '100%' }} disabled={!isEdit} />
                      </Form.Item>
                      <Form.Item
                        label="二级合伙人佣金比例(%)"
                        name="sale2ndRewardPct"
                        rules={[
                          {
                            required: true,
                            message: '请输入二级合伙人佣金比例',
                          },
                        ]}
                      >
                        <InputNumber precision={0} max={100} style={{ width: '100%' }} disabled={!isEdit} />
                      </Form.Item>
                    </>
                  )
                )
              }}
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
    </>
  )
}
export default Index
