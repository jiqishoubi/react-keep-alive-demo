import { watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getLocalRouteByRouter } from '@/router/func'

/**
 * 设置 document.title
 */

function useDocumentTitle() {
  const route = useRoute()
  const router = useRouter()

  const store = useStore()
  const allMenu = computed(() => store.state.user?.allMenu)

  watch(
    [allMenu, route],
    (newVArr) => {
      const allMenuV = newVArr[0]
      const routeV = newVArr[1]
      const curRequestMenu = allMenuV.find((item) => item.menuUrl == routeV.path)
      if (curRequestMenu) {
        document.title = curRequestMenu.menuTitle
        return
      }
      const curLocalRoute = getLocalRouteByRouter(router, routeV.path)
      if (curLocalRoute && curLocalRoute.name) {
        document.title = curLocalRoute.name
        return
      }
    },
    { immediate: true }
  )
}

export default useDocumentTitle
