import React, { Component } from 'react'
import { Modal, Form, Input, message, InputNumber, Radio } from 'antd'
import SelectItemFromTable from '@/components/SelectItemFromTable'
import lodash from 'lodash'
import { addAjax, updateAjax } from '../service'
import { handleRes } from '@/utils/requestw'
import api_goods from '@/services/api/goods'

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
  let record = lodash.cloneDeep(lookingRecord)
  if (record.refGoodsCode) {
    record.refGoodsCode = JSON.stringify({
      inputCode: record.refGoodsCode,
      inputVal: record.goodsName,
    })
  }
  return record
}

const codeKey = 'textCode'

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
    this.selectItemFromTableRef = React.createRef()
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
    })
  }
  close = () => {
    this.setState({
      visible: false,
      lookingRecord: null,
    })
  }
  sumbmit = async () => {
    const { lookingRecord } = this.state
    const isEdit = lookingRecord && lookingRecord[codeKey]
    const values = await this.form.current?.validateFields()
    if (!window.isProd) console.log('表单值', values)

    let goodsCode = ''
    try {
      let refGoodsCodeJson = JSON.parse(values.refGoodsCode)
      goodsCode = refGoodsCodeJson.inputCode
    } catch (e) {}
    let postData = {
      [codeKey]: (isEdit && lookingRecord[codeKey]) || null,
      ...values,
      refGoodsCode: goodsCode,
      //
      textTitle: values.textName,
      textType: 'softArticle',
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
  render() {
    const { visible, lookingRecord, loading_btn } = this.state

    const initialValues = getInitialValues(lookingRecord)

    return (
      <Modal title="创建文章" visible={visible} destroyOnClose={true} maskClosable={false} onCancel={this.close} onOk={this.sumbmit} confirmLoading={loading_btn} width={650}>
        <Form ref={this.form} {...formItemLayout} initialValues={initialValues}>
          <Form.Item label="文章名称" name="textName" required rules={[{ required: true, message: '请输入文章名称' }]}>
            <Input placeholder="请输入文章名称" />
          </Form.Item>
          <Form.Item label="关联商品" name="refGoodsCode">
            <SelectItemFromTable
              onRef={(e) => {
                this.selectItemFromTableRef.current = e
              }}
              {...{
                width: 700,
                title: '商品',
                searchFormItems: [{ name: 'goodsName', placeholder: '商品' }],
                api: api_goods.getUIGoodsListApi(),
                columns: [
                  {
                    title: '商品名称',
                    dataIndex: 'goodsName',
                  },
                  {
                    title: '创建时间',
                    dataIndex: 'createDateStr',
                  },
                ],
                rowKey: 'goodsCode',
                inputValKey: 'goodsName',
                inputCodeKey: 'goodsCode',
                pageKey: 'page',
                pageSizeKey: 'rows',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Index
