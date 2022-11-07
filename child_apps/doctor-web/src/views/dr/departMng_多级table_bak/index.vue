<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="orgName">
        <el-input placeholder="医生集团1名称" v-model="searchController.formModel.orgName" clearable></el-input>
      </el-form-item>
    </template>
    <template #controll>
      <el-button type="primary" @click="clickAdd">新建</el-button>
    </template>
  </SearchForm>

  <!-- 表格 -->
  <div className="my_pro_table_wrap">
    <div className="my_pro_table">
      <el-table class="table_my" :border="true" size="small" :data="tableController.tableData" v-loading="tableController.loading">
        <el-table-column type="expand">
          <template #default="props">
            <!-- <p>State: {{ props.row.state }}</p>
            <p>City: {{ props.row.city }}</p>
            <p>Address: {{ props.row.address }}</p>
            <p>Zip: {{ props.row.zip }}</p> -->
            <el-table size="small" :data="props.rows?.childrend || []">
              <el-table-column label="Date" prop="date" />
              <el-table-column label="Date" prop="date" />
              <el-table-column label="Date" prop="date" />
              <el-table-column label="Date" prop="date" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Date" prop="date" />
        <el-table-column label="Date" prop="date" />
        <el-table-column label="Date" prop="date" />
        <el-table-column label="Date" prop="date" />
      </el-table>

      <div className="pagination_box">
        <div className="total_text">共{{ tableController.total }}条</div>
        <el-pagination
          class="pro_table_pagination"
          :current-page="tableController.pageState.page"
          :page-size="tableController.pageState.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
          :total="tableController.total"
          layout="sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>

  <!-- 模态 -->
  <AddModal ref="addModalRef" @successAdd="tableController.search" />
</template>

<script>
import { ref, reactive } from 'vue'
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
    const tableData = reactive({
      page: 1,
      pageSize: 10,
      list: [],
      total: 0,
      loading: false,
    })
    const addModalRef = ref(null)
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
    function handleCurrentChange(v) {
      tableController.onPageChange({
        page: v,
        pageSize: tableController.pageState.pageSize,
      })
    }
    function handleSizeChange(v) {
      tableController.onPageChange({
        page: 1, // pageSize改变的时候，重新回到第一页
        pageSize: v,
      })
    }

    function clickAdd() {
      addModalRef.value?.open()
    }

    function clickEdit(record) {}

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
      tableData,
      searchController,
      tableController,
      handleCurrentChange,
      handleSizeChange,
      //
      addModalRef,
      clickAdd,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, AddModal },
}
</script>

<style lang="less" scoped>
@import url('~@/components/ProTable/index.less');
</style>
