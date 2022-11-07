import React, { useState } from 'react'

const useAdd = () => {
  const [isShowAdd, setIsShowAdd] = useState(false)
  const [lookingRecord, setLookingRecord] = useState(null)

  const open = (params) => {
    //record
    setIsShowAdd(true)
    if (params && params.record) {
      setLookingRecord(params.record)
    }
  }
  const close = () => {
    setIsShowAdd(false)
    setLookingRecord(null)
  }

  return {
    isShowAdd,
    lookingRecord,
    //方法
    openAdd: open,
    closeAdd: close,
  }
}

export default useAdd
