import { useState, useRef } from 'react'

interface IOptions {
  onClose?: () => void
  onAddSuccess?: () => void
  onEditSuccess?: () => void
}

interface IController {
  payload: any
  open: (payload: any) => void
  close: (type?: ICloseType) => void
  setConfirmLoading: (loading: boolean) => void
}

type ICloseType = undefined | 'add' | 'edit'

export interface IUseModalController {
  modalProps: {
    closable: boolean
    visible: boolean
    onCancel: () => void
    confirmLoading: boolean
  }
  controller: IController
}

function useModalController(options: IOptions = {}): IUseModalController {
  const [visible, setVisible] = useState(false)
  const payload = useRef({})
  const [confirmLoading, setConfirmLoading] = useState(false)
  function open(params = {}) {
    payload.current = params
    setVisible(true)
  }
  function close(type?: ICloseType) {
    payload.current = {}
    setVisible(false)

    if (type == 'add') {
      options.onAddSuccess && options.onAddSuccess()
    } else if (type == 'edit') {
      options.onEditSuccess && options.onEditSuccess()
    } else {
      options.onClose && options.onClose()
    }
  }
  return {
    modalProps: {
      closable: true,
      visible,
      onCancel: close,
      confirmLoading,
    },
    controller: {
      payload: payload.current,
      open,
      close,
      setConfirmLoading,
    },
  }
}
export default useModalController
