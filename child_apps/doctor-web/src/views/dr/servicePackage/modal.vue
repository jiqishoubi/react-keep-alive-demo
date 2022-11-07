<template>
  <StyledModal :visible="modalController.visible" title="服务包" :showCancel="false" @close="modalController.close" @submit="modalController.close" width="90vw">
    <ServicePackagePage :modalProps="modalController.modalProps" />
  </StyledModal>
</template>
<script>
import StyledModal from '@/components/modal/StyledModal'
import ServicePackagePage from './index.vue'
import useModalController from '@/hooks/useModalController'
export default {
  setup() {
    const modalController = useModalController()
    return { modalController }
  },
  components: { StyledModal, ServicePackagePage },
}
</script>
