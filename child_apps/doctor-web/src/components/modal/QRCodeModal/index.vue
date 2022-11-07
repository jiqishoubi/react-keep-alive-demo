<template>
  <StyledModal :visible="visible" :title="title" :showCancel="false" @close="close" @submit="close" width="600px">
    <div class="content">
      <div v-if="state.current.isShowText && !state.current.setShowText">
        <div>{{ state.current.text }}</div>
        <div style="height: 30px"></div>
      </div>
      <div v-if="state.current.isShowText && state.current.setShowText">
        <div>{{ state.current.setShowText }}</div>
        <div style="height: 30px"></div>
      </div>
      <div class="flexJCenter"><QRCode ref="QRCodeRef" :text="state.current.text" :width="300" /></div>
    </div>
    <template #footer_extra>
      <el-button @click="handleSave">下载二维码</el-button>
    </template>
  </StyledModal>
</template>

<script>
import { reactive, ref } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import QRCode from '@/components/QRCode'
import { cloneDeep } from 'lodash'

const defaultState = {
  text: '',
  isShowText: false,
  saveName: '',
  setShowText: '', // 如果显示的text和 urlText不同，就用这个变量
}

export default {
  props: {
    title: {
      type: String,
      default: '二维码',
    },
  },
  setup() {
    const visible = ref(false)
    const QRCodeRef = ref(null)

    const state = reactive({ current: cloneDeep(defaultState) })

    function open(stateParam = {}) {
      for (let key in stateParam) {
        state.current[key] = stateParam[key]
      }
      visible.value = true
    }
    function close() {
      visible.value = false
      state.current = cloneDeep(defaultState)
    }
    function handleSave() {
      QRCodeRef.value?.saveImg(state.current.saveName || '二维码')
    }
    return {
      state,
      visible,
      QRCodeRef,
      open,
      close,
      handleSave,
    }
  },
  components: { StyledModal, QRCode },
}
</script>
<style lang="less" scoped>
@import url('~@/common/styles.less');
.content {
  .title {
    font-size: 15px;
    font-weight: bolder;
    margin: 8px 0;
  }
}
</style>
