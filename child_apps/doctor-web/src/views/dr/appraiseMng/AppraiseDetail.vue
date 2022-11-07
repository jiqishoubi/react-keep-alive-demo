<template>
  <view class="detail_form">
    <view class="item">
      <view class="label">评价内容</view>
      <view class="item_content">
        {{ record?.appraiseNote }}
      </view>
    </view>
    <view class="item">
      <view class="label">医生总评</view>
      <StarInput class="star_input" v-model="record.overallAppraisal" />
      <view class="pingjia_str">{{ record?.overallAppraisalStr || '' }}</view>
    </view>
    <view class="item">
      <view class="label">回复质量</view>
      <StarInput class="star_input" v-model="record.replyQuality" />
      <view class="pingjia_str">{{ record?.replyQualityStr || '' }}</view>
    </view>
    <view class="item">
      <view class="label">服务态度</view>
      <StarInput class="star_input" v-model="record.serviceAttitude" />
      <view class="pingjia_str">{{ record?.serviceAttitudeStr || '' }}</view>
    </view>
    <view class="item">
      <view class="label">回复速度</view>
      <StarInput class="star_input" v-model="record.recoverySpeed" />
      <view class="pingjia_str">{{ record?.recoverySpeedStr || '' }}</view>
    </view>
  </view>
</template>
<script>
import StarInput from '@/components/StarInput'
export default {
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {},
  components: { StarInput },
}
</script>
<style lang="less" scoped>
@import url('~@/common/styles.less');
.detail_form {
  .item {
    .flex;
    align-items: flex-start;
    margin: 7px 0;

    .label {
      margin-right: 15px;
    }

    .star_input {
      margin-top: -2px;
    }

    .pingjia_str {
      margin-left: 10px;
    }

    .item_content {
      width: calc(100% - 150px);
    }
  }
}
</style>
