import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Radio, Tabs, Divider, InputNumber, message } from 'antd'
import FetchSelect from '@/components/FetchSelect'
// import FetchRadioGroup from '@/components/FetchRadioGroup'
import BUpload from '@/components/BUpload'
import TagsInput from '@/components/TagsInput'
import request from '@/utils/request'
import api_common from '@/services/api/common'
import SupplierEdit from './configEdit'

const { TabPane } = Tabs
const moduleId = 'supplierCode'
const modalWidth = '90%'
const formSpan = { labelCol: { span: 6 }, wrapperCol: { span: 12 } }
const Index = (props, ref) => {
  const [show, setShow] = useState(false)
  const [code, setCode] = useState(null)

  useImperativeHandle(ref, () => ({
    show: async (params) => {
      setCode(params.orgCode)
      setShow(true)
    },
  }))
  const complete = async () => {
    props?.submitCompleted && props.submitCompleted()
    setShow(false)
  }
  const cancel = async () => {
    setShow(false)
    setCode(null)
    props?.cancel && props.cancel()
  }
  return (
    <Modal title="供应商" visible={show} destroyOnClose={true} maskClosable={true} centered={true} width={modalWidth} onOk={complete} onCancel={cancel} footer={null}>
      {show && <SupplierEdit code={code} submitCompleted={complete} />}
    </Modal>
  )
}

export default forwardRef(Index)
