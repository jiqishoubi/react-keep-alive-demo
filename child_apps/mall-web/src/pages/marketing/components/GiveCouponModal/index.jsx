import React, { Component } from 'react'
import { Modal, Form, Input, Radio, Row, Col, Button, Select, Upload } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import BUpload from '@/components/BUpload'
import FetchSelect from '@/components/FetchSelect'
import { giveTicketDetailAjax } from '@/services/marketing'
import requestw from '@/utils/requestw'
import styles from './index.less'

/**
 * prop
 *
 * onSuccess
 */

const { Option } = Select

const label = 5
const total = 23
const formLayout = {
  labelCol: { span: label },
  wrapperCol: { span: total - label },
}

const templateUrl = 'https://filedown.bld365.com/bld_mall/20201220121810/template/手工发放优惠券模板.xlsx'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      //form
      isBatch: false,
      fileList: [],
      //loading
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
  //是否批量
  onIsBatchChange = (e) => {
    const value = e.target.value
    this.setState(
      {
        isBatch: value == '1',
        fileList: [],
      },
      () => {
        this.formRef.current?.setFieldsValue({
          phone: '',
          file: '',
        })
        this.formRef.current?.validateFields[('phone', 'file')]
      }
    )
  }
  //上传
  onUploadChange = (e) => {
    this.setState({ fileList: e.fileList }, () => {
      this.formRef.current?.setFieldsValue({
        file: e.fileList.length > 0 ? '1' : '',
      })
    })
  }
  //提交
  submit = async () => {
    const { isBatch, fileList } = this.state
    const values = await this.formRef.current?.validateFields()
    let data
    if (isBatch) {
      let formData = new FormData()
      let fileObj = (fileList[0] && fileList[0].originFileObj) || fileList[0]
      formData.append('file', fileObj)
      formData.append('ticketCode', values.ticketCode)
      data = formData
    } else {
      data = {
        phone: values.phone,
        ticketCode: values.ticketCode,
      }
    }
    this.setState({ loading_submit: true })
    const res = await requestw({
      type: isBatch ? 'formdata' : 'post',
      url: '/web/staff/ticketDetail/giveTicketDetail',
      data: data,
    })
    this.setState({ loading_submit: false })
    if (res && res.code == '0') {
      Modal.success({
        title: '提示',
        content: (res && res.message) || '网络异常',
        onOk: () => {
          this.close()
          if (this.props.onSuccess) this.props.onSuccess()
        },
      })
    } else {
      Modal.warning({
        title: '提示',
        content: (res && res.message) || '网络异常',
      })
    }
  }
  render() {
    const {
      visible,
      //form
      isBatch, //是否批量
      fileList,
      //loading
      loading_submit,
    } = this.state

    return (
      <Modal visible={visible} title="补发卡券" width={650} destroyOnClose maskClosable={false} centered onCancel={this.close} onOk={this.submit} confirmLoading={loading_submit}>
        <Form ref={this.formRef} {...formLayout}>
          <Row>
            <Col style={{ width: 125, paddingLeft: 18 }}>
              <Radio.Group value={isBatch ? '1' : '0'} onChange={this.onIsBatchChange} style={{ position: 'relative', top: 6 }}>
                <div style={{ marginBottom: 37 }}>
                  <Radio value="0">客户手机号：</Radio>
                </div>
                <div>
                  <Radio value="1">批量补发：</Radio>
                </div>
              </Radio.Group>
            </Col>
            <Col flex="1 0 0">
              <Form.Item name="phone" required={!isBatch} rules={[{ required: !isBatch, message: '请输入手机号' }]}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item>
                <Row style={{ position: 'relative' }}>
                  <Form.Item noStyle name="file" required={isBatch} rules={[{ required: isBatch, message: '请上传文件' }]}>
                    <Input
                      style={{
                        position: 'absolute',
                        top: -9999,
                        left: -9999,
                        zIndex: -10,
                      }}
                    />
                  </Form.Item>
                  <Upload accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" fileList={fileList} onChange={this.onUploadChange}>
                    <Button icon={<DownloadOutlined />} disabled={fileList.length}>
                      上传文件
                    </Button>
                  </Upload>
                  <div style={{ position: 'absolute', top: 0, left: 117 }}>
                    <Button
                      onClick={() => {
                        window.open(templateUrl, '_blank')
                      }}
                    >
                      下载示例表格
                    </Button>
                  </div>
                </Row>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="补发的优惠券" name="ticketCode" required rules={[{ required: true, message: '请选择优惠券' }]}>
            <FetchSelect
              api="/web/staff/ticket/getTicketList"
              formData={{
                page: 1,
                rows: 200,
              }}
              valueKey="ticketCode"
              textKey="ticketName"
              placeholder="请选择优惠券"
            />
          </Form.Item>
          <Form.Item label="已选优惠券" name="ticketCode" required>
            <Input placeholder="请选择优惠券" disabled />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Index
