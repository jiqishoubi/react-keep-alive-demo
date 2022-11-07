/**
 * props:
 * onChange
 */
import React, { Component } from 'react'
import { Upload } from 'antd'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // loading: false,
      imgUrl: '',
    }
  }

  handleRequest = () => {
    this.setState(
      {
        // loading: true,
        imgUrl: '',
      },
      () => {
        this.imgUrlChange()
      }
    )
    setTimeout(() => {
      this.setState(
        {
          // loading: false,
          imgUrl: 'https://cdn.s.bld365.com/greecardindex_banner_new2_03_01.png',
        },
        () => {
          this.imgUrlChange()
        }
      )
    }, 1000)
  }

  handleChange = () => {}

  imgUrlChange = () => {
    const { onUploadChange } = this.props
    if (onUploadChange) {
      onUploadChange(this.state.imgUrl)
    }
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
      //判断文件是否符合正则表达式的规则
      // if (!fileNameRegular.reg.test(fileName)) {
      //   message.error(fileNameRegular.msg);
      //   return reject(false)
      // }
      return resolve(true)
    })
  }

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

  render() {
    const { imgUrl } = this.state

    const uploadButton = (
      <div>
        {/* <Icon type={loading ? 'loading' : 'plus'} /> */}
        <div className="ant-upload-text">上传</div>
      </div>
    )

    return (
      <Upload
        accept="image/jpg,image/jpeg,image/png"
        listType="picture-card"
        showUploadList={false}
        data={{ fileExt: this.state.fileType, fileType: 'GoodsImage' }}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        customRequest={this.handleRequest}
      >
        {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    )
  }
}

export default index
