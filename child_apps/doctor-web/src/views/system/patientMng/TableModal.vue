<template>
  <StyledModal :visible="visible" title="" :showCancel="false" @close="close" @submit="close" :destroy-on-close="true" width="900px">
    <ProTable
      tableId="patientMng_distribute_table"
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
import { computed, reactive, ref } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import ProTable from '@/components/ProTable'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'

export default {
  emits: {
    successAdd: null,
    successEdit: null,
  },
  setup(_, ctx) {
    const visible = ref(false)

    const personCode = ref('')

    const columns = [
      { label: '医生', prop: 'doctorName', width: 'auto' },
      { label: '推广人', prop: 'distributeName', width: 'auto' },
    ]

    const tableController = useTableController({
      tableId: 'patientMng_distribute_table',
      columns,
      ajax: ({ page, pageSize }) => {
        const postData = {
          page,
          rows: pageSize,
          personCode: personCode.value,
        }
        return request({
          url: '/web/system/patient/queryDistributePage',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
      getIsReady: () => personCode.value !== '',
      depArr: [personCode],
    })

    /**
     * 方法
     */
    function open(code = '') {
      visible.value = true
      personCode.value = code
    }

    function close() {
      visible.value = false
      personCode.value = ''
    }

    return {
      visible,
      open,
      close,
      tableController,
    }
  },
  components: { StyledModal, ProTable },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
