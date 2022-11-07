<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
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
      <el-form-item prop="patientName">
        <el-input placeholder="患者姓名" v-model="searchController.formModel.patientName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input placeholder="手机号" v-model="searchController.formModel.phoneNumber" clearable></el-input>
      </el-form-item>
      <el-form-item prop="distributeCode">
        <el-input placeholder="推广人编码" v-model="searchController.formModel.distributeCode" clearable></el-input>
      </el-form-item>
    </template>
  </SearchForm>
  <ProTable
    :columns="tableController.columns"
    :tableData="tableController.tableData"
    :loading="tableController.loading"
    :total="tableController.total"
    :pageState="tableController.pageState"
    @pageChange="tableController.onPageChange"
  />
  <TableModal ref="TableModalRef" />
</template>

<script>
import { ref } from 'vue'
import dayjs from 'dayjs'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import TableModal from './TableModal.vue'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'

export default {
  setup() {
    const TableModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        dateRange: [dayjs().subtract(365, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        patientName: '',
        phoneNumber: '',
        distributeCode: '',
      },
    })
    // table
    const columns = [
      { label: '患者姓名', prop: 'patientName' },
      { label: '手机号', prop: 'phoneNumber', width: 130 },
      { label: '身份证号码', prop: 'patientPsptNo' },
      { label: '创建时间', prop: 'createDateStr' },
      {
        label: '操作',
        prop: 'actions',
        render: (_, record) => {
          return (
            <CustomLink
              onClick={() => {
                TableModalRef.value.open(record.personCode)
              }}
            >
              详情
            </CustomLink>
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
          url: '/web/system/patient/queryPage',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    return {
      searchController,
      tableController,
      TableModalRef,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, TableModal },
}
</script>

<style></style>
