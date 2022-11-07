<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="roleName">
        <el-input placeholder="角色名称" v-model="searchController.formModel.roleName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="ifDefault">
        <el-select placeholder="是否默认" v-model="searchController.formModel.ifDefault" clearable>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="disabled">
        <el-select placeholder="状态" v-model="searchController.formModel.disabled" clearable>
          <el-option label="有效" :value="0"></el-option>
          <el-option label="无效" :value="1"></el-option>
        </el-select>
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
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import EditModal from './EditModal.vue'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import { actionConfirm } from '@/utils/confirm'
import request from '@/utils/request'

export default {
  setup() {
    const editModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        roleName: '',
        ifDefault: '',
        disabled: '',
      },
    })
    // table
    const columns = [
      { label: '角色名称', prop: 'roleName' },
      { label: '角色说明', prop: 'roleDesc', width: 240 },
      { label: '是否默认', prop: 'ifDefaultName', width: 90 },
      { label: '状态', prop: 'disabledName', width: 100 },
      { label: '创建时间', prop: 'createDateStr' },
      {
        label: '操作',
        prop: 'actions',
        width: 130,
        render: (_, record) => {
          const statusText = record.disabled == '0' ? '失效' : '生效'
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
          url: '/web/role/getRoleList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickAdd() {
      editModalRef.value?.open()
    }

    function clickEdit(record) {
      editModalRef.value?.open(record.roleCode)
    }

    function handleToggleStatus(record) {
      const statusText = record.status == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/role/updateRoleDisabled',
          data: {
            roleCode: record.roleCode,
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
      //
      editModalRef,
      clickAdd,
    }
  },
  components: { SearchForm, ProTable, EditModal, FetchSelect, CustomLink },
}
</script>

<style></style>
