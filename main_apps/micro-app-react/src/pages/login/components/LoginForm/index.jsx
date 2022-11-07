import { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import login from '@/store/login'
import { Form, Input, Button } from 'antd'
import { UserOutlined, UnlockOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import InputSMS from '../InputSMS'
import { ENV_CONFIG, setToken } from '@/utils/consts'
import request from '@/utils/request'
import { findFirstMenuUrl } from '@/utils/dealMenu'
import { cloneDeep } from 'lodash'

const Index = () => {
  const history = useHistory()
  const [formRef] = Form.useForm()
  const InputSMSRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)

  //提交
  const handleSubmit = (values) => {
    const postData = {
      loginName: values.loginName,
      loginPassword: values.loginPassword,
      captcha: values.sms.v,
      captchaKey: values.sms.key,
    }
    setSubmitting(true)
    request({
      url: '/web/doLogin',
      data: postData,
    })
      // .finally(() => {
      //   setSubmitting(false)
      // })
      .then(async (data) => {
        console.log('登录成功结果', data)
        //二、初始化信息
        setToken(data.loginSessionId)
        const menuTree = await login.initInfo()
        const fisrtMenu = findFirstMenuUrl({ list: cloneDeep(menuTree) })
        setSubmitting(false)
        //跳转
        goto(fisrtMenu)
      })
      .catch(() => {
        setSubmitting(false)
        InputSMSRef.current?.reset()
      })
  }

  /** 此方法会跳转到 redirect 参数所在的位置 */
  function goto(url) {
    if (!history) return
    history.push(url || '/')
  }

  return (
    <Form form={formRef} onFinish={handleSubmit}>
      <Form.Item name="loginName" required rules={[{ required: true, message: '请输入账号' }]}>
        <Input size="large" placeholder="请输入账号" prefix={<UserOutlined />} allowClear />
      </Form.Item>
      <Form.Item name="loginPassword" required rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password size="large" placeholder="请输入密码" prefix={<UnlockOutlined />} allowClear />
      </Form.Item>
      <Form.Item name="sms" required rules={[{ required: true, message: '请输入验证码' }]}>
        <InputSMS
          ref={InputSMSRef}
          getImgSrc={(key) => {
            return `${ENV_CONFIG.apiPath}/captcha?key=${key}`
          }}
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button size="large" type="primary" htmlType="submit" loading={submitting} style={{ width: '100%', fontSize: 14 }}>
          确认登录
        </Button>
      </Form.Item>
    </Form>
  )
}

export default observer(Index)
