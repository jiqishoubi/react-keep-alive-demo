<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="productTitle">
        <el-input placeholder="标题" v-model="searchController.formModel.productTitle" clearable></el-input>
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
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import CustomLink from '@/components/customStyle/CustomLink'
import AddModal from './AddModal.vue'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'
import { actionConfirm } from '@/utils/confirm'
import { ElMessage } from 'element-plus'

export default {
  props: ['modalProps'],
  setup(props) {
    const { modalProps } = props
    const { record: doctorRecord } = modalProps
    const addModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        productTitle: '',
        disabled: '',
      },
    })
    // table
    const columns = [
      {
        label: '图标',
        prop: 'productIcon',
        width: 70,
        render: (v, record) => {
          const width = 48
          const styleObj = {
            width: width + 'px',
            height: width + 'px',
            overflow: 'hidden',
          }
          return (
            <div className="flexCenter flexJCenter">
              <div style={styleObj}>
                <el-image src={record.productIcon} fit="cover"></el-image>
              </div>
            </div>
          )
        },
      },
      { label: '标题', prop: 'productTitle', width: 180 },
      { label: '描述', prop: 'productDesc' },
      { label: '价格', prop: 'productFeeStr', width: 150 },
      { label: '状态', prop: 'disabledName', width: 80 },
      {
        label: '操作',
        prop: 'actions',
        width: 130,
        fixed: 'right',
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
          doctorCode: doctorRecord?.doctorCode || '',
          ...searchController.formModel,
        }
        return request({
          url: '/web/system/serviceproduct/getServiceProductList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickAdd() {
      addModalRef.value.open({
        doctorRecord,
      })
    }

    function clickEdit(record) {
      addModalRef.value.open({
        doctorRecord,
        record,
      })
    }

    function handleToggleStatus(record) {
      const statusText = record.disabled == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/system/serviceproduct/updateServiceProductDisabled',
          data: {
            productCode: record.productCode,
            disabled: record.disabled == '0' ? '1' : '0',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('操作成功')
        })
      })
    }

    return { addModalRef, searchController, tableController, clickAdd, clickEdit }
  },
  components: { SearchForm, ProTable, AddModal },
}
</script>
<style lang="less"></style>
