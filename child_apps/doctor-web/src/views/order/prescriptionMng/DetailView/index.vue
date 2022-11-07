<template>
  <div>
    <!-- 患者 -->
    <el-descriptions :column="3" size="small">
      <el-descriptions-item label="姓名">{{ prescriptionInfo.patientName }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ prescriptionInfo.patientSexName }}</el-descriptions-item>
      <el-descriptions-item label="年龄">{{ prescriptionInfo.patientAge }}</el-descriptions-item>
      <el-descriptions-item label="科室">{{ prescriptionInfo.doctorDepartName }}</el-descriptions-item>
      <el-descriptions-item label="日期" :span="2">{{ prescriptionInfo.rxDateStr }}</el-descriptions-item>
    </el-descriptions>

    <!-- 诊断 -->
    <el-descriptions :column="1" size="small" direction="vertical">
      <template #title>
        <div>诊断</div>
      </template>
      <el-descriptions-item label-class-name="prescription_detail_view_descriptions_label">{{ prescriptionInfo.icdName }}</el-descriptions-item>
    </el-descriptions>

    <!-- 处方 -->
    <el-descriptions v-if="prescriptionInfo.prescriptionDetailList?.length > 0" :column="1" size="small" direction="vertical">
      <template #title>
        <div>Rp</div>
      </template>
      <el-descriptions-item v-for="(item, index) in prescriptionInfo.prescriptionDetailList" :key="index" :label="item.goodsName">
        用法用量：{{ item.goodsNote }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 处理意见 -->
    <el-descriptions v-if="prescriptionInfo.remark" :column="1" size="small" direction="vertical">
      <template #title>
        <div>处理意见</div>
      </template>
      <el-descriptions-item label-class-name="prescription_detail_view_descriptions_label">{{ prescriptionInfo.remark }}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions :column="2" size="small">
      <el-descriptions-item label="医师">{{ prescriptionInfo.doctorName }}</el-descriptions-item>
      <el-descriptions-item v-if="prescriptionInfo.pharmacistName" label="药师">{{ prescriptionInfo.pharmacistName }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
import { toRefs } from 'vue'
import useRequestData from '@/hooks/useRequestData'
export default {
  props: {
    rxCode: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { rxCode } = toRefs(props)
    const { info: prescriptionInfo } = useRequestData({
      api: '/web/system/prescription/getPrescriptionInfo',
      watchData: rxCode,
      getPostData: (rxCodeValue) => ({ rxCode: rxCodeValue }),
      getIsReady: (rxCodeValue) => rxCodeValue,
    })
    return {
      prescriptionInfo,
    }
  },
}
</script>
<style lang="less">
@import url('./index_global.less');
</style>
