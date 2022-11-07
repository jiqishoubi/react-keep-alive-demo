<template>
  <DetailContainer>
    <div class="page_container doctorMng_detail_page">
      <el-form ref="formRef" :model="formModel.form" label-width="110px" label-position="right">
        <div class="content_title">
          <IconVertical style="margin-right: 10px" />
          医生信息
        </div>
        <div class="form">
          <el-row :gutter="10">
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="医生姓名" prop="doctorName" :rules="[{ required: true, message: '请输入医生姓名' }]">
                <el-input v-model="formModel.form.doctorName" placeholder="请输入医生姓名" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="医疗机构" prop="hospitalCode" :rules="[{ required: true, message: '请选择医疗机构' }]">
                <FetchSelect v-model="formModel.form.hospitalCode" api="/web/system/doctor/getHospitalList" valueKey="hospitalCode" textKey="hospitalName" />
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="所在科室" prop="departCode" :rules="[{ required: true, message: '请选择所在科室' }]">
                <FetchSelect v-model="formModel.form.departCode" api="/web/system/doctor/getDepartList" valueKey="departCode" textKey="departName" />
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="职称" prop="doctorTitleCode" :rules="[{ required: true, message: '请选择职称' }]">
                <FetchSelect
                  v-model="formModel.form.doctorTitleCode"
                  api="/web/sys/code/getSysCodeByParam"
                  :postData="{ codeParam: 'DOCTOR_TITLE' }"
                  textKey="codeValue"
                  valueKey="codeKey"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="手机号码" prop="phoneNumber" :rules="[{ required: true, message: '请输入手机号码' }]">
                <el-input v-model="formModel.form.phoneNumber" placeholder="请输入手机号码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="证件号码" prop="doctorPsptNo" :rules="[{ required: true, message: '请输入证件号码' }]">
                <el-input v-model="formModel.form.doctorPsptNo" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="性别" prop="doctorSex" :rules="[{ required: true, message: '请选择性别' }]">
                <FetchSelect v-model="formModel.form.doctorSex" api="/web/sys/code/getSysCodeByParam" :postData="{ codeParam: 'SEX' }" textKey="codeValue" valueKey="codeKey" />
              </el-form-item>
            </el-col>

            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"></el-col>

            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="登录账号" prop="loginName" :rules="[{ required: true, message: '请输入医生登录账号' }]">
                <el-input v-model="formModel.form.loginName" placeholder="请输入医生登录账号" clearable></el-input>
              </el-form-item>
            </el-col>

            <!-- <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="医生集团" prop="orgCode" :rules="[{ required: true, message: '请选择在职医生集团' }]">
                <FetchSelect v-model="formModel.form.orgCode" api="/web/system/doctor/getCompanyList" valueKey="orgCode" textKey="orgName" />
              </el-form-item>
            </el-col> -->

            <!-- <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="医生推广人" prop="developerCode" :rules="[{ required: true, message: '请选择医生推广人' }]">
                <FetchSelect
                  v-model="formModel.form.developerCode"
                  api="/web/system/doctor/getDeveloperList"
                  valueKey="distributeCode"
                  textKey="distributeName"
                  :disabled="isEdit"
                />
              </el-form-item>
            </el-col> -->

            <!-- <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="关联商城" prop="doctorMallCode" :rules="[{ required: true, message: '请选择关联商城' }]">
                <FetchSelect v-model="formModel.form.doctorMallCode" api="/web/system/doctor/getDoctorMallList" valueKey="orgCode" textKey="orgName" :disabled="isEdit" />
              </el-form-item>
            </el-col> -->

            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <div class="img_form_wrap">
                <div class="el-form--label-top">
                  <el-row :gutter="10">
                    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="label_top_item">
                      <el-form-item label="医生照片" prop="doctorHeadImg" :rules="[{ required: true, message: '请添加医生照片' }]">
                        <ImgUploadForCropper v-model="formModel.form.doctorHeadImg" :limit="1" />
                      </el-form-item>
                    </el-col>

                    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="label_top_item">
                      <el-form-item label="公众号二维码" prop="doctorWechatImg">
                        <ImgUpload v-model="formModel.form.doctorWechatImg" :limit="1" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>

            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="个人简介" prop="doctorDesc">
                <el-input v-model="formModel.form.doctorDesc" placeholder="请输入" type="textarea" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="擅长" prop="doctorExpert">
                <el-input v-model="formModel.form.doctorExpert" placeholder="请输入" type="textarea" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="荣誉奖项" prop="doctorHonors">
                <el-input v-model="formModel.form.doctorHonors" placeholder="请输入" type="textarea" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="content_title">
          <IconVertical style="margin-right: 10px" />
          医生信息
        </div>
        <div class="form">
          <el-row :gutter="10">
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="执业证书编号" prop="practisingCertCode" :rules="[{ required: true, message: '请输入执业证书编号' }]">
                <el-input v-model="formModel.form.practisingCertCode" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="执业类别" prop="practisingTypeCode" :rules="[{ required: true, message: '请选择执业类别' }]">
                <FetchSelect
                  v-model="formModel.form.practisingTypeCode"
                  api="/web/sys/code/getSysCodeByParam"
                  :postData="{ codeParam: 'DOCTOR_PRACTISING_TYPE' }"
                  textKey="codeValue"
                  valueKey="codeKey"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="执业范围" prop="practisingScopeCode" :rules="[{ required: true, message: '请选择执业范围' }]">
                <FetchSelect
                  v-model="formModel.form.practisingScopeCode"
                  api="/web/sys/code/getSysCodeByParam"
                  :postData="{ codeParam: 'DOCTOR_PRACTISING_SCOPE' }"
                  textKey="codeValue"
                  valueKey="codeKey"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="执业机构编号" prop="practisingOrgCode" :rules="[{ required: true, message: '请输入执业机构编号' }]">
                <el-input v-model="formModel.form.practisingOrgCode" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 问诊信息 -->
        <template v-for="(domain, index) in formModel.form.doctorOrderTypeList" :key="index">
          <div class="content_title">
            <IconVertical style="margin-right: 10px" />
            {{ domain.orderTypeName }}
          </div>
          <div class="form">
            <el-row :gutter="10">
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item :label="'是否开通'" :prop="'doctorOrderTypeList.' + index + '.disabled'" :rules="[{ required: true }]">
                  <el-radio-group v-model="domain.disabled">
                    <el-radio :label="0">是</el-radio>
                    <el-radio :label="1">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item
                  label="标题"
                  :prop="'doctorOrderTypeList.' + index + '.title'"
                  :rules="[{ required: true, message: '请输入标题' }, ...(domain.orderType == 'IM_REVIEW' ? [{ max: 4, message: '最多4个字' }] : [])]"
                >
                  <el-input v-model="domain.title" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item label="首诊金额" :prop="'doctorOrderTypeList.' + index + '.doctorFeeStr'" :rules="[{ required: true, message: '请输入首诊金额' }]">
                  <el-input v-model="domain.doctorFeeStr" placeholder="请输入" clearable>
                    <template #suffix>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item
                  label="平台服务费"
                  :prop="'doctorOrderTypeList.' + index + '.serviceFeePct'"
                  :rules="[
                    { required: true, message: '请输入平台服务费' },
                    { pattern: patternCreator.zeroToHundredDecimal.pattern, message: '请输入0-100的数字，最多2位小数' },
                  ]"
                >
                  <el-input v-model="domain.serviceFeePct" placeholder="请输入" clearable>
                    <template #suffix>%</template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item label="是否开通复诊" :prop="'doctorOrderTypeList.' + index + '.ifReview'" :rules="[{ required: true }]">
                  <el-radio-group v-model="domain.ifReview">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item label="复诊价格" :prop="'doctorOrderTypeList.' + index + '.reviewFeeStr'" :rules="[{ required: true, message: '请输入复诊价格' }]">
                  <el-input v-model="domain.reviewFeeStr" placeholder="请输入" clearable>
                    <template #suffix>元</template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item
                  label="复诊有效时间"
                  :prop="'doctorOrderTypeList.' + index + '.reviewValidDays'"
                  :rules="[
                    { required: true, message: '请输入天数' },
                    { pattern: patternCreator.zeroPositive.pattern, message: '请输入正确的天数' },
                  ]"
                >
                  <el-input v-model="domain.reviewValidDays" placeholder="请输入天数" clearable>
                    <template #suffix>天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="介绍文字" :prop="'doctorOrderTypeList.' + index + '.content'" :rules="[{ required: true, message: '请输入介绍文字' }]">
                  <el-input v-model="domain.content" placeholder="请输入" type="textarea" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>

        <!-- 开通服务包 -->
        <div class="content_title">
          <IconVertical style="margin-right: 10px" />
          快捷购药
        </div>
        <div class="form">
          <el-row :gutter="10">
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <el-form-item label="是否开通" prop="doctorServiceProduct.ifDoctorServiceProduct" :rules="[{ required: true }]">
                <el-radio-group v-model="formModel.form.doctorServiceProduct.ifDoctorServiceProduct">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-row v-if="false" :gutter="10" v-show="formModel.form.doctorServiceProduct.ifDoctorServiceProduct == 1">
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="标题"
                  prop="doctorServiceProduct.defaultTitle"
                  :rules="[{ required: formModel.form.doctorServiceProduct.ifDoctorServiceProduct == 1, message: '请输入标题' }]"
                >
                  <el-input v-model="formModel.form.doctorServiceProduct.defaultTitle" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="关联服务包"
                  prop="doctorServiceProduct.productCode"
                  :rules="[{ required: formModel.form.doctorServiceProduct.ifDoctorServiceProduct == 1, message: '请选择关联服务包' }]"
                >
                  <FetchSelect
                    v-model="formModel.form.doctorServiceProduct.productCode"
                    api="/web/system/serviceproduct/getServiceProductList"
                    valueKey="productCode"
                    textKey="productTitle"
                    :postData="{
                      page: 1,
                      rows: 900,
                      doctorCode: doctorCode,
                      disabled: 0,
                    }"
                    :isPaging="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
        </div>

        <!-- 排班信息 -->
        <div class="content_title">
          <IconVertical style="margin-right: 10px" />
          排班信息
        </div>
        <div class="form3">
          <div class="form3_row">
            <el-form-item label="开始时间" label-width="100px" prop="doctorDutyStartTime" :rules="[{ required: !isEdit, message: '请选择开始时间' }]">
              <el-time-picker
                v-model="formModel.form.doctorDutyStartTime"
                :default-value="new Date('2021-10-10 08:00')"
                format="HH:mm"
                value-format="HH:mm"
                :editable="false"
                placeholder="请选择开始时间"
              ></el-time-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="100px" prop="doctorDutyEndTime" :rules="[{ required: !isEdit, message: '请选择结束时间' }]">
              <el-time-picker
                v-model="formModel.form.doctorDutyEndTime"
                :default-value="new Date('2021-10-10 20:00')"
                format="HH:mm"
                value-format="HH:mm"
                :editable="false"
                placeholder="请选择结束时间"
                :disabled-hours="filterEndDisabledHours"
              ></el-time-picker>
            </el-form-item>
            <el-form-item
              label="服务时长/次"
              label-width="120px"
              prop="doctorDutyUnitMinutes"
              :rules="[
                { required: !isEdit, message: '请输入服务时长' },
                { pattern: patternCreator.positiveInteger.pattern, message: '请输入正确的分钟数' },
              ]"
            >
              <el-input v-model="formModel.form.doctorDutyUnitMinutes" placeholder="请输入服务时长" clearable>
                <template #suffix><span>分钟</span></template>
              </el-input>
            </el-form-item>
            <el-button v-if="isEdit" type="primary" style="margin-left: 15px" @click="handleInitDutyTemplate" :loading="submitLoading_duty">确认排班</el-button>
          </div>
          <el-container
            v-if="doctorDutyTemplateListController.info.value?.doctorDutyList?.length > 0"
            class="form3_table"
            v-loading="doctorDutyTemplateListController.loading.value"
          >
            <div v-for="item in doctorDutyTemplateListController.info.value.doctorDutyList" :key="item.dutyCode" class="form3_table_item">
              {{ item.dutyTime }}
            </div>
          </el-container>
        </div>

        <!-- 操作 -->
        <div class="form" style="margin-left: 170px">
          <el-form-item>
            <SubmitButton @click="handleSubmit" :loading="submitLoading">提交</SubmitButton>
            <el-button @click="$router.back">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </DetailContainer>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import DetailContainer from '@/components/layout/DetailContainer'
import IconVertical from '@/components/customStyle/IconVertical'
import ImgUpload from '@/components/ImgUpload'
import ImgUploadForCropper from '@/components/ImgUploadForCropper'
import FetchSelect from '@/components/FetchSelect'
import SubmitButton from '@/components/customStyle/SubmitButton'
import useGoBackParams from '@/hooks/router/useGoBackParams'
import useRequestData from '@/hooks/useRequestData'
import { validateFormRef } from '@/common/utils_element'
import request from '@/utils/request'
import { simpleConfirm } from '@/utils/confirm'
import patternCreator from '@/utils/patternCreator'
import { cloneDeep } from 'lodash'

/**
 * 回退的时候 可以设置：
 * $route.params:
 * isAddSuccess
 * isEditSuccess
 */
export default {
  data() {
    return { patternCreator }
  },
  setup() {
    const route = useRoute()
    const goBackParams = useGoBackParams('/web/system/doctor/doctormgr') // 返回一个方法
    const doctorCode = route.query.doctorCode
    const isEdit = route.query.doctorCode ? true : false // 判断是否编辑

    const defaultForm = {
      /**
       * 医生信息
       */
      // 医生信息-左侧
      doctorName: '', //          医生姓名(非空)
      loginName: '', //              医生登录账号
      phoneNumber: '', //       医生联系电话(非空)
      orgCode: 'ORG202208050001', //    医生集团编码(非空)
      departCode: '', //           医疗科室编码(非空)
      doctorTitleCode: '', //     职称编码(非空)(下拉框,codeParam=DOCTOR_TITLE)
      developerCode: 'DIS2022080400001', // 合伙人编码
      doctorMallCode: 'ORG202208040004', // 关联商城 // 我理解这个就是 供货商吧！
      doctorHeadImg: '', //    医生头像
      doctorWechatImg: '', // 公众号二维码
      doctorDesc: '', //        医生介绍
      doctorExpert: '', //       医生擅长
      doctorHonors: '', //       医生荣誉
      // 医生信息-右侧
      hospitalCode: '', //   医疗机构编码(非空)
      doctorPsptNo: '', //     医生身份证号(非空)
      doctorSex: '', //     医生性别(非空)(下拉框,codeParam=SEX)
      practisingCertCode: '', //    医生执业证书编号(非空)
      practisingTypeCode: '', //    医师执业类别编码(非空)(下拉框,codeParam=DOCTOR_PRACTISING_TYPE)
      practisingScopeCode: '', //   医师执业范围编码(非空)(下拉框,codeParam=DOCTOR_PRACTISING_SCOPE)
      practisingOrgCode: '', //    执业机构编码(非空)
      /**
       * 问诊信息 doctorOrderTypeListStr
       */
      doctorOrderTypeList: [
        {
          orderType: 'IM_CONSULT',
          orderTypeName: '图文接诊',
          title: '',
          content: '',
          doctorFeeStr: '',
          serviceFeePct: '',
          disabled: 0, // 状态(0-生效;1-失效)
          // 复诊
          ifReview: 0,
          reviewFeeStr: '0',
          reviewValidDays: '0',
        },
        {
          orderType: 'CONSULT_SERVICE',
          orderTypeName: '咨询服务',
          title: '',
          content: '',
          doctorFeeStr: '',
          serviceFeePct: '',
          disabled: 0, // 状态(0-生效; 1-失效)
          // 复诊
          ifReview: 0,
          reviewFeeStr: '0',
          reviewValidDays: '0',
        },
        // {
        //   orderType: 'IM_REVIEW',
        //   orderTypeName: '用药指导',
        //   title: '',
        //   content: '',
        //   doctorFeeStr: '',
        //   serviceFeePct: '',
        //   disabled: 0, // 状态(0-生效; 1-失效)
        //   // 复诊
        //   ifReview: 0,
        //   reviewFeeStr: '0',
        //   reviewValidDays: '0',
        // },
      ],
      // 开通服务包 doctorServiceProductStr
      doctorServiceProduct: {
        ifDoctorServiceProduct: 0, // 是否开通服务包 1-是 0-否
        defaultTitle: '', // 显示的标题
        productCode: '', // 关联的服务包
      },
      /**
       * 排班信息
       */
      doctorDutyStartTime: isEdit ? '' : '08:00',
      doctorDutyEndTime: isEdit ? '' : '20:00',
      doctorDutyUnitMinutes: isEdit ? '' : '15',
    }

    const formRef = ref(null)
    const formModel = reactive({ form: cloneDeep(defaultForm) })
    const submitLoading = ref(false)
    const submitLoading_duty = ref(false)

    // 医生信息
    useRequestData({
      api: '/web/system/doctor/getDoctorInfo',
      getPostData: () => ({ doctorCode }),
      getIsReady: () => doctorCode,
      successAjax: renderForm,
    })

    // 排班信息
    const doctorDutyTemplateListController = useRequestData({
      api: '/web/system/doctorduty/getDoctorDutyTemplateList',
      getPostData: () => ({ doctorCode }),
      getIsReady: () => doctorCode,
      successAjax: (data) => {
        formModel.form.doctorDutyStartTime = data?.startTime ?? ''
        formModel.form.doctorDutyEndTime = data?.endTime ?? ''
        formModel.form.doctorDutyUnitMinutes = data?.unitMinutes ?? ''
      },
    })

    /**
     * 方法
     */

    function renderForm(data) {
      // 处理数据
      // 旧的数据 doctorOrderTypeList 可能不全，要以defaultForm为基础
      const doctorOrderTypeList = defaultForm.doctorOrderTypeList.map((defaultItem, index) => {
        return data?.doctorOrderTypeList?.[index] ?? defaultItem
      })
      // 服务包的关联
      const doctorServiceProduct = {
        ...defaultForm.doctorServiceProduct,
        ...data.doctorServiceProduct,
        ifDoctorServiceProduct: data.doctorServiceProduct?.disabled == 0 ? 1 : 0, // 返回数据没有ifDoctorServiceProduct这个字段，根据disabled判断一下
      }
      // 处理数据 end
      formModel.form = { ...defaultForm, ...data, doctorServiceProduct, doctorOrderTypeList }
    }

    function filterEndDisabledHours() {
      const startTime = formModel.form.doctorDutyStartTime
      if (!startTime) return []
      const startHour = Number(startTime.substring(0, 2))
      const arr = new Array(24)
        .fill(1)
        .map((_, index) => index)
        .filter((num) => num < startHour)
      return arr // 这里要返回number
    }

    // 提交
    async function handleSubmit() {
      // 验证
      await validateFormRef(formRef)

      // 处理postData
      const { doctorOrderTypeList, doctorServiceProduct, ...restForm } = formModel.form
      const doctorOrderTypeListStr = JSON.stringify(
        doctorOrderTypeList.map((item) => {
          const itemObj = {
            ...item,
            doctorFee: Math.round(item.doctorFeeStr * 100), // 处理金钱
            reviewFee: Math.round(item.reviewFeeStr * 100),
          }
          return itemObj
        })
      )
      const doctorServiceProductStr = JSON.stringify(doctorServiceProduct)

      // // 公众号图片 如果是 编辑 && 空 ，就传'NULL'
      // if (isEdit) {
      //   ;['doctorWechatImg'].forEach((key) => {
      //     const v = restForm[key]
      //     if (v === '' || v === undefined || v === null) restForm[key] = `NULL`
      //   })
      // }

      const postData = {
        ...(isEdit ? { doctorCode } : {}),
        ...restForm,
        doctorOrderTypeListStr,
        doctorServiceProductStr,
      }
      console.log('postData', postData)

      // 请求
      submitLoading.value = true
      request({
        url: !isEdit ? '/web/system/doctor/createDoctor' : '/web/system/doctor/updateDoctor',
        data: postData,
      })
        .finally(() => {
          submitLoading.value = false
        })
        .then(() => {
          ElMessage.success('操作成功')
          if (!isEdit) goBackParams({ isAddSuccess: true })
          if (isEdit) goBackParams({ isEditSuccess: true })
        })
    }

    async function handleInitDutyTemplate() {
      // 验证
      if (!formModel.form.doctorDutyStartTime || !formModel.form.doctorDutyEndTime || !formModel.form.doctorDutyUnitMinutes) {
        ElMessage.warning('排班信息：开始时间、结束时间、服务时长 请输入完整')
        return
      }
      // 验证 end
      await simpleConfirm('确认设置排班模板？')
      // 请求
      submitLoading_duty.value = true
      request({
        url: '/web/system/doctorduty/initDoctorDutyTemplate',
        data: {
          doctorCode,
          doctorDutyStartTime: formModel.form.doctorDutyStartTime,
          doctorDutyEndTime: formModel.form.doctorDutyEndTime,
          doctorDutyUnitMinutes: formModel.form.doctorDutyUnitMinutes,
        },
      })
        .finally(() => {
          submitLoading_duty.value = false
        })
        .then(() => {
          ElMessage.success('设置排班模板成功')
          doctorDutyTemplateListController.getInfo()
        })
    }

    return {
      doctorCode,
      isEdit,
      formRef,
      formModel,
      filterEndDisabledHours,
      handleSubmit,
      handleInitDutyTemplate,
      submitLoading,
      submitLoading_duty,
      doctorDutyTemplateListController,
    }
  },
  components: { DetailContainer, IconVertical, ImgUpload, ImgUploadForCropper, SubmitButton, FetchSelect },
}
</script>

<style lang="less">
@import url('./index_global.less');
</style>
<style lang="less" scoped>
@import url('./index.less');
</style>
