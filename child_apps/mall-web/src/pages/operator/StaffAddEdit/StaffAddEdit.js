import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Form, Input, Select, Button, message, Icon, TreeSelect } from 'antd'
import { mConfirm, cancelAutoComplete } from '@/utils/utils'
import patternCreator from '@/utils/patternCreator'
import requestw from '@/utils/requestw'
import api_channel from '@/services/api/channel'
import styles from './StaffAddEdit.less'

const { TextArea } = Input
const { Option } = Select

class StaffAddEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldData: null,

      haveChange: false,

      //treeSelect
      treeSelectVal: undefined,
      ComPanyList: [],
    }
    this.formRef = React.createRef()
  }
  //周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期
  componentDidMount() {
    //取消input autocomplete
    cancelAutoComplete(document.getElementById('adm_staff_detail_modal'))
    //业务
    const { isAdd } = this.props
    if (!isAdd) {
      //如果是编辑
      this.getData()
    }
    this.getComPanyList()
  }
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //获取select
  getSelectOptions = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'selectOptions/getOrganizationTree',
    })
  }
  getComPanyList = async () => {
    let res = await requestw({
      url: api_channel.getAllDistributeCompanyListApi,
      noCom: true,
    })
    if (res && res.code === '0') {
      this.setState({
        ComPanyList: res.data,
      })
    }
  }
  //绑定treeSelect
  onChangeTree = (value) => {
    this.setState({
      treeSelectVal: value,
      haveChange: true,
    })
  }
  //点击add 取消
  addCancel = () => {
    const { onClickCancel } = this.props
    if (onClickCancel) {
      onClickCancel()
    }
  }
  //点击提交（创建）
  submitClick = () => {
    const { form, dispatch } = this.props
    let values = this.formRef.current && this.formRef.current.getFieldValue()
    if (!values.loginName || !values.staffName || !values.orgCode) {
      message.warning('请填写完整')
      return
    }
    mConfirm('确认创建操作员？', async () => {
      const { onAddSuccessCallback } = this.props

      let postData = {
        ...values,
      }
      const res = await requestw({
        url: api_channel.createStaffApi(),
        data: postData,
      })
      if (res && res.code != '0') {
        message.warning(res.message)
        return false
      }
      message.success('创建成功')
      onAddSuccessCallback()
    })
  }
  //========================编辑==========================================================
  //获取商户详情 //回显
  getData = () => {
    const { staff, form } = this.props
    let oldData = {
      ...staff,
    }
    this.setState(
      {
        oldData,
        treeSelectVal: staff.departCode,
      },
      () => {
        setTimeout(() => {
          this.formRef.current && this.formRef.current.setFieldsValue({ ...oldData })
        }, 10)
      }
    )
  }
  //编辑信息是否change了
  inputChange = () => {
    this.setState({ haveChange: true })
  }
  //取消编辑
  cancelEdit = () => {
    const { onClickCancel } = this.props
    onClickCancel()
  }
  //点击编辑 保存
  saveEditClick = () => {
    const { haveChange } = this.state
    const { form, onEditSuccessCallback, staff } = this.props
    if (!haveChange) {
      message.warning('您未进行修改')
      return
    }
    let values = this.formRef.current && this.formRef.current.getFieldValue()
    mConfirm('确认修改？', async () => {
      const postData = {
        staffCode: staff.staffCode,
        staffName: values.staffName,
        remark: values.remark,
      }
      const res = await requestw({
        url: api_channel.updateStaffApi(),
        data: postData,
        noCom: true,
      })
      if (res && res.code != '0') {
        message.warning(res.message)
        return false
      }
      message.success('修改成功')
      onEditSuccessCallback()
    })
  }
  //渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染
  render() {
    const { treeSelectVal, ComPanyList } = this.state
    const { form, isAdd, selectOptions } = this.props

    //form布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 15,
          offset: 6,
        },
      },
    }
    //domdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdom
    return (
      <div id="adm_staff_detail_modal">
        <Form ref={this.formRef} {...formItemLayout} className={styles.form}>
          <Form.Item name="orgCode" label={<span>企业名称</span>} rules={[{ required: true, message: '请输入企业名称' }]}>
            <Select placeholder="企业名称" allowClear disabled={!isAdd} style={{ marginRight: '10px' }}>
              {ComPanyList.map((r) => (
                <Option key={r.orgCode} value={r.orgCode}>
                  {r.orgName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="staffName" label="管理员姓名" rules={[{ required: true, message: '请输入管理员姓名' }]}>
            <Input placeholder="请输入管理员姓名" onChange={this.inputChange} />
          </Form.Item>
          {isAdd ? (
            <Form.Item name="loginName" label="登录账号" rules={[{ required: true, message: '请输入登录账号' }]}>
              <Input placeholder="请输入登录账号" onChange={this.inputChange} disabled={!isAdd} />
            </Form.Item>
          ) : null}
          {isAdd ? (
            <Form.Item name="initPassword" label="登录密码">
              <Input.Password placeholder="默认密码为123456" onChange={this.inputChange} disabled={!isAdd} />
            </Form.Item>
          ) : null}

          <Form.Item name="remark" label="备注">
            <TextArea placeholder="请输入备注" onChange={this.inputChange} />
          </Form.Item>
        </Form>

        {/* 控制 */}
        <Form style={{ paddingTop: '30px' }}>
          <Form.Item {...tailFormItemLayout}>
            {isAdd ? (
              <Fragment>
                <Button shape="round" onClick={this.addCancel} style={{ width: '114px', marginRight: '20px' }}>
                  取消
                </Button>
                <Button shape="round" type="primary" onClick={this.submitClick} style={{ width: '114px' }}>
                  创建
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button shape="round" onClick={this.cancelEdit} style={{ width: '114px', marginRight: '20px' }}>
                  取消
                </Button>
                <Button shape="round" type="primary" onClick={this.saveEditClick} style={{ width: '114px' }}>
                  保存
                </Button>
              </Fragment>
            )}
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default StaffAddEdit
