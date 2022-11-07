import React from 'react'
import { set } from 'lodash'
import { Spin } from 'antd'

export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id || null,
      ueEditor: null,
      isShow: false,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      const self = this
      var UE = window.UE
      let { id } = this.state
      if (id) {
        try {
          UE.delEditor(id)
        } catch (error) {}
        let ueEditor = UE.getEditor(id, {
          // autoFloatEnabled: true,
          //字体大小
          // fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36, 48],
          // 上传图片时后端提供的接口
          // serverUrl: '',
          // enableAutoSave: false,
          // eslint-disable-next-line no-dupe-keys
          autoHeightEnabled: false,
          initialFrameHeight: this.props.height,
          initialFrameWidth: '100%',
          //
          toolbars: [
            [
              'undo', //撤销
              'bold', //加粗
              'indent', //首行缩进
              'italic', //斜体
              'underline', //下划线
              'blockquote', //引用
              'horizontal', //分隔线
              'fontfamily', //字体
              'fontsize', //字号
              'paragraph', //段落格式
              'emotion', //表情
              'justifyleft', //居左对齐
              'justifyright', //居右对齐
              'justifycenter', //居中对齐
              'justifyjustify', //两端对齐
              'forecolor', //字体颜色
              'rowspacingtop', //段前距
              'rowspacingbottom', //段后距
              'lineheight', //行间距
            ],
          ], //工具栏
          allowDivTransToP: false,
          wordCount: false, //计数统计
          elementPathEnabled: false, //元素路径
        })
        this.setState({ ueEditor })
        //判断有没有默认值
        ueEditor.ready((ueditr) => {
          var value = this.props.value ? this.props.value : '<p></p>'
          ueEditor.setContent(value)
          self.setState({ isShow: true })
        })
        //将文本回调回去
        ueEditor.addListener('selectionchange', (type) => {
          this.props.callback(ueEditor.getContent())
        })

        //清空富文本内容
        //this.refs.ueditor.changeContent("");
      }
    }, 400)
  }

  render() {
    let { id, isShow } = this.state

    return (
      <div>
        {!isShow && (
          <div style={{ textAlign: 'center', paddingTop: 100 }}>
            <Spin />
          </div>
        )}
        <div style={{ visibility: isShow ? 'inherit' : 'hidden' }}>
          <textarea id={id} style={{ width: this.props.width, height: this.props.height }}></textarea>
        </div>
      </div>
    )
  }
}
