import { handleRes } from '@/utils/requestw'
import { queryListAjax, updatePromotionCompany } from './service'
import { message } from 'antd'
import lodash from 'lodash'

const initialState = {
  searchParams: {},
  page: 1,
  pageSize: 10,
  recordTotalNum: undefined,
  list: [],
  itemData: {},
}

const Model = {
  namespace: 'spreadCompanyGoodsPriceModel',

  state: lodash.cloneDeep(initialState),

  effects: {
    //获取
    *fetch({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.spreadCompanyGoodsPriceModel)
      const { searchParams, page, pageSize } = thisState
      const postData = {
        queryType: 'replaceSkuQuery',
        page: page,
        rows: pageSize,
        ...searchParams,
      }

      if (!postData.distributeOrgCode) {
        yield put({
          type: 'save',
          payload: {
            list: [],
            recordTotalNum: '',
          },
        })
        return
      }
      const response = yield call(queryListAjax, postData)
      if (!handleRes(response)) return
      const result = response.data
      yield put({
        type: 'save',
        payload: {
          list: result.data ?? [],
          recordTotalNum: result.rowTop ?? 0,
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
    initialSava() {
      return { ...initialState }
    },
    save(state, { payload }) {
      const newState = {
        ...state,
        ...payload,
      }
      return newState
    },
  },
}

export default Model
