<template>
  <StyledModal :visible="visible" title="服务包" @close="close" @submit="submit" :submitLoading="submitLoading" width="800px">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="100px">
      <el-form-item label="标题" prop="productTitle" :rules="[{ required: true, message: '请输入标题' }]">
        <el-input v-model="formModel.form.productTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="productIcon" :rules="[{ required: true, message: '请添加图标' }]">
        <ImgUpload v-model="formModel.form.productIcon" :limit="1" />
      </el-form-item>
      <el-form-item label="描述" prop="productDesc" :rules="[{ required: true, message: '请输入描述' }]">
        <el-input v-model="formModel.form.productDesc" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item
        label="价格"
        prop="productFee"
        :rules="[
          { required: true, message: '请输入价格' },
          { pattern: patternCreator.money.pattern, message: '请输入正确格式的金额' },
        ]"
      >
        <el-input v-model="formModel.form.productFee" placeholder="请输入价格">
          <template #suffix>元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="有效时间" prop="productValidDays" :rules="[{ required: true, message: '请输入有效时间' }]">
        <el-input v-model="formModel.form.productValidDays" placeholder="请输入有效时间">
          <template #suffix>天</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="服务费"
        prop="serviceFeePct"
        :rules="[
          { required: true, message: '请输入服务费百分比' },
          { pattern: patternCreator.zeroToHundredDecimal.pattern, message: '请输入0-100的数字，最多2位小数' },
        ]"
      >
        <el-input v-model="formModel.form.serviceFeePct" placeholder="请输入服务费百分比">
          <template #suffix>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="顺序" prop="productSeq" :rules="[{ pattern: patternCreator.number.pattern, message: '请输入数字' }]">
        <el-input v-model="formModel.form.productSeq" placeholder="请输入顺序"></el-input>
      </el-form-item>

      <el-form-item label="详情">
        <htmlEditor ref="htmlEditorRef" />
      </el-form-item>
    </el-form>
  </StyledModal>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash'
import StyledModal from '@/components/modal/StyledModal'
import FetchSelect from '@/components/FetchSelect'
import ImgUpload from '@/components/ImgUpload'
import DetailEditor from '@/components/DetailEditor'
import htmlEditor, { setEditorContent } from '@/components/htmlEditor'
import request from '@/utils/request'
import { validateFormRef } from '@/common/utils_element'
import patternCreator from '@/utils/patternCreator'

const defaultForm = {
  productTitle: '',
  productIcon: '',
  productDesc: '',
  productFee: '',
  productValidDays: '',
  serviceFeePct: '',
  productSeq: '',
}

export default {
  data() {
    return { patternCreator }
  },
  emits: ['successAdd', 'successEdit'],
  setup(_, ctx) {
    const htmlEditorRef = ref(null)
    const visible = ref(false)
    const submitLoading = ref(false)
    const doctorInfo = ref(null)

    const formRef = ref(null)
    const formModel = reactive({
      form: cloneDeep(defaultForm),
    })

    const record = reactive({ v: null })
    const isAdd = computed(() => (record.v ? false : true))

    /**
     * @param {object} params
     * @param {any} params.doctorRecord
     * @param {any} params.record
     */
    function open(params) {
      const { doctorRecord, record: recordParam } = params
      doctorInfo.value = doctorRecord
      if (recordParam) {
        record.v = cloneDeep(recordParam)
        renderForm(cloneDeep(recordParam))
      }

      visible.value = true
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
        productFee: data.productFeeStr ?? 0,
      }
      setEditorContent(htmlEditorRef, data.productDetail)
    }

    // 提交
    async function submit() {
      // 验证
      await validateFormRef(formRef)
      // 验证 end

      const postData = {
        doctorCode: doctorInfo.value?.doctorCode,
        ...(isAdd.value ? {} : { productCode: record.v.productCode }),
        ...formModel.form,
        productDetail: htmlEditorRef.value?.getContent() ?? '',
      }
      submitLoading.value = true
      request({
        url: isAdd.value ? '/web/system/serviceproduct/createServiceProduct' : '/web/system/serviceproduct/updateServiceProduct',
        data: postData,
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
      htmlEditorRef,
      isAdd,
      visible,
      submitLoading,
      open,
      close,
      submit,
      //
      formRef,
      formModel,
    }
  },
  components: { StyledModal, FetchSelect, ImgUpload, DetailEditor, htmlEditor },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
