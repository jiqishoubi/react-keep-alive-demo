<template>
  <StyledModal :visible="visible" title="处方审核" @close="close" @submit="submit" :submitLoading="submitLoading">
    <el-form ref="formRef" :model="formModel.form" label-width="100px">
      <el-form-item label="物流公司" prop="expressCompany" :rules="[{ required: true, message: '请选择物流公司' }]">
        <FetchSelect v-model="formModel.form.expressCompany" placeholder="请选择" api="/web/system/trade/getExpressCompanyList" textKey="expressName" valueKey="expressCode" />
      </el-form-item>
      <el-form-item label="物流单号" prop="expressNo" :rules="[{ required: true, message: '请输入物流单号' }]">
        <el-input v-model="formModel.form.expressNo" placeholder="请输入..." />
      </el-form-item>
    </el-form>
  </StyledModal>
</template>

<script>
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash'
import StyledModal from '@/components/modal/StyledModal'
import FetchSelect from '@/components/FetchSelect'
import request from '@/utils/request'
import { validateFormRef } from '@/common/utils_element'
import { ElMessage } from 'element-plus/lib/components'

const defaultForm = {
  expressCompany: '', // 物流公司编号
  expressNo: '', // 物流单号
}

export default {
  emits: ['success'],
  setup(_, ctx) {
    const visible = ref(false)
    const submitLoading = ref(false)

    const formRef = ref(null)
    const formModel = reactive({
      form: cloneDeep(defaultForm),
    })

    const record = ref(null)

    function open(pRecord) {
      visible.value = true
      if (pRecord) {
        record.value = pRecord
      }
    }

    function close() {
      record.value = null
      formModel.form = cloneDeep(defaultForm)
      visible.value = false
    }

    async function submit() {
      await validateFormRef(formRef)
      const postData = {
        tradeNo: record.value?.tradeNo,
        ...formModel.form,
      }
      submitLoading.value = true
      request({
        url: '/web/system/trade/expressTrade',
        data: postData,
      })
        .finally(() => {
          submitLoading.value = false
        })
        .then((data) => {
          ElMessage.success('操作成功')
          ctx.emit('success')
          close()
        })
    }

    return {
      visible,
      submitLoading,
      open,
      close,
      submit,
      record,
      formRef,
      formModel,
    }
  },
  components: { StyledModal, FetchSelect },
}
</script>

<style lang="less" scoped></style>
