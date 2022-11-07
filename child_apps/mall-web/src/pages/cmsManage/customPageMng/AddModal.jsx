import React, { Component } from 'react'
import { Modal, Form, Input, message, InputNumber } from 'antd'
import { addAjax, updateAjax } from './services'
import UploadImg from '@/components/T-Upload2'
import Button from 'antd/es/button'
import { getOrgKind } from '@/utils/utils'
/**
 * props
 *
 * open : record
 */

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

const getInitialValues = (lookingRecord) => {
  if (!lookingRecord) return {}

  if (lookingRecord.templateImage) {
    lookingRecord.templateImage = [lookingRecord.templateImage]
  }
  return {
    ...lookingRecord,
  }
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      lookingRecord: null,
      //loading
      loading_btn: false,
    }
    this.form = React.createRef()
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }
  open = (params) => {
    if (params && params?.record.templateImage) {
      params.record.templateImage = [params.record.templateImage]
    }
    this.setState(
      {
        visible: true,
        lookingRecord: (params && params.record) || null,
      },
      () => {
        setTimeout(() => {
          this.form.current.setFieldsValue(params?.record)
        }, 100)
      }
    )
  }
  close = () => {
    this.setState({
      visible: false,
      lookingRecord: null,
    })
  }
  sumbmit = async () => {
    const { lookingRecord } = this.state
    const isEdit = lookingRecord && lookingRecord.templateCode
    let values = await this.form.current?.validateFields()

    if (values.templateImage[0].url) {
      let url = values.templateImage[0].url
      values['templateImage'] = url
    } else {
      message.warn('请上传图片')
      return
    }

    if (!window.isProd) console.log('表单值', values)

    let postData = {
      templateCode: (isEdit && lookingRecord.templateCode) || null,
      ...values,
    }

    let res
    this.setState({ loading_btn: true })
    if (isEdit) {
      res = await updateAjax(postData)
    } else {
      res = await addAjax(postData)
    }
    this.setState({ loading_btn: false })
    if (!window.isProd) console.log('提交结果', res)

    // 成功
    // message.success(isEdit ? '保存成功' : '添加成功')
    this.close()
    if (this.props.onSuccess) this.props.onSuccess()
  }
  render() {
    const { visible, loading_btn } = this.state

    return (
      <Modal
        title="自定义页面"
        visible={visible}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={loading_btn}
        footer={[
          <Button key="back" onClick={this.close}>
            取消
          </Button>,
          getOrgKind().isCompany && (
            <Button key="submit" type="primary" onClick={this.sumbmit}>
              确定
            </Button>
          ),
        ]}
      >
        <Form ref={this.form} {...formItemLayout}>
          <Form.Item label="活动名称" name="templateName" required rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="分享图片" name="templateImage" required rules={[{ required: true, message: '请上传图片' }]}>
            <UploadImg length={1} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Index
