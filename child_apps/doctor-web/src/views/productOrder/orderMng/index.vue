<template>
  <SearchFormByOrderType ref="searchFormRef" :searchController="searchController" :tableController="tableController" @export="exportStream" />

  <ProTable
    :columns="tableController.columns"
    :tableData="tableController.tableData"
    :loading="tableController.loading"
    :total="tableController.total"
    :pageState="tableController.pageState"
    @pageChange="tableController.onPageChange"
  />

  <LogDrawer :controller="useLogDrawerController" />
</template>

<script>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SearchFormByOrderType from './orderMngConfig/SearchFormByOrderType'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import LogDrawer from '@/components/modal/LogDrawer'
import useLogDrawer from '@/components/modal/LogDrawer/useLogDrawer'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import usePageMeta from '@/hooks/router/usePageMeta'
import useExport from '@/hooks/useExport'
import request from '@/utils/request'
import { getDefaultSearchFormModel } from './orderMngConfig/func'
import { promptConfirm } from '@/utils/confirm'

export default {
  name: '服务订单列表-共用',
  props: ['orderType'],
  setup() {
    const meta = usePageMeta()
    const router = useRouter()

    // searchForm
    const searchController = useSearchFormCtrller({
      form: getDefaultSearchFormModel(meta),
    })

    const { setExportPostData, exportStream } = useExport('/web/system/serviceorder/exportServiceOrderList')

    // table
    const columns = [
      { label: '下单时间', prop: 'orderDateStr' },
      { label: '订单编号', prop: 'orderNo' },
      { label: '服务包名称', prop: 'productTitle' },
      { label: '医生', prop: 'doctorName', width: 140 },
      { label: '医生集团', prop: 'orgName', width: 260 },
      { label: '患者姓名', prop: 'patientName', width: 130 },
      { label: '患者手机号', prop: 'patientPhoneNumber', width: 125 },
      { label: '金额(元)', prop: 'productFeeStr', width: 140 },
      { label: '订单状态', prop: 'orderStatusName', width: 110 },
      { label: '支付状态', prop: 'payStatusName', width: 110 },
      { label: '有效时间', prop: 'serviceValidDate', width: 220 },
      { label: '支付时间', prop: 'payDateStr' },
      { label: '完成时间', prop: 'finishDateStr' },
      {
        label: '操作',
        prop: 'actions',
        fixed: 'right',
        width: 200,
        render: (_, record) => {
          // 取消订单 (注:仅当 orderStatus = 0(诊疗单提交), 10(待支付), 50(咨询中)时,可操作)
          return (
            <div>
              <CustomLink
                onClick={() => {
                  handleDetail(record)
                }}
              >
                详情
              </CustomLink>

              {['0', '10', '50'].includes(record.orderStatus) && (
                <CustomLink
                  onClick={() => {
                    handleCancelOrder(record)
                  }}
                >
                  取消
                </CustomLink>
              )}
              {['50'].includes(record.orderStatus) && (
                <CustomLink
                  onClick={() => {
                    handleFinishOrder(record)
                  }}
                >
                  完成
                </CustomLink>
              )}
              <CustomLink
                onClick={() => {
                  handleLog(record)
                }}
              >
                订单日志
              </CustomLink>
            </div>
          )
        },
      },
    ]

    const tableController = useTableController({
      columns,
      ajax: ({ page, pageSize }) => {
        const { dateRange, ...values } = searchController.formModel
        const postData = {
          page,
          rows: pageSize,
          startDate: dateRange[0],
          endDate: dateRange[1],
          ...values,
        }
        setExportPostData(postData)
        return request({
          url: '/web/system/serviceorder/getServiceOrderList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    const useLogDrawerController = useLogDrawer({
      columns: [
        { title: '操作内容', dataIndex: 'logInfo', width: 'auto' },
        { title: '操作时间', dataIndex: 'logDateStr' },
      ],
      api: '/web/system/serviceorder/getLogServiceOrderOperList',
      getPostDataFunc: (openParams) => {
        return {
          orderNo: openParams.orderNo,
        }
      },
    })

    function handleDetail(record) {
      router.push(`/web/system/serviceorder/ordermgr/detail?orderNo=${record.orderNo}`)
    }
    function handleCancelOrder(record) {
      promptConfirm({ label: '取消说明' }, (value) => {
        return request({
          url: '/web/system/serviceorder/cancelServiceOrder',
          data: {
            orderNo: record.orderNo,
            resultNote: value ?? '',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('取消操作成功')
        })
      })
    }
    function handleFinishOrder(record) {
      promptConfirm({ label: '说明' }, (value) => {
        return request({
          url: '/web/system/serviceorder/finishServiceOrder',
          data: {
            orderNo: record.orderNo,
            resultNote: value ?? '',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('完成订单操作成功')
        })
      })
    }
    function handleLog(record) {
      useLogDrawerController.open(record)
    }

    return {
      meta,
      searchController,
      tableController,
      exportStream,
      useLogDrawerController,
    }
  },
  // ...needKeepAliveMixin,
  components: { SearchForm, ProTable, FetchSelect, CustomLink, SearchFormByOrderType, LogDrawer },
}
</script>

<style lang="less">
@import url('./index_global.less');
</style>
