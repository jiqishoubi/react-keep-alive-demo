/**
 * props:
 * callback
 */
import React, { Component } from 'react'
import { Upload, Button, Form, message } from 'antd'
import { uploadAjax } from '@/services/common'
import api_common from '@/services/api/common'
import { globalHost } from '@/utils/utils'
import { UPLOAD_FILE_TYPE } from '@/utils/consts'

class index extends Component {
  state = {
    fileType: '',
  }

  beforeUpload = (file, fileList) => {
    file['time'] = new Date().getTime()
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

  handleChange = (e) => {
    const { file, fileList } = e
    fileList.sort((a, b) => a.time - b.time)
    if (file.status == 'removed' || file.status == 'done' || file.status == 'uploading') {
      this.setState({ fileList }, () => {
        if (file.status == 'removed') {
          if (this.props.callback) {
            this.props.callback(fileList)
          }
        }
        if (file.status == 'done') {
          if (file.response && file.response.code == '0') {
            if (this.props.callback) {
              this.props.callback(fileList)
            }
          } else {
            let curFileList = this.state.fileList
            let newFileList = curFileList.filter((obj) => obj.uid !== file.uid)
            this.setState({ fileList: newFileList })
            message.warning('网络异常')
          }
        } else {
          if (this.props.callback) {
            this.props.callback(fileList)
          }
        }
      })
    }
    if (file.status == 'error') {
      let curFileList = this.state.fileList
      let newFileList = curFileList.filter((obj) => obj.uid !== file.uid)
      this.setState({ fileList: newFileList })
      message.warning('网络异常')
    }
  }

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
  /**
   * 渲染
   */
  render() {
    const { children } = this.props
    return (
      <div>
        <Upload
          showUploadList={false}
          action={`${globalHost()}${api_common.uploadApi}`}
          onChange={this.handleChange}
          data={{ fileType: UPLOAD_FILE_TYPE, fileExt: this.state.fileType }}
          beforeUpload={this.beforeUpload}
          multiple={true}
          ref={this.props.ref}
          fileList={this.props.imgFileList}
        >
          {children}
        </Upload>
      </div>
    )
  }
}

export default index
