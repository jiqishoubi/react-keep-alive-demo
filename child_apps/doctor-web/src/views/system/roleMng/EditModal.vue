<template>
  <StyledModal :visible="visible" title="角色" @close="close" @submit="submit" :submitLoading="submitLoading" :destroy-on-close="true">
    <el-form class="form_box" ref="formRef" :model="formModel.form" label-width="90px" v-loading="getRoleInfoLoading">
      <el-form-item label="角色名称" prop="roleName" :rules="[{ required: true, message: '请输入角色名称' }]">
        <el-input v-model="formModel.form.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色说明" prop="roleDesc">
        <el-input v-model="formModel.form.roleDesc" placeholder="请输入角色说明"></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleKind">
        <el-radio-group v-model="formModel.form.roleKind" :disabled="!isAdd">
          <el-radio label="SYSTEM">平台端</el-radio>
          <el-radio label="SUPPLIER">供应商端</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 菜案权限 -->
      <el-form-item label="菜单权限" prop="menuCodeStr" :rules="[{ required: true, message: '请选择菜单权限' }]" v-loading="loading_allMenu">
        <InitMenuTreeItem v-model="formModel.form.menuCodeStr" :treeData="allInitMenuTree" />
      </el-form-item>
    </el-form>
  </StyledModal>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'
import StyledModal from '@/components/modal/StyledModal'
import InitMenuTreeItem from '@/components/InitMenuTreeItem'
import useRequestData from '@/hooks/useRequestData'
import dealMenu from '@/router/dealMenu'
import request from '@/utils/request'
import { cloneDeep } from '@/utils/utils'
import { validateFormRef } from '@/common/utils_element'

const defaultForm = {
  roleName: '',
  roleDesc: '',
  roleKind: 'SYSTEM',
  menuCodeStr: '',
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
    const roleKind = computed(() => formModel.form.roleKind)

    const recordCode = ref(null)
    const isAdd = computed(() => (recordCode.value ? false : true))

    // 全部菜单
    const allMenu = ref([])
    const loading_allMenu = ref(false)
    const allInitMenuTree = computed(() => {
      return dealMenu(allMenu.value ?? [])?.menuTree ?? []
    })
    function getAllMenu() {
      loading_allMenu.value = true
      request({
        url: '/web/menu/getSupplierMenuList',
        data: { menuType: formModel.form.roleKind },
      })
        .finally(() => (loading_allMenu.value = false))
        .then((data) => (allMenu.value = data ?? []))
    }
    watch(
      roleKind,
      (v) => {
        if (v) getAllMenu()
      },
      {
        immediate: true,
        deep: true,
      }
    )

    // 详细信息
    const { loading: getRoleInfoLoading } = useRequestData({
      api: '/web/role/getRoleInfo',
      watchData: [visible, recordCode],
      getPostData: ([, recordCodeValue]) => {
        return { roleCode: recordCodeValue }
      },
      getIsReady: ([visibleValue, recordCodeValue]) => visibleValue && recordCodeValue, // 之后recordCode有值的时候 才去请求
      successAjax: (data) => {
        renderForm(cloneDeep(data))
      },
    })

    /**
     * 方法
     */
    function open(recordCodeParam) {
      visible.value = true
      if (recordCodeParam) {
        recordCode.value = recordCodeParam
      }
    }

    function close() {
      recordCode.value = null
      visible.value = false
      formModel.form = {
        ...defaultForm,
      }
    }

    // form回显
    function renderForm(data) {
      formModel.form = {
        ...(data?.role ?? {}),
        menuCodeStr: data?.rightCodeStr ?? '',
      }
    }

    // 提交
    async function submit() {
      await validateFormRef(formRef)
      submitLoading.value = true
      request({
        url: isAdd.value ? '/web/role/createRole' : '/web/role/updateRole',
        data: {
          ...formModel.form,
          ...(isAdd.value ? {} : { roleCode: recordCode.value }),
        },
      })
        .finally(() => {
          submitLoading.value = false
        })
        .then(() => {
          isAdd.value && ctx.emit('successAdd')
          !isAdd.value && ctx.emit('successEdit')
          close()
        })
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
      allInitMenuTree,
      loading_allMenu,
      getRoleInfoLoading,
    }
  },
  components: { StyledModal, InitMenuTreeItem },
}
</script>

<style lang="less" scoped>
.form_box {
  width: 90%;
}
</style>
