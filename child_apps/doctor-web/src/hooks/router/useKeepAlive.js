import { useRouter, onBeforeRouteLeave } from 'vue-router'

/**
 * @description 需要keepAlive的页面 要调用这个，传入自己的path
 *
 * 2021.12.04 下午 这个暂时不用了，动态keepalive的方案 使用了 vuex + needKeepAliveMixin
 *
 * @param {*} selfPath
 */
function useKeepAlive(selfPath) {
  const router = useRouter()

  const treeRoutes = router.options.routes
  const selfRoute = getSelfRoute(treeRoutes, selfPath)

  function getSelfRoute(list = [], path) {
    for (let i = 0; i < list.length; i++) {
      let a = list[i]
      if (a.path === path) {
        return a
      } else {
        if (a.children && a.children.length > 0) {
          let res = getSelfRoute(a.children, path)
          if (res) {
            return res
          }
        }
      }
    }
  }

  const changeRouterKeepAlive = (toPath) => {
    if (selfRoute) {
      if (selfRoute.path === selfPath && selfRoute.meta.keepAlive?.to === toPath) {
        selfRoute.meta.keepAlive.value = true
      } else {
        selfRoute.meta.keepAlive.value = false
      }
    }
  }

  onBeforeRouteLeave((to) => {
    changeRouterKeepAlive(to.path)
  })
}

export default useKeepAlive
