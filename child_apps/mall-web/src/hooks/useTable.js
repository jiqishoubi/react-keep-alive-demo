import { useState, useEffect, useMemo, useRef } from 'react'
import lodash from 'lodash'

/**
 * @param {object} options
 * @param {string} [options.tableId]
 * @param {string} [options.rowKey='id']
 * @param { (pageRes:{
 *  page:number
 *  pageSize:number
 * })=>Promise<{list,total}> } options.ajax 表格查询的ajax
 * @param {array<any>} [options.columns] 原始columns
 * @param {number} [options.columnsWidth=200] columns的默认width
 * @param {boolean} [options.manul=false] 是否手动触发，默认自动触发
 * @returns {{
 *      tableId: string
 *      rowKey: string
 *      currentPage: number
 *      currentPageSize: number
 *      tableData: object[]
 *      tableTotalNum: number | undefined
 *      isTableLoading: boolean
 *      setTableData: (data:any[])=>void 手动设置tableData
 *      setCurrentPage: (o?:number)=>void
 *      setCurrentPageSize: (o?:number)=>void
 *      getData: ()=>Promise<{list: any[]; total: number}>
 *      search: ()=>void
 *      showColumns: any[]
 *      selectedRows: ()=>void
 *      selectedRowKeys: ()=>void
 *      setSelectedRows: ()=>void
 *      updateSelectedRows: ()=>void
 *      tableWidth: number
 * }}
 */
export default function useTable({ tableId: setTableId, rowKey = 'id', ajax, columns, responseDeal = null, columnsWidth = 200, manul = false }) {
  const isMounted = useRef(false)
  const showTableId = setTableId || `_${window.location.pathname}_table`

  //表格
  const [searchParams, setSearchParams] = useState({})
  const [currentPage, setCurrentPage] = useState(1) //当前的页码
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [tableData, setTableData] = useState([]) //表格的数据
  const [tableTotalNum, setTableTotalNum] = useState(0) //表格数据总量
  const [isTableLoading, setIsTableLoading] = useState(false)

  //批量
  const [selectedRows, setSelectedRows] = useState([])
  const selectedRowKeys = selectedRows.map((item) => item[rowKey])

  //columns
  let showColumns = []
  if (columns) {
    showColumns = lodash.cloneDeep(columns).map((item) => {
      return {
        ...item,
        key: item.dataIndex,
        width: item.width || columnsWidth,
      }
    })
  }
  //columns end

  //table宽度
  const tableWidth = useMemo(() => {
    let w = false
    const tableDom = document.getElementById(showTableId)
    if (tableDom) {
      const tableDomWidth = tableDom.clientWidth
      const columnsDomWidth = showColumns.reduce((accumulator, item) => {
        return accumulator + item.width
      }, 0)
      if (columnsDomWidth >= tableDomWidth) {
        w = columnsDomWidth
      }
    }
    return w
  }, [isTableLoading])

  //方法
  const getData = () => {
    setIsTableLoading(true)
    ajax({
      page: currentPage,
      pageSize: currentPageSize,
    })
      .finally(() => {
        setIsTableLoading(false)
      })
      .then(({ list, total }) => {
        if (responseDeal) {
          list = responseDeal(list)
        }
        setTableData(list)
        setTableTotalNum(total)
      })
  }

  /**
   * 更新批量选择
   * @param {boolean} selected
   * @param {Array} rows
   */
  const updateSelectedRows = (selected, rows) => {
    let selectedRowsTemp = selectedRows
    let selectedRowsTempNew = []

    if (selected) {
      //增加
      selectedRowsTemp = [...selectedRowsTemp, ...rows]
      const res = new Map()
      selectedRowsTempNew = selectedRowsTemp.filter((item) => !res.has(item[rowKey]) && res.set(item[rowKey], 1))
    } else {
      //删除
      selectedRowsTempNew = selectedRowsTemp.filter((item) => {
        let filterArr = rows.filter((obj) => obj[rowKey] == item[rowKey])
        return !filterArr[0]
      })
    }

    setSelectedRows(selectedRowsTempNew)
  }

  /**
   * 触发查询
   */
  const search = () => {
    if (currentPage == 1) {
      getData()
    } else {
      setCurrentPage(1)
    }
  }

  /**
   * 副作用
   */

  useEffect(() => {
    if (isMounted.current) {
      getData()
    }
  }, [currentPage, currentPageSize])

  useEffect(() => {
    if (!manul) {
      getData()
    }
    isMounted.current = true
  }, [])

  return {
    tableId: showTableId,
    rowKey,
    //表格
    currentPage,
    currentPageSize,
    tableData,
    tableTotalNum,
    isTableLoading,
    //方法
    setTableData,
    setCurrentPage,
    setCurrentPageSize,
    getData, //刷新表格 页码不变
    search, //刷新表格 页码变成1
    //columns
    showColumns,
    //批量操作
    selectedRows,
    selectedRowKeys,
    setSelectedRows,
    updateSelectedRows,
    //table宽度
    tableWidth,
  }
}
