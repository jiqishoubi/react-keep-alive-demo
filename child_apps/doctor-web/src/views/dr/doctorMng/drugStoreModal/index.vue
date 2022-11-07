<template>
  <StyledModal :visible="modalController.visible" title="配置药房" :showCancel="false" @close="modalController.close" @submit="modalController.close" width="90vw">
    <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
      <template #form>
        <el-form-item prop="goodsName">
          <el-input placeholder="商品名称" v-model="searchController.formModel.goodsName" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item prop="disabled">
          <el-select placeholder="状态" v-model="searchController.formModel.disabled" clearable>
            <el-option label="有效" :value="0"></el-option>
            <el-option label="无效" :value="1"></el-option>
          </el-select>
        </el-form-item> -->
      </template>
      <template #controll>
        <el-button type="primary" @click="handleAdd">分销市场选品</el-button>
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
  </StyledModal>
</template>
<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StyledModal from '@/components/modal/StyledModal'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import CustomLink from '@/components/customStyle/CustomLink'
import ServicePackagePage from './index.vue'
import useModalController from '@/hooks/useModalController'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'
import { toRefs } from 'vue'
import { ActionTypes, dispatchMicroApp } from '@/utils/aboutMicroApp'
import { actionConfirm } from '@/utils/confirm'

export default {
  setup() {
    const router = useRouter()
    const modalController = useModalController()
    const { modalProps } = toRefs(modalController)

    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        goodsName: '',
      },
    })
    // table
    const columns = [
      { label: '商品名称', prop: 'goodsName', width: 'auto' },
      { label: '供应商', prop: 'supplierOrgName', width: 'auto' },
      { label: '一级类目', prop: 'groupName' },
      { label: '二级类目', prop: 'childGroupName' },
      { label: '商品类型', prop: 'goodsTypeName', width: 100 },
      {
        label: '商品价格',
        prop: 'price',
        width: 130,
        render: (v, record) => {
          if (record.minSkuPriceStr == record.minSkuPriceStr) {
            return record.minSkuPriceStr
          } else {
            return record.minSkuPriceStr + ' - ' + record.minSkuPriceStr
          }
        },
      },
      { label: '状态', prop: 'goodsStatusName', width: 90 },
      { label: '是否常用', prop: 'statusName', width: 90 }, // 0否 1是
      {
        label: '操作',
        prop: 'actions',
        width: 130,
        fixed: 'right',
        render: (_, record) => {
          const statusText = record.status == '0' ? '加入常用' : '取消常用'
          return (
            <div>
              <CustomLink
                onClick={() => {
                  handleToggleStatus(record)
                }}
              >
                {statusText}
              </CustomLink>
              <CustomLink
                onClick={() => {
                  handleDeleteDrug(record)
                }}
              >
                删除
              </CustomLink>
            </div>
          )
        },
      },
    ]
    const tableController = useTableController({
      // tableId: 'doctorMng_drugStoreModal_table',
      columns,
      ajax: ({ page, pageSize }) => {
        const postData = {
          page,
          rows: pageSize,
          doctorCode: modalProps.value?.record?.doctorCode,
          ...searchController.formModel,
        }
        return request({
          url: '/web/system/drugstore/queryPage',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
      getIsReady: () => modalProps.value?.record?.id,
      depArr: [modalProps],
    })

    // 分销市场选品
    function handleAdd() {
      // 去mallApp 分销市场
      dispatchMicroApp({
        type: ActionTypes.ROUTER_PUSH_NEW,
        payload: `/mallApp/web/system/goods/suppliergoodsmgrForStore?doctorCode=${modalProps.value?.record?.doctorCode}`,
      }) // 通知主应用
    }

    function handleToggleStatus(record) {
      const statusText = record.status == '0' ? '加入常用' : '取消常用'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/system/drugstore/updateDrugstoreStatus',
          data: {
            drugstoreCode: record.drugstoreCode,
            status: record.status == '0' ? '1' : '0',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('操作成功')
        })
      })
    }

    function handleDeleteDrug(record) {
      actionConfirm(`确认删除？`, () => {
        return request({
          url: '/web/system/drugstore/removeDrugstore',
          data: {
            drugstoreCode: record.drugstoreCode,
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('操作成功')
        })
      })
    }

    return {
      modalController,
      searchController,
      tableController,
      handleAdd,
    }
  },
  components: { StyledModal, ServicePackagePage, SearchForm, ProTable },
}
</script>
