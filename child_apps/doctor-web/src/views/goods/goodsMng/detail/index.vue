<template>
  <DetailContainer>
    <div class="page_container">
      <el-form ref="formRef" :model="formModel.form" label-width="140px">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div>
              <el-form-item label="医生集团" prop="orgCode">
                <FetchSelect v-model="formModel.form.orgCode" api="/web/system/goods/getCompanyList" textKey="orgName" valueKey="orgCode" @change="handleOrgChange" />
              </el-form-item>
              <el-form-item label="医生" prop="doctorCode" :rules="[{ required: true, message: '请选择医生' }]">
                <FetchSelect
                  v-model="formModel.form.doctorCode"
                  api="/web/system/doctor/getDoctorList"
                  :postData="{
                    page: 1,
                    rows: 999,
                    orgCode: formModel.form.orgCode,
                  }"
                  textKey="doctorName"
                  valueKey="doctorCode"
                  :isPaging="true"
                />
              </el-form-item>
              <el-form-item label="商品名称" prop="goodsName" :rules="[{ required: true, message: '请输入商品名称' }]">
                <el-input v-model="formModel.form.goodsName" placeholder="请输入商品名称"></el-input>
              </el-form-item>
              <el-form-item label="商品类型" prop="goodsType" :rules="[{ required: true, message: '请选择商品类型' }]">
                <FetchSelect
                  v-model="formModel.form.goodsType"
                  api="/web/sys/code/getSysCodeByParam"
                  :postData="{ codeParam: 'GOODS_TYPE' }"
                  textKey="codeValue"
                  valueKey="codeKey"
                  :disabled="isEdit"
                />
              </el-form-item>
              <el-form-item label="商品说明" prop="goodsDesc" :rules="[{ required: true, message: '请选择商品说明' }]">
                <el-input v-model="formModel.form.goodsDesc" placeholder="请输入商品说明" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="商品详情" prop="goodsDetail" :rules="[{ required: true, message: '请添加商品详情' }]">
                <DetailEditor v-model="formModel.form.goodsDetail" />
              </el-form-item>
              <el-form-item label="商品图片" prop="goodsImg" :rules="[{ required: true, message: '请添加商品图片' }]">
                <ImgUpload v-model="formModel.form.goodsImg" :limit="10" />
              </el-form-item>
              <el-form-item label="商品规格" prop="goodsSize" :rules="[{ required: true, message: '请输入商品规格' }]">
                <el-input v-model="formModel.form.goodsSize" placeholder="请输入商品规格"></el-input>
              </el-form-item>
              <el-form-item label="药厂" prop="goodsFactory">
                <el-input v-model="formModel.form.goodsFactory" placeholder="请输入药厂"></el-input>
              </el-form-item>
              <el-form-item label="渠道商品ID" prop="chnlGoodsId" :rules="[{ required: true, message: '请输入渠道商品ID' }]">
                <el-input v-model="formModel.form.chnlGoodsId" placeholder="请输入渠道商品ID"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goodsFee" :rules="[{ required: true, message: '请输入价格' }]">
                <el-input v-model="formModel.form.goodsFee" placeholder="请输入商品价格" clearable>
                  <template #suffix>元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="是否首页展示" prop="ifIndexShow">
                <el-radio-group v-model="formModel.form.ifIndexShow">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="商品序列" prop="goodsSeq">
                <el-input v-model="formModel.form.goodsSeq" placeholder="请输入商品序列" clearable></el-input>
              </el-form-item>

              <!-- 操作 -->
              <div style="margin-top: 50px">
                <el-form-item>
                  <SubmitButton @click="handleSubmit" :loading="submitLoading">提交</SubmitButton>
                  <el-button @click="$router.back">取消</el-button>
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div v-show="isChufang">
              <el-form-item label="药物标准编码" prop="drugCode" :rules="[{ required: isChufang, message: '请输入药物标准编码' }]">
                <el-input v-model="formModel.form.drugCode" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="药品包装单位" prop="packageUnit" :rules="[{ required: isChufang, message: '请输入药品包装单位' }]">
                <el-input v-model="formModel.form.packageUnit" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="药品频次" prop="frequency" :rules="[{ required: isChufang, message: '请选择药品频次' }]">
                <FetchSelect
                  v-model="formModel.form.frequency"
                  api="/web/sys/code/getSysCodeByParam"
                  :postData="{ codeParam: 'MEDICATE_FREQUENCY' }"
                  textKey="codeValue"
                  valueKey="codeKey"
                />
              </el-form-item>
              <el-form-item
                label="药品剂量"
                prop="onceDosage"
                :rules="[
                  { required: isChufang, message: '请输入药品剂量' },
                  { pattern: patternCreator.zeroPositiveDecimal.pattern, message: '大于0，支持2位小数' },
                ]"
              >
                <el-input v-model="formModel.form.onceDosage" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="药品剂量单位" prop="dosageUnit" :rules="[{ required: isChufang, message: '请选择药品剂量单位' }]">
                <FetchSelect
                  v-model="formModel.form.dosageUnit"
                  api="/web/sys/code/getSysCodeByParam"
                  :postData="{ codeParam: 'MEDICATE_DOSAGE_UNIT' }"
                  textKey="codeValue"
                  valueKey="codeKey"
                />
              </el-form-item>
              <el-form-item label="药品使用途径" prop="useway" :rules="[{ required: isChufang, message: '请选择药品使用途径' }]">
                <FetchSelect
                  v-model="formModel.form.useway"
                  api="/web/sys/code/getSysCodeByParam"
                  :postData="{ codeParam: 'MEDICATE_USEWAY' }"
                  textKey="codeValue"
                  valueKey="codeKey"
                />
              </el-form-item>
              <el-form-item
                label="药品用药天数"
                prop="durationDays"
                :rules="[
                  { required: isChufang, message: '请输入药品用药天数' },
                  { pattern: patternCreator.zeroPositive.pattern, message: '大于0，整数' },
                ]"
              >
                <el-input v-model="formModel.form.durationDays" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </DetailContainer>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import DetailContainer from '@/components/layout/DetailContainer'
import IconVertical from '@/components/customStyle/IconVertical'
import ImgUpload from '@/components/ImgUpload'
import ImgUploadForCropper from '@/components/ImgUploadForCropper'
import FetchSelect from '@/components/FetchSelect'
import SubmitButton from '@/components/customStyle/SubmitButton'
import DetailEditor from '@/components/DetailEditor'
import useGoBackParams from '@/hooks/router/useGoBackParams'
import useRequestData from '@/hooks/useRequestData'
import { validateFormRef } from '@/common/utils_element'
import request from '@/utils/request'
import patternCreator from '@/utils/patternCreator'
import { cloneDeep } from '@/utils/utils'

const defaultForm = {
  orgCode: '',
  doctorCode: '',
  goodsName: '',
  goodsType: '',
  goodsDesc: '',
  goodsDetail: '',
  goodsImg: '',
  goodsSize: '',
  goodsFactory: '',
  chnlGoodsId: '',
  goodsFee: '',
  ifIndexShow: 0,
  goodsSeq: '', // 商品序列
  // 处方 当goodsType='MEDICINE'
  drugCode: '', //  国家药品标准编码(当goodsType='MEDICINE'时,非空)
  packageUnit: '', // 药品包装单位(当goodsType='MEDICINE'时,非空)
  frequency: '', //   用药频次(当goodsType='MEDICINE'时,非空)(下拉框,codeParam=MEDICATE_FREQUENCY)
  onceDosage: '', // 单次剂量(当goodsType='MEDICINE'时,非空)(大于0, 保留小数点后2位)
  dosageUnit: '', //  剂量单位(当goodsType='MEDICINE'时,非空)(下拉框,codeParam=MEDICATE_DOSAGE_UNIT)
  useway: '', //   使用途径(当goodsType='MEDICINE'时,非空)(下拉框,codeParam=MEDICATE_USEWAY)
  durationDays: '', //   用药天数(当goodsType='MEDICINE'时,非空)(大于0, 整数)
}

/**
 * 页面参数：
 * goodsCode
 *
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
    const goBackParams = useGoBackParams('/web/system/goods/goodsmgr') // 返回一个方法
    const goodsCode = route.query.goodsCode
    const isEdit = route.query.goodsCode ? true : false // 判断是否编辑

    const formRef = ref(null)
    const formModel = reactive({ form: { ...defaultForm } })
    const isChufang = computed(() => formModel.form.goodsType === 'MEDICINE') // 处方
    const submitLoading = ref(false)

    // 医生信息
    useRequestData({
      api: '/web/system/goods/getGoodsInfo',
      getPostData: () => ({ goodsCode }),
      getIsReady: () => goodsCode,
      successAjax: renderForm,
    })

    /**
     * 方法
     */

    function renderForm(data) {
      formModel.form = {
        ...defaultForm,
        ...data,
        goodsFee: data.goodsFeeStr,
      }
    }

    // 修改医生集团的时候  清空 医生
    function handleOrgChange() {
      formModel.form.doctorCode = ''
    }

    // 提交
    async function handleSubmit() {
      // 验证
      await validateFormRef(formRef)

      // 请求
      delete formModel.form.orgCode
      let postData = {
        ...formModel.form,
        ...(isEdit ? { goodsCode } : {}),
      }
      for (let key in postData) {
        if (typeof postData[key] == 'string') {
          postData[key] = postData[key].trim()
        }
      }

      // 请求
      submitLoading.value = true
      request({
        url: isEdit ? '/web/system/goods/updateGoods' : '/web/system/goods/createGoods',
        data: postData,
      })
        .finally(() => {
          submitLoading.value = false
        })
        .then(() => {
          ElMessage.success('操作成功')
          setTimeout(() => {
            formModel.form = cloneDeep(defaultForm)
            if (!isEdit) goBackParams({ isAddSuccess: true })
            if (isEdit) goBackParams({ isEditSuccess: true })
          }, 0)
        })
    }

    return {
      isEdit,
      formRef,
      formModel,
      isChufang,
      handleOrgChange,
      handleSubmit,
      submitLoading,
    }
  },
  components: { DetailContainer, IconVertical, ImgUpload, ImgUploadForCropper, SubmitButton, FetchSelect, DetailEditor },
}
</script>

<style lang="less" scoped>
.page_container {
  padding: 20px 90px 20px 20px;
}
</style>
