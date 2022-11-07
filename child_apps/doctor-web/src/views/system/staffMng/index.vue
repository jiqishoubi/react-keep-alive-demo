<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="loginName">
        <el-input placeholder="账号" v-model="searchController.formModel.loginName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input placeholder="电话" v-model="searchController.formModel.phoneNumber" clearable></el-input>
      </el-form-item>
      <el-form-item prop="staffName">
        <el-input placeholder="姓名" v-model="searchController.formModel.staffName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="orgCode">
        <FetchSelect placeholder="企业" v-model="searchController.formModel.orgCode" api="/web/system/supplier/getOrgList" textKey="orgName" valueKey="orgCode" />
      </el-form-item>
      <el-form-item prop="status">
        <FetchSelect
          placeholder="状态"
          v-model="searchController.formModel.status"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'STAFF_STATUS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
    </template>
    <template #controll>
      <el-button type="primary" @click="clickAdd">新建</el-button>
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

  <!-- 模态 -->
  <EditModal ref="editModalRef" @successAdd="tableController.search" @successEdit="tableController.refresh" />
</template>

<script>
import { ref } from 'vue'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import EditModal from './EditModal.vue'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import { actionConfirm } from '@/utils/confirm'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

export default {
  setup() {
    const editModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        loginName: '',
        phoneNumber: '',
        staffName: '',
        orgCode: '',
        status: '',
      },
    })
    // table
    const columns = [
      { label: '员工姓名', prop: 'staffName', width: 140 },
      { label: '所属企业', prop: 'orgName' },
      { label: '账号', prop: 'loginName', width: 140 },
      { label: '手机号', prop: 'phoneNumber', width: 140 },
      { label: '状态', prop: 'statusName', width: 90 }, // 状态(非空 0-有效 3-失效)
      { label: '创建时间', prop: 'createDateStr' },
      {
        label: '操作',
        prop: 'actions',
        width: 130,
        render: (_, record) => {
          const statusText = record.status == '0' ? '失效' : '生效'
          return (
            <div>
              <CustomLink
                onClick={() => {
                  clickEdit(record)
                }}
              >
                编辑
              </CustomLink>
              <CustomLink
                onClick={() => {
                  handleToggleStatus(record)
                }}
              >
                {statusText}
              </CustomLink>
            </div>
          )
        },
      },
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
          url: '/web/staff/getStaffList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickAdd() {
      editModalRef.value?.open()
    }

    function clickEdit(record) {
      editModalRef.value?.open(record)
    }

    function handleToggleStatus(record) {
      const statusText = record.status == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/staff/updateStaffStatus',
          data: {
            staffCode: record.staffCode,
            status: record.status == '0' ? '3' : '0',
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
      //
      editModalRef,
      clickAdd,
    }
  },
  components: { SearchForm, ProTable, EditModal, FetchSelect, CustomLink },
}
</script>

<style></style>
