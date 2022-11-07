<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="departClassName">
        <el-input placeholder="诊疗科目名称" v-model="searchController.formModel.departClassName" clearable></el-input>
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
  <AddModal ref="addModalRef" @successAdd="tableController.search" @successEdit="tableController.refresh" />
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import AddModal from './AddModal.vue'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import { actionConfirm } from '@/utils/confirm'
import request from '@/utils/request'

export default {
  setup() {
    const addModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        departClassName: '',
        disabled: '',
      },
    })
    // table
    const columns = [
      { label: '诊疗科目', prop: 'departClassName', width: 170 },
      { label: '全名', prop: 'departClassFullName' },
      { label: '备注', prop: 'remark' },
      { label: '创建时间', prop: 'createDateStr' },
      { label: '状态', prop: 'disabledName', width: 90 },
      {
        label: '操作',
        prop: 'actions',
        width: 100,
        render: (_, record) => {
          const statusText = record.disabled == '0' ? '失效' : '生效'
          return (
            <div>
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
          url: '/web/system/departclass/getDepartClassList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickAdd() {
      addModalRef.value?.open()
    }

    // function clickEdit(record) {
    //   addModalRef.value?.open(record)
    // }

    function handleToggleStatus(record) {
      const statusText = record.disabled == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/system/departclass/updateDepartClassDisabled',
          data: {
            departClassCode: record.departClassCode,
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
      addModalRef,
      clickAdd,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, AddModal },
}
</script>

<style></style>
