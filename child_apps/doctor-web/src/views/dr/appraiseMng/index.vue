<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="dateType">
        <el-select placeholder="日期类型" v-model="searchController.formModel.dateType">
          <el-option label="订单时间" value="TRADE"></el-option>
          <el-option label="审核时间" value="APPR"></el-option>
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
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="tradeNo">
        <el-input placeholder="订单编号" v-model="searchController.formModel.tradeNo" clearable></el-input>
      </el-form-item>
      <el-form-item prop="appraiseCode">
        <el-input placeholder="评价编号" v-model="searchController.formModel.appraiseCode" clearable></el-input>
      </el-form-item>
      <el-form-item prop="doctorName">
        <el-input placeholder="医生姓名" v-model="searchController.formModel.doctorName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="patientName">
        <el-input placeholder="患者" v-model="searchController.formModel.patientName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="patientPhoneNumber">
        <el-input placeholder="手机号码" v-model="searchController.formModel.patientPhoneNumber" clearable></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <FetchSelect
          v-model="searchController.formModel.status"
          placeholder="评价状态"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'APPRAISE_STATUS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
    </template>
    <template #controll></template>
  </SearchForm>
  <ProTable
    :columns="tableController.columns"
    :tableData="tableController.tableData"
    :loading="tableController.loading"
    :total="tableController.total"
    :pageState="tableController.pageState"
    @pageChange="tableController.onPageChange"
  />
  <ApprModal ref="ApprModalRef" @success="tableController.refresh" />
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import { actionConfirm } from '@/utils/confirm'
import request from '@/utils/request'
import dayjs from 'dayjs'
import ApprModal from './ApprModal.vue'

export default {
  setup() {
    const ApprModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        dateType: 'TRADE', //日期类型(非空) 订单时间:TRADE,审核时间:APPR
        dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        tradeNo: '',
        appraiseCode: '',
        doctorName: '',
        patientName: '',
        patientPhoneNumber: '',
        status: '',
      },
    })

    // table
    const columns = [
      { label: '下单时间', prop: 'tradeDateStr' },
      { label: '订单编号', prop: 'tradeNo' },
      { label: '评价编号', prop: 'appraiseCode' },
      { label: '医生', prop: 'doctorName', width: 130 },
      { label: '患者', prop: 'patientName', width: 130 },
      { label: '手机号码', prop: 'patientPhoneNumber', width: 130 },
      { label: '医生总评', prop: 'overallAppraisalStr', width: 100 },
      { label: '评价时间', prop: 'createDateStr' },
      { label: '评价状态', prop: 'statusName', width: 90 },
      { label: '审核意见', prop: 'apprNote' },
      {
        label: '操作',
        prop: 'actions',
        width: 90,
        fixed: 'right',
        render: (_, record) => {
          const str = record.status == '10' ? '审核' : '详情'
          return (
            <div>
              <CustomLink
                onClick={() => {
                  ApprModalRef.value?.open(record)
                }}
              >
                {str}
              </CustomLink>
            </div>
          )
        },
      },
    ]
    const tableController = useTableController({
      columns,
      ajax: ({ page, pageSize }) => {
        const { dateRange, ...values } = searchController.formModel
        const postData = {
          page,
          rows: pageSize,
          startDate: dateRange?.[0],
          endDate: dateRange?.[1],
          ...values,
        }
        return request({
          url: '/web/system/appraise/queryPage',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickEdit(record) {
      addModalRef.value?.open(record)
    }

    function handleToggleStatus(record) {
      const statusText = record.disabled == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/system/depart/updateDepartDisabled',
          data: {
            departCode: record.departCode,
            disabled: record.disabled == '0' ? '1' : '0',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('操作成功')
        })
      })
    }

    return {
      searchController,
      tableController,
      ApprModalRef,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, ApprModal },
}
</script>

<style></style>
