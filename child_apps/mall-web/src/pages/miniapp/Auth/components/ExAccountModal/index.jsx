import React, { Component } from 'react'
import { Form, Modal, Input, Button, message } from 'antd'
import { bindTesterAjax } from '../../../services/miniapp'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
    }
    this.formRef = React.createRef()
  }
  open = () => {
    this.setState({ visible: true })
  }
  close = () => {
    this.setState({ visible: false }, () => {
      this.formRef.current.resetFields()
    })
  }
  cancel = () => {
    this.close()
  }
  submit = async () => {
    const { miniapp, dispatch } = this.props
    const { appid } = miniapp
    let values = await this.formRef.current.validateFields()
    let postData = {
      app_id: appid,
      ...values,
    }
    this.setState({ loading: true })
    let res = await bindTesterAjax(postData)
    if (!window.isProd) console.log('绑定体验者结果', res)
    this.setState({ loading: false })
    if (res && res.code == 200 && res.data && res.data.errcode == 0) {
      message.success('添加体验者成功')
      this.close()
      dispatch({
        type: 'miniapp/getTesterList',
      })
    } else {
      message.warning((res.data && res.data.errmsg) || res.message || '添加失败')
    }
  }
  render() {
    const { visible, loading } = this.state
    return (
      <Modal
        visible={visible}
        title="绑定体验成员"
        onCancel={this.cancel}
        footer={[
          <Button key="cancel" onClick={this.cancel}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={this.submit} loading={loading}>
            确定
          </Button>,
        ]}
      >
        <Form ref={this.formRef}>
          <Form.Item name="wechatid" rules={[{ required: true, message: '请输入微信号' }]}>
            <Input placeholder="请输入微信号" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default index
