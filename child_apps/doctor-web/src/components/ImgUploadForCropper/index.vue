<template>
  <div class="ImgUpload_1638518131492" :class="{ disabled: disabled || fileList.length >= limit }">
    <el-upload
      list-type="picture-card"
      :action="action"
      :file-list="fileList"
      @change="handleChange"
      :limit="limit"
      :disabled="disabled || fileList.length >= limit"
      :http-request="customRequest"
      v-loading="loading"
    >
      <template #default>
        <el-icon><plus /></el-icon>
      </template>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <el-icon><zoom-in /></el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
              <el-icon><download /></el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <el-icon><delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>

    <!-- 模态 -->
    <el-dialog v-model="dialogVisible" :center="true" width="700px" append-to-body>
      <img class="dialog_image" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <ImageCropper3 ref="ImageCropper3Ref" />
  </div>
</template>

<script>
import { Plus, ZoomIn, Download, Delete } from '@element-plus/icons'
import { globalHost, getFileNameSuffix } from '@/utils/utils'
import ImageCropper3 from '@/components/ImageCropper3'
import request from '@/utils/request'

function formateFileListToValueStr(fileList) {
  return (fileList || []).map((item) => item.url).join(',') ?? ''
}

function formateValueStrToFileList(str) {
  let arr = []
  if (str) {
    arr = str.split(',').map((url, index) => {
      return {
        name: index + '_' + url,
        url,
      }
    })
  }
  return arr
}

/**
 * 接收的是 逗号分隔的字符串
 */
export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      action: globalHost() + '/web/sys/uploadFile',
      fileList: [],
      loading: false,

      // 模态
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  watch: {
    fileList(newV) {
      // ****** 里面的fileList 改变 去 emit
      this.emitValueStr(newV)
    },
  },
  beforeMount() {
    console.log('beforeMount')
    this.setFileListByModelValue()
  },
  beforeUpdate() {
    console.log('beforeUpdate')
    this.setFileListByModelValue()
  },
  /**
   * 方法
   */
  methods: {
    handleChange(file, fileList) {
      console.log('handleChange', file)
      this.fileList = fileList.map((item) => {
        return {
          ...item,
          url: item.response || item.url,
        }
      })
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter((item) => item.url != file.url)
    },
    handlePictureCardPreview(file) {
      if (file.url) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    },
    handleDownload(file) {
      window.open(file.url)
    },
    emitValueStr(fileList) {
      const valueStr = formateFileListToValueStr(fileList)
      this.$emit('update:modelValue', valueStr)
    },
    // 覆盖上传
    async customRequest(e) {
      const originFile = e.file
      const croppedFile = await this.$refs.ImageCropper3Ref.open(originFile)
      console.log('剪裁完的file', croppedFile)
      const postData = {
        fileType: 'doctor-pc',
        fileExt: getFileNameSuffix(originFile.name),
        file: croppedFile,
      }
      this.loading = true
      return request({
        url: e.action,
        data: postData,
      }).finally(() => {
        this.loading = false
      })
    },
    // ****** 外面的props modelValue改变了，去更新fileList
    setFileListByModelValue() {
      const oldStr = formateFileListToValueStr(this.fileList)
      if (oldStr !== this.modelValue) {
        this.fileList = formateValueStrToFileList(this.modelValue)
      }
    },
  }, // methods end
  components: {
    Plus,
    ZoomIn,
    Download,
    Delete,
    ImageCropper3,
  },
}
</script>

<style lang="less">
@import url('./index_global.less');
</style>
<style lang="less" scoped>
.dialog_image {
  width: 100%;
  height: auto;
}
</style>
