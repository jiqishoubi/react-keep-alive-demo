<template>
  <el-dialog
    custom-class="el_dialog_styled_1638427336554"
    append-to-body
    :center="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="visible"
    :title="title"
    :width="width"
    @close="close"
  >
    <slot></slot>
    <template #footer>
      <div class="dialog-footer-warp">
        <span class="dialog-footer">
          <slot name="footer_extra"></slot>
          <el-button v-if="showCancel" @click="close">取消</el-button>
          <el-button v-if="showOk" type="primary" @click="submit" :loading="submitLoading">确定</el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  emits: {
    close: null,
    submit: null,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '600px',
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    showOk: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      this.$emit('submit')
    },
  },
}
</script>

<style lang="less">
@import url('./index_global.less');
</style>
<style lang="less" scoped>
.dialog-footer-warp {
  text-align: right;
}
</style>
