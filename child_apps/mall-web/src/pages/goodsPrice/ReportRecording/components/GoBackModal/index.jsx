/**
 * 回退modal
 * onRef
 * lookingRecord
 * onSuccess
 */
import React, { Component } from 'react'
import { Modal, Form, Input, message } from 'antd'
import requestw from '@/utils/requestw'

const { TextArea } = Input

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading_submit: false,
    }
    this.formRef = React.createRef()
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }
  open = () => {
    this.setState({ visible: true })
  }
  close = () => {
    this.setState({ visible: false })
  }
  submit = async () => {
    const { lookingRecord } = this.props
    const values = await this.formRef.current?.validateFields()
    const postData = {
      ...values,
      orderNumber: lookingRecord.orderNumber,
    }
    this.setState({ loading_submit: true })
    requestw({
      url: '/web/admin/reportAudit/rejectPass',
      data: postData,
    }).then((res) => {
      this.setState({ loading_submit: false })
      if (!res || res.code !== 200) {
        message.warning((res && res.message) || '网络异常')
        return
      }
      //成功
      message.success('操作成功')
      if (this.props.onSuccess) this.props.onSuccess()
      this.close()
    })
  }
  render() {
    const { visible, loading_submit } = this.state

    return (
      <Modal title="回退" visible={visible} onCancel={this.close} onOk={this.submit} confirmLoading={loading_submit} destroyOnClose={true}>
        <Form ref={this.formRef}>
          <Form.Item label="回退原因" name="rejectReason" required rules={[{ required: true, message: '请输入回退原因' }]}>
            <TextArea placeholder="请输入..." maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Index
