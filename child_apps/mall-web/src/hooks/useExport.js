import { useState } from 'react'
import { globalHost } from '@/utils/utils'
import { message } from 'antd'
import { stringify } from 'qs'
import { getToken } from '@/utils/consts'

/**
 *
 * @param {object} options
 * @param {any[]} options.rawData
 * @param {string} options.exportApi
 * @returns {{
 *  setQueryData: (postData: object)=>void
 *  handleExport: ()=>void
 * }}
 */
export default function ({ rawData, exportApi }) {
  const [queryData, setQueryData] = useState({})

  async function handleExport() {
    // 验证
    if (rawData.length == 0) {
      message.warning('暂无数据')
      return
    }

    const postDataUrl = stringify(queryData)
    const downloadUrl = `${globalHost()}${exportApi}?sessionId=${getToken()}&${postDataUrl}`
    window.open(downloadUrl)
  }
  return {
    setQueryData,
    handleExport,
  }
}
