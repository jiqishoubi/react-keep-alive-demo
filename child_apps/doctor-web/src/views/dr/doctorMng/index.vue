<template>
  <SearchForm ref="searchFormRef" :formModel="searchController.formModel" @search="tableController.search" :searchLoading="tableController.loading">
    <template #form>
      <el-form-item prop="doctorName">
        <el-input placeholder="医生姓名" v-model="searchController.formModel.doctorName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input placeholder="手机号" v-model="searchController.formModel.phoneNumber" clearable></el-input>
      </el-form-item>
      <el-form-item prop="orgName">
        <el-input placeholder="医生集团" v-model="searchController.formModel.orgName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="hospitalName">
        <el-input placeholder="医疗机构" v-model="searchController.formModel.hospitalName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="departName">
        <el-input placeholder="科室" v-model="searchController.formModel.departName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="doctorTitleCode">
        <FetchSelect
          v-model="searchController.formModel.doctorTitleCode"
          placeholder="职称"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'DOCTOR_TITLE' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
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
  <QRCodeModal ref="QRCodeModalRef" />
  <ServicePackageModal ref="ServicePackageModalRef" />
  <drugStoreModal ref="drugStoreModalRef" />
  <FormModal title="首页配置" :controller="configTemplateModalController">
    <el-form-item label="首页模板" prop="templateDataId" :rules="[{ required: true, message: '请选择首页模板' }]">
      <FetchSelect
        v-model="configTemplateModalController.formData.templateDataId"
        placeholder="请选择"
        api="/web/system/doctor/getUiTemplateDataList"
        :postData="{ doctorCode: configTemplateModalController.modalProps.record?.doctorCode }"
        textKey="templateDataName"
        valueKey="id"
      />
    </el-form-item>
  </FormModal>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/SearchForm'
import ProTable from '@/components/ProTable'
import FetchSelect from '@/components/FetchSelect'
import CustomLink from '@/components/customStyle/CustomLink'
import QRCodeModal from '@/components/modal/QRCodeModal'
import ServicePackageModal from '@/views/dr/servicePackage/modal.vue'
import drugStoreModal from './drugStoreModal'
import FormModal from '@/components/modal/FormModal'
import useSearchFormCtrller from '@/hooks/useSearchFormCtrller'
import useFormModalController from '@/hooks/useFormModalController'
import useTableController from '@/hooks/useTableController'
import needKeepAliveMixin from '@/mixins/needKeepAliveMixin'
import { actionConfirm } from '@/utils/confirm'
import request from '@/utils/request'
import { getIsProd } from '@/utils/utils'
import { getNumber } from '@/utils/number'

const componentName = '/web/system/doctor/doctormgr'

export default {
  name: componentName, // 需要keepalive的组件 一定要有name，用来把name存在vuex中
  setup() {
    const router = useRouter()
    const QRCodeModalRef = ref(null)
    const ServicePackageModalRef = ref(null)
    const drugStoreModalRef = ref(null)
    const configTemplateModalController = useFormModalController({
      formData: {
        templateDataId: '',
      },
      onOk: (values) => {
        return request({
          url: '/web/system/doctor/updateDoctorTemplateDataId',
          data: {
            doctorCode: configTemplateModalController.modalProps.record?.doctorCode,
            ...values,
          },
        }).then((data) => {
          ElMessage.success('操作成功')
          tableController.refresh()
        })
      },
    })

    // searchForm
    const searchController = useSearchFormCtrller({
      form: {
        doctorName: '',
        phoneNumber: '',
        orgName: '',
        hospitalName: '',
        departName: '',
        doctorTitleCode: '',
      },
    })

    // table
    const columns = [
      {
        label: '医生姓名',
        prop: 'doctorName',
        width: 130,
      },
      { label: '登录账号', prop: 'loginName', width: 150 },
      // { label: '医生集团', prop: 'orgName' },
      { label: '医疗机构', prop: 'hospitalName', width: 210 },
      { label: '科室', prop: 'departName' },
      { label: '职称', prop: 'doctorTitleName', width: 160 },
      { label: '手机号', prop: 'phoneNumber', width: 130 },
      { label: '首页模板', prop: 'templateDataName', width: 140 },
      { label: '创建时间', prop: 'createDateStr' },
      { label: '状态', prop: 'disabledName', width: 75 },
      {
        label: '操作',
        prop: 'actions',
        width: 180,
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
              <CustomLink
                onClick={() => {
                  // 跳转微信H5 在线问诊
                  // const text = `https://ly.bld365.com/h5/index.html#/h5/pages/index/index?doctorCode=${record.doctorCode}`
                  const text = `https://unigree.bld365.com/h5/index.html#/h5/pages/index/index?doctorCode=${record.doctorCode}`
                  QRCodeModalRef.value.open({
                    text,
                    isShowText: true,
                    saveName: `${record.doctorName}-二维码`,
                  })
                }}
              >
                二维码链接
              </CustomLink>
              {/* 
              <CustomLink
                onClick={() => {
                  // 跳转 良医优选（正式版）
                  // const text = `https://ly.bld365.com/jumpMallApp?doctorCode=${record.doctorCode}`
                  const text = `https://unigree.bld365.com/jumpMallApp?doctorCode=${record.doctorCode}`
                  QRCodeModalRef.value.open({
                    text,
                    saveName: `${record.doctorName}-商城二维码`,
                    isShowText: true,
                    setShowText: `pages/index/index?doctorCode=${record.doctorCode}`,
                  })
                }}
              >
                商城二维码
              </CustomLink>
              <CustomLink
                onClick={() => {
                  handleServicePackage(record)
                }}
              >
                服务包
              </CustomLink>
              <CustomLink
                onClick={() => {
                  configTemplateModalController.open((modalProps) => {
                    modalProps.record = record
                  })
                  configTemplateModalController.setFormData({ templateDataId: getNumber(record.templateDataId) })
                }}
              >
                首页模板
              </CustomLink>
              */}
              <CustomLink
                onClick={() => {
                  drugStoreModalRef.value?.modalController?.open((modalProps) => {
                    modalProps.record = record
                  })
                }}
              >
                配置药房
              </CustomLink>
              {record.signImg && (
                <CustomLink
                  onClick={() => {
                    window.open(record.signImg, '_blank')
                  }}
                >
                  签名
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
        const postData = {
          page,
          rows: pageSize,
          ...searchController.formModel,
        }
        return request({
          url: '/web/system/doctor/getDoctorList',
          data: postData,
        }).then((data) => ({ list: data.data ?? [], totalNum: data.rowTop ?? 0 }))
      },
      defaultPageSize: 50,
    })

    function clickAdd() {
      router.push('/web/system/doctor/doctormgr/detail')
    }

    function clickEdit(record) {
      router.push(`/web/system/doctor/doctormgr/detail?doctorCode=${record.doctorCode}`)
    }

    function handleToggleStatus(record) {
      const statusText = record.disabled == '0' ? '失效' : '生效'
      actionConfirm(`确认${statusText}？`, () => {
        return request({
          url: '/web/system/doctor/updateDoctorDisabled',
          data: {
            doctorCode: record.doctorCode,
            disabled: record.disabled == '0' ? '1' : '0',
          },
        }).then(() => {
          tableController.refresh()
          ElMessage.success('操作成功')
        })
      })
    }

    function handleServicePackage(record) {
      ServicePackageModalRef.value?.modalController.open((modalProps) => {
        modalProps.record = record
      })
    }

    return {
      QRCodeModalRef,
      ServicePackageModalRef,
      drugStoreModalRef,
      configTemplateModalController,

      searchController,
      tableController,
      //
      clickAdd,
    }
  },
  ...needKeepAliveMixin,
  components: { SearchForm, ProTable, FetchSelect, CustomLink, QRCodeModal, ServicePackageModal, drugStoreModal, FormModal },
}
</script>

<style lang="less">
@import url('./index_global.less');
</style>
<style lang="less" scoped></style>
