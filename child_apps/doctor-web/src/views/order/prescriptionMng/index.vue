<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="dateType">
        <el-select placeholder="日期类型" v-model="searchController.formModel.dateType" clearable>
          <el-option label="下处方时间" value="RX"></el-option>
          <el-option label="审批时间" value="APPR"></el-option>
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
      <el-form-item prop="doctorName">
        <el-input placeholder="医生姓名" v-model="searchController.formModel.doctorName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="pharmacistName">
        <el-input placeholder="审方人" v-model="searchController.formModel.pharmacistName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="apprStatus">
        <FetchSelect
          placeholder="审方状态"
          v-model="searchController.formModel.apprStatus"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'PRESCRIPTION_APPR_STATUS' }"
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
  <DetailModal ref="DetailModalRef" />
  <ApprModal ref="ApprModalRef" @success="tableController.refresh" />
  <QRCodeModal ref="QRCodeModalRef" />
</template>

<script>
import { ref } from 'vue'
import dayjs from 'dayjs'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import DetailModal from './DetailModal.vue'
import ApprModal from './ApprModal.vue'
import QRCodeModal from '@/components/modal/QRCodeModal'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useTableController from '@/hooks/useTableController'
import request from '@/utils/request'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'
import { ElMessage } from 'element-plus/lib/components'
import { simpleConfirm } from '@/utils/confirm'

export default {
  setup() {
    const DetailModalRef = ref(null)
    const ApprModalRef = ref(null)
    const QRCodeModalRef = ref(null)

    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        dateType: 'RX', // 日期类型(非空 RX-下处方时间;APPR-审批时间;FINISH-完成时间)(默认:RX)
        dateRange: [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        tradeNo: '', // 订单编号
        rxCode: '', // 处方编号
        pharmacistName: '', // 药剂师 审方人
        apprStatus: '', // 审批状态
        // 8) doctorPsptNo                        医生身份证(精确查询)
        // 11) rxStatus                                处方状态(可多选, 分隔符",")(下拉框,codeParam=PRESCRIPTION_RX_STATUS)
      },
    })
    // table
    const columns = [
      { label: '下单时间', prop: 'rxDateStr' },
      { label: '订单编号', prop: 'tradeNo' },
      { label: '处方编号', prop: 'rxCode' },
      // { label: '医疗机构编码', prop: '' },
      { label: '医生', prop: 'doctorName', width: 140 },
      { label: '身份证号', prop: 'doctorPsptNo' },
      { label: '审方人', prop: 'pharmacistName', width: 140 },
      { label: '审方时间', prop: 'apprDateStr' },
      { label: '审方状态', prop: 'rxStatusName', width: 100 },
      { label: '审核意见', prop: 'apprNote', width: 260 },
      {
        label: '操作',
        prop: 'actions',
        width: 130,
        fixed: 'right',
        render: (_, record) => {
          return (
            <div>
              <CustomLink
                onClick={() => {
                  clickDetail(record)
                }}
              >
                详情
              </CustomLink>
              {record.rxStatus == '0' && (
                <CustomLink
                  onClick={() => {
                    clickAppr(record)
                  }}
                >
                  审核
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
          url: '/web/system/prescription/getPrescriptionList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
    })

    function clickDetail(record) {
      DetailModalRef.value?.open(record.rxCode)
    }

    async function clickAppr(record) {
      // 验证
      if (!getMainAppGlobalData().userInfo?.pharmacistInfoDTO) return // 还没查询完
      // 如果是药师，但是还没签名
      if (getMainAppGlobalData().userInfo?.pharmacistInfoDTO && !getMainAppGlobalData().userInfo?.pharmacistInfoDTO.signImg) {
        await simpleConfirm('请先完善签名再审核')
        const text = `https://ly.bld365.com/yaoshih5/index.html#/h5/pages/login/index?phoneNumber=${record.phoneNumber}`
        QRCodeModalRef.value.open({
          text,
          saveName: '药师_' + record.pharmacistName + '_二维码',
          isShowText: true,
        })
        return
      }
      // 验证 end

      ApprModalRef.value?.open(record)
    }

    return {
      searchController,
      tableController,
      DetailModalRef,
      ApprModalRef,
      QRCodeModalRef,
    }
  },
  components: { SearchForm, ProTable, FetchSelect, CustomLink, DetailModal, ApprModal, QRCodeModal },
}
</script>

<style></style>
