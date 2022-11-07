import React from 'react'
import { Modal } from 'antd'

function getPageModal(WrappedComponent) {
  return function Component(props) {
    const { modalProps = {}, controller } = props

    return (
      <Modal
        {...modalProps}
        onCancel={() => {
          controller.close()
        }}
        onOk={() => {
          controller.close()
        }}
        width="94vw"
      >
        <WrappedComponent {...props} {...(controller?.payload ?? {})} />
      </Modal>
    )
  }
}

export default getPageModal
