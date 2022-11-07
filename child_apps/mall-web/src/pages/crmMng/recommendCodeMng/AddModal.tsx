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

    // 处理 multiple select
    let postData = {}
    for (let key in values) {
      const codeArr = values[key] ?? []
      postData[key] = codeArr.join(',')
    }

    controller.setConfirmLoading(true)
    requestw({
      url: !isEdit ? '/web/system/recommend/createRecommend' : '',
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
      formRef.setFieldsValue(record)
    }
  }, [modalProps.visible, formRef, record])

  return (
    <Modal
      title="生成推荐码"
      {...modalProps}
      onCancel={() => {
        controller.close()
        formRef.resetFields()
      }}
      onOk={hanldeOk}
      width={600}
    >
      <Form form={formRef} labelCol={{ span: 4 }}>
        <Form.Item label="推荐人" name="distributeCodeStr" rules={[{ required: true, message: '请选择推荐人' }]}>
          <FetchSelect
            mode="multiple"
            api="/web/system/recommend/getDistributeList"
            valueKey="distributeCode"
            textKey="distributeName"
            showSearch
            filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          />
        </Form.Item>
        <Form.Item label="推广医生" name="doctorCodeStr" rules={[{ required: true, message: '请选择推广医生' }]}>
          <FetchSelect
            mode="multiple"
            api="/web/system/recommend/getDoctorList"
            valueKey="doctorCode"
            textKey="doctorName"
            showSearch
            filterOption={(input, option) => option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          />
        </Form.Item>

        <Form.Item label="推广方式" name="recommendTypeStr" rules={[{ required: true, message: '请选择推广方式' }]}>
          <FetchSelect mode="multiple" api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'RECOMMEND_TYPE' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default Index
