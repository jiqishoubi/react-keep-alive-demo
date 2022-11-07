<template>
  <div style="padding: 10px">
    <el-skeleton :rows="rows" :animated="animated" />
  </div>
</template>

<script>
export default {
  props: {
    rows: {
      type: Number,
      default: 6,
    },
    animated: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style></style>
