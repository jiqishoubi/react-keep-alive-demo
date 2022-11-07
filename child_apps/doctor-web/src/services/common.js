import request from '@/utils/request'
import { getFileNameSuffix } from '@/utils/utils'

/**
 * @param {blob} file
 * @returns string 图片url
 */
export function uplodaFileAjax(file) {
  const suffix = getFileNameSuffix(file.name ?? '')
  return request({
    url: '/web/sys/uploadFile',
    data: {
      fileType: 'doctor-pc', //                       文件类型(非空 前端自定义,用于区分文件用途方便后运维清理)
      fileExt: suffix, //                        文件扩展名(非空 jpg/jpeg/png/等等)
      file, //                           文件流(非空)
    },
  })
}
