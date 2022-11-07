<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="search" :searchLoading="tableController.loading">
    <template #form>
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
      <el-form-item prop="paymentNo">
        <el-input placeholder="提现单号" v-model="searchController.formModel.paymentNo" clearable></el-input>
      </el-form-item>
      <el-form-item prop="personOrgName">
        <el-input placeholder="医生集团" v-model="searchController.formModel.personOrgName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="personName">
        <el-input placeholder="医生" v-model="searchController.formModel.personName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <FetchSelect
          placeholder="状态"
          v-model="searchController.formModel.status"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'PAYMENT_STATUS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
    </template>
  </SearchForm>
  <!-- 统计数据 -->
  <div class="statistics_wrap">
    <div class="statistics_item">
      <div>总提现金额</div>
      <div class="statistics_count">{{ statisticsInfo.totalPayFeeStr || '0.00' }}</div>
    </div>
    <div class="statistics_item">
      <div>已提现</div>
      <div class="statistics_count">{{ statisticsInfo.totalFinishPayFeeStr || '0.00' }}</div>
    </div>
    <div class="statistics_item">
      <div>审核中</div>
      <div class="statistics_count">{{ statisticsInfo.totalProcessPayFeeStr || '0.00' }}</div>
    </div>
    <div class="statistics_item">
      <div>已驳回</div>
      <div class="statistics_count">{{ statisticsInfo.totalCancelPayFeeStr || '0.00' }}</div>
    </div>
  </div>
  <ProTable
    :columns="tableController.columns"
    :tableData="tableController.tableData"
    :loading="tableController.loading"
    :total="tableController.total"
    :pageState="tableController.pageState"
    @pageChange="tableController.onPageChange"
  />
</template>

<script>
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import useRequestData from '@/hooks/useRequestData'
import { actionConfirm, promptConfirm } from '@/utils/confirm'
import request from '@/utils/request'
import dayjs from 'dayjs'

export default {
  setup() {
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        paymentNo: '',
        personName: '',
        personOrgName: '',
        status: '',
      },
    })

    // table
    const columns = [
      { label: '提现单号', prop: 'paymentNo', width: 160 },
      { label: '提现时间', prop: 'payDateStr' },
      { label: '医生集团', prop: 'personOrgName', width: 210 },
      { label: '医生', prop: 'personName', width: 110 },
      { label: '提现金额', prop: 'payFeeStr', width: 120 },
      { label: '状态', prop: 'statusName', width: 90 },
      { label: '驳回原因', prop: 'resultNote', width: 170 },
      { label: '审核人', prop: 'apprPersonName', width: 130 },
      { label: '审核时间', prop: 'apprDateStr' },
      {
        label: '操作',
        prop: 'actions',
        width: 120,
        fixed: 'right',
        render: (_, record) => {
          return record.status == '30' ? (
            <div>
              <CustomLink
                onClick={() => {
                  handlePass(record)
                }}
              >
                通过
              </CustomLink>
              <CustomLink
                onClick={() => {
                  handleReject(record)
                }}
              >
                取消
              </CustomLink>
            </div>
          ) : null
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
          url: '/web/system/payment/getPaymentList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
      defaultPageSize: 50,
    })

    const { info: statisticsInfo, getInfo: getStatisticsInfo } = useRequestData({
      api: '/web/system/payment/getPaymentPayFeeTotal',
      getPostData: () => {
        const { dateRange, ...values } = searchController.formModel
        return {
          startDate: dateRange?.[0],
          endDate: dateRange?.[1],
          ...values,
        }
      },
    })

    function search() {
      tableController.search()
      getStatisticsInfo()
    }
    function refresh() {
      tableController.refresh()
      getStatisticsInfo()
    }

    function handlePass(record) {
      actionConfirm(`确认通过？`, () => {
        return request({
          url: '/web/system/payment/approvePayment',
          data: {
            paymentNo: record.paymentNo,
            resultNote: '',
          },
        }).then(() => {
          refresh()
          ElMessage.success('操作成功')
        })
      })
    }
    function handleReject(record) {
      promptConfirm({ label: '取消说明' }, (value) => {
        return request({
          url: '/web/system/payment/cancelPayment',
          data: {
            paymentNo: record.paymentNo,
            resultNote: value ?? '',
          },
        }).then(() => {
          refresh()
          ElMessage.success('取消操作成功')
        })
      })
    }
    return {
      searchController,
      tableController,
      statisticsInfo,
      search,
      refresh,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, CustomLink },
}
</script>

<style lang="less"></style>
<style lang="less" scoped>
@import url('~@/common/styles.less');
.statistics_wrap {
  .flexCenter;
  background-color: #fff;
  margin: 0 0 15px;
  padding: 15px 7.5px;
  .statistics_item {
    .flexColumn;
    flex: 1 0 0;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    margin: 0 7.5px;
    padding: 7px 0;
    .statistics_count {
      font-size: 17px;
      font-weight: bolder;
      margin-top: 3px;
      color: red;
    }
  }
}
</style>
