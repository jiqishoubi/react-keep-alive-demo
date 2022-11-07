import { handleRes } from '@/utils/requestw'
import { queryListAjax, deleteGoodsRightdata, createGoodsRightdata, batchDeleteSkuDiy, getSkuListPaging, deleteCompany } from './service'
import { router } from 'umi'
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
    *fetch({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.spreadCompanySpecGoodsMngModel)
      const { searchParams, page, pageSize } = thisState
      const postData = {
        queryType: 'query',
        page: page,
        rows: pageSize,
        ...searchParams,
      }
      if (payload) {
        if (!payload.distributeOrgCode) {
          yield put({
            type: 'save',
            payload: {
              list: [],
              recordTotalNum: '',
            },
          })
          return
        }
      }

      const response = yield call(queryListAjax, postData)

      if (!handleRes(response)) return

      const result = response.data

      yield put({
        type: 'save',
        payload: {
          list: result.data,
          recordTotalNum: result.rowTop,
          oldData: postData,
        },
      })
    },
    //取消专营
    *cancel({ payload }, { call, put, select }) {
      const postData = {
        ...payload,
      }
      const response = yield call(deleteGoodsRightdata, postData)
      if (!handleRes(response)) return
      message.success('操作成功')
      yield put({ type: 'fetch' })
    },

    //添加专营
    *addGoods({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.spreadCompanySpecGoodsMngModel)
      const { searchParams } = thisState
      let personCode = searchParams.distributeOrgCode
      if (!payload.keys.length > 0) return
      let data = []
      payload.keys.map((r) => {
        data.push({
          goodsCode: r,
          personType: 'ORG',
          personCode: personCode,
        })
      })

      data = JSON.stringify(data)

      const postData = {
        goodsRightdataListStr: data,
      }
      if (!postData.goodsRightdataListStr) return
      const response = yield call(createGoodsRightdata, postData)
      if (!handleRes(response)) return
      message.success('操作成功')
      yield put({ type: 'fetch' })
    },
    //取消渠道价设置
    *batchDeleteSkuDiy({ payload }, { call, put, select }) {
      const postData = {
        ...payload,
      }
      const response = yield call(batchDeleteSkuDiy, postData)
      if (!handleRes(response)) return
      message.success('操作成功')
      yield put({ type: 'fetch' })
    },
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

    //修改页码
    *changePage({ payload }, { call, put }) {
      yield put({ type: 'save', payload })
      yield put({ type: 'fetch' })
    },

    *qureyData({ payload }, { call, put }) {
      yield put({ type: 'save', payload })
      yield put({ type: 'fetch' })
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
