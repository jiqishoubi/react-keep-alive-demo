<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="orgName">
        <el-input placeholder="医生集团名称" v-model="searchController.formModel.orgName" clearable></el-input>
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
  <AddModal ref="addModalRef" @successAdd="tableController.search" />
  <EditModal ref="editModalRef" @successEdit="tableController.refresh" />
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import AddModal from './AddModal.vue'
import EditModal from './EditModal.vue'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import { actionConfirm } from '@/utils/confirm'
import request from '@/utils/request'

export default {
  setup() {
    const addModalRef = ref(null)
    const editModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        orgName: '',
      },
    })
    // table
    const columns = [
      { label: '医生集团', prop: 'orgName' },
      { label: '类型', prop: 'orgKindName', width: 140 },
      { label: '状态', prop: 'statusName', width: 130 },
      { label: '创建时间', prop: 'createDateStr' },
      {
        label: '操作',
        prop: 'actions',
        width: 100,
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
          url: '/web/system/company/getCompanyList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickAdd() {
      addModalRef.value?.open()
    }

    function clickEdit(record) {
      editModalRef.value?.open(record)
    }

    function handleToggleStatus(record) {
      const statusText = record.status == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/system/company/updateCompanyStatus',
          data: {
            orgCode: record.orgCode,
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
      addModalRef,
      editModalRef,
      clickAdd,
    }
  },
  components: { SearchForm, ProTable, EditModal, FetchSelect, AddModal },
}
</script>

<style></style>
