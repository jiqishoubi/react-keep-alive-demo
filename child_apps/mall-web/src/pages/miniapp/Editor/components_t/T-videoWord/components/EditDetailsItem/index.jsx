import React, { Component, Fragment } from 'react'
import { Input, Button, Row } from 'antd'
import BUpload from '@/components/BUpload'
import { loginStateKey } from '@/utils/consts'
import api_common from '@/services/api/common'
import styles from './index.less'

const { TextArea } = Input

export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stamp: new Date().getTime(),
      visible: false,
      groupList: (props.value && props.value.length) > 0 ? props.value : [], //[{type,value}]
    }
  }
  /**
   * 周期
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      if (nextProps.value.length > 0) {
        this.setState({
          visible: true,
          groupList: nextProps.value,
        })
      }
    }
  }
  /**
   * 方法
   */
  toggleShow = () => {
    this.setState({ visible: !this.state.visible })
  }
  //新增组件
  addSubGroup = (type) => {
    //1文字 2图片 3分割线 4视频
    const { groupList } = this.state
    if (type == 1) {
      let obj = {
        type: 1,
        value: '',
      }
      groupList.push(obj)
      this.setState({ groupList })
    }
  }
  //文字
  textChange = (index, e) => {
    const { groupList } = this.state
    let value = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
    groupList[index].value = value
    this.setState({ groupList }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.dealList())
      }
    })
  }
  //图片
  imgUploadCallback = (res) => {
    const url = res.url
    const { groupList } = this.state
    let obj = {
      type: 2,
      value: url,
    }
    groupList.push(obj)
    this.setState({ groupList }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.dealList())
      }
    })
  }
  //视频
  videoUploadCallback = (res) => {
    const url = res.url
    const { groupList } = this.state
    let obj = {
      type: 4,
      value: url,
    }
    groupList.push(obj)
    this.setState({ groupList }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.dealList())
      }
    })
  }
  deleteItem = (index) => {
    const { groupList } = this.state
    groupList.splice(index, 1)
    this.setState({ groupList }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.dealList())
      }
    })
  }
  //处理当前的list
  dealList = () => {
    const { groupList } = this.state
    let list = []
    groupList.forEach((obj) => {
      if (obj.value) {
        list.push(obj)
      }
    })
    return list
  }

  /**
   * 渲染
   */
  render() {
    const { visible, groupList } = this.state
    const { readOnly } = this.props

    return (
      <Fragment>
        {/* {!readOnly && (
          <div className={styles.title}>
            <a onClick={this.toggleShow}>点击设置</a>
          </div>
        )} */}
        <div className={styles.wrap}>
          <div className={styles.content}>
            <div className={styles.container}>
              {groupList &&
                Array.isArray(groupList) &&
                groupList.map((obj, index) => {
                  let dom = ''
                  if (obj.type == 1) {
                    //文字
                    dom = (
                      <TextArea
                        placeholder="请输入..."
                        value={obj.value}
                        onChange={(e) => {
                          this.textChange(index, e)
                        }}
                        readOnly={readOnly}
                      />
                    )
                  } else if (obj.type == 2) {
                    //图片
                    dom = <img style={{ width: '100%', height: 'auto' }} src={obj.value} />
                  } else if (obj.type == 4) {
                    //视频
                    dom = <video src={obj.value} style={{ width: '100%', height: 'auto' }}></video>
                  }
                  return (
                    <div key={index}>
                      {dom}
                      {!readOnly && (
                        <div style={{ textAlign: 'right' }}>
                          <a
                            onClick={() => {
                              this.deleteItem(index)
                            }}
                          >
                            删除
                          </a>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>

            {/* 控制 组件 */}
            {!readOnly && (
              <div className={styles.subgroup_wrap}>
                <div style={{ padding: '0 0 5px 5px' }}>组件</div>
                <Row justify="start">
                  <BUpload
                    api={api_common.uploadApi}
                    type="img"
                    listType="text"
                    onSuccessCallback={this.imgUploadCallback}
                    getPostData={(e) => {
                      const file = e.file
                      const fileExt = file.type.split('/')[1]
                      return {
                        fileExt,
                        fileType: 'customIndex',
                      }
                    }}
                  >
                    {(loading) => {
                      return (
                        <Button
                          className={styles.sub_btn}
                          size="small"
                          onClick={() => {
                            this.addSubGroup(2)
                          }}
                          loading={loading}
                        >
                          图片
                        </Button>
                      )
                    }}
                  </BUpload>
                  <Button
                    className={styles.sub_btn}
                    size="small"
                    onClick={() => {
                      this.addSubGroup(1)
                    }}
                  >
                    段落
                  </Button>
                  <BUpload
                    api={api_common.uploadApi}
                    type="video"
                    onSuccessCallback={this.videoUploadCallback}
                    getPostData={(e) => {
                      const file = e.file
                      const fileExt = file.type.split('/')[1]
                      return {
                        fileExt,
                        fileType: 'customIndex',
                      }
                    }}
                  >
                    {(loading) => {
                      return (
                        <Button
                          className={styles.sub_btn}
                          size="small"
                          onClick={() => {
                            this.addSubGroup(4)
                          }}
                          loading={loading}
                        >
                          视频
                        </Button>
                      )
                    }}
                  </BUpload>
                </Row>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    )
  }
}
