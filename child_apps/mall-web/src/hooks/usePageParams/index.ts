import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { stringify, parse } from 'query-string'
import { tryJSONParse } from './fn'

export interface IPageState {
  page: number
  pageSize: number
}

interface IUsePageParams {
  pageState: IPageState
  setPageState: (o: { page?: number; pageSize?: number }) => void
  filters: {
    [propName: string]: any
  } // 其它的筛选条件
  setFilters: (e: object) => void
}

interface IUsePageParamsOptions {
  defaultPageSize?: number
}

function usePageParams(options: IUsePageParamsOptions = {}): IUsePageParams {
  const { defaultPageSize = 10 } = options

  const location = useLocation()
  const history = useHistory()

  const searchState = useMemo(() => parse(location.search) ?? {}, [location.search]) // search url => search obj

  const pageState = useMemo<IPageState>(() => {
    const pageStateFromSearch = tryJSONParse(searchState.pageState) as IPageState
    return {
      page: pageStateFromSearch.page || 1,
      pageSize: pageStateFromSearch.pageSize || defaultPageSize,
    }
  }, [searchState.pageState])

  function setPageState(o: { page?: number; pageSize?: number } = {}) {
    history.push({
      search: `?${stringify({
        ...searchState,
        pageState: JSON.stringify({
          page: o.page || pageState.page,
          pageSize: o.pageSize || pageState.pageSize,
        }),
      })}`,
      state: {},
    })
  }

  const filters = useMemo(() => tryJSONParse(searchState.filters), [searchState.filters]) // 其它筛选条件

  function setFilters(formValues = {}) {
    history.push({
      search: `?${stringify({
        ...searchState,
        filters: JSON.stringify({
          ...formValues,
        }),
      })}`,
      state: {},
    })
  }

  return {
    pageState,
    setPageState,
    filters,
    setFilters,
  }
}

export default usePageParams
