import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
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
      url: !isEdit ? '/web/system/promotionCompany/createPromotionCompany' : '/web/system/promotionCompany/updatePromotionCompany',
      data: {
        ...(isEdit ? { orgCode: record.orgCode } : {}),
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
      title="代理商"
      {...modalProps}
      onCancel={() => {
        controller.close()
        formRef.resetFields()
      }}
      onOk={hanldeOk}
    >
      <Form form={formRef}>
        <Form.Item label="代理商名称" name="orgName" rules={[{ required: true, message: '请输入代理商名称' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="代理商简称" name="orgAlias" rules={[{ required: true, message: '请输入代理商简称' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default Index
