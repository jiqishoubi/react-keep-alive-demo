<template>
  <div class="component_html_editor_box">
    <div :id="id"></div>
  </div>
</template>
<script>
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import tinymce from './tinymce/tinymce.js'
import { uplodaFileAjax } from '@/services/common'
import { getElementByAttr } from './jsfunc'

// 给插入图片的按钮 绑定一个事件，弹出上传图片框的时候，直接通过代码点击到 上传tab
function insertImageBtnBindFunc() {
  const buttonArr = getElementByAttr('button', 'aria-label', '插入/编辑图片')
  const button = buttonArr[0]
  if (button) {
    // eslint-disable-next-line no-inner-declarations
    function onClickImage() {
      console.log('点击图片了')
      setTimeout(() => {
        const tabBtnArr = document.getElementsByClassName('tox-dialog__body-nav-item')
        let tabBtn
        for (let i = 0; i < tabBtnArr.length; i++) {
          if (tabBtnArr[i].innerHTML == '上传') {
            tabBtn = tabBtnArr[i]
            break
          }
        }
        if (tabBtn) {
          tabBtn.click()
        }
      }, 10)
    }
    button.addEventListener('click', onClickImage)
  }
}

// 尝试setContent 每300ms试一次
export function setEditorContent(ref, value) {
  let time = 0
  function setContent() {
    if (time >= 5) return
    time++
    if (ref && ref.value && ref.value.isInitSuccess) {
      // 放入
      setTimeout(() => {
        ref.value.setContent(value || '')
      }, 0)
    } else {
      // ref 还没挂载
      setTimeout(setContent, 300)
    }
  }
  setContent()
}

export default {
  props: {
    id: {
      type: String,
      default: 'htmlEditor_id',
    },
    width: {
      default: '394',
    },
    height: {
      default: '730',
    },
  },
  setup(props) {
    const { width, height } = props

    const isInitSuccess = ref(false)

    // onBeforeMount(() => {
    //   const scriptTagArr = document.getElementsByTagName('script')
    //   let isHaveEditorScript = false
    //   for (let i = 0; i < scriptTagArr.length; i++) {
    //     const scriptTag = scriptTagArr[i]
    //     if (scriptTag.src?.indexOf(`/tinymce.min.js`) > -1) {
    //       isHaveEditorScript = true
    //       break
    //     }
    //   }
    //   if (!isHaveEditorScript) {
    //     const editorScriptTag = document.createElement('script')
    //     editorScriptTag.setAttribute('src', './tinymce/js/tinymce/tinymce.min.js')
    //     document.head.appendChild(editorScriptTag)
    //   }
    // })

    onMounted(() => {
      initEditor()
    })
    onBeforeUnmount(() => {
      tinymce.remove(`#${props.id}`)
    })

    function initEditor() {
      isInitSuccess.value = false
      setTimeout(() => {
        if (tinymce && document.getElementById(props.id)) {
          console.log('初始化editor', props.id)
          tinymce.init({
            selector: `#${props.id}`,
            language: 'zh_CN',
            // 编辑器样式
            content_style: 'body {margin: 0px; color: #262626;} img { max-width: 100%; height: auto;}',
            content_style: 'body { margin: 0px; color: #262626;} img { width: 100%; height: auto;}',
            inline_styles: true,
            // 图片插件
            plugins: 'image link',
            image_dimensions: false,
            image_description: false, // 不显示 图片描述
            // 工具栏
            toolbar: 'fontselect fontsizeselect styleselect forecolor backcolor bold italic underline strikethrough alignleft aligncenter alignjustify undo redo image link',
            // 字体大小选择 列表
            fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
            // 格式选择 列表
            style_formats: [
              { title: '正文', block: 'div', styles: { padding: '10px 12px', 'text-align': 'justify' } },
              { title: '正文-首行缩进', block: 'div', styles: { padding: '10px 12px', 'text-align': 'justify', 'text-indent': '2em' } },
            ],
            // 手动设置
            setup: function (editor) {
              editor.on('init', function () {
                // 默认选择的字体
                this.execCommand('fontSize', false, '14px')
              })
              editor.on('NodeChange', function (e) {
                // 手动的处理 <img/> 标签 增加style
                e.element.parentNode.querySelectorAll('img').forEach((img) => {
                  // img.setAttribute('rel', 'lightbox')
                  img.style.width = '100%'
                })
              })
            },
            // 自定义上传
            images_upload_handler: (blobInfo, succFun, failFun) => {
              if (blobInfo && blobInfo.blob) {
                return uplodaFileAjax(blobInfo.blob())
                  .then((url) => {
                    console.log('自定义上传 url', url)
                    // return succFun(url)

                    // // 这个版本的tinymce 没把success传出来，直接放在了then里
                    // handler(blobInfo, progress).then(success, err => {
                    //   failure(isString(err) ? { message: err } : err);
                    // });

                    return url
                  })
                  .catch((err) => {
                    console.log('自定义上传 err', err)
                    return failFun(err)
                  })
              }
            },
            // 编辑器的大小
            width,
            height,
            // 初始化编辑器实例 成功 时要执行的..
            init_instance_callback: () => {
              isInitSuccess.value = true

              initCallback()
            },
            // 移除推广
            branding: false,
          })
        } else {
          initEditor()
        }
      }, 200)
    }
    function initCallback() {
      insertImageBtnBindFunc()
    }
    function setContent(htmlStr) {
      if (htmlStr) tinymce?.activeEditor?.setContent(htmlStr)
    }
    function getContent() {
      return tinymce?.activeEditor?.getContent() ?? ''
    }
    return { setContent, getContent, isInitSuccess }
  },
}
</script>
<style lang="less">
@import url('./index_global.less');
</style>
