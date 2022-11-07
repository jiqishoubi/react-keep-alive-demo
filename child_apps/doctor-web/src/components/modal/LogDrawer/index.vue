<template>
  <el-drawer v-model="controller.visible" :title="title" :size="size" direction="rtl" destroy-on-close>
    <el-table :data="controller.tableData" style="width: 100%">
      <el-table-column v-for="item in controller.columns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :width="item.width || 180" />
    </el-table>
  </el-drawer>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '订单日志',
    },
    size: {
      default: 700, // 百分比或者数字
    },
    controller: {},
  },
}
</script>
