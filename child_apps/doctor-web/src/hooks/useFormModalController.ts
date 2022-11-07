import { reactive, Ref, ref } from 'vue'
import { validateFormRef } from '@/common/utils_element'

interface UseFormModalControllerOptions {
  formData?: object
  onCancel?: () => void
  onOk?: (formData?: object) => Promise<void>
}

export interface UseFormModalController {
  formData: object
  setFormData: (data: object) => void
  visible: boolean
  open: (modalProps?: any) => void
  close: () => void
  handleCancel: () => void
  handleOk: (ref?: any) => void
  submitLoading: boolean
}

export default function useFormModalController(options: UseFormModalControllerOptions = {}): UseFormModalController {
  const { formData: formDataFromOptions = {}, onCancel, onOk } = options

  const visible = ref(false)
  const modalProps = reactive({}) // 传给modal body的props

  const formData = reactive({ ...formDataFromOptions })
  const submitLoading = ref(false)

  function open(setProps) {
    visible.value = true
    setProps && setProps(modalProps)
  }

  function close() {
    visible.value = false
  }

  function setFormData(data) {
    Object.keys(data).forEach((key) => {
      formData[key] = data[key]
    })
  }

  function handleCancel() {
    visible.value = false
    onCancel && onCancel()
  }

  async function handleOk(formRef) {
    console.log('验证')

    if (onOk) {
      submitLoading.value = true
      onOk(formData)
        .finally(() => (submitLoading.value = false))
        .then(() => {
          close()
        })
    }
  }

  return reactive({
    formData,
    setFormData,
    visible,
    modalProps,
    open,
    close,
    handleCancel,
    handleOk,
    submitLoading,
  })
}
