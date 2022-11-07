<template>
  <ProTable
    :tableId="tableController.tableId"
    :columns="tableController.columns"
    :tableData="tableController.tableData"
    :loading="tableController.loading"
    :total="tableController.total"
    :pageState="tableController.pageState"
    @pageChange="tableController.onPageChange"
  />
</template>
<script>
import { toRefs } from 'vue'
import ProTable from '@/components/ProTable'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'
export default {
  props: ['slotProps'],
  setup(props) {
    const { slotProps } = toRefs(props)
    // table
    const columns = [
      { label: '时间', prop: 'billDateStr', width: 110 },
      { label: '订单号', prop: 'seqNo', width: 135 },
      { label: '类型', prop: 'feeItemName', width: 90 },
      { label: '金额', prop: 'feeStr', width: 120 },
      { label: '账户余额', prop: 'balanceStr', width: 120 },
      { label: '状态', prop: 'statusName', width: 90 },
    ]
    const tableController = useTableController({
      tableId: 'feeAccountMng_DetailTable_table',
      columns,
      ajax: ({ page, pageSize }) => {
        const postData = {
          page,
          rows: pageSize,
          doctorCode: props.slotProps?.doctorCode,
        }
        return request({
          url: '/web/system/doctorbalance/getDoctorBalanceDetailList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
      defaultPageSize: 50,
      getIsReady: () => props.slotProps?.doctorCode,
      depArr: [slotProps],
    })
    return { tableController }
  },
  components: { ProTable },
}
</script>
