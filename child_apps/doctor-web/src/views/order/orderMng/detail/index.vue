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
            <div class="label">订单类型</div>
            <div class="input">{{ orderInfo.orderTypeName ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">下单时间</div>
            <div class="input">{{ orderInfo.orderDateStr ?? '-' }}</div>
          </div>
          <div class="item">
            <div class="label">预约时间</div>
            <div class="input">{{ orderInfo.scheduleDateStr ?? '-' }}</div>
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
            <!-- 订单完成 -->
            <div v-if="orderInfo.orderStatus == '93'" class="label">退款原因</div>
            <!-- 订单完成 -->
            <div v-if="orderInfo.orderStatus == '90'" class="label">完成说明</div>
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
            <div class="input">{{ orderInfo.doctorFeeStr ?? '-' }}</div>
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
          <!-- 病情描述 -->
          <div class="item" style="width: 100%">
            <div class="label">病情描述</div>
            <div class="input">{{ orderInfo.orderContent }}</div>
          </div>
          <div v-if="imageArr.length > 0" class="item" style="width: 100%">
            <div class="label">病情图片</div>
            <div class="input">
              <div class="img_wrap">
                <div v-for="(src, index) in imageArr" :key="index" class="img_box">
                  <el-image :src="src" fit="cover" :preview-src-list="imageArr" :initial-index="index" style="width: 120px; height: 120px"></el-image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 会话记录 -->
      <template v-if="chatMsgListReverse && chatMsgListReverse.length > 0">
        <div class="content_title">
          <IconVertical style="margin-right: 10px" />
          会话记录
        </div>
        <iframe v-if="chatIframeSrc" class="h5_webview" :src="chatIframeSrc" width="380" height="690"></iframe>
      </template>
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
import useRequestData from '@/hooks/useRequestData'
import { getIsProd, getToken } from '@/utils/utils'

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
      api: '/web/system/doctororder/getDoctorOrderInfo',
      watchData: route,
      getPostData: () => ({ orderNo }),
      getIsReady: () => orderNo,
      successAjax: () => {},
    })
    const patientInfo = computed(() => {
      return orderInfo.value?.doctorOrderPatientList?.[0] ?? null
    })

    const imageArr = computed(() => {
      let arr = []
      if (orderInfo.value.orderImage) {
        arr = orderInfo.value.orderImage.split(',')
      }
      return arr
    })

    // 会话记录
    const { info: chatMsgList } = useRequestData({
      api: '/web/system/doctororder/getLogDoctorOrderIMList',
      watchData: route,
      getPostData: () => ({ orderNo }),
      getIsReady: () => orderNo,
      successAjax: () => {},
    })
    const chatMsgListReverse = computed(() => (chatMsgList.value && chatMsgList.value.reverse?.()) ?? []) // 查到的chatMsgList 要颠倒一下顺序
    const chatIframeSrc = computed(() => {
      // return `https://ly.bld365.com/h5/index.html#/h5/pages/packageB/chat/chatInterface/index?orderNo=${orderNo}&isFromAdmin=1&token=${getToken()}`
      return `https://unigree.bld365.com/h5/index.html#/h5/pages/packageB/chat/chatInterface/index?orderNo=${orderNo}&isFromAdmin=1&token=${getToken()}`
    })

    return {
      orderNo,
      orderInfo,
      patientInfo,
      imageArr,
      chatMsgListReverse,
      chatIframeSrc,
    }
  },
  components: { DetailContainer, IconVertical, ImgUpload, SubmitButton, FetchSelect },
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
