<template>
  <StyledModal :visible="controller.visible" :title="title" @close="controller.close" @submit="hanldeSubmit" :submitLoading="controller.submitLoading">
    <el-form ref="formRef" :model="controller.formData" label-width="100px">
      <slot></slot>
    </el-form>
  </StyledModal>
</template>
<script>
import { toRefs, ref } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import { validateFormRef } from '@/common/utils_element'

export default {
  props: ['controller', 'title'],
  setup(props) {
    const formRef = ref(null)
    async function hanldeSubmit() {
      await validateFormRef(formRef)
      props.controller.handleOk(formRef)
    }
    return { formRef, hanldeSubmit }
  },
  components: { StyledModal },
}
</script>
