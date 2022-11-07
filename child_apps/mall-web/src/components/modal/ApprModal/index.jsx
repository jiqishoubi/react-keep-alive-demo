import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Radio, Form, Input, message } from 'antd'
import StyledModal from '@/components/modal/StyledModal'
import { isPromise } from '@/utils/utils'

/**
注：form中的值
ifApprPass 1 是 2 否
apprNote 说明
 */

/**
 *
 * @param {*} props
 * @param {boolean} [props.isShowNote=true]
 * @param {function} props.onSuccess
 * @returns
 */
function Index(props, ref) {
  const { isShowNote = true, onSuccess } = props

  const [visible, setVisible] = useState(false)
  const [formRef] = Form.useForm()

  const promiseAjaxRef = useRef()
  const [loading, setLoading] = useState(false)
  /**
   *
   * @param {object} options
   * @param {any} options.payload
   * @param {Promise} options.promiseAjax
   */
  function open(options = {}) {
    const { payload = {}, promiseAjax } = options
    setVisible(true)
    if (promiseAjax) {
      promiseAjaxRef.current = function (args) {
        return promiseAjax(payload, args)
      }
    }
  }
  function close() {
    formRef.resetFields()
    setVisible(false)
  }
  async function onOk() {
    const values = await formRef.validateFields()
    if (promiseAjaxRef.current) {
      setLoading(true)
      promiseAjaxRef
        .current(values)
        .finally(() => {
          setLoading(false)
        })
        .then(() => {
          message.success('操作成功')
          onSuccess && onSuccess()
          close()
        })
    }
  }

  useImperativeHandle(ref, () => ({
    open,
  }))

  return (
    <StyledModal title="审核" visible={visible} onCancel={close} onOk={onOk} width={620} confirmLoading={loading} centered={false}>
      <Form form={formRef}>
        <Form.Item name="ifApprPass" label="是否审核通过" initialValue={1}>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {isShowNote && (
          <Form.Item noStyle shouldUpdate>
            {(form) => {
              const ifApprPassVal = form.getFieldValue('ifApprPass')
              return ifApprPassVal == 1 ? null : (
                <Form.Item name="apprNote" rules={[{ required: true, message: '请输入说明' }]} label="说明">
                  <Input placeholder="请输入说明" allowClear />
                </Form.Item>
              )
            }}
          </Form.Item>
        )}
      </Form>
    </StyledModal>
  )
}

export default forwardRef(Index)
