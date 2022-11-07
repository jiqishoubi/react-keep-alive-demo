<template>
  <div class="detail_editor">
    <div v-if="itemList && itemList.length > 0" class="list_panel">
      <draggable v-model="itemList" :group="name" @change="handleListChange" @start="handleStart" @end="handleEnd" item-key="id">
        <template #item="{ element }">
          <div class="item">
            <!-- 文字 -->
            <textarea v-if="element.type == 'text'" class="item_text" :value="element.content" @input="handleTextInput($event, element)" placeholder="请输入"></textarea>
            <!-- 图片 -->
            <img v-if="element.type == 'image'" class="item_img" :src="element.content" draggable="false" />

            <!-- 操作模态 -->
            <div class="item_ctrl_box">
              <div class="item_ctrl_box_btn item_ctrl_box_btn_delete" @click="handleDeleteItem(element)">删除</div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="ctrl_btn_wrap">
      <div class="ctrl_btn_wrap_btn" @click="handleAddText">添加文字</div>
      <el-upload :show-file-list="false" :action="action" :data="uploadPostData" :before-upload="handleBeforeUpload" @success="handleUploadSuccess">
        <template #default>
          <div class="ctrl_btn_wrap_btn">添加图片</div>
        </template>
      </el-upload>
    </div>
  </div>
</template>
<script>
import { reactive, ref, computed, toRefs } from 'vue'
import draggable from 'vuedraggable'
import { getFileNameSuffix, globalHost } from '@/utils/utils'
import { ElMessage } from 'element-plus'
const randomStrKey = (num = 7) => {
  return Math.random().toString(36).substr(2, num)
}
/**
 * modelValue jsonStr [{ id, type, content }]
 *
 * type:'text' content是文字
 * type:'image' conetent是图片网络地址
 *
 */
export default {
  emits: ['update:modelValue'],
  data() {
    return {
      action: globalHost() + '/web/sys/uploadFile',
    }
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: 'detailEditorGroup',
    },
  },
  setup(props, ctx) {
    const { modelValue } = toRefs(props)
    const uploadPostData = reactive({
      fileType: 'doctor-pc', //                       文件类型(非空 前端自定义,用于区分文件用途方便后运维清理)
      fileExt: '', //
    })
    const isDragging = ref(false)
    const itemList = computed(() => {
      let arr = []
      let temp
      if (modelValue.value) {
        try {
          temp = JSON.parse(modelValue.value)
        } catch (e) {
          console.log(e)
        }
      }
      if (Array.isArray(temp)) {
        arr = temp
      }
      return arr
    })

    // 控制text高度
    function handleTextInput(e, element) {
      // 高度
      const dom = e.target
      dom.style.height = dom.scrollHeight + 'px'
      // 修改value
      const value = e.target.value
      const newList = [...itemList.value]
      newList.find((item) => item.id == element.id).content = value
      emitValue(newList)
    }
    // 设置upload文件后缀
    function handleBeforeUpload(file) {
      const suffix = getFileNameSuffix(file.name)
      uploadPostData.fileExt = suffix
      return true
    }
    // 上传回调
    function handleUploadSuccess(res) {
      if (res?.code == '0') {
        const newList = [
          ...itemList.value,
          {
            id: randomStrKey(),
            type: 'image',
            content: res.data,
          },
        ]
        emitValue(newList)
      } else {
        ElMessage.warning(res.message || '上传失败')
      }
    }
    function handleDeleteItem(ele) {
      const newList = itemList.value.filter((item) => item.id != ele.id)
      emitValue(newList)
    }
    // 拖拽
    function handleListChange(e) {
      const newList = [...itemList.value]
      newList.splice(e.moved.oldIndex, 1)
      newList.splice(e.moved.newIndex, 0, e.moved.element)
      emitValue(newList)
    }
    function handleStart() {
      isDragging.value = true
    }
    function handleEnd() {
      isDragging.value = false
    }
    // ctrl btn
    function handleAddText() {
      const newList = [
        ...itemList.value,
        {
          id: randomStrKey(),
          type: 'text',
          content: '',
        },
      ]
      emitValue(newList)
    }
    function emitValue(newList) {
      let valueStr = ''
      if (newList) {
        valueStr = JSON.stringify(newList)
      }
      ctx.emit('update:modelValue', valueStr)
    }
    return {
      uploadPostData,
      itemList,
      handleTextInput,
      handleBeforeUpload,
      handleUploadSuccess,
      handleDeleteItem,
      // 拖拽
      handleListChange,
      handleStart,
      handleEnd,
      // ctrl btn
      handleAddText,
    }
  },
  components: { draggable },
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
