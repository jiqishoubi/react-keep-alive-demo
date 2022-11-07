import { reactive, ref } from 'vue'

interface UseModalControllerOptions {
  onCancel?: () => void
  onOk?: () => Promise<void>
}

export interface UseModalController {
  visible: boolean
  open: (modalProps?: any) => void
  close: () => void
  handleCancel: () => void
  handleOk: () => void
}

export default function useModalController(options: UseModalControllerOptions = {}): UseModalController {
  const { onCancel, onOk } = options
  const visible = ref(false)
  const modalProps = reactive({}) // 传给modal body的props

  function open(setProps) {
    visible.value = true
    setProps && setProps(modalProps)
  }

  function close() {
    visible.value = false
  }

  function handleCancel() {
    visible.value = false
    onCancel && onCancel()
  }

  async function handleOk() {
    if (onOk) {
      await onOk()
    }
    visible.value = false
  }

  return reactive({
    visible,
    modalProps,
    open,
    close,
    handleCancel,
    handleOk,
  })
}
