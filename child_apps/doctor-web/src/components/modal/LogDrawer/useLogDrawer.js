import { ref, reactive } from 'vue'
import request from '@/utils/request'

export default function useLogDrawer({ columns = [], api, getPostDataFunc }) {
  const visible = ref(false)
  const tableData = ref([])
  const openParams = ref({}) // 打开的时候传进来的参数
  function open(params = {}) {
    visible.value = true
    openParams.value = params
    getData()
  }
  function close() {
    visible.value = false
  }
  function getData() {
    request({
      url: api,
      data: getPostDataFunc(openParams.value),
    }).then((data) => {
      tableData.value = data ?? []
    })
  }
  return reactive({ visible, columns, tableData, open, close })
}
