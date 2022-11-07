<template>
  <StyledModal :visible="visible" :title="`${isAdd ? '新建' : '编辑'}诊疗科目`" @close="close" @submit="submit" :submitLoading="submitLoading">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="120px">
      <el-form-item label="科目" prop="departClassCode" :rules="[{ required: true, message: '请选择科目' }]">
        <FetchSelect
          v-model="formModel.form.departClassCode"
          api="/web/sys/code/getSysCodeByParam"
          :postData="{ codeParam: 'DEPART_CLASS' }"
          textKey="codeValue"
          valueKey="codeKey"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formModel.form.remark" placeholder="请输入"></el-input>
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

const defaultForm = {
  departClassCode: '',
  remark: '',
}

export default {
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
        url: isAdd.value ? '/web/system/departclass/createDepartClass' : '',
        data: {
          ...formModel.form,
          // ...(isAdd.value ? {} : { hospitalCode: record.v.hospitalCode }),
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
