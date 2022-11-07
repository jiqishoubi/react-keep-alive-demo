import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { IUseModalController } from '@/hooks/useModalController'
import requestw from '@/utils/requestw'
import { message } from 'antd/es'

// 接口继承
interface IProps extends IUseModalController {}

function Index(props: IProps) {
  const { modalProps, controller } = props
  const [formRef] = Form.useForm()

  const record = controller.payload
  const isEdit = record?.id

  async function hanldeOk() {
    const values = await formRef.validateFields()

    controller.setConfirmLoading(true)
    requestw({
      url: !isEdit ? '/web/system/distribute/createDistribute' : '/web/system/distribute/updateDistributePhoneNumber',
      data: {
        ...(isEdit ? { distributeCode: record.distributeCode } : {}),
        ...values,
      },
      isNeedCheckResponse: true,
      errMsg: true,
    })
      .finally(() => {
        controller.setConfirmLoading(false)
      })
      .then((data) => {
        message.success('操作成功')
        formRef.resetFields()
        controller.close(!isEdit ? 'add' : 'edit')
      })
  }

  useEffect(() => {
    if (modalProps.visible && formRef && record.id) {
      formRef.setFieldsValue(record)
    }
  }, [modalProps.visible, formRef, record])

  return (
    <Modal
      title="推广人"
      {...modalProps}
      onCancel={() => {
        controller.close()
        formRef.resetFields()
      }}
      onOk={hanldeOk}
    >
      <Form form={formRef} labelCol={{ span: 5 }}>
        <Form.Item label="代理商" name="orgCode" rules={[{ required: true, message: '请选择代理商' }]}>
          <FetchSelect
            api="/web/system/distribute/getPromotionCompanyList"
            valueKey="orgCode"
            textKey="orgName"
            showSearch
            filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            disabled={isEdit}
          />
        </Form.Item>
        <Form.Item label="推广人姓名" name="distributeName" rules={[{ required: true, message: '请输入推广人姓名' }]}>
          <Input placeholder="请输入" disabled={isEdit} />
        </Form.Item>
        <Form.Item label="推广人电话" name="phoneNumber" rules={[{ required: true, message: '请输入推广人电话' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default Index
