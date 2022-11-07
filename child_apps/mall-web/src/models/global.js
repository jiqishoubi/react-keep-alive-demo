const GlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {},

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    changeLayoutCollapsed(state = { collapsed: true }, { payload }) {
      return {
        ...state,
        collapsed: payload,
      }
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // // Subscribe history(url) change, trigger `load` action if pathname is `/`
      // history.listen((route, typeStr) => {
      //   const { pathname } = route
      //   dispatch({
      //     type: 'setToPath',
      //     payload: pathname,
      //   })
      // })
    },
  },
}

export default GlobalModel
