import { Space, Modal, message, Form, Input, Button } from 'antd'
import { connect } from 'dva'
import React, { useState } from 'react'
import AvatarDropdown from './AvatarDropdown'
import { Retreat, UpdatePassword } from '@/services/login'
import styles from './index.less'
import { localDB } from '@/utils/utils'
import { loginStateKey } from '@/utils/consts'
import { router } from 'umi'

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
}
const spaceSize = 10

const GlobalHeaderRight = (props) => {
  const { login } = props

  const [leave, setleave] = useState(false)
  const [basic, setbasic] = useState(false)
  let className = styles.right

  async function handleOk() {
    const res = await Retreat()
    if (res && res.code === '0') {
      setleave(false)
      localDB.deleteItem(loginStateKey)
      router.replace({
        pathname: '/user/login',
      })
    } else {
      setleave(false)
      localDB.deleteItem(loginStateKey)
      router.replace({
        pathname: '/user/login',
      })
    }
  }

  function handleCancel(e) {
    setleave(false)
  }

  function passwordOk() {
    document.getElementById('updataPassword').click()
  }

  function passwordCancel(e) {
    setbasic(false)
  }
  const [form] = Form.useForm()
  //表单数据
  async function onFinish(values) {
    delete values.username
    if (values.oldPassword == values.newPassword) {
      message.warning('旧密码不能与新密码相同')
      return false
    }
    if (values.newPassword != values.newPasswordRetry) {
      message.warning('两次输入密码不同')
      return false
    }
    const updata = {
      ...values,
    }
    let res = await UpdatePassword(updata)
    if (res && res.code === '0') {
      setleave(false)
      localDB.deleteItem(loginStateKey)
      router.replace({
        pathname: '/user/login',
      })
    } else {
      message.error(res.message)
    }
  }

  const loginName = login?.loginInfo?.loginName || ''

  return (
    <div style={{ position: 'relative' }} className={className + ' font14'}>
      <Space size={spaceSize}>
        <div style={{ color: '#969696', fontSize: '14px' }}>{loginName}</div>
        <div onClick={() => setbasic(true)} style={{ color: '#969696', fontSize: '14px', cursor: 'pointer' }}>
          修改密码
        </div>
        <div style={{ color: '#969696' }}>|</div>
        <div
          style={{
            marginRight: '18px',
            color: '#969696',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={() => setleave(true)}
        >
          安全退出
        </div>
      </Space>

      <Modal style={{ width: 400 }} title="提示" visible={leave} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
        是否退出登录？
      </Modal>

      <Modal style={{ width: 400 }} title="请输入" visible={basic} onOk={passwordOk} onCancel={passwordCancel} okText="确认" cancelText="取消">
        <Form name="basic" onFinish={onFinish}>
          {/* <Form.Item
            {...formItemLayout}
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入你的账号' }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item {...formItemLayout} label="旧密码" name="oldPassword" rules={[{ required: true, message: '请输入原有密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item {...formItemLayout} label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码' }]}>
            <Input />
          </Form.Item>
          <Form.Item {...formItemLayout} label="确认密码" name="newPasswordRetry" rules={[{ required: true, message: '请输入新密码' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button id="updataPassword" htmlType="submit" type="primary" size="middle"></Button>
          </Form.Item>
        </Form>
      </Modal>

      {/*<AvatarDropdown />*/}
    </div>
  )
}
export default connect(({ login }) => ({
  login,
}))(GlobalHeaderRight)
