<template>
  <StyledModal :visible="visible" title="评价审核" @close="close" @submit="submit" width="700px" :submitLoading="submitLoading" :showOk="!isForLook">
    <el-form ref="formRef" :model="formModel.form" label-width="100px">
      <el-form-item label="审核" prop="ifPass" :rules="[{ required: true }]">
        <el-radio-group v-model="formModel.form.ifPass" :disabled="isForLook">
          <el-radio label="1">审核通过</el-radio>
          <el-radio label="0">审核驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见" prop="apprNote" :rules="[{ required: formModel.form.ifPass == '0', message: '请输入审核意见' }]">
        <el-input v-model="formModel.form.apprNote" type="textarea" placeholder="请输入..." :disabled="isForLook" />
      </el-form-item>
    </el-form>

    <div class="detailView_box">
      <AppraiseDetail :record="record" />
    </div>
  </StyledModal>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import request from '@/utils/request'
import { validateFormRef } from '@/common/utils_element'
import { ElMessage } from 'element-plus/lib/components'
import AppraiseDetail from './AppraiseDetail.vue'

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

    const record = ref({})
    const isForLook = computed(() => (record.value?.apprDate ? true : false))
    watch(isForLook, (v) => {
      if (v) {
        // render form
        formModel.form = {
          ifPass: record.value.status == '90' ? '1' : '0',
          apprNote: record.value.apprNote,
        }
      }
    })

    function open(pRecord = {}) {
      visible.value = true
      if (pRecord) {
        record.value = pRecord
      }
    }

    function close() {
      record.value = {}
      formModel.form = { ...defaultForm }
      visible.value = false
    }

    async function submit() {
      await validateFormRef(formRef)
      const postData = {
        appraiseCode: record.value?.appraiseCode,
        ...formModel.form,
      }
      submitLoading.value = true
      request({
        url: '/web/system/appraise/approveAppraise',
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
      isForLook,
    }
  },
  components: { StyledModal, AppraiseDetail },
}
</script>

<style lang="less" scoped>
.detailView_box {
  margin: 20px 0 0 35px;
}
</style>
