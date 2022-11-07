import React, { Component } from 'react'
import { Modal, Form, Input, message, InputNumber } from 'antd'
import UEditor from '@/components/UEditor'
import MultiEditor from '@/components/MultiEditor/index'
import { addAjax, updateAjax } from '../service'
import { handleRes } from '@/utils/requestw'
import { getOrgKind } from '@/utils/utils'
import Button from 'antd/es/button'

/**
 * props
 *
 * open : record
 */

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

const codeKey = 'textCode'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      lookingRecord: null,
      contents: '', //富文本编辑器
      //loading
      loading_btn: false,
    }
    this.form = React.createRef()
    this.editorRef = React.createRef()
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }
  open = (params) => {
    let record = null
    if (params && params.record) {
      record = params && params.record
    }
    this.setState({
      visible: true,
      lookingRecord: record,
      contents: record && record.textContent,
    })
  }
  close = () => {
    this.setState({
      visible: false,
      lookingRecord: null,
    })
  }
  handleEditorChange = (c) => {
    this.setState({ contents: c })
  }
  submitContent = async () => {
    const { lookingRecord, contents } = this.state
    const isEdit = lookingRecord && lookingRecord[codeKey]
    // const values = await this.form.current?.validateFields();
    // if (!window.isProd) console.log('表单值', values);

    let postData = {
      [codeKey]: (isEdit && lookingRecord[codeKey]) || null,
      // ...values,
      textContent: contents,
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
    //成功
    message.success(isEdit ? '保存成功' : '添加成功')
    this.close()
    if (this.props.onSuccess) this.props.onSuccess()
  }

  footerShow = () => {
    if (getOrgKind().isAdmin) {
      return { footer: {} }
    }
  }

  handleSubmit() {}

  render() {
    const { visible, lookingRecord, contents, loading_btn } = this.state

    return (
      <Modal
        title="编辑文章"
        visible={visible}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={this.close}
        onOk={this.submitContent}
        confirmLoading={loading_btn}
        centered
        width={620}
        //footer={getOrgKind().isAdmin ? false : true}
        footer={[
          <Button key="back" onClick={this.close}>
            取消
          </Button>,
          getOrgKind().isCompany && (
            <Button key="submit" type="primary" onClick={this.submitContent}>
              确定
            </Button>
          ),
        ]}
      >
        <div>
          <MultiEditor ref={this.editorRef} value={contents} onChange={this.handleEditorChange} />
          {/* <UEditor id="ueditor_article" value={contents} callback={this.handleEditorChange} width="100%" height="668" /> */}
        </div>
      </Modal>
    )
  }
}

export default Index
