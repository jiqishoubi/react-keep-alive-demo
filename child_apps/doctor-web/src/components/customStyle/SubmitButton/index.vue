<template>
  <el-button type="primary" :loading="loading" style="width: 200px; margin-right: 50px">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
