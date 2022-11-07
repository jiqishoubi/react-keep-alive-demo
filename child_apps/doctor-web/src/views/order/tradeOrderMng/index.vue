<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="dateType">
        <el-select placeholder="日期类型" v-model="searchController.formModel.dateType" clearable>
          <el-option label="下单时间" value="TRADE"></el-option>
          <el-option label="支付时间" value="PAY"></el-option>
          <el-option label="完成时间" value="FINISH"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="dateRange">
        <el-date-picker
          v-model="searchController.formModel.dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          :clearable="false"
          style="height: 32px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="tradeNo">
        <el-input placeholder="订单编号" v-model="searchController.formModel.tradeNo" clearable></el-input>
      </el-form-item>
      <el-form-item prop="rxCode">
        <el-input placeholder="处方编号" v-model="searchController.formModel.rxCode" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item prop="doctorName">
        <el-input placeholder="医生姓名" v-model="searchController.formModel.doctorName" clearable></el-input>
      </el-form-item> -->
      <el-form-item prop="tradeStatus">
        <FetchSelect
          placeholder="订单状态"
          v-model="searchController.formModel.tradeStatus"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'TRADE_STATUS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
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
  <LogisticsModal ref="LogisticsModalRef" @success="tableController.refresh" />
</template>

<script>
import { ref } from 'vue'
import dayjs from 'dayjs'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import LogisticsModal from '@/components/business/LogisticsModal'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import { actionConfirm, promptConfirm, simpleConfirm } from '@/utils/confirm'
import request from '@/utils/request'
import { ElMessage } from 'element-plus/lib/components'

export default {
  setup() {
    const LogisticsModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        dateType: 'TRADE', // 日期类型(非空 RX-下处方时间;APPR-审批时间;FINISH-完成时间)(默认:RX)
        dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        tradeNo: '', // 订单编号
        rxCode: '', // 处方编号
        tradeStatus: '', // 审批状态
      },
    })
    // table
    const columns = [
      { label: '下单时间', prop: 'tradeDateStr' },
      { label: '订单编号', prop: 'tradeNo' },
      { label: '处方编号', prop: 'rxCode' },
      { label: '状态', prop: 'tradeStatusName', width: 100 },
      {
        label: '操作',
        prop: 'actions',
        width: 130,
        fixed: 'right',
        render: (_, record) => {
          return (
            <div>
              {[
                '50', // 待发货
              ].includes(record.tradeStatus) && (
                <CustomLink
                  onClick={() => {
                    handleLogistics(record)
                  }}
                >
                  发货
                </CustomLink>
              )}
              {[
                '0', // 订单提交
                '10', // 待支付
                '20', // 待审批
                '50', // 待发货
              ].includes(record.tradeStatus) && (
                <CustomLink
                  onClick={() => {
                    handleCancel(record)
                  }}
                >
                  取消
                </CustomLink>
              )}
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
          startDate: dateRange?.[0],
          endDate: dateRange?.[1],
          ...values,
        }
        return request({
          url: '/web/system/trade/getTradeList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    // 发货
    function handleLogistics(record) {
      LogisticsModalRef.value?.open(record)
    }

    // 取消订单
    async function handleCancel(record) {
      promptConfirm({ label: '取消说明' }, (value) => {
        return request({
          url: '/web/system/trade/cancelTrade',
          data: {
            tradeNo: record.tradeNo,
            resultNote: value ?? '',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('取消操作成功')
        })
      })
    }

    return {
      searchController,
      tableController,
      LogisticsModalRef,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, CustomLink, LogisticsModal },
}
</script>

<style></style>
