import { ref, watch, onMounted, computed } from 'vue'
import request from '@/utils/request'

/**
 * @param {object} config
 * @param {string} config.api
 * @param {any} [config.watchData] 如果不watch的话 就onMounted执行
 * @param {(watchDataValue?:any)=>object} [config.getPostData]
 * @param {(watchDataValue?:any)=>boolean} [config.getIsReady]
 * @param {function} [config.successAjax]
 * @param {function} [config.format]
 * @returns
 */
function useRequestData(config = {}) {
  const { api, watchData, getPostData, getIsReady, successAjax, format } = config

  const info = ref({})
  const postData = ref({})
  const loading = ref(false)

  const showInfo = computed(() => {
    return format ? format(info.value) : info.value
  })

  if (watchData) {
    watch(
      watchData,
      (newV) => {
        if (!getIsReady || getIsReady(newV)) {
          postData.value = (getPostData && getPostData(newV)) || {}
          getInfo()
        }
      },
      { immediate: true }
    )
  } else {
    onMounted(() => {
      if (!getIsReady || getIsReady()) {
        postData.value = (getPostData && getPostData()) || {}
        getInfo()
      }
    })
  }

  function getInfo() {
    loading.value = true
    return request({
      url: api,
      data: postData.value,
    })
      .finally(() => {
        loading.value = false
      })
      .then((data) => {
        info.value = data ?? {}
        successAjax && successAjax(info.value) // 请求到info的callback
      })
  }

  return {
    info: showInfo,
    loading,
    getInfo, // 刷新
  }
}

export default useRequestData
