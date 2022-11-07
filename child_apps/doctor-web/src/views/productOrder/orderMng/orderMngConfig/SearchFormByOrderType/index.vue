<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="dateType">
        <el-select placeholder="日期类型" v-model="searchController.formModel.dateType" clearable>
          <el-option label="下单时间" value="ORDER"></el-option>
          <el-option label="支付时间" value="PAY"></el-option>
          <el-option label="完成时间" value="FINISH"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="dateRange">
        <el-date-picker
          v-model="searchController.formModel.dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          :clearable="false"
          style="height: 32px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="orderNo">
        <el-input placeholder="订单号" v-model="searchController.formModel.orderNo" clearable></el-input>
      </el-form-item>
      <el-form-item prop="orgName">
        <el-input placeholder="医生集团" v-model="searchController.formModel.orgName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="doctorName">
        <el-input placeholder="医生姓名" v-model="searchController.formModel.doctorName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="productTitle">
        <el-input placeholder="服务包名称" v-model="searchController.formModel.productTitle" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="!meta.config?.orderStatus" prop="orderStatus">
        <FetchSelect
          placeholder="状态"
          v-model="searchController.formModel.orderStatus"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'SERVICE_ORDER_STATUS' }"
          textKey="codeValue"
          valueKey="codeKey"
          :multiple="true"
        />
      </el-form-item>
      <el-form-item prop="patientName">
        <el-input placeholder="患者姓名" v-model="searchController.formModel.patientName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="patientPhoneNumber">
        <el-input placeholder="患者手机号" v-model="searchController.formModel.patientPhoneNumber" clearable></el-input>
      </el-form-item>
      <el-form-item prop="payStatus">
        <FetchSelect
          placeholder="支付状态"
          v-model="searchController.formModel.payStatus"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'SERVICE_ORDER_PAY_STATUS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
    </template>
    <template #controll>
      <el-button type="primary" @click="handleExport">导出</el-button>
    </template>
  </SearchForm>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import FetchSelect from '@/components/FetchSelect'
import usePageMeta from '@/hooks/router/usePageMeta'

export default {
  emits: ['export'],
  props: ['searchController', 'tableController'],
  setup(_, ctx) {
    const meta = usePageMeta()
    function handleExport() {
      ctx.emit('export')
    }
    return {
      meta,
      handleExport,
    }
  },
  components: { SearchForm, FetchSelect },
}
</script>
