/**
 * @description 根据router和当前的path，找到 本地的route
 * @param {*} router
 * @param {*} selfPath
 * @returns
 */
export function getLocalRouteByRouter(router, selfPath) {
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

  return selfRoute
}
