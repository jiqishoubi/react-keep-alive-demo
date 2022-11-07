<template>
  <div class="detail_container">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
@import url('~@/common/styles.less');

.detail_container {
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
  min-height: 200px;
}
</style>
