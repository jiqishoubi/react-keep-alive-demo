<template>
  <div class="form_wrap">
    <div class="form_title">欢迎登录良医健康系统</div>
    <el-form class="form" ref="formRef" :model="form" :rules="rules" @keyup.enter="submit">
      <el-form-item prop="loginName">
        <el-input v-model="form.loginName" placeholder="用户名" clearable>
          <template #prefix>
            <img class="input_icon" src="./assets/login_icon_loginName.png" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="form.password" placeholder="密码" clearable>
          <template #prefix>
            <img class="input_icon" src="./assets/login_icon_password.png" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="sms">
        <sms-input v-model="form.sms">
          <img class="input_icon" src="./assets/login_icon_password.png" />
        </sms-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading" style="width: 100%">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SMSInput from '@/components/SMSInput/index.vue'
import request from '@/utils/request'
import { firstMenuUrl, LOGIN_TOKEN_KEY } from '@/utils/consts'
import { validateFormRef } from '@/common/utils_element'

export default {
  setup() {
    const router = useRouter()
    const formRef = ref(null)
    const form = reactive({
      loginName: '',
      password: '',
      sms: undefined, // {v,key}
    })
    const rules = reactive({
      loginName: [{ required: true, message: '请输入用户名' }],
      password: [{ required: true, message: '请输入密码' }],
      sms: [{ required: true, message: '请输入验证码' }],
    })
    const loading = ref(false)
    async function submit() {
      await validateFormRef(formRef)
      const postData = {
        loginName: form.loginName,
        loginPassword: form.password,
        captcha: form.sms.v,
        captchaKey: form.sms.key,
      }
      loading.value = true
      request({
        url: '/web/doLogin',
        data: postData,
      })
        .finally(() => {
          loading.value = false
        })
        .then((data) => {
          // 保存token
          localStorage.setItem(LOGIN_TOKEN_KEY, data.loginSessionId)
          // 跳转
          router.push(firstMenuUrl)
        })
    }
    return {
      form,
      formRef,
      rules,
      submit,
      loading,
    }
  },
  components: { 'sms-input': SMSInput },
}
</script>

<style lang="less" scoped>
@import url('~@/common/styles.less');

.form_wrap {
  .flexColumn;
  .positionCenter;

  .form_title {
    text-align: center;
    font-size: 29px;
    font-weight: 500;
    margin-bottom: 50px;
  }

  .form {
    width: 300px;
    margin: 0 auto;

    .input_icon {
      width: 15px;
      height: 15px;
      object-fit: contain;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
