/**
 * router 返回时 携带参数
 */
import { useRoute, useRouter } from 'vue-router'

/**
 *
 * @param {*} defaultBackPath
 * @returns  // 返回一个方法
 */
function useGoBackParams(defaultBackPath = '') {
  const route = useRoute()
  const router = useRouter()

  function setAndGo(payload) {
    for (let key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        route.params[key] = payload[key]
      }
    }

    // 跳转
    try {
      router.back()
    } catch (err) {
      // 有可能 没有上一页的情况
      if (defaultBackPath) {
        router.replace(defaultBackPath)
      }
    }
  }

  return setAndGo
}

export default useGoBackParams
