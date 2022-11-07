// 传入formRef 校验，并滚动到 不符合的form item
export function validateFormRef(formRef) {
  return new Promise(async (resolve, reject) => {
    if (!formRef.value) return reject()
    try {
      await formRef.value.validate()
    } catch (err) {
      const errPropArr = Object.keys(err ?? {})
      errPropArr[0] && formRef.value.scrollToField(errPropArr[0])
      return reject()
    }
    return resolve()
  })
}
