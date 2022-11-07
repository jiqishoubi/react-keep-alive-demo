<template>
  <StyledModal :visible="visible" title="员工" @close="close" @submit="submit" :submitLoading="submitLoading">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="90px">
      <el-form-item label="企业" prop="orgCode" :rules="[{ required: true, message: '请选择企业' }]">
        <FetchSelect v-model="formModel.form.orgCode" placeholder="请选择" api="/web/system/supplier/getOrgList" textKey="orgName" valueKey="orgCode" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="账号" prop="loginName" :rules="[{ required: true, message: '请输入账号' }]">
        <el-input v-model="formModel.form.loginName" placeholder="请输入账号" :disabled="!isAdd"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="staffName" :rules="[{ required: true, message: '请输入姓名' }]">
        <el-input v-model="formModel.form.staffName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phoneNumber" :rules="[{ required: true, message: '请输入电话' }]">
        <el-input v-model="formModel.form.phoneNumber" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleCode">
        <FetchSelect v-model="formModel.form.roleCode" api="/web/staff/role/getRoleList" valueKey="roleCode" textKey="roleName" :multiple="true" :isShowLoading="true" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formModel.form.remark" placeholder="请输入" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <div>初始密码默认：123456</div>
      </el-form-item>
    </el-form>
  </StyledModal>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import FetchSelect from '@/components/FetchSelect'
import useRequestData from '@/hooks/useRequestData'
import request from '@/utils/request'
import { cloneDeep } from '@/utils/utils'
import { validateFormRef } from '@/common/utils_element'

const defaultForm = {
  orgCode: '',
  loginName: '',
  staffName: '',
  phoneNumber: '',
  roleCode: '', // 角色 roleCode 逗号分隔
  remark: '',
}

export default {
  emits: {
    successAdd: null,
    successEdit: null,
  },
  setup(_, ctx) {
    const visible = ref(false)
    const submitLoading = ref(false)

    const formRef = ref(null)
    const formModel = reactive({
      form: {
        ...defaultForm,
      },
    })

    const record = reactive({ v: null })
    const isAdd = computed(() => (record.v ? false : true))

    useRequestData({
      api: '/web/staff/role/getStaffRoleRightDataList',
      watchData: record,
      getPostData: (recordValue) => {
        return { staffCode: recordValue.v?.staffCode }
      },
      getIsReady: (recordValue) => recordValue.v?.staffCode,
      successAjax: (data) => {
        formModel.form.roleCode = data?.roleCodeStr ?? ''
      },
    })

    /**
     * 方法
     */

    function open(recordParam) {
      visible.value = true
      if (recordParam) {
        record.v = cloneDeep(recordParam)
        renderForm(cloneDeep(recordParam))
      }
    }

    function close() {
      record.v = null
      visible.value = false
      formModel.form = {
        ...defaultForm,
      }
    }

    // form回显
    function renderForm(data) {
      formModel.form = data
    }

    // 提交
    async function submit() {
      await validateFormRef(formRef)

      submitLoading.value = true
      // 员工信息
      let data1
      try {
        data1 = await request({
          url: isAdd.value ? '/web/staff/createStaff' : '/web/staff/updateStaff',
          data: {
            ...formModel.form,
            ...(isAdd.value ? {} : { staffCode: record.v?.staffCode }),
          },
        })
      } catch {
        submitLoading.value = false
      }

      // 角色信息
      let staffCode = '' // 新建的时候会返回员工信息，可以得到staffCode；编辑的时候，就直接使用record的staffCode
      if (isAdd.value) {
        staffCode = data1.staffCode
      } else {
        staffCode = record.v?.staffCode
      }
      try {
        await request({
          url: '/web/staff/role/replaceRoleRightDataList',
          data: {
            staffCode,
            roleCode: formModel.form.roleCode,
          },
        })
      } catch {
        submitLoading.value = false
      }
      submitLoading.value = false

      // 成功
      isAdd.value && ctx.emit('successAdd')
      !isAdd.value && ctx.emit('successEdit')
      close()
    }

    return {
      visible,
      submitLoading,
      isAdd,
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
