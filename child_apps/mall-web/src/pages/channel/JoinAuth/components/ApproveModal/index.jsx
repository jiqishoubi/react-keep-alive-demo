import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Modal, Form, Radio, Input, message } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { approveDistributeAjax } from '../../services'

const { TextArea } = Input

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
}

/**
 *
 * @param {object} props
 * @param {function} [props.onSuccess]
 */
function Index(props, ref) {
  useImperativeHandle(ref, () => ({
    open,
    close,
  }))

  const [formRef] = Form.useForm()
  const [codeStr, setCodeStr] = useState('') //审核的入参 逗号连接的code
  const [visible, setVisible] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [radiusShow, setRadiusShow] = useState(true)
  const [developCode, setDevelopCode] = useState('')

  /**
   * 方法
   */

  /**
   * @param {string} codeStrParam
   */
  function open(codeStrParam, developCode) {
    if (codeStrParam) setCodeStr(codeStrParam)
    setDevelopCode(developCode)

    setVisible(true)
  }

  function close() {
    formRef.resetFields()
    setRadiusShow(true)
    setVisible(false)
    setCodeStr('')
  }

  async function submit() {
    const values = await formRef.validateFields()
    const postData = {
      distributeCode: codeStr,
      ...values,
    }
    setBtnLoading(true)
    const res = await approveDistributeAjax(postData)
    setBtnLoading(false)
    if (!res || res.code !== '0') {
      message.warning((res && res.message) || '网络异常')
      return
    }
    //成功
    message.success('操作成功')
    close()
    if (props.onSuccess) props.onSuccess()
  }
  const radioChange = (e) => {
    let key = e.target.value
    if (key === 'Y') {
      setRadiusShow(true)
    } else {
      setRadiusShow(false)
    }
  }

  /**
   * 副作用
   */

  /**
   * 渲染
   */

  return (
    <Modal destroyOnClose={true} title="审核" visible={visible} maskClosable={false} onCancel={close} onOk={submit} confirmLoading={btnLoading}>
      <Form form={formRef} {...formLayout} preserve={true}>
        <Form.Item label="审核状态" name="approveFlag" initialValue="Y" required>
          <Radio.Group onChange={radioChange}>
            <Radio value="Y">同意</Radio>
            <Radio value="N">拒绝</Radio>
          </Radio.Group>
        </Form.Item>

        {radiusShow && developCode && (
          <>
            <Form.Item label="推广人" name="developCode" rules={[{ required: true, message: '请选择推广人' }]}>
              <FetchSelect api="/web/staff/member/getDistributeHeadList" valueKey="distributeCode" textKey="personName" placeholder="请选择推广人" />
            </Form.Item>
          </>
        )}
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.approveFlag !== curValues.approveFlag}>
          {(form) => {
            return (
              <Form.Item
                label="审核备注"
                name="approveNote"
                rules={[
                  {
                    required: form.getFieldValue('approveFlag') == 'N',
                    message: '请输入审核说明',
                  },
                ]}
              >
                <TextArea placeholder="请输入..." />
              </Form.Item>
            )
          }}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(Index)
