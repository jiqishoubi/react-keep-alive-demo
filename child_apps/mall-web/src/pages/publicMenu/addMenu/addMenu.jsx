import { Form, Input, InputNumber, Radio, Button, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Mark from '../components/Mark'
import { getMenuInfoAjax, createWechatMenu, updateWechatMenu } from '../services'
import { router } from 'umi'
import { element } from 'prop-types'
const AddMend = (props) => {
  const markRef = useRef()
  const { menuCode, menuName, isAdd } = props.location.query
  const [menuForm] = Form.useForm()
  const [radioIndex, setRadioIndex] = useState('click')
  const [parentCode, setParentCode] = useState(menuCode)
  const [miniRadioIndex, setMiniRadioIndex] = useState('1')

  // radioChange
  const radioChange = (e) => {
    setRadioIndex(e.target.value)
  }
  const miniRadioChange = (e) => {
    setMiniRadioIndex(e.target.value)
  }

  useEffect(() => {
    if (!menuCode) return
    getMenuInfo()
  }, [menuCode])

  const getMenuInfo = async () => {
    if (isAdd) {
      menuForm.setFieldsValue({ parentName: menuName })
      return
    }
    const res = await getMenuInfoAjax({ menuCode })
    if (res && res.code === '0') {
      const viceData = JSON.parse(JSON.stringify(res.data))
      setRadioIndex(viceData.menuType)
      setParentCode(viceData.parentCode)
      setMiniRadioIndex(viceData.ifLocalBindApp)
      if (viceData.menuType) {
        viceData.menuType === 'view' && (viceData['menuUrlView'] = viceData.menuUrl)
        viceData.menuType === 'miniprogram' && (viceData['menuUrlMiniprogram'] = viceData.menuUrl)
        viceData.menuUrlClick = {
          mediaId: viceData?.mediaId,
          ...viceData?.mediaDetail,
        }
      }
      menuForm.setFieldsValue({ ...viceData })
    }
  }

  /*
提交数据
*/
  const onFinish = async (values) => {
    values['menuType'] = radioIndex
    values['menuLevel'] = 2
    values['parentCode'] = parentCode
    values['menuUrlClick'] = markRef.current?.getViceValue()
    !isAdd && (values['menuCode'] = menuCode)
    radioIndex === 'view' && (values['menuUrl'] = values.menuUrlView)
    radioIndex === 'miniprogram' && (values['mpPagepath'] = values.menuUrlMiniprogram)

    if (radioIndex === 'click') {
      if (values.menuUrlClick && values.menuUrlClick.type) {
        values['remark'] = values.menuUrlClick?.type
        if (values.menuUrlClick?.type && values.menuUrlClick.type === 'text') {
          values['menuUrl'] = markRef.current?.getInputData()
        } else {
          values['mediaId'] = values.menuUrlClick?.mediaId
        }
      } else {
        message.warn('发送信息，数据不完整')
        return
      }
    }

    let url = isAdd ? createWechatMenu : updateWechatMenu
    const res = await url(values)
    if (res && res.code === '0') {
      message.success('成功')
      router.push('/web/company/menuConfig')
    } else {
      message.error('失败')
    }
  }

  return (
    <Form form={menuForm} wrapperCol={{ span: 8 }} labelCol={{ span: 8 }} style={{ padding: '20px 20px' }} onFinish={onFinish}>
      <Form.Item label="主菜单名称" name="parentName">
        <Input readOnly={true} bordered={false} />
      </Form.Item>
      <Form.Item label="子菜单名称" name="menuName" rules={[{ required: true, message: '请输入子菜单名称' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="跳转类型" name="menuType" rules={[{ required: true, message: '跳转类型' }]} initialValue="click">
        <Radio.Group onChange={radioChange}>
          <Radio value="click">发送消息</Radio>
          <Radio value="view">跳转页面</Radio>
          <Radio value="miniprogram">跳转小程序</Radio>
        </Radio.Group>
      </Form.Item>

      {radioIndex === 'view' && (
        <Form.Item label="页面地址" name="menuUrlView" rules={[{ required: true, message: '请输入页面地址' }]}>
          <Input />
        </Form.Item>
      )}

      {radioIndex === 'miniprogram' && (
        <>
          <Form.Item label="小程序" name="ifLocalBindApp" rules={[{ required: true, message: '请选择' }]} initialValue="1">
            <Radio.Group onChange={miniRadioChange}>
              <Radio value="1">平台已绑定小程序</Radio>
              <Radio value="0">公众号关联的其他小程序</Radio>
            </Radio.Group>
          </Form.Item>
          {miniRadioIndex === '0' ? (
            <Form.Item label="小程序appId" name="mpAppid" rules={[{ required: true, message: '请输入小程序appId' }]}>
              <Input />
            </Form.Item>
          ) : null}
          <Form.Item label="跳转页面" name="menuUrlMiniprogram" rules={[{ required: true, message: '请输入备用页面' }]}>
            <Input />
          </Form.Item>
        </>
      )}
      {radioIndex === 'click' && (
        <Form.Item label={' '} name="menuUrlClick" colon={false}>
          <Mark ref={markRef} onChange={() => {}} />
        </Form.Item>
      )}
      <Form.Item label="排序" name="menuOrder" rules={[{ required: true, message: '请输入排序' }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 9, span: 6 }}>
        <>
          <Button style={{ borderRadius: '4px', marginRight: 10, float: 'left' }} size="middle" type="primary" onClick={() => router.push('/web/company/menuConfig')}>
            取消
          </Button>
          <Button style={{ borderRadius: '4px', marginRight: 10, float: 'right' }} size="middle" type="primary" htmlType="submit">
            确定
          </Button>
        </>
      </Form.Item>
    </Form>
  )
}
export default AddMend
