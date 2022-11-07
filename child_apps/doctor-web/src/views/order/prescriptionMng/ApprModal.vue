<template>
  <StyledModal :visible="visible" title="处方审核" @close="close" @submit="submit" width="700px" :submitLoading="submitLoading">
    <el-form ref="formRef" :model="formModel.form" label-width="100px">
      <el-form-item label="审核" prop="ifPass" :rules="[{ required: true }]">
        <el-radio-group v-model="formModel.form.ifPass">
          <el-radio label="1">审核通过</el-radio>
          <el-radio label="0">审核驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见" prop="apprNote" :rules="[{ required: formModel.form.ifPass == '0', message: '请输入审核意见' }]">
        <el-input v-model="formModel.form.apprNote" type="textarea" placeholder="请输入..." />
      </el-form-item>
    </el-form>

    <div class="detailView_box">
      <detail-view :rxCode="record?.rxCode"></detail-view>
    </div>
  </StyledModal>
</template>

<script>
import { reactive, ref } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import DetailView from './DetailView/index.vue'
import request from '@/utils/request'
import { validateFormRef } from '@/common/utils_element'
import { ElMessage } from 'element-plus/lib/components'

const defaultForm = {
  ifPass: '1',
  apprNote: '',
}

export default {
  emits: ['success'],
  setup(_, ctx) {
    const visible = ref(false)
    const submitLoading = ref(false)

    const formRef = ref(null)
    const formModel = reactive({
      form: {
        ...defaultForm,
      },
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
      formModel.form = { ...defaultForm }
      visible.value = false
    }

    async function submit() {
      await validateFormRef(formRef)
      const postData = {
        rxCode: record.value?.rxCode,
        ...formModel.form,
      }
      submitLoading.value = true
      request({
        url: '/web/system/prescription/approvePrescription',
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
  components: { StyledModal, DetailView },
}
</script>

<style lang="less" scoped>
.detailView_box {
  margin: 20px 0 0 100px;
}
</style>
