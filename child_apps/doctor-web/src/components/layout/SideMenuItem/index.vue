<template>
  <template v-if="menuItem.menuUrl || (!menuItem.menuUrl && menuItem.children && menuItem.children.length > 0)">
    <el-sub-menu v-if="menuItem.children && menuItem.children.length > 0" :index="menuKey">
      <template #title>
        <span>{{ menuItem.menuTitle }}</span>
      </template>
      <side-menu-item v-for="(item, index) in menuItem.children" :key="index" :menuItem="item"></side-menu-item>
    </el-sub-menu>

    <router-link v-else class="side_menu_item_a" :to="menuItem.menuUrl" @click.prevent>
      <el-menu-item :index="menuKey" @click="goRoute(menuItem.menuUrl)">
        {{ menuItem.menuTitle }}
      </el-menu-item>
    </router-link>
  </template>
</template>

<script>
export default {
  name: 'side-menu-item',
  props: {
    menuItem: Object,
    default: () => ({}),
  },
  computed: {
    menuKey() {
      return this.menuItem.menuUrl || this.menuItem.menuTitle
    },
  },
  setup() {},
  methods: {
    goRoute(route) {
      this.$router.push(route)
    },
  },
}
</script>

<style lang="less" scoped>
.side_menu_item_a {
  text-decoration: none;
  outline: none;
  // color: inherit !important;
}
</style>
