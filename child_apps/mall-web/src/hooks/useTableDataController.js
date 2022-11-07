import React, { useEffect, useMemo, useState } from 'react'
import { useGetRow } from '@/hooks/useGetRow'

const defaultConfig = {
  initialLoad: true,
  initRowKey: 0,
}

// 当调用load触发listDataGenerator时，nextPage将为1，当翻页触发listDataGenerator时，nextPage为翻页的页数
/**
 * 创建一个Table数据的控制器，封装列表查询的业务逻辑
 * @param {(nextPage: number,pageSize:number)
 *  => Promise<{ list: array, tableTotalLength?: number }>} tableDataGenerator 数据生成器函数，需要返回一个指定格式Promise，Promise的值为接口返回的列表数据(包含list和page字段)或包含list和tableTotalLength
 * @param {typeof defaultConfig} initConfig
 */
export default function useTableDataController(tableDataGenerator, initConfig = defaultConfig) {
  const config = useMemo(() => Object.assign(defaultConfig, initConfig), [initConfig])
  const [tableList, setTableList] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(20)

  const [listTotalLength, setListTotalLength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  //批量
  const [selectedRows, setSelectedRows] = useState([])
  const selectedRowKeys = selectedRows.map((item) => item[config.initRowKey])
  useEffect(() => {
    if (config?.initialLoad) load()
  }, [])

  function load(page = currentPage, pageSize = currentPageSize) {
    setCurrentPage(page)
    setCurrentPageSize(pageSize)

    setIsLoading(true)
    return tableDataGenerator(page, pageSize)
      .finally(() => setIsLoading(false))
      .then((data) => {
        if (!data) return
        let list
        let tableTotalLength

        if (Array.isArray(data.data)) {
          list = data.data
          tableTotalLength = data.rowTop
        }

        if (!Array.isArray(data.data) && Array.isArray(data.data?.data)) {
          list = data.data.data
          tableTotalLength = data.data.rowTop
        }
        if (!Array.isArray(data.data) && !Array.isArray(data.data?.data)) {
          list = []
          tableTotalLength = 0
        }

        if ([list, tableTotalLength].includes(undefined)) {
          throw TypeError('数据生成函数返回的Promise必须是列表数据，或包含有效的list及tableTotalLength')
        }
        setTableList(list)
        setListTotalLength(tableTotalLength)

        return { list, tableTotalLength }
      })
  }

  function reset() {
    setTableList([])
    setCurrentPage(1)
    setCurrentPageSize(20)
    setListTotalLength(0)
    setIsLoading(false)
  }

  const onSelectChange = (selected, rows) => {
    let selectedRowsTemp = selectedRows
    let selectedRowsTempNew = []
    if (selected) {
      //增加
      selectedRowsTemp = [...selectedRowsTemp, ...rows]
      const res = new Map()
      selectedRowsTempNew = selectedRowsTemp.filter((item) => !res.has(item[config.initRowKey]) && res.set(item[config.initRowKey], 1))
    } else {
      //删除
      selectedRowsTempNew = selectedRowsTemp.filter((item) => {
        let filterArr = rows.filter((obj) => obj[config.initRowKey] == item[config.initRowKey])
        return !filterArr.length
      })
    }
    setSelectedRows(selectedRowsTempNew)
  }

  return {
    tableList, // 等同于tableProps.dataSource，便于进行额外的数据处理
    setTableList,
    currentPage,
    currentPageSize,
    load,
    search: () => load(1, 20),
    setIsLoading,
    reset,
    selectedRowKeys,
    onSelectChange,
    rowSelection: {
      fixed: true,
      selectedRowKeys,
      onSelect: (row, isSelected, _) => {
        onSelectChange(isSelected, [row])
      },
      onSelectAll: (isSelected, _, changeRows) => {
        onSelectChange(isSelected, changeRows)
      },
    },
    tableProps: {
      rowClassName: useGetRow,
      loading: isLoading,
      dataSource: tableList,
      rowKey: config.initRowKey || (() => config.initRowKey++),
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        current: currentPage,
        pageSize: currentPageSize,
        total: listTotalLength,
        showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
        onChange: load,
      },
    },
  }
}
