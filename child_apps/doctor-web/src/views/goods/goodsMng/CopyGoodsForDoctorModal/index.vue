<template>
  <StyledModal :visible="visible" :title="'商品复制'" @close="close" @submit="submit" :submitLoading="submitLoading">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="120px">
      <el-form-item label="选择医生" prop="targetDoctorCode" :rules="[{ required: true, message: '请选择医生' }]">
        <FetchSelect
          v-model="formModel.form.targetDoctorCode"
          api="/web/system/doctor/getDoctorList"
          valueKey="doctorCode"
          textKey="doctorName"
          :postData="{
            page: 1,
            rows: 900,
          }"
          :isPaging="true"
        />
      </el-form-item>
    </el-form>
  </StyledModal>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import { cloneDeep } from 'lodash'
import StyledModal from '@/components/modal/StyledModal'
import ImgUpload from '@/components/ImgUpload'
import FetchSelect from '@/components/FetchSelect'
import { validateFormRef } from '@/common/utils_element'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const defaultForm = {
  targetDoctorCode: '',
}

export default {
  setup(_, ctx) {
    const visible = ref(false)
    const submitLoading = ref(false)

    const formRef = ref(null)
    const formModel = reactive({
      form: cloneDeep(defaultForm),
    })

    const goodsCodeArr = ref([]) // 批量选择的商品
    const callbackRef = ref(null)

    function open(goodsCodeArrParam = [], callback) {
      visible.value = true
      goodsCodeArr.value = goodsCodeArrParam
      if (callback) callbackRef.value = callback
    }

    function close() {
      visible.value = false
      formModel.form = cloneDeep(defaultForm)
      goodsCodeArr.value = []
    }

    // 提交
    async function submit() {
      await validateFormRef(formRef)
      submitLoading.value = true
      request({
        url: '/web/system/goods/copyGoods',
        data: {
          goodsCode: goodsCodeArr.value.join(','),
          ...formModel.form,
        },
      })
        .finally(() => {
          submitLoading.value = false
        })
        .then(() => {
          ElMessage.success('复制成功')
          close()
          if (callbackRef.value) callbackRef.value()
        })
    }

    return {
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
  components: { StyledModal, FetchSelect, ImgUpload },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
