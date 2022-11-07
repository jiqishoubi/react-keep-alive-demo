<template>
  <StyledModal :visible="visible" :title="`${isAdd ? '新建' : '编辑'}科室`" @close="close" @submit="submit" :submitLoading="submitLoading">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="120px">
      <el-form-item label="科室名称" prop="departName" :rules="[{ required: true, message: '请输入科室名称' }]">
        <el-input v-model="formModel.form.departName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="科室图标" prop="departLogo" :rules="[{ required: false, message: '请添加科室图标' }]">
        <ImgUpload v-model="formModel.form.departLogo" :limit="1" />
      </el-form-item>
      <el-form-item label="诊疗科目" prop="departClassCode" :rules="[{ required: true, message: '请选择诊疗科目' }]">
        <FetchSelect v-model="formModel.form.departClassCode" api="/web/system/depart/getDepartClassList" textKey="departClassFullName" valueKey="departClassCode" />
      </el-form-item>
      <el-form-item label="科室简介" prop="departDesc">
        <el-input v-model="formModel.form.departDesc" placeholder="请输入"></el-input>
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

const defaultForm = {
  departName: '',
  departLogo: '',
  departClassCode: '',
  departDesc: '',
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
        url: isAdd.value ? '/web/system/depart/createDepart' : '/web/system/depart/updateDepart',
        data: {
          ...formModel.form,
          ...(isAdd.value ? {} : { departCode: record.v.departCode }),
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
  components: { StyledModal, FetchSelect, ImgUpload },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
