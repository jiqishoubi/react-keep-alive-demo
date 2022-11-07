import { router } from 'umi'
import { localDB } from '@/utils/utils'
import { loginStateKey, getToken } from '@/utils/consts'
import { loginAjax, getMenuRights, Retreat } from '@/services/login'
import { dealMenu, findFirstMenuUrl } from '@/utils/login'
import request, { handleRes } from '@/utils/requestw'

const defaultState = {
  loginInfo: null,
  allMenu: [],
  menuTree: [],
  rightsArr: [],
  mixMenuActiveIndex: '0', //mix模式
}

const Model = {
  namespace: 'login',
  state: defaultState,
  effects: {
    //登录
    *login({ payload }, { call, put }) {
      const data = yield call(loginAjax, payload)
      let loginInfo = {
        ...data.staffInfo,
        token: data.loginSessionId,
      }
      localDB.setItem(loginStateKey, loginInfo)
      yield put({
        type: 'saveDB',
        payload: {
          loginInfo,
        },
      })
      // 这里是异步的 没阻塞
      yield put({
        type: 'getMenuRightsFunc',
      })
      return data || false
    },

    //获取菜单权限，列表
    *getMenuRightsFunc({}, { call, put }) {
      //获取菜单权限
      const data = yield call(getMenuRights)
      let allMenu = data
      let dealMenuRes = dealMenu(allMenu)
      yield put({
        type: 'saveDB',
        payload: {
          allMenu,
          menuTree: dealMenuRes.menuTree,
          rightsArr: dealMenuRes.rightsArr,
        },
      })
      //跳转主页  找到树形菜单结构的 第一菜单路径，进行跳转
      setTimeout(() => {
        const firstUrl = findFirstMenuUrl({
          arr: dealMenuRes.menuTree,
          urlKey: 'menuUrl',
        })
        window.location.href = firstUrl
      }, 5)
    },

    *getLoginInfoByToken({ payload }, { call, put }) {
      const data = yield call(function () {
        return request({
          url: '/web/getLoginStaffInfo',
          data: {
            token: getToken(),
          },
        })
      })
      let loginInfo = {
        ...data,
        token: getToken(),
      }
      yield put({
        type: 'saveDB',
        payload: {
          loginInfo,
        },
      })

      return loginInfo

      const data2 = yield call(getMenuRights)
      let allMenu = data2
      let dealMenuRes = dealMenu(allMenu)
      yield put({
        type: 'saveDB',
        payload: {
          allMenu,
          menuTree: dealMenuRes.menuTree,
          rightsArr: dealMenuRes.rightsArr,
        },
      })
    },

    // 重新登录
    *loginAgain({}, { put }) {
      if (localDB.getItem(loginStateKey)) {
        const loginState = localDB.getItem(loginStateKey)
        yield put({
          type: 'saveDB',
          payload: loginState,
        })
      }
    },

    //
    *logout({ payload }, { call, put }) {
      let res = yield call(Retreat, payload)
      if (!handleRes(res)) {
        return false
      }

      if (window.location.pathname !== '/user/login') {
        yield put({
          type: 'save',
          payload: defaultState,
        })

        localDB.deleteItem(loginStateKey)
        router.replace({
          pathname: '/user/login',
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
      let newState = {
        ...state,
        ...payload,
      }
      localDB.setItem(loginStateKey, newState)
      return newState
    },
    //mix模式下 上面菜单 index
    saveMixMenuActiveIndex(state, { payload }) {
      if (payload == -1 || payload == '-1') {
        return state
      }
      let newState = {
        ...state,
        mixMenuActiveIndex: payload,
      }
      localDB.setItem(loginStateKey, newState)
      return newState
    },
  },
}

export default Model
