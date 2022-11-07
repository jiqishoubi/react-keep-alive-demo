<template>
  <div class="qr_box" :id="id">
    <img class="qr_box_img" :src="imgSrc" :style="{ width: width + 'px', height: width + 'px' }" />
  </div>
</template>
<script>
import { watch, toRefs, ref } from 'vue'
var QRCode = require('qrcode')
export default {
  props: {
    id: {
      type: String,
      default: 'qr_box_idname',
    },
    text: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 250, // px
    },
  },
  setup(props) {
    const { text } = toRefs(props)
    const imgSrc = ref('')
    watch(
      text,
      (value) => {
        if (value) {
          initCode(value)
        }
      },
      { immediate: true }
    )
    function initCode(str) {
      QRCode.toDataURL(str, { width: 500, height: 500 }, function (err, url) {
        imgSrc.value = url
      })
    }

    function saveImg(name) {
      let a = document.createElement('a') // 生成一个a元素
      a.download = name ?? '图片下载'
      a.href = imgSrc.value
      a.click()
      setTimeout(() => {
        a = null
      }, 0)
    }
    return { imgSrc, initCode, saveImg }
  },
}
</script>
<style lang="less" scoped>
.qr_box {
  display: inline-block;
  font-size: 0;
}
</style>
