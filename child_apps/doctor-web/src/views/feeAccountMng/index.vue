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
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="doctorName">
        <el-input placeholder="医生" v-model="searchController.formModel.doctorName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input placeholder="手机号" v-model="searchController.formModel.phoneNumber" clearable></el-input>
      </el-form-item>
      <el-form-item prop="orgName">
        <el-input placeholder="医生集团" v-model="searchController.formModel.orgName" clearable></el-input>
      </el-form-item>
    </template>
  </SearchForm>
  <!-- 统计数据 -->
  <div class="statistics_wrap">
    <div class="statistics_item">
      <div>总收入金额</div>
      <div class="statistics_count">{{ statisticsInfo.totalIncomeFeeStr || '0.00' }}</div>
    </div>
    <div class="statistics_item">
      <div>总账户金额</div>
      <div class="statistics_count">{{ statisticsInfo.totalBalanceFeeStr || '0.00' }}</div>
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
  <!-- 模态 -->
  <DrawerModal ref="drawerModalRef" :size="1100">
    <template v-slot:default="{ slotProps: slotProps }">
      <DetailTable :slotProps="slotProps" />
    </template>
  </DrawerModal>
</template>

<script>
import { ref } from 'vue'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import DrawerModal from '@/components/modal/DrawerModal'
import DetailTable from './DetailTable.vue'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import useRequestData from '@/hooks/useRequestData'
import request from '@/utils/request'
import dayjs from 'dayjs'

export default {
  setup() {
    const drawerModalRef = ref(null)
    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        doctorName: '',
        phoneNumber: '',
        orgName: '',
      },
    })

    // table
    const columns = [
      { label: '医生', prop: 'doctorName', width: 110 },
      { label: '手机号', prop: 'phoneNumber', width: 110 },
      { label: '医生集团', prop: 'orgName', width: 200 },
      { label: '分润金额', prop: 'incomeFeeStr', width: 150 },
      { label: '已提现金额', prop: 'cashTotalFeeStr', width: 150 },
      { label: '账户余额', prop: 'balanceFeeStr', width: 150 },
      { label: '待审核金额', prop: 'cashApprFeeStr', width: 130 },
      { label: '对账校验', prop: 'checkFeeStr', width: 110 },
      {
        label: '操作',
        prop: 'actions',
        width: 75,
        fixed: 'right',
        render: (_, record) => {
          return (
            <div>
              <CustomLink
                onClick={() => {
                  drawerModalRef.value.open(record)
                }}
              >
                详情
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
          startDate: dateRange?.[0],
          endDate: dateRange?.[1],
          ...values,
        }
        return request({
          url: '/web/system/doctorbalance/getDoctorBalanceList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    const { info: statisticsInfo, getInfo: getStatisticsInfo } = useRequestData({
      api: '/web/system/doctorbalance/getDoctorBalanceTotal',
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

    return {
      drawerModalRef,
      searchController,
      tableController,
      statisticsInfo,
      search,
      refresh,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, CustomLink, DetailTable, DrawerModal },
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
