<template>
  <DetailContainer>
    <div class="page_container">
      <div class="content_title">
        <IconVertical style="margin-right: 10px" />
        订单信息
      </div>
      <div class="form">
        <div class="row">
          <div class="item">
            <div class="label">订单编号</div>
            <div class="input">{{ orderInfo.orderNo ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">下单时间</div>
            <div class="input">{{ orderInfo.orderDateStr ?? '-' }}</div>
          </div>
          <div class="item" style="width: 40%">
            <div class="label">有效时间</div>
            <div class="input">{{ orderInfo.serviceValidDate ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">完成时间</div>
            <div class="input">{{ orderInfo.finishDateStr ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">订单状态</div>
            <div class="input">{{ orderInfo.orderStatusName ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">发展编号</div>
            <div class="input">{{ orderInfo.developCode ?? '-' }}</div>
          </div>

          <div class="item" style="width: 100%">
            <div class="label">说明</div>
            <div class="input">{{ orderInfo.resultNote ?? '-' }}</div>
          </div>
        </div>
      </div>

      <div class="content_title">
        <IconVertical style="margin-right: 10px" />
        付款信息
      </div>
      <div class="form">
        <div class="row">
          <div class="item">
            <div class="label">订单金额</div>
            <div class="input">{{ orderInfo.productFeeStr ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">付款状态</div>
            <div class="input">{{ orderInfo.payStatusName ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">付款单号</div>
            <div class="input">{{ orderInfo.paymentNo ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">付款时间</div>
            <div class="input">{{ orderInfo.payDateStr ?? '-' }}</div>
          </div>
        </div>
      </div>

      <div class="content_title">
        <IconVertical style="margin-right: 10px" />
        患者信息
      </div>
      <div class="form">
        <div class="row">
          <div class="item">
            <div class="label">患者昵称</div>
            <div class="input">{{ orderInfo.patientName ?? orderInfo.orderUserName ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">问诊医生</div>
            <div class="input">{{ orderInfo.doctorName ?? '-' }}</div>
          </div>
          <div v-if="patientInfo?.patientAge" class="item">
            <div class="label">年龄</div>
            <div class="input">{{ patientInfo?.patientAge }}</div>
          </div>
          <div v-if="patientInfo?.phoneNumber" class="item">
            <div class="label">电话</div>
            <div class="input">{{ patientInfo?.phoneNumber }}</div>
          </div>
          <div v-if="patientInfo?.patientPsptNo" class="item">
            <div class="label">身份证号</div>
            <div class="input">{{ patientInfo?.patientPsptNo }}</div>
          </div>
          <div v-if="patientInfo?.patientWeight" class="item">
            <div class="label">体重</div>
            <div class="input">{{ patientInfo?.patientWeight }}</div>
          </div>
          <div v-if="patientInfo?.allergyDesc" class="item">
            <div class="label">过敏</div>
            <div class="input">{{ patientInfo?.allergyDesc }}</div>
          </div>
          <div v-if="patientInfo?.sicknessDesc" class="item">
            <div class="label">过往病史</div>
            <div class="input">{{ patientInfo?.sicknessDesc }}</div>
          </div>
        </div>
      </div>
    </div>
  </DetailContainer>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DetailContainer from '@/components/layout/DetailContainer'
import IconVertical from '@/components/customStyle/IconVertical'
import ImgUpload from '@/components/ImgUpload'
import FetchSelect from '@/components/FetchSelect'
import SubmitButton from '@/components/customStyle/SubmitButton'
import ChatItemWeb from '@/components/business/ChatItemWeb'
import useRequestData from '@/hooks/useRequestData'

/**
 * 回退的时候 可以设置：
 * $route.params:
 * 暂无
 */
export default {
  setup() {
    const route = useRoute()
    const orderNo = route.query.orderNo

    const { info: orderInfo } = useRequestData({
      api: '/web/system/serviceorder/getServiceOrderInfo',
      watchData: route,
      getPostData: () => ({ orderNo }),
      getIsReady: () => orderNo,
      successAjax: () => {},
    })
    const patientInfo = computed(() => {
      return orderInfo.value?.serviceOrderPatientList?.[0] ?? null
    })

    return {
      orderInfo,
      patientInfo,
    }
  },
  components: { DetailContainer, IconVertical, ImgUpload, SubmitButton, FetchSelect, ChatItemWeb },
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
