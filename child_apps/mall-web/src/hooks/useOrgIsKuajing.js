// 如果当前的供应商是跨境类型

import { getMainAppGlobalData } from '@/utils/aboutMicroApp'
import { useEffect } from 'react'

export default function (callback) {
  const isOrgKuajing = getMainAppGlobalData()?.userInfo?.supplierInfoDTO?.attrMap?.supplierType == 'THIRD_PLATFORM' // 供应商是否是跨境类型

  useEffect(() => {
    if (isOrgKuajing) {
      callback && callback()
    }
  }, [isOrgKuajing])

  return { isOrgKuajing }
}
