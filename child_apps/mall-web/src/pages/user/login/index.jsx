import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'dva'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, CodeSandboxCircleFilled } from '@ant-design/icons'
import { globalHost, randomStrKey } from '@/utils/utils'
import api_login from '@/services/api/login'
import styles from './index.less'

const index = (props) => {
  const loginFormRef = useRef()
  const { dispatch, loadingBtn } = props

  const onFinish = (values) => {
    dispatch({
      type: 'login/login',
      payload: {
        ...values,
        captchaKey: mykey,
      },
    }).then((flag) => {
      if (!flag) {
        refreshMykey()
      }
    })
  }

  //图形验证码
  const captchaKey = 'captcha'
  const [mykey, setMykey] = useState(randomStrKey())

  useEffect(() => {
    if (loginFormRef && loginFormRef.current) {
      loginFormRef.current.resetFields([captchaKey])
    }
  }, [mykey])

  const refreshMykey = () => {
    setMykey(randomStrKey())
  }
  //图形验证码 end

  // // 校验码图片样式
  // const suffix = (
  //   <div>
  //     <img src={globalHost() + api_login.getCaptchaApi + mykey} alt='' onClick={refreshMykey}
  //          style={{ width: 88, height: 31, marginLeft: 10 }} />
  //   </div>
  // );

  return (
    <>
      <div>
        <div>
          <div className={styles.login_form}>
            <div className={styles.form_title}>账号登录</div>
            <Form className={styles.panel} ref={loginFormRef} name="login" onFinish={onFinish}>
              <Form.Item name="loginName" rules={[{ required: true, message: '请输入账号' }]} className="loginItem">
                <Input
                  placeholder="请输入账号"
                  className={styles.loginInput}
                  prefix={<img src={require('../../../assets/loginusername.png')} alt="" className={styles.inputImg} />}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
              <Form.Item name="loginPassword" rules={[{ required: true, message: '请输入密码' }]} className="loginItem">
                <Input.Password
                  placeholder="请输入密码"
                  className={styles.loginInput}
                  prefix={<img src={require('../../../assets/loginpsw.png')} alt="" className={styles.inputImg} />}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name={captchaKey} rules={[{ required: true, message: '请输入验证码' }]} noStyle>
                  <Input
                    suffix={
                      <div>
                        <img src={globalHost() + api_login.getCaptchaApi + mykey} alt="" onClick={refreshMykey} style={{ width: 88, height: 31, marginLeft: 10 }} />
                      </div>
                    }
                    className={styles.loginInput}
                    prefix={<img className={styles.inputImg} src={require('../../../assets/logincode.png')} alt="" />}
                    allowClear
                    placeholder="请输入验证码"
                    maxLength={4}
                    style={{ borderRadius: 6 }}
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <div style={{ marginTop: '33px' }}>
                  <Button type="primary" block style={{ background: '#0080CB', borderRadius: 6 }} htmlType="submit" loading={loadingBtn} className={styles.loginButton}>
                    确认登录
                  </Button>
                </div>
              </Form.Item>
            </Form>
            <div style={{ color: '#9B9B9B', textAlign: 'center', fontSize: 13 }}>如需注册账号，请联系客服</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default connect(({ login, loading }) => ({
  login,
  loadingBtn: loading.effects['login/login'] || loading.effects['login/getMenuRightsFunc'],
}))(index)
