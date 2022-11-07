<template>
  <order-mng></order-mng>
</template>

<script>
import orderMng from '@/views/order/orderMng/index.vue'
import needKeepAliveMixin from '@/mixins/needKeepAliveMixin'

export default {
  name: '/web/system/doctororder/undoordermgr',
  ...needKeepAliveMixin,
  components: { orderMng },
}
</script>
