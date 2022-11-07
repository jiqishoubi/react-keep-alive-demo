import { handleRes } from '@/utils/requestw'
// import {} from './service';
import { router } from 'umi'
import { message } from 'antd'
import lodash from 'lodash'

const initialState = {
  searchParams: {},
}
const Model = {
  namespace: 'channelToolModel',

  state: lodash.cloneDeep(initialState),

  effects: {
    //获取
    *fetch({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.channelToolModel)
      const {} = thisState
      const postData = {}

      const response = yield call('', postData)

      if (!handleRes(response)) return

      const result = response.data

      yield put({
        type: 'save',
        payload: {},
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
