<template>
  <el-container>
    <!-- 右侧 right_content 是滚动容器 -->
    <el-container class="right_content">
      <el-main class="el_main_my">
        <!-- 业务页面 -->
        <div class="roter_view_wrap">
          <div class="page_container">
            <PageContainer>
              <router-view v-slot="{ Component }">
                <keep-alive :include="keepAliveComponents">
                  <component :is="Component" />
                </keep-alive>
              </router-view>
            </PageContainer>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SideMenu from '@/components/layout/SideMenu/index.vue'
import Header from '@/components/layout/Header/index.vue'
import Footer from '@/components/layout/Footer/index.vue'
import Skeleton from '@/components/layout/Skeleton'
import PageContainer from '@/components/layout/PageContainer'
import Page404 from '@/views/common/404'
import logo from '@/assets/logo.png'
import { loginPath } from '@/utils/consts'
import { getToken, useHaveRight } from '@/utils/utils'

export default defineComponent({
  data() {
    return { logo }
  },
  setup() {
    const toPath = ref(window.location.pathname)
    const router = useRouter()

    const store = useStore()
    // global
    const keepAliveComponents = computed(() => store.state.global.keepAliveComponents)
    // user
    const allMenu = computed(() => store.state.user.allMenu)
    const menuTree = computed(() => store.state.user.menuTree)

    const isHaveRight = computed(() => useHaveRight(toPath.value, allMenu.value))

    // onMounted(() => {
    //   if (getToken()) {
    //     store.dispatch('user/initUserInfo')
    //   } else {
    //     router.replace(loginPath)
    //   }
    // })

    return {
      toPath,
      keepAliveComponents,
      menuTree,
      isHaveRight,
    }
  },
  watch: {
    $route(to) {
      this.toPath = to.path
    },
  },
  components: { SideMenu, Header, Footer, Skeleton, Page404, PageContainer },
})
</script>

<style lang="less">
@import url('./index_global.less');
</style>
<style lang="less" scoped>
@import url('./index.less');
</style>
