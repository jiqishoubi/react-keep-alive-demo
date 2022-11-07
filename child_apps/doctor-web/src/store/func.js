import lodash from 'lodash'

// mutations save
export function save(state, payload) {
  if (payload && Object.prototype.toString.call(payload) === '[object Object]') {
    for (let key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        state[key] = lodash.cloneDeep(payload[key])
      }
    }
    return state
  }
}
