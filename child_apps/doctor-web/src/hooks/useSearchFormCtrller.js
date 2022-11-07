import { ref, reactive } from 'vue'

/**
 *
 * @param {object} options
 * @param {object} [options.form={}]
 * @returns
 */
function useSearchFormCtrller(options) {
  const { form = {} } = options

  const searchFormRef = ref(null)
  const formModel = reactive(form)

  return reactive({
    searchFormRef,
    formModel,
  })
}

export default useSearchFormCtrller
