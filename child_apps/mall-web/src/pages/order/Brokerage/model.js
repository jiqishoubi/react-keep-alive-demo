import { queryListAjax } from '@/pages/order/Brokerage/service'
import { handleRes } from '@/utils/requestw'

const model = {
  namespace: 'orderBrokerageModel',
  state: {
    searchParams: {},
    page: 1,
    pageSize: 20,
    recordTotalNum: undefined,
    list: [],
    tradeNo: '',
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.orderBrokerageModel)
      const { searchParams, page, pageSize } = thisState
      const postData = {
        page: page,
        rows: pageSize,
        ...searchParams,
      }
      const response = yield call(queryListAjax, postData)
      if (!handleRes(response)) return
      const result = response.data
      yield put({
        type: 'save',
        payload: {
          list: result.data,
          recordTotalNum: result.rowTop,
        },
      })
    },
    //修改页码
    *changePage({ payload }, { call, put }) {
      yield put({ type: 'save', payload })
      yield put({ type: 'fetch' })
    },

    *qureyData({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          searchParams: payload.searchParams || {},
        },
      })
      yield put({ type: 'fetch' })
    },
  },

  reducers: {
    save(state, { payload }) {
      const newState = {
        ...state,
        ...payload,
      }
      return newState
    },
  },
}

export default model
