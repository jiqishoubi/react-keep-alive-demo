import React, { Component } from 'react'
import { Modal, Input, Button, Form, Select } from 'antd'

export default class InputModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
    this.formRef = React.createRef()
    this.inputRef = React.createRef()

    this.resolveFunc = null
    this.rejectFunc = null
  }

  componentDidMount() {
    this.props.onRef?.(this)
  }

  open = () => {
    return new Promise((resolve, reject) => {
      this.setState({ visible: true }, () => {
        //自动 焦点
        setTimeout(() => {
          if (this.inputRef && this.inputRef.current) this.inputRef.current.focus()
        }, 50)
      })

      this.resolveFunc = resolve
      this.rejectFunc = reject
    })
  }

  close = () => {
    this.formRef.current.resetFields()
    this.setState({ visible: false })
  }

  onCancel = () => {
    this.close()
    this.rejectFunc?.(false)
  }

  onOk = async () => {
    const values = await this.formRef.current.validateFields()
    this.close()
    this.resolveFunc?.(values.name)
  }

  render() {
    const { visible } = this.state
    const { allWareHouseList, warehouse } = this.props
    return (
      <Modal
        title="添加规格"
        visible={visible}
        onCancel={this.onCancel}
        destroyOnClose
        footer={[
          <Button key="cancel" style={{ borderRadius: '4px' }} onClick={this.onCancel}>
            取消
          </Button>,
          <Button key="ok" style={{ borderRadius: '4px' }} type="primary" onClick={this.onOk}>
            确定
          </Button>,
        ]}
      >
        <Form ref={this.formRef} onFinish={this.onOk}>
          <Form.Item name="name" rules={[{ required: true, message: '请输入规格' }]}>
            <Input ref={this.inputRef} placeholder="请输入规格" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
