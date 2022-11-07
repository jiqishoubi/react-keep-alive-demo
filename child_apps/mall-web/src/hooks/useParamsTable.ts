import usePageParams, { IPageState } from '@/hooks/usePageParams'
import { FormInstance } from 'antd'
import { useEffect, useState } from 'react'

// 通过 地址栏 记录 筛选条件 page

interface IUseParamsTableOptions {
  searchForm?: FormInstance
  defaultPageSize?: number
  ajax: (e: IPageState) => Promise<{ data: { data: any[]; rowTop: number } }>
}

function useParamsTable({ searchForm, defaultPageSize, ajax }: IUseParamsTableOptions) {
  const { pageState, setPageState, filters, setFilters } = usePageParams({ defaultPageSize: defaultPageSize })
  const [tableData, setTableData] = useState([])
  const [tableTotal, setTableTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchForm) {
      searchForm.setFieldsValue(filters)
    }
  }, [filters])
  useEffect(() => {
    getData()
  }, [pageState])

  function search() {
    if (pageState.page == 1) {
      getData()
    } else {
      setPageState({ page: 1 })
    }
  }
  function getData() {
    setLoading(true)
    return ajax(pageState)
      .finally(() => {
        setLoading(false)
      })
      .then((data) => {
        // @ts-ignore
        setTableData(data?.data ?? [])
        // @ts-ignore
        setTableTotal(data?.rowTop ?? 0)
      })
  }
  return {
    search,
    getData,
    filters,
    setFilters,
    tableProps: {
      dataSource: tableData,
      loading: loading,
      pagination: {
        showQuickJumper: true,
        defaultCurrent: 1,
        defaultPageSize: defaultPageSize,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total: number, range: any) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
        total: tableTotal,
        current: pageState.page,
        pageSize: pageState.pageSize,
      },
      onChange: (e: any) => {
        setPageState({
          page: e.current,
          pageSize: e.pageSize,
        })
      },
    },
  }
}
export default useParamsTable
