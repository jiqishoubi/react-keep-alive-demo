<template>
  <StyledModal :visible="visible" :title="`${isAdd ? '新建' : '编辑'}医疗机构`" @close="close" @submit="submit" :submitLoading="submitLoading" width="700px">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="150px">
      <el-form-item label="医疗机构名称" prop="hospitalName" :rules="[{ required: true, message: '请输入医疗机构名称' }]">
        <el-input v-model="formModel.form.hospitalName" placeholder="请输入医疗机构名称"></el-input>
      </el-form-item>
      <el-form-item label="医疗机构编码" prop="unifiedCode" :rules="[{ required: true, message: '请输入医疗机构编码' }]">
        <el-input v-model="formModel.form.unifiedCode" placeholder="请输入18位统一社会信用代码" maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="医疗机构简介" prop="hospitalDesc">
        <el-input v-model="formModel.form.hospitalDesc" placeholder="请输入" type="textarea" clearable></el-input>
      </el-form-item>
      <el-form-item label="医生机构类别" prop="hospitalType" :rules="[{ required: true, message: '请选择医生机构类别' }]">
        <FetchSelect
          v-model="formModel.form.hospitalType"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'HOSPITAL_TYPE' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
      <el-form-item label="医院等级评价（级）" prop="hospitalClass" :rules="[{ required: true, message: '请选择医院等级评价（级）' }]">
        <FetchSelect
          v-model="formModel.form.hospitalClass"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'HOSPITAL_CLASS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
      <el-form-item label="医院等级评价（等）" prop="hospitalDegree" :rules="[{ required: true, message: '请选择医院等级评价（等）' }]">
        <FetchSelect
          v-model="formModel.form.hospitalDegree"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'HOSPITAL_DEGREE' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
      <el-form-item label="成立日期" prop="hospitalOpenDate" :rules="[{ required: true, message: '请选择成立日期' }]">
        <el-date-picker
          v-model="formModel.form.hospitalOpenDate"
          placeholder="请选择"
          value-format="YYYY-MM-DD"
          style="height: 32px"
          :disabled-date="disabledDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="行政区划编码" prop="hospitalRegionCode" :rules="[{ required: true, message: '请输入行政区划编码' }]">
        <el-input v-model="formModel.form.hospitalRegionCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="医院登记地址" prop="hospitalAddress" :rules="[{ required: true, message: '请输入医院登记地址' }]">
        <el-input v-model="formModel.form.hospitalAddress" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="法定代表人" prop="legalPersonName" :rules="[{ required: true, message: '请输入法定代表人' }]">
        <el-input v-model="formModel.form.legalPersonName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="主要负责人" prop="leaderName" :rules="[{ required: true, message: '请输入主要负责人' }]">
        <el-input v-model="formModel.form.leaderName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="医院联系电话" prop="phoneNumber" :rules="[{ required: true, message: '请输入医院联系电话' }]">
        <el-input v-model="formModel.form.phoneNumber" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
  </StyledModal>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import { cloneDeep } from 'lodash'
import StyledModal from '@/components/modal/StyledModal'
import FetchSelect from '@/components/FetchSelect'
import { validateFormRef } from '@/common/utils_element'
import request from '@/utils/request'
import moment from 'moment'

const defaultForm = {
  hospitalName: '', // 名称
  unifiedCode: '', // 医疗机构编码 统一社会信用代码
  hospitalDesc: '', // 医疗机构简介
  hospitalType: '', // 医疗机构类别
  hospitalClass: '', // 评价（级）
  hospitalDegree: '', // 评价（等）
  hospitalOpenDate: '', // 成立日期
  hospitalRegionCode: '', // 行政区划编码
  hospitalAddress: '', // 医疗机构地址
  legalPersonName: '', // 法人姓名
  leaderName: '', // 负责人姓名
  phoneNumber: '', // 医院联系电话
}

export default {
  data() {
    return {
      disabledDate(date) {
        return moment(date).valueOf() >= moment().valueOf()
      },
    }
  },
  emits: ['successAdd', 'successEdit'],
  setup(_, ctx) {
    const visible = ref(false)
    const submitLoading = ref(false)

    const formRef = ref(null)
    const formModel = reactive({
      form: cloneDeep(defaultForm),
    })

    const record = reactive({ v: null })
    const isAdd = computed(() => (record.v ? false : true))

    function open(recordParam) {
      visible.value = true
      if (recordParam) {
        record.v = cloneDeep(recordParam)
        renderForm(cloneDeep(recordParam))
      }
    }

    function close() {
      visible.value = false
      record.v = null
      formModel.form = cloneDeep(defaultForm)
    }

    // form回显
    function renderForm(data) {
      formModel.form = {
        ...data,
      }
    }

    // 提交
    async function submit() {
      await validateFormRef(formRef)
      submitLoading.value = true
      request({
        url: isAdd.value ? '/web/system/hospital/createHospital' : '/web/system/hospital/updateHospital',
        data: {
          ...formModel.form,
          ...(isAdd.value ? {} : { hospitalCode: record.v.hospitalCode }),
        },
      })
        .finally(() => {
          submitLoading.value = false
        })
        .then(() => {
          ctx.emit(isAdd.value ? 'successAdd' : 'successEdit')
          close()
        })
    }

    return {
      visible,
      isAdd,
      submitLoading,
      open,
      close,
      submit,
      //
      formRef,
      formModel,
    }
  },
  components: { StyledModal, FetchSelect },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
