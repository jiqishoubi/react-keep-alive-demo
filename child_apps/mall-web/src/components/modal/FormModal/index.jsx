import { useImperativeHandle, useState, useEffect, useRef, forwardRef } from 'react'
import { Modal, Form, message } from 'antd'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

/**
 * @param {object} props
 * @param {any} [props.title='说明']
 * @param {Promise} [props.ajax]
 * @param {function} props.onSuccessCallback
 * @param {object} props.confirmConfig
 * @returns
 */
function Index(props, ref) {
  const {
    title = '说明',
    ajax,
    onSuccessCallback,
    confirmConfig = {
      isNeed: false,
      confirmStr: '',
    },
  } = props

  const [formRef] = Form.useForm()

  const [visible, setVisible] = useState(false)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const paramsRef = useRef() // 暂存open传进来的参数 params

  /**
   * 方法
   */
  /**
   *
   * @param {object} [inParams={}] open的时候 传进来的数据
   * @param {any} [initialValues]
   */
  function open(inParams = {}, initialValues) {
    setVisible(true)
    if (inParams) {
      paramsRef.current = inParams
    }
    if (initialValues && formRef) {
      formRef.setFieldsValue({ ...(initialValues ?? {}) }) // setFieldsValue
    }
  }

  function close() {
    paramsRef.current = null
    formRef.resetFields()
    setVisible(false)
  }

  // modal confirm
  function confirmPromise() {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '提示',
        content: confirmConfig.confirmStr || '',
        onOk: () => resolve(true),
        onCancel: () => reject(false),
      })
    })
  }

  // 提交
  async function onOk() {
    const values = await formRef.validateFields()

    // modal confirm
    if (confirmConfig.isNeed) {
      await confirmPromise()
    }

    if (ajax) {
      setAjaxLoading(true)
      ajax(values, paramsRef.current)
        .finally(() => {
          setAjaxLoading(false)
        })
        .then((data) => {
          message.success('操作成功')
          close()
          onSuccessCallback && onSuccessCallback(data, paramsRef.current)
        })
    } else {
      close()
      onSuccessCallback && onSuccessCallback(values, paramsRef.current)
    }
  }

  useImperativeHandle(ref, () => ({
    open,
    close,
    // record:paramsRef.current
  }))

  /**
   * 渲染
   */
  return (
    <Modal visible={visible} title={title} onCancel={close} onOk={onOk} confirmLoading={ajaxLoading}>
      <Form form={formRef} {...formItemLayout} preserve={false}>
        {props.children}
      </Form>
    </Modal>
  )
}

export default forwardRef(Index)
