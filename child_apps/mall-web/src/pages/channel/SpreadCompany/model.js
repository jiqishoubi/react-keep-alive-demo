import { handleRes } from '@/utils/requestw'
import { queryListAjax, createPromotionCompany, updatePromotionCompany, getPromotionCompanyInfor, getProfitConfig, submitProfitConfig } from './service'
import { router } from 'umi'
import { message } from 'antd'

const Model = {
  namespace: 'spreadCompanyMngModel',

  state: {
    searchParams: {},
    page: 1,
    pageSize: 10,
    recordTotalNum: undefined,
    list: [],
    detailsData: '',
    revampRecord: null,
    revampShow: false,
    bordered: true,
    show: true,
    newDatas: [],
    allGoodsData: [],
    templateData: '',
    deleteShow: false,
    orgCode: '',
  },

  effects: {
    //获取
    *fetch(_, { call, put, select }) {
      const thisState = yield select((state) => state.spreadCompanyMngModel)
      const { page, pageSize, searchParams } = thisState
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
          list: result?.data,
          recordTotalNum: result?.rowTop,
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

    //详情
    *details({ payload }, { call, put, select }) {
      const postData = {
        orgCode: payload.orgCode,
      }
      const response = yield call(getPromotionCompanyInfor, postData)
      if (!handleRes(response)) return

      const result = response.data

      yield put({
        type: 'save',
        payload: {
          detailsData: result,
          revampShow: true,
          bordered: false,
          show: false,
          ...payload,
        },
      })
      router.push('/web/company/distributemgr/spreadcompany/detail')
    },

    //修改
    *revampData({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          revampRecord: payload, //record
          revampShow: true,
          bordered: true,
          show: false,
        },
      })
    },

    //编辑分润
    *submitProfitConfig({ payload }, { call, put, select }) {
      const thisState = yield select((state) => state.spreadCompanyMngModel)
      const { orgCode } = thisState
      const postData = {
        orgCode: orgCode,
        ...payload,
      }
      const response = yield call(submitProfitConfig, postData)

      if (!handleRes(response)) {
        return
      }
      message.success('设置成功')
      yield put({
        type: 'save',
        payload: {
          deleteShow: false,
        },
      })
      yield put({ type: 'fetch' })
    },

    *create({ payload }, { call, put }) {
      yield put({ type: 'save', payload })
    },

    *alarts({ payload }, { call, put }) {
      yield put({ type: 'save', payload })
    },
    *resetFields({ payload }, { call, put }) {
      yield put({ type: 'save', payload })
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export default Model
