import React, { useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { IUseModalController } from '@/hooks/useModalController'
import requestw from '@/utils/requestw'
import BUpload from '@/components/BUpload'
import api_common from '@/services/api/common'
import TEditDetails from '@/components/goods/T-EditDetails'
import { tryJSONParse } from '@/utils/utils'

// 接口继承
interface IProps extends IUseModalController {}

function Index(props: IProps) {
  const { modalProps, controller } = props
  const [formRef] = Form.useForm()

  const record = controller.payload
  const isEdit = record?.id

  async function hanldeOk() {
    const { noticeContentArr, ...restValues } = await formRef.validateFields()

    const postData = {
      ...(isEdit ? { noticeCode: record.noticeCode } : {}),
      ...restValues,
      noticeContent: JSON.stringify(noticeContentArr),
    }

    controller.setConfirmLoading(true)
    requestw({
      url: !isEdit ? '/web/system/notice/createNotice' : '/web/system/notice/updateNotice',
      data: postData,
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
      const noticeContentArr = tryJSONParse(record.noticeContent, undefined)
      formRef.setFieldsValue({
        ...record,
        noticeContentArr,
      })
    }
  }, [modalProps.visible, formRef, record])

  return (
    <Modal
      title="消息通知"
      {...modalProps}
      onCancel={() => {
        controller.close()
        formRef.resetFields()
      }}
      onOk={hanldeOk}
    >
      <Form form={formRef}>
        <Form.Item label="通知标题" name="noticeTitle" rules={[{ required: true, message: '请输入通知标题' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="通知封面" name="noticeImage" rules={[{ required: true, message: '请选择通知封面' }]}>
          <BUpload
            valueType="string"
            type="img"
            api={api_common.uploadApi}
            getPostData={(e: any) => {
              const file = e.file
              return {
                fileExt: file.type.split('/')[1],
                fileType: 'saasFile',
              }
            }}
            length={1}
          />
        </Form.Item>
        <Form.Item label="通知内容" name="noticeContentArr" rules={[{ required: true, message: '请设置通知内容' }]}>
          <TEditDetails imgUploadText="图片" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default Index
