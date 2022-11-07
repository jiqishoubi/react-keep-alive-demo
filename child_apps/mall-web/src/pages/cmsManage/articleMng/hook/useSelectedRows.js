import React, { useState } from 'react'

//批量操作
const useSelectedRows = (keyStr) => {
  const [selectedRows, setSelectedRows] = useState([])

  const updateSelectedRows = (selected, rows) => {
    let selectedRowsTemp = selectedRows
    let selectedRowsTempNew = []

    if (selected) {
      //增加
      selectedRowsTemp = [...selectedRowsTemp, ...rows]
      const res = new Map()
      selectedRowsTempNew = selectedRowsTemp.filter((item) => !res.has(item[keyStr]) && res.set(item[keyStr], 1))
    } else {
      //删除
      selectedRowsTempNew = selectedRowsTemp.filter((item) => {
        let filterArr = rows.filter((obj) => obj[keyStr] == item[keyStr])
        return !filterArr[0]
      })
    }

    setSelectedRows(selectedRowsTempNew)
  }

  const selectedRowKeys = selectedRows.map((item) => item[keyStr])

  return {
    selectedRowKeys,
    selectedRows,
    //方法
    setSelectedRows,
    updateSelectedRows, // (selected, rows)
  }
}

export default useSelectedRows
