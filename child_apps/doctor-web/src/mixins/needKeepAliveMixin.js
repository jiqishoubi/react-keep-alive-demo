/**
 * @description 设置keep alive的页面 要加入这个mixin
 *
 */
const needKeepAliveMixin = {
  /**
   * @description 判断去哪个页面 设置keep alive
   * to为即将跳转的路由，from为当前页面
   */
  beforeRouteLeave(to, from, next) {
    // 如果当前页面是 可能需要keepalive的
    if (from.meta?.keepAlive) {
      const needKeepAliveToPath = from.meta?.keepAlive.to // 去往这个页面，本页面需要缓存
      if (to.path == needKeepAliveToPath) {
        this?.$store?.commit('global/setKeepAliveComponents', [from.path]) // 这里我们自己规定，页面的name就是他的path，所以这里保存path就行
      } else {
        this?.$store?.commit('global/setKeepAliveComponents', [])
      }
    }
    next()
  },
  /**
   * @description 从详情回来 刷新一下table
   * 新建就是回到第一页刷新search，编辑就是当前页刷新refresh
   * 这里this要用?，因为正常情况下页面keep alive缓存，是有this的，但是如果直接进入的是详情页，那么列表页的this还没生成，因此这里要使用?
   */
  async beforeRouteEnter(to, from, next) {
    if (to.meta?.keepAlive) {
      const needKeepAliveToPath = to.meta?.keepAlive.to
      // 从详情页返回的
      if (from.path == needKeepAliveToPath) {
        if (from.params.isAddSuccess) {
          this?.tableController?.search()
        } else if (from.params.isEditSuccess) {
          this?.tableController?.refresh()
        }
      }
    }
    next()
  },
}

export default needKeepAliveMixin
