<template>
  <div v-if="['TEXT', 'PICTURE'].includes(item.msgType)" class="chat_item">
    <div class="chat_item_name">{{ item.msgClient == 'H5_USER' ? orderInfo.doctorOrderPatientList?.[0].patientName ?? '患者' : `${orderInfo.doctorName}(医生)` }}：</div>
    <div class="chat_item_content">
      <div v-if="item.msgType == 'TEXT'" class="chat_item_content_text">{{ showContent }}</div>
      <div v-if="item.msgType == 'PICTURE'">
        <el-image class="chat_img" :src="showContent" fit="contain" :preview-src-list="[showContent]" />
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    showContent() {
      if (this.item.msgType == 'TEXT') {
        return this.item.msgContent
      } else {
        let fileObj = {}
        try {
          fileObj = JSON.parse(this.item.msgContent ?? '{}')
        } catch (e) {
          console.log(e)
        }
        const src = fileObj.url

        if (this.item.msgType == 'PICTURE' || this.item.msgType == 'AUDIO') {
          return src
        }
      }
      return ''
    },
  },
}
</script>

<style lang="less" scoped>
.chat_item {
  display: flex;
  margin-bottom: 18px;

  @chatItemNameWidth: 97px;
  .chat_item_name {
    width: @chatItemNameWidth;
    font-weight: bold;
    text-align: right;
  }

  .chat_item_content {
    width: calc(100% - @chatItemNameWidth);
    word-wrap: break-word;
    word-break: break-all;

    // 文字
    .chat_item_content_text {
      line-height: 21px;
    }

    .chat_img {
      width: 320px;
      height: 320px;
    }
  }
}
</style>
