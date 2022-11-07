import { useRoute } from 'vue-router'

/**
 * @description 获取当前页面的meta
 * @returns
 */
function usePageMeta() {
  const route = useRoute()
  const pageMeta = route.meta ?? {}
  return pageMeta
}

export default usePageMeta
