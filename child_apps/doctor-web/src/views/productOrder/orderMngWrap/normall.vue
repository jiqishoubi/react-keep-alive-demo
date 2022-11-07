<template>
  <order-mng></order-mng>
</template>

<script>
import orderMng from '@/views/productOrder/orderMng/index'
import needKeepAliveMixin from '@/mixins/needKeepAliveMixin'

export default {
  name: '/web/system/serviceorder/ordermgr',
  ...needKeepAliveMixin,
  components: { orderMng },
}
</script>
