import { createStore } from 'vuex'
import global from './modules/global'
import user from './modules/user'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    global,
    user,
  },
})
