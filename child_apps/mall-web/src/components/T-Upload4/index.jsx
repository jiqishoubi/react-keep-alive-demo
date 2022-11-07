/**
 * props:
 * value
 * onChange
 *
 * length 默认8
 */
import React, { Component, useState } from 'react'
import { Upload, Button, Input, Modal, Form, message } from 'antd'

import { UploadOutlined } from '@ant-design/icons'
import api_common from '@/services/api/common'
import { globalHost, isIMG, isVIDEO, pathVideoHeader, pathimgHeader, localDB } from '@/utils/utils'
import { getToken, loginStateKey } from '@/utils/consts'
import './index.less'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      //modal
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      //loading
      loading: false,
      fileType: '',
    }
  }
  //回显
  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      let value = nextProps.value.map((item, index) => {
        if (typeof item == 'object') {
          return item
        } else {
          let arr = item.split(',')
          let name = arr[arr.length - 1]
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
    return url
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
            console.log('业务失败', e.file.response.message)
            message.warning(e.file.response.message)
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

  //处理fileList 发射出去
  dealFileList = (fileList) => {
    return fileList.map((item) => {
      if (item.xhr && item.response) {
        let url = item.response.data //.list[0].filePath; //自定义
        return {
          uid: item.uid,
          name: item.name,
          status: 'done',
          code: item.response.data.OPER_DATA_KEY,
          url,
        }
      } else {
        return item
      }
    })
  }

  //Modal
  openModal = async (file) => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }
  closeModal = () => {
    this.setState({ previewVisible: false })
  }

  beforeUpload = (file, fileList) => {
    return new Promise((resolve, reject) => {
      let filetype = file.type.split('/')[1]

      // const isJPG = filetype === 'vnd.ms-excel';
      // const isJPEG = filetype === 'vnd.ms-excel';
      // const isGIF = filetype === 'vnd.ms-excel';
      // const isPNG = filetype === 'vnd.ms-excel';
      // const isPDF = filetype === 'vnd.ms-excel';
      // if (!isJPG) {
      //   message.error('只能上传excle文件');
      //   return;
      // }

      this.setState({
        fileType: filetype,
      })
      let fileName = file.name
      //截取文件名
      let pointPos = fileName.indexOf('.')
      fileName = fileName.substring(0, pointPos)
      //判断文件是否符合正则表达式的规则
      // if (!fileNameRegular.reg.test(fileName)) {
      //   message.error(fileNameRegular.msg);
      //   return reject(false)
      // }
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
    const { length, stylse, listt, btn, disabled, type } = this.props

    const uploadButton = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: 18,
          border: '1px solid #d9d9d9',
          height: 30,
        }}
      >
        <UploadOutlined style={{ paddingLeft: 18, marginTop: 2 }} />
        <div style={{ paddingLeft: 6, paddingRight: 18 }}>上传</div>
      </div>
    )

    const token = getToken()

    return (
      <div>
        <Upload
          listType={listt ? listt : 'text'}
          isImageUrl={this.isImageUrl}
          fileList={fileList}
          accept=".xls, .xlsx"
          action={`${globalHost()}${api_common.importOperDataByExcel}`}
          data={{ sessionId: token, operKind: type }}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          onPreview={this.openModal}
          style={stylse}
          disabled={disabled}
        >
          {fileList.length >= length ? null : uploadButton}
        </Upload>
        <Modal destroyOnClose visible={previewVisible} title={previewTitle} footer={null} onCancel={this.closeModal}>
          <div id="component_t_upload_2_modal">
            {previewImage && isIMG(previewImage) ? <img alt="example" style={{ width: '100%' }} src={previewImage} /> : null}
            {/*{previewImage && isVIDEO(previewImage) ? (*/}
            {/*  <SublimeVideo loop style={{ width: '420px', height: '420px' }} src={previewImage} />*/}
            {/*) : null}*/}
          </div>
        </Modal>
      </div>
    )
  }
}

export default index
