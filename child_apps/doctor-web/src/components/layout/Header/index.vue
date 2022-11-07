<template>
  <div class="header_box">
    <div class="header_content">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in routerBreadcrumb" :key="index">
          {{ item.menuTitle }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header_user_content">
      <HeaderUserContent />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import HeaderUserContent from '../HeaderUserContent/index.vue'

export default {
  data() {
    return {
      routerBreadcrumb: [],
    }
  },
  setup() {
    const store = useStore()
    const allMenu = computed(() => store.state.user.allMenu)

    return {
      allMenu,
    }
  },
  watch: {},
  methods: {
    getRouterBreadcrumb(allMenu, toPath) {
      function getItemArr(path, itemArr) {
        let menuUrl = path ?? window.location.pathname
        let arr = itemArr || []
        let curMenu = allMenu.find((item) => item.menuUrl == menuUrl)
        if (curMenu) {
          arr.unshift(curMenu)
          if (curMenu.parentCode) {
            let parentMenu = allMenu.find((item) => item.menuCode == curMenu.parentCode)
            return getItemArr(parentMenu.menuUrl, arr)
          } else {
            return arr
          }
        } else {
          return arr
        }
      }

      const items = getItemArr(toPath)
      this.routerBreadcrumb = items
    },
  },
  components: {
    HeaderUserContent,
  },
}
</script>

<style lang="less" scoped>
@import url('~@/common/styles.less');

.header_box {
  .flexCenter;
  font-size: 14px;
  height: 100%;

  .header_content {
    flex: 1 0 0;
  }
}
</style>
