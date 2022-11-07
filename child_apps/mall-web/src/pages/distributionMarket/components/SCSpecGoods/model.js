import { handleRes } from '@/utils/requestw'
import { queryListAjax, deleteGoodsRightdata, createGoodsRightdata, batchDeleteSkuDiy, getSkuListPaging } from './service'
import { message } from 'antd'
import lodash from 'lodash'

const initialState = {
  searchParams: {},
  page: 1,
  pageSize: 10,
  recordTotalNum: undefined,
  list: [],
  oldData: '',
  channelData: '',
}

const Model = {
  namespace: 'spreadCompanySpecGoodsMngModel',
  state: lodash.cloneDeep(initialState),

  effects: {
    //获取

    //渠道价展示
    *getSkuListPaging({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.spreadCompanySpecGoodsMngModel)
      const { searchParams } = thisState
      const postData = {
        ...payload,
        ...searchParams,
      }

      const response = yield call(getSkuListPaging, postData)
      if (!handleRes(response)) return
      const result = response.data.data
      yield put({
        type: 'save',
        payload: {
          channelData: result,
        },
      })
    },
  },

  reducers: {
    initialSava() {
      return { ...initialState }
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
