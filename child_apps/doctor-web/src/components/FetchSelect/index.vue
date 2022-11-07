<template>
  <el-select
    :model-value="showValue"
    :placeholder="placeholder"
    clearable
    :multiple="multiple"
    @change="handleSelectChange"
    style="display: block"
    v-loading="isShowLoading && loading"
    :disabled="disabled"
    filterable
  >
    <el-option v-for="(item, index) in optionList" :key="index" :label="item[textKey]" :value="item[valueKey]"></el-option>
  </el-select>
</template>

<script>
import { ref, onMounted, toRefs, computed, watch } from 'vue'
import request from '@/utils/request'

/**
 * @description 如果是 multiple 那么modelValue是逗号分隔的code
 */
export default {
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'post',
    },
    api: {
      type: String,
      default: '',
    },
    postData: {
      type: Object,
      default: () => ({}),
    },
    valueKey: {
      type: String,
      default: '',
    },
    textKey: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 请求的数据是否是分页的？
    isPaging: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    isShowLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const { modelValue, postData } = toRefs(props)
    const showValue = computed(() => {
      let showV = ''
      if (modelValue.value) {
        if (props.multiple) {
          showV = modelValue.value.split(',')
        } else {
          showV = modelValue.value
        }
      }
      return showV
    })

    const optionList = ref([])
    const loading = ref(false)

    onMounted(() => {
      getOptions()
    })

    watch(postData, (newV, oldV) => {
      if (JSON.stringify(newV) !== JSON.stringify(oldV)) {
        setTimeout(() => {
          getOptions()
        }, 0)
      }
    })

    function getOptions() {
      loading.value = true
      return request({
        method: props.type,
        url: props.api,
        data: {
          ...props.postData,
        },
        errMsg: false,
      })
        .finally(() => {
          loading.value = false
        })
        .then((data) => {
          let list = []
          if (props.isPaging) {
            list = data?.data ?? []
          } else {
            list = data ?? []
          }
          optionList.value = list
        })
    }

    function handleSelectChange(e) {
      let value = ''
      let payload
      if (props.multiple) {
        // 多选
        value = e.join(',')
        payload = e.map((code) => {
          return optionList.value.find((item) => item[props.valueKey] == code)
        })
      } else {
        // 单选
        value = e
        payload = optionList.value.find((item) => item[props.valueKey] == e)
      }
      ctx.emit('update:modelValue', value, payload)
      ctx.emit('change', value, payload)
    }

    return {
      optionList,
      loading,
      showValue,
      handleSelectChange,
    }
  },
}
</script>
