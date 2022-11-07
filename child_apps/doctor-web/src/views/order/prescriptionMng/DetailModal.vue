<template>
  <StyledModal :visible="visible" title="详情" :showCancel="false" @close="close" @submit="close" width="700px">
    <detail-view :rxCode="rxCode"></detail-view>
  </StyledModal>
</template>

<script>
import { reactive, ref } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import DetailView from './DetailView/index.vue'

export default {
  setup(_, ctx) {
    const visible = ref(false)
    const rxCode = ref('')

    function open(pRxCode) {
      visible.value = true
      if (pRxCode) rxCode.value = pRxCode
    }

    function close() {
      rxCode.value = ''
      visible.value = false
    }

    return {
      visible,
      open,
      close,
      rxCode,
    }
  },
  components: { StyledModal, DetailView },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
