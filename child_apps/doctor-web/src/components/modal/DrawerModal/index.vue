<template>
  <el-drawer v-model="visible" :title="title" :size="size" direction="rtl" destroy-on-close>
    <slot :slotProps="slotProps"></slot>
  </el-drawer>
</template>
<script>
import { ref } from 'vue'
export default {
  props: {
    title: {
      type: String,
      default: '详情',
    },
    size: {},
  },
  setup() {
    const visible = ref(false)
    const slotProps = ref({})
    /**
     * @param params slotProps
     */
    function open(params = {}) {
      visible.value = true
      slotProps.value = params
    }
    function close() {
      visible.value = false
    }
    return { visible, open, close, slotProps }
  },
}
</script>
