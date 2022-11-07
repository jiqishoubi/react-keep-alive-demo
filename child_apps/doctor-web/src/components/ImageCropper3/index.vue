<template>
  <div class="cropper_wrap" :class="{ close: !visible }">
    <div class="modal">
      <div class="modal_title">剪裁</div>
      <div class="modal_content" :style="{ width: width + 'px', height: height + 'px' }">
        <VueCropper
          ref="cropperRef"
          :img="option.img"
          :outputType="option.outputType"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
        ></VueCropper>
      </div>
      <div class="modal_ctrl">
        <div class="modal_btn_ok" @click="handleOk">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

export default {
  props: {
    width: {
      type: Number,
      default: 570,
    },
    height: {
      type: Number,
      default: 570,
    },
    cropPercentage: {
      type: Number,
      default: 0.9, // 剪裁框占整个的百分比， 0 - 1
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    fixedNumber: {
      type: Array,
      default: () => [1, 1], // 默认剪切框 一比一的比例
    },
  },
  setup(props) {
    const { width, height, cropPercentage, fixed, fixedNumber } = props

    // modal
    const visible = ref(false)
    const promiseStatus = reactive({
      resolve: null,
      reject: null,
    })
    // cropper
    const cropperRef = ref(null)
    const option = reactive({
      img: '', //	裁剪图片的地址	空	url 地址, base64, blob
      outputType: 'jpeg', //	裁剪生成图片的格式	jpg (jpg 需要传入jpeg)	jpeg, png, webp
      autoCrop: true, //	是否默认生成截图框	false	true, false
      autoCropWidth: width * cropPercentage, //	默认生成截图框宽度	容器的 80%	0 ~ max
      autoCropHeight: height * cropPercentage, //	默认生成截图框高度	容器的 80%	0 ~ max
      fixed: fixed, //是否开启截图框宽高固定比例	false	true, false
      fixedNumber: fixedNumber, //截图框的宽高比例	[1, 1]	[ 宽度 , 高度 ]
      ////
      info: '', //裁剪框的大小信息	true	true, false
      canScale: '', //	图片是否允许滚轮缩放	true	true, false
      full: '', //	是否输出原图比例的截图	false	true, false
      fixedBox: '', //	固定截图框大小	不允许改变	false
      canMove: '', //上传图片是否可以移动	true	true, false
      canMoveBox: '', //	截图框能否拖动	true	true, false
      original: '', //上传图片按照原始比例渲染	false	true, false
      centerBox: '', //截图框是否被限制在图片里面	false	true, false
      high: '', //是否按照设备的dpr 输出等比例图片	true	true, false
      infoTrue: '', //true 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true, false
      maxImgSize: '', //	限制图片最大宽度和高度	2000	0 ~ max
      enlarge: '', //图片根据截图框输出比例倍数	1	0 ~ max(建议不要太大不然会卡死的呢)
      mode: '', //图片默认渲染方式	contain	contain , cover, 100px, 100% auto
    })
    /**
     * 方法
     */
    function open(img) {
      visible.value = true

      // imgUrl
      let imgUrl = ''
      if (typeof img == 'string') {
        imgUrl = img
      } else if (typeof img == 'object') {
        try {
          imgUrl = window.URL?.createObjectURL?.(img)
        } catch {}
      }
      if (imgUrl) option.img = imgUrl

      return new Promise(function (resolve, reject) {
        promiseStatus.resolve = resolve
        promiseStatus.reject = reject
      })
    }
    function close() {
      visible.value = false
    }
    function handleOk() {
      cropperRef.value.getCropBlob((data) => {
        close()
        return promiseStatus.resolve?.(data)
      })
    }
    return {
      // modal
      visible,
      open,
      close,
      // cropper
      cropperRef,
      option,
      handleOk,
    }
  },
  components: { VueCropper },
}
</script>
<style lang="less" scope>
@import url('~@/common/styles.less');

.cropper_wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 90;
  background-color: fade(#000, 20);
  .modal {
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 15px;
    border-radius: 4px;
    .modal_title {
      margin-bottom: 15px;
      font-size: 17px;
      font-weight: bold;
    }
    .modal_content {
      // width: 570px;
      // height: 570px;
    }
    .modal_ctrl {
      display: flex;
      justify-content: flex-end;
      .modal_btn_ok {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        height: 40px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 15px;
        color: #fff;
        background-color: @primaryColor;
      }
    }
  }

  &.close {
    width: 0;
    height: 0;
    overflow: hidden;
    z-index: -1;
  }
}
</style>
