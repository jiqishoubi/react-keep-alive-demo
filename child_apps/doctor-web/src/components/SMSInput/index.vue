<template>
  <div class="flexCenter">
    <el-input :model-value="modelValue.v" @input="onInputChange" @change="onInputChange" placeholder="验证码" clearable>
      <template #prefix>
        <slot></slot>
      </template>
    </el-input>
    <el-image class="sms_img" :src="imgUrl" @click="resetKey"></el-image>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { randomStrKey, globalHost } from '@/utils/utils'

export default {
  emits: {
    'update:modelValue': null,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const smsKey = ref(randomStrKey())
    const imgUrl = computed(() => {
      return `${globalHost()}/captcha?key=${smsKey.value}`
    })
    function resetKey() {
      smsKey.value = randomStrKey()
    }
    function onInputChange(v) {
      const emitValue = v
        ? {
            v,
            key: smsKey.value,
          }
        : undefined
      ctx.emit('update:modelValue', emitValue)
    }
    return {
      imgUrl,
      smsKey,
      onInputChange,
      resetKey,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../../common/styles.less');

.sms_img {
  width: 160px;
  height: 33px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
