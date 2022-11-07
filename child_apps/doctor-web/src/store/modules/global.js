import lodash from 'lodash'
import { save } from '../func'

const defaultState = {
  keepAliveComponents: [], // names // keepalive的组件
}

const global = {
  namespaced: true,
  state: () => defaultState,
  getters: {},
  actions: {},
  mutations: {
    save,
    setKeepAliveComponents(state, payload) {
      state.keepAliveComponents = lodash.cloneDeep(payload ?? [])
    },
  },
}

export default global
