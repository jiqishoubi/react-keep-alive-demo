import React from 'react'
import { message } from 'antd'
import moment from 'moment'
import requestw from '@/utils/requestw'
import api_tibao from './api/tibao'
import { streamToDownload } from '@/utils/utils'

/**
 * 提报审核
 */
//导出
export async function exportReportTableAjax(params) {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: api_tibao.exportReportTableApi,
      data: params,
      responseType: 'blob',
    })

    const date = moment().format('YYYY-MM-DD')
    const fileName = `提报审核记录导出_${date}.xls`
    streamToDownload({
      data: res,
      exportName: fileName, // 下载文件的名称
    })
    resolve(res)
  })
}
//导出-审核
export async function exportReportTableForVerifyAjax(params) {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: api_tibao.exportReportTableForVerifyApi,
      data: params,
      responseType: 'blob',
    })
    if (!window.isProd) console.log('导出-审核 结果', res)
    if (!res || res.size <= 110) {
      message.warning('暂无数据')
      resolve(false)
      return
    }

    const date = moment().format('YYYY-MM-DD')
    const fileName = `提报审核记录导出_审核_${date}.xls`
    streamToDownload({
      data: res,
      exportName: fileName, // 下载文件的名称
    })
    resolve(res)
  })
}

export async function exportImportTableAjax(params) {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: '/reportAudit/downloadFaildList',
      data: params,
      responseType: 'blob',
    })

    const date = moment().format('YYYY-MM-DD')
    const fileName = `文件列表失败导出_${date}.xls`
    streamToDownload({
      data: res,
      exportName: fileName, // 下载文件的名称
    })
    resolve(res)
  })
}

//导入
export async function importSubmitVerifyAjax(params) {
  return requestw({
    type: 'formdata',
    url: api_tibao.importSubmitVerifyApi,
    data: params,
  })
}

/**
 * 提现审核记录 导出
 */
export async function exportWithDrawTableAjax(params) {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: api_tibao.exportWithDrawTableApi,
      data: params,
      responseType: 'blob',
    })

    const date = moment().format('YYYY-MM-DD')
    const fileName = `提现审核记录导出_${date}.xls`
    streamToDownload({
      data: res,
      exportName: fileName, // 下载文件的名称
    })
    resolve(res)
  })
}

//11.24添加新导出

export async function exportQuery(params) {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: api_tibao.exportQuery,
      data: params,
      // noCom:true,
      responseType: 'blob',
    })

    const date = moment().format('YYYY-MM-DD')
    const fileName = `提现审核记录导出_${date}.xls`
    streamToDownload({
      data: res,
      exportName: fileName, // 下载文件的名称
    })
    resolve(res)
  })
}

export async function adminExportQuery(params) {
  return new Promise(async (resolve) => {
    const res = await requestw({
      url: '/web/admin/payment/export', //api_tibao.exportQuery,
      data: params,
      // noCom:true,
      responseType: 'blob',
    })

    const date = moment().format('YYYY-MM-DD')
    const fileName = `提现审核记录导出_${date}.xls`
    streamToDownload({
      data: res,
      exportName: fileName, // 下载文件的名称
    })
    resolve(res)
  })
}
