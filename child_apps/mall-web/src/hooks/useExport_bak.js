import { useState } from 'react'
import { streamToDownload } from '@/utils/utils'
import requestw from '@/utils/requestw'
import { message } from 'antd'

/**
 *
 * @param {object} options
 * @param {any[]} options.rawData
 * @param {string} options.exportApi
 * @returns {{
 *  setQueryData: (postData: object)=>void
 *  handleExport: ()=>void
 *  loading: boolean
 * }}
 */
export default function ({ rawData, exportApi }) {
  const [queryData, setQueryData] = useState({})
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    // 验证
    if (rawData.length == 0) {
      message.warning('暂无数据')
      return
    }

    setLoading(true)
    requestw({
      url: exportApi,
      data: queryData,
      responseType: 'blob',
      isNeedCheckResponse: true,
      errMsg: true,
    })
      .finally(() => setLoading(false))
      .then((data) => {
        // 导出 跨域 todo
      })
    // if (!res || res.size <= 110) {
    //   message.warning('暂无数据')
    //   return
    // }

    // const date = moment().format('YYYY-MM-DD')
    // const fileName = `提报审核记录导出_审核_${date}.xls`
    // streamToDownload({
    //   data: res,
    //   exportName: fileName, // 下载文件的名称
    // })
  }
  return {
    setQueryData,
    handleExport,
    loading,
  }
}
