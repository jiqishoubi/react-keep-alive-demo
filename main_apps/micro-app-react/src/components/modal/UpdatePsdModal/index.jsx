import { useImperativeHandle, forwardRef, useState } from 'react'
import { Modal, Form, Input, message } from 'antd'
import request from '@/utils/request'
import { handleTokenFail } from '@/services/login'

function Index(props, ref) {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  function open() {
    setVisible(true)
  }
  function close() {
    setVisible(false)
  }
  async function submit() {
    const values = await form.validateFields()
    const { newPwd1, newPwd2 } = values
    if (newPwd1 !== newPwd2) {
      message.warning('两次输入的新密码不同')
      return
    }
    const postData = {
      pwdType: 'LOGIN',
      // * @param oldPwd    登录人密码修改
      // * @param newPwd1   新密码(非空)
      // * @param newPwd2   新密码确认(非空)
      ...values,
    }
    setLoading(true)
    request({
      url: '/web/updateLoginStaffPassword',
      data: postData,
    })
      .finally(() => setLoading(false))
      .then((data) => {
        message.success('密码修改成功，请重新登录')
        close()
        handleTokenFail()
      })
  }

  useImperativeHandle(ref, () => ({
    open,
  }))
  const label = 5
  return (
    <Modal visible={visible} title="修改密码" onCancel={close} onOk={submit} confirmLoading={loading}>
      <Form form={form} labelCol={{ span: label }} labelWrap={{ span: 24 - label }}>
        <Form.Item label="旧密码" name="oldPwd" rules={[{ required: true, message: '请输入旧密码' }]}>
          <Input.Password placeholder="请输入" />
        </Form.Item>
        <Form.Item label="新密码" name="newPwd1" rules={[{ required: true, message: '请输入新密码' }]}>
          <Input.Password placeholder="请输入" />
        </Form.Item>
        <Form.Item label="确认新密码" name="newPwd2" rules={[{ required: true, message: '请输入再次新密码' }]}>
          <Input.Password placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Index)
