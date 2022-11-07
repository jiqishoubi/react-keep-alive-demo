/**
 * props:
 * value
 * onChange
 *
 * length 默认8
 */
import React, { Component, Fragment } from 'react'
import { Upload, Button, Input, Modal, Form, message } from 'antd'
// import SublimeVideo from 'react-sublime-video';
import { PlusOutlined } from '@ant-design/icons'
import { uploadAjax } from '@/services/common'
import api_common from '@/services/api/common'
import { globalHost, isIMG, isVIDEO, pathVideoHeader, pathimgHeader } from '@/utils/utils'
import './index.less'

import { Document, Page } from 'react-pdf'

import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      //modal
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      numPages: null,

      //loading
      loading: false,
      fileType: '',
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages })
  }

  directlyRenderPdfPage = (pages) => {
    const x = []
    for (let i = 2; i <= pages; i++) x.push(<Page pageNumber={i} key={`x${i}`} size="A4" />)
    return x
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      let value = nextProps.value.map((item, index) => {
        if (typeof item == 'object') {
          return item
        } else {
          // // let arr = item.split('/');
          // let arr = item.split(',');
          // let name = arr[arr.length - 1];
          // return {
          //   uid: -(index + 1),
          //   name: item,
          //   status: 'done',
          //   url: item,
          // };

          let arr = item.split(',')
          let name = arr[arr.length - 1]
          if (name.substring(name.length - 3) === 'pdf') name = 'PDF文件.pdf'
          return {
            uid: -(index + 1),
            name,
            status: 'done',
            url: item,
          }
        }
      })
      this.setState({ fileList: value })
    }
  }

  isImageUrl = (file) => {
    let url = file.url
    return isIMG(url || '')
  }

  //change
  handleChange = (e) => {
    const { file, fileList } = e
    if (file.status == 'uploading' || file.status == 'removed' || file.status == 'done') {
      console.log('执行')
      this.setState({ fileList }, () => {
        if (file.status == 'removed') {
          if (this.props.onChange) {
            this.props.onChange(this.dealFileList(fileList))
          }
        }
        if (file.status == 'uploading') {
          if (this.props.onChange) {
            this.props.onChange(this.dealFileList(fileList))
          }
        }
        if (file.status == 'done') {
          if (file.response && file.response.code == 0) {
            if (this.props.onChange) {
              this.props.onChange(this.dealFileList(fileList))
            }
          } else {
            let curFileList = this.state.fileList
            let newFileList = curFileList.filter((obj) => obj.uid !== file.uid)
            this.setState({ fileList: newFileList })
            console.log('业务失败', e)
            message.warning('网络异常')
          }
        }
      })
    }
    if (file.status == 'error') {
      let curFileList = this.state.fileList
      let newFileList = curFileList.filter((obj) => obj.uid !== file.uid)
      this.setState({ fileList: newFileList })
      console.log('error', e)
      message.warning('网络异常')
    }
  }

  //处理fileList 发射出去
  dealFileList = (fileList) => {
    return fileList.map((item) => {
      if (item.xhr && item.response) {
        let filePath = item.response.data //.list[0].filePath;
        let host = isVIDEO(filePath) ? pathVideoHeader : pathimgHeader
        let url = item.response.data //.list[0].filePath; //自定义
        return {
          uid: item.uid,
          name: item.name,
          status: 'done',
          url,
        }
      } else {
        return item
      }
    })
  }

  //Modal
  openModal = async (file) => {
    let filetype = file.name.substring(file.name.length - 3)
    const isJPG = filetype === 'jpg'
    const isJPEG = filetype === 'peg'
    const isGIF = filetype === 'gif'
    const isPNG = filetype === 'png'
    const isPDF = filetype === 'pdf'
    if (isPDF) {
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        // previewTitle: `预览链接: ${file.url.substring(file.url.lastIndexOf('/') + 1)}`,
        previewTitle: false,
      })
    } else {
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: true,
      })
    }
  }
  closeModal = () => {
    this.setState({ previewVisible: false })
  }

  beforeUpload = (file, fileList) => {
    return new Promise((resolve, reject) => {
      let filetype = file.type.split('/')[1]
      this.setState({
        fileType: filetype,
      })
      let fileName = file.name
      //截取文件名
      let pointPos = fileName.indexOf('.')
      fileName = fileName.substring(0, pointPos)
      return resolve(true)
    })
  }

  /**
   * 渲染
   */
  render() {
    const {
      fileList,
      //modal
      previewVisible,
      previewTitle,
      previewImage,
    } = this.state
    const { length, stylse, listt, btn, disabled } = this.props

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    )

    return (
      <div>
        <Upload
          listType={listt ? listt : 'picture-card'}
          isImageUrl={this.isImageUrl}
          fileList={fileList}
          action={`${globalHost()}${api_common.uploadApi}`}
          // customRequest={this.handleRequest}
          data={{ fileExt: this.state.fileType, fileType: 'GoodsImage' }}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          onPreview={this.openModal}
          style={stylse}
          disabled={disabled}
        >
          {fileList.length >= length ? null : uploadButton}
          {/* {btn ? <Button>点击上传</Button> : ''} */}
        </Upload>
        <Modal width="640px" destroyOnClose visible={previewVisible} footer={null} onCancel={this.closeModal}>
          <div id="component_t_upload_2_modal">
            {previewTitle ? (
              previewImage && isIMG(previewImage) ? (
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              ) : (
                ''
              )
            ) : (
              <Document file={previewImage} onLoadSuccess={this.onDocumentLoadSuccess}>
                <Page pageNumber={1} size="A4" />
                {this.state.numPages > 1 && this.directlyRenderPdfPage(this.state.numPages)}
              </Document>
            )}
          </div>
        </Modal>
      </div>
    )
  }
}

export default index
