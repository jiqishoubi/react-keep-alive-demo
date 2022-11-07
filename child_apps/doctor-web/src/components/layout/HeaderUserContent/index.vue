<template>
  <div class="usercontent_wrap">
    <!-- <el-dropdown>
      <span class="username">
        {{ userInfo?.staffName }}
        <span v-if="userInfo?.loginName">（{{ userInfo?.loginName }}）</span>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人中心</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->

    <!-- dropdown 先不显示 -->
    <span class="username">
      {{ userInfo?.staffName }}
      <span v-if="userInfo?.loginName">（{{ userInfo?.loginName }}）</span>
    </span>

    <!-- 注销 -->
    <img class="logout_btn" src="./icon_logout.png" @click="logout" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import HeaderUserContent from '../HeaderUserContent/index.vue'
import { simpleConfirm } from '@/utils/confirm'

export default {
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state.user.userInfo)
    const menuTree = computed(() => store.state.user.menuTree)

    async function logout() {
      await simpleConfirm('确定注销？')
      store.dispatch('user/logout')
    }

    return {
      userInfo,
      menuTree,
      logout,
    }
  },
  components: {
    HeaderUserContent,
  },
}
</script>

<style lang="less" scoped>
@import url('~@/common/styles.less');

.usercontent_wrap {
  .flexCenter;
  .username {
    cursor: pointer;
  }
  .logout_btn {
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin-left: 6px;
  }
}
</style>
