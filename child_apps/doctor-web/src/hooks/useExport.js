import { ref } from 'vue'
import { getToken, globalHost } from '../utils/utils'
import { stringify } from 'qs'

export default function useExport(api) {
  const postData = ref({})
  function setExportPostData(params = {}) {
    postData.value = params
  }
  function exportStream() {
    console.log('点击导出')
    const postDataUrl = stringify(postData.value)
    const downloadUrl = `${globalHost()}${api}?sessionId=${getToken()}&${postDataUrl}`
    window.open(downloadUrl)
  }
  return {
    setExportPostData,
    exportStream,
  }
}
