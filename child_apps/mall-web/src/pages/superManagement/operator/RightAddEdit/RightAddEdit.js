/**
 * 员工form modal
 * 人员权限（角色） add edit的页面/组件
 *
 * staff //如果编辑的话 staff obj
 * userType //USER 导购和安装师傅    STAFF操作员
 * onClickCancel //新增的 取消
 * onAddSuccessCallback //新增成功的回调
 * onEditSuccessCallback //编辑成功的回调
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
//组件
import { Form, Input, Select, Button, message } from 'antd'
//变量方法
import { mConfirm, cancelAutoComplete } from '@/utils/utils'
import requestw from '@/utils/requestw'
// import api_system from '@/services/api/system'
// import
//样式
import styles from './RightAddEdit.less'

const { Option } = Select

// @connect(({ selectOptions }) => ({
//   selectOptions,
// }))
// @Form.create()
class RightAddEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleList: [],
      AllRoleList: [],
    }
    this.formRef = React.createRef()
  }
  //周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期周期
  componentDidMount() {
    //取消input autocomplete
    cancelAutoComplete(document.getElementById('adm_staff_detail_modal'))

    //业务
    this.getData()
    this.getSelectOptions()
  }
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //获取select
  getSelectOptions = async () => {
    let res = await requestw({
      url: '/web/role/getRoles',
      data: {
        nowPage: 1,
        rowsPage: 9999,
      },
    })
    if (res && res.code != '0') {
      return false
    }
    this.setState({
      AllRoleList: res.data.data,
    })
  }
  //点击add 取消
  addCancel = () => {
    const { onClickCancel } = this.props
    if (onClickCancel) {
      onClickCancel()
    }
  }
  //========================编辑==========================================================
  //获取商户详情 //回显
  getData = async () => {
    const { staff, userType, form } = this.props

    let postData = {
      personCode: staff.staffCode, //	  用户编码
      personType: userType, //		  用户类型：操作员界面 =STAFF   ;师傅/导购界面 =USER
    }
    let res = await requestw({
      url: '/web/role/getUserRoles',
      noCom: true,
      data: postData,
    })

    if ((res && res.code != '0') || !res.data) {
      return false
    }

    let codeArr = res.data.map((obj) => {
      return obj.rightCode
    })

    //form回显
    setTimeout(() => {
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          roles: codeArr,
        })
    }, 200)
  }
  //取消编辑
  cancelEdit = () => {
    const { onClickCancel } = this.props
    onClickCancel()
  }
  //点击编辑 保存
  saveEditClick = () => {
    const { form, onEditSuccessCallback, staff } = this.props
    let values = this.formRef.current && this.formRef.current.getFieldsValue()
    mConfirm('确认修改？', async () => {
      const { staff, userType } = this.props
      let roles = values.roles.map((code) => {
        return {
          roleCode: code,
        }
      })
      let postData = {
        personCode: staff['staffCode'], //	  用户编码
        roleListStr: JSON.stringify(roles),
      }
      let res = await requestw({
        url: '/web/role/associateRole',
        noCom: true,
        data: postData,
      })
      if ((res && res.code != '0') || !res.data) {
        message.warning(res.message)
        return false
      }
      message.success('修改成功')
      onEditSuccessCallback()
    })
  }
  //渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染
  render() {
    const { AllRoleList } = this.state
    const { form, selectOptions } = this.props
    // const { getFieldDecorator } = form

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
      <div>
        <Form ref={this.formRef} {...formItemLayout} className={styles.form}>
          <Form.Item name="roles" label="角色管理">
            <Select mode="multiple" placeholder="请选择角色">
              {AllRoleList &&
                AllRoleList.map((obj, index) => (
                  <Option key={index} value={obj.roleCode}>
                    {obj.roleName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>

        {/* 控制 */}
        <Form style={{ paddingTop: '30px' }}>
          <Form.Item {...tailFormItemLayout}>
            <Button shape="round" onClick={this.cancelEdit} style={{ width: '114px', marginRight: '20px' }}>
              取消
            </Button>
            <Button shape="round" type="primary" onClick={this.saveEditClick} style={{ width: '114px' }}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default RightAddEdit
