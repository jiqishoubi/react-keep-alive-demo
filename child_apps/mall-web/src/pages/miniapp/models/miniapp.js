import { message } from 'antd'
import { localDB } from '@/utils/utils'
import { miniappStateKey, loginStateKey } from '@/utils/consts'
import { getAuthAjax, getMiniappInfoAjax, verifyListAjax, submitCodeAjax, getTesterAjax, publishAppAjax, cancelSubmitAjax } from '../services/miniapp'

const Model = {
  namespace: 'miniapp',

  state: {
    appid: '',
    miniappStatus: '',
    miniappInfo: null, //基本信息

    verifyList: [], //审核列表
    testerList: [], //体验成员列表
  },

  effects: {
    //授权 并 查小程序appid 并保存
    *getAuth({ payload }, { call, put }) {
      const res = yield call(getAuthAjax, payload)
      if (!window.isProd) console.log('授权结果', res)
      if (res && res.authorizationInfo && res.authorizationInfo.authorizer_appid) {
        message.success('授权成功')
        yield put({ type: 'getMiniappInfo' })
      } else {
        message.warning('授权失败')
      }
    },

    //获取基本信息
    *getMiniappInfo(_, { call, put }) {
      const res = yield call(getMiniappInfoAjax)
      if (!window.isProd) console.log('小程序信息', res)
      if (res && res.authorizerInfo) {
        yield put({
          type: 'save',
          payload: {
            miniappStatus: res.auditStatus,
            miniappInfo: res.authorizerInfo,
            appid: res.authorizationInfo.authorizer_appid, //appid
          },
        })

        //审核记录 && 体验成员
        yield put({ type: 'getVerifyList' }) //审核记录
        yield put({ type: 'getTesterList' }) //体验成员
      }
    },

    //提交审核
    *submitVerify({ payload }, { call, put, select }) {
      const appid = yield select((state) => state.miniapp.appid)
      const res = yield call(submitCodeAjax, appid)
      if (!window.isProd) console.log('提交审核结果', res)
      if (res && res.code == 200) {
        message.success('提交审核成功')
      } else {
        message.warning(res.message || '提交失败')
        return
      }

      yield put({ type: 'getMiniappInfo' })
    },

    //撤销审核
    *cancelVerify({ payload }, { call, put, select }) {
      const appid = yield select((state) => state.miniapp.appid)
      const res = yield call(cancelSubmitAjax, appid)
      if (res && res.code == 200 && res.data && res.data.errcode == 0) {
        message.success('撤回审核成功')
        yield put({ type: 'getMiniappInfo' })
      } else {
        message.warning((res.data && res.data.errmsg) || res.message)
        return
      }
    },

    //发布上线
    *publishApp({ payload }, { call, put, select }) {
      const appid = yield select((state) => state.miniapp.appid)
      const res = yield call(publishAppAjax, appid)
      if (!window.isProd) console.log('最后发布小程序结果', res)
      message.success('发布成功')
      yield put({ type: 'getMiniappInfo' })
    },

    //获取审核列表
    *getVerifyList({ payload }, { call, put, select }) {
      const appid = yield select((state) => state.miniapp.appid)
      const res = yield call(verifyListAjax, appid)
      if (!window.isProd) console.log('提交审核记录', res)
      if (res && Array.isArray(res) && res.length > 0) {
        yield put({
          type: 'save',
          payload: {
            verifyList: res,
          },
        })
      }
    },

    //获取体验成员
    *getTesterList({ payload }, { call, put, select }) {
      const appid = yield select((state) => state.miniapp.appid)
      const res = yield call(getTesterAjax, appid)
      if (!window.isProd) console.log('体验者列表', res)
      if (res && res.code == 200 && res.data && res.data.length > 0) {
        yield put({
          type: 'save',
          payload: {
            testerList: res.data,
          },
        })
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveDB(state, { payload }) {
      const newState = {
        ...state,
        ...payload,
      }
      localDB.setItem(miniappStateKey, newState)
      return newState
    },
  },
}

export default Model
