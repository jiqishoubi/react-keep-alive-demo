import { handleRes } from '@/utils/requestw'
import { queryListAjax, deleteAjax, toggleStatusAjax } from './service'

const pageKey = 'page'
const pageSizeKey = 'rows'

const defaulState = {
  searchParams: {}, //查询参数

  page: 1,
  pageSize: 10,

  list: [],
  recordTotalNum: undefined,
}

const Model = {
  namespace: 'cmsManageArticleMngModel',

  state: defaulState,

  effects: {
    //设置查询参数 并 获取
    *goSearch({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          page: 1,
          searchParams: payload,
        },
      })
      yield put({ type: 'fetch' })
    },
    //获取
    *fetch({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.cmsManageArticleMngModel)
      const { page, pageSize, searchParams } = thisState
      const postData = {
        [pageKey]: page,
        [pageSizeKey]: pageSize,
        ...searchParams,
      }
      const data = yield call(queryListAjax, postData)

      yield put({
        type: 'save',
        payload: {
          list: data?.data ?? [],
          recordTotalNum: data?.rowT ?? 0,
        },
      })
    },
    //修改页码
    *changePage({ payload }, { call, put }) {
      yield put({ type: 'save', payload })
      yield put({ type: 'fetch' })
    },
    //删除
    *delete({ payload }, { call, put }) {
      //payload : record
      const record = payload
      const postData = {
        cardCode: record.cardCode,
      }
      const response = yield call(deleteAjax, postData)
      yield put({ type: 'fetch' })
    },
    //修改状态（上下架）
    *toggleStatus({ payload }, { call, put }) {
      //payload : record
      const record = payload
      const postData = {
        cardCode: record.cardCode,
        status: record.status == '1' ? '0' : '1',
      }
      const response = yield call(toggleStatusAjax, postData)
      yield put({ type: 'fetch' })
    },
  },

  reducers: {
    setDefault(state, { payload }) {
      return defaulState
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export default Model
