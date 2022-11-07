<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="doctorCode">
        <FetchSelect
          placeholder="医生"
          v-model="searchController.formModel.doctorCode"
          api="/web/system/doctor/getDoctorList"
          :postData="{
            page: 1,
            rows: 999,
          }"
          textKey="doctorName"
          valueKey="doctorCode"
          :isPaging="true"
        />
      </el-form-item>
      <el-form-item prop="goodsName">
        <el-input placeholder="商品名称" v-model="searchController.formModel.goodsName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="goodsType">
        <FetchSelect
          placeholder="商品类型"
          v-model="searchController.formModel.goodsType"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'GOODS_TYPE' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
      <el-form-item prop="status">
        <FetchSelect
          placeholder="状态"
          v-model="searchController.formModel.status"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'GOODS_STATUS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
    </template>
    <template #controll>
      <el-button type="primary" @click="clickAdd">新建</el-button>
      <el-button type="primary" @click="handleBatchCopy">复制至医生</el-button>
      <el-button type="primary" @click="handleBatchDelete">删除商品</el-button>
    </template>
  </SearchForm>
  <ProTable
    ref="tableRef"
    :columns="tableController.columns"
    :tableData="tableController.tableData"
    :loading="tableController.loading"
    :total="tableController.total"
    :pageState="tableController.pageState"
    @pageChange="tableController.onPageChange"
    :isSelection="true"
  />

  <!-- 模态 -->
  <CopyGoodsForDoctorModal ref="CopyGoodsForDoctorModalRef" />
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import CopyGoodsForDoctorModal from './CopyGoodsForDoctorModal'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import needKeepAliveMixin from '@/mixins/needKeepAliveMixin'
import { actionConfirm } from '@/utils/confirm'
import request from '@/utils/request'
import './index_global.less'

const componentName = '/web/system/goods/goodsmgr'

export default {
  name: componentName, // 需要keepalive的组件 一定要有name，用来把name存在vuex中
  setup() {
    const CopyGoodsForDoctorModalRef = ref(null)
    const router = useRouter()
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        doctorCode: '',
        goodsName: '',
        goodsType: '',
        status: '', // 0 有效
      },
    })
    // table
    const tableRef = ref(null)
    const columns = [
      {
        label: '商品名称',
        prop: 'goodsName',
        width: 240,
        render: (_, record) => {
          const imgSrc = record.goodsImg?.split(',')[0] ?? ''
          return (
            <div className="goodsName_wrap">
              {imgSrc && (
                <div className="goodsImgBox">
                  <el-image style="width: 58px; height: 58px" src={imgSrc} fit="cover"></el-image>
                </div>
              )}
              <div className="goodsName_text">{record.goodsName}</div>
            </div>
          )
        },
      },
      { label: '医生', prop: 'doctorName' },
      { label: '商品规格', prop: 'goodsSize', width: 180 },
      { label: '商品类型', prop: 'goodsTypeName', width: 100 },
      { label: '渠道商品ID', prop: 'chnlGoodsId', width: 150 },
      { label: '药厂', prop: 'goodsFactory' },
      { label: '创建时间', prop: 'createDateStr' },
      { label: '状态', prop: 'statusName', width: 70 },
      {
        label: '操作',
        prop: 'actions',
        width: 100,
        fixed: 'right',
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
          url: '/web/system/goods/getGoodsList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickAdd() {
      router.push('/web/system/goods/goodsmgr/detail')
    }

    function clickEdit(record) {
      router.push(`/web/system/goods/goodsmgr/detail?goodsCode=${record.goodsCode}`)
    }

    function handleToggleStatus(record) {
      const statusText = record.status == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/system/goods/updateGoodsStatus',
          data: {
            goodsCode: record.goodsCode,
            status: record.status == '0' ? '3' : '0',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('操作成功')
        })
      })
    }

    // 批量复制给医生
    function handleBatchCopy() {
      const goodsCodeArr = tableRef.value?.getSelectedKeys('goodsCode')
      if (goodsCodeArr.length == 0) {
        ElMessage.warning('请选择商品')
        return
      }
      CopyGoodsForDoctorModalRef.value?.open(goodsCodeArr, () => tableRef.value?.clearSelectedRows())
    }

    // 批量删除
    function handleBatchDelete() {
      const goodsCodeArr = tableRef.value?.getSelectedKeys('goodsCode')
      if (goodsCodeArr.length == 0) {
        ElMessage.warning('请选择商品')
        return
      }

      actionConfirm(`商品删除后无法恢复，确定删除${goodsCodeArr.length}个商品吗？`, () => {
        return request({
          url: '/web/system/goods/deleteGoods',
          data: {
            goodsCode: goodsCodeArr.join(','),
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('删除成功')
          tableRef.value?.clearSelectedRows()
        })
      })
    }

    return {
      searchController,
      tableRef,
      tableController,
      clickAdd,
      CopyGoodsForDoctorModalRef,
      handleBatchCopy,
      handleBatchDelete,
    }
  },
  ...needKeepAliveMixin,
  components: { SearchForm, ProTable, FetchSelect, CopyGoodsForDoctorModal },
}
</script>

<style lang="less" scoped></style>
