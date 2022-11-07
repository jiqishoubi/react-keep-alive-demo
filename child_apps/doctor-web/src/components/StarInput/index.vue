<template>
  <div class="p_1657593134724 star_box">
    <div class="star_item" v-for="(item, index) in new Array(max)" :key="index" @tap.stop="toggleStar(index)">
      <img class="star_img" v-if="index + 1 <= getNumber(modelValue)" src="./assets/xingxing_1.png" />
      <img class="star_img" v-else src="./assets/xingxing_0.png" />
    </div>
  </div>
</template>
<script>
import { getNumber } from '@/utils/number'
export default {
  emits: ['update:modelValue'],
  data() {
    return { getNumber }
  },
  props: {
    modelValue: {
      default: '',
    },
    max: {
      type: Number,
      default: 5,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    function toggleStar(index) {
      if (props.disabled) return
      ctx.emit('update:modelValue', index + 1)
    }
    return {
      toggleStar,
    }
  },
}
</script>
<style lang="less">
@import url('~@/common/styles.less');
.p_1657593134724.star_box {
  .flexCenter;
  .star_item {
    width: 22px;
    height: 22px;
    margin: 0 5px;
    .star_img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
