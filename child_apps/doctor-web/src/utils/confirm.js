import { ElMessage, ElMessageBox } from 'element-plus'

// 普通的confirm
export function simpleConfirm(str, options = {}) {
  const { title = '提示', type = 'warning' } = options
  return new Promise((resolve, reject) => {
    ElMessageBox({
      title, //MessageBox 标题
      message: str, //MessageBox 消息正文内容
      showCancelButton: true, //是否显示取消按钮
      confirmButtonText: '确定', //确定按钮的文本内容
      cancelButtonText: '取消', //取消按钮的文本内容
      type, //消息类型，用于显示图标
    })
      .then(() => {
        return resolve(true)
      })
      .catch(() => {
        return reject(false)
      })
  })
}

// 异步的confirm
export function actionConfirm(str, promiseFunc) {
  ElMessageBox({
    title: '提示',
    message: str,
    showCancelButton: true,
    confirmButtonText: '确定', //确定按钮的文本内容
    cancelButtonText: '取消', //取消按钮的文本内容
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        // instance.confirmButtonText = "Loading...";
        promiseFunc()
          .finally(() => {
            instance.confirmButtonLoading = false
            done()
          })
          .then(() => {})
      } else {
        done()
      }
    },
  })
}

// 带输入框的confirm // 这个是异步的
export function promptConfirm(options = {}, promiseFunc) {
  const { title = '提示', label = '请输入', message = '' } = options

  let errMessage = ``
  if (message) {
    errMessage = message
  } else {
    if (label == '请输入') {
      errMessage = label
    } else {
      errMessage = `请输入${label}`
    }
  }

  ElMessageBox.prompt(label, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    // inputPattern:
    //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: "Invalid Email",
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        // 验证
        const value = instance.inputValue
        if (!value) {
          ElMessage.warning(errMessage)
          return
        }
        // 验证 end

        // 请求
        instance.confirmButtonLoading = true
        // instance.confirmButtonText = "Loading...";
        promiseFunc(value)
          .finally(() => {
            instance.confirmButtonLoading = false
            done()
          })
          .then(() => {})
      } else {
        done()
      }
    },
  })
}
