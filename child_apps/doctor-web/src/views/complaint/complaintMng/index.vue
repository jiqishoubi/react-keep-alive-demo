<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="complaintNo">
        <el-input placeholder="投诉举报编号" v-model="searchController.formModel.complaintNo" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input placeholder="举报人电话" v-model="searchController.formModel.phoneNumber" clearable></el-input>
      </el-form-item>
      <el-form-item prop="demandType">
        <FetchSelect
          v-model="searchController.formModel.demandType"
          placeholder="诉求类型"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'DEMAND_TYPE' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
      <el-form-item prop="complaintType">
        <FetchSelect
          v-model="searchController.formModel.complaintType"
          placeholder="投诉举报类型"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'COMPLAINT_TYPE' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
    </template>
    <!-- <template #controll>
      <el-button type="primary" @click="clickAdd">新建</el-button>
    </template> -->
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
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
// import CustomLink from '@/components/customStyle/CustomLink'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'

export default {
  setup() {
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        complaintNo: '',
        phoneNumber: '',
        demandType: '',
        complaintType: '',
      },
    })
    // table
    const columns = [
      { label: '投诉举报编号', prop: 'complaintNo', width: 170 },
      { label: '诉求类型', prop: 'demandTypeName', width: 85 },
      { label: '举报人电话', prop: 'phoneNumber', width: 130 },
      { label: '投诉举报类型', prop: 'complaintTypeName', width: 170 },
      { label: '投诉举报内容', prop: 'complaintText', width: 'auto' },
      //   { label: '状态', prop: 'disabledName', width: 90 },
      //   {
      //     label: '操作',
      //     prop: 'actions',
      //     width: 100,
      //     render: (_, record) => {
      //       const statusText = record.disabled == '0' ? '失效' : '生效'
      //       return (
      //         <div>
      //           <CustomLink onClick={() => {}}>{statusText}</CustomLink>
      //         </div>
      //       )
      //     },
      //   },
    ]
    const tableController = useTableController({
      columns,
      ajax: ({ page, pageSize }) => {
        const postData = {
          page,
          rows: pageSize,
          ...searchController.formModel,
        }
        return request({
          url: '/web/system/complaint/getComplaintList',
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
