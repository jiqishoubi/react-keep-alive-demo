<template>
  <StyledModal :visible="visible" title="新建医生集团" @close="close" @submit="submit" :submitLoading="submitLoading">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="125px">
      <el-form-item label="医生集团名称" prop="orgName" :rules="[{ required: true, message: '请输入医生集团名称' }]">
        <el-input v-model="formModel.form.orgName" placeholder="请输入医生集团名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formModel.form.remark" placeholder="请输入" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </StyledModal>
</template>

<script>
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash'
import StyledModal from '@/components/modal/StyledModal'
import { validateFormRef } from '@/common/utils_element'
import request from '@/utils/request'

const defaultForm = {
  orgName: '',
  remark: '',
}

export default {
  emits: ['successAdd'],
  setup(_, ctx) {
    const visible = ref(false)
    const submitLoading = ref(false)

    const formRef = ref(null)
    const formModel = reactive({
      form: cloneDeep(defaultForm),
    })

    function open() {
      visible.value = true
    }

    function close() {
      visible.value = false
      formModel.form = cloneDeep(defaultForm)
    }

    // 提交
    async function submit() {
      await validateFormRef(formRef)
      submitLoading.value = true
      request({
        url: '/web/system/company/createCompany',
        data: {
          ...formModel.form,
        },
      })
        .finally(() => {
          submitLoading.value = false
        })
        .then(() => {
          ctx.emit('successAdd')
          close()
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
  components: { StyledModal },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
