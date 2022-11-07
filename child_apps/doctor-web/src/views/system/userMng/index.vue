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
          style="height: 32px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input placeholder="姓名" v-model="searchController.formModel.userName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input placeholder="手机号" v-model="searchController.formModel.phoneNumber" clearable></el-input>
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
</template>

<script>
import dayjs from 'dayjs'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'

export default {
  setup() {
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        dateRange: [dayjs().subtract(365, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        userName: '',
        phoneNumber: '',
      },
    })
    // table
    const columns = [
      { label: '姓名', prop: 'userName' },
      { label: '手机号', prop: 'phoneNumber', width: 130 },
      //   { label: '身份证号码', prop: 'phoneNumber', width: 130 },
      // { label: '发展编号', prop: 'developCode' },
      //   { label: '二级推荐人', prop: 'complaintText', width: 'auto' },
      { label: '创建时间', prop: 'createDateStr' },
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
          url: '/web/system/user/getUserList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    return {
      searchController,
      tableController,
    }
  },
  components: { SearchForm, ProTable, FetchSelect },
}
</script>

<style></style>
