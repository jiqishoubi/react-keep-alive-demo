import React, { Component, Fragment } from 'react'
import { Input, Button, Row, message } from 'antd'
import UploadForDetails from './UploadForDetails'
import styles from './index.less'
import { isVIDEO } from '@/utils/utils'

const { TextArea } = Input

/**
 * props:
 * [imgUploadText='图片/视频']
 */
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      groupList: [],
      imgList: [],
      isUpload: true,
      viceEvent: '',
    }
  }

  /**
   * 周期
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      let list = nextProps.value
      if (list.length > 0) {
        const viceImgList = []
        list.map((r) => {
          r.type === 2 ? viceImgList.push(r) : ''
        })
        this.setState({
          visible: true,
          groupList: list,
          imgList: viceImgList,
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
  //添加组件
  addSubGroup = (type) => {
    //1文字 2图片 3分割线
    const { groupList } = this.state
    if (type == 1) {
      let obj = {
        type: 1,
        value: '',
        time: new Date().getDate(),
      }
      groupList.push(obj)
      this.setState({ groupList })
    }
  }
  //文字
  textChange = (index, e) => {
    const { groupList } = this.state
    let value = e.target.value
    groupList[index].value = value
    this.setState({ groupList }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.dealList())
      }
    })
  }
  //图片
  imgUploadCallback = (url) => {
    this.setState({
      imgList: url || [],
      isUpload: false,
    })
    let isKeep = true
    url.map((r) => {
      if (r.status == 'uploading') {
        isKeep = false
      }
    })
    if (!isKeep) return
    this.setState({
      isUpload: true,
    })

    let obj = []
    url.map((r) => {
      try {
        obj.push({
          ...r,
          type: 2,
          value: r.response?.data || r.value,
        })
      } catch (e) {
        message.warn('老数据商品请删除详情，重新上传！')
      }
    })
    this.setState({ groupList: obj, imgList: obj || [] }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.dealList())
      }
    })
  }
  onRemove = (index) => {
    const { imgList, groupList } = this.state
    let item = groupList[index].value
    let i
    try {
      i = imgList.findIndex((r) => r.response?.data == item || r == item)
    } catch (e) {}
    if (i === -1) return
    imgList.splice(i, 1)
    this.setState({ imgList })
  }

  deleteItem = (index, type) => {
    if (type == 2) {
      this.onRemove(index)
    }
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

    // 最终处理一下list
    return list.map((item) => {
      return {
        type: item.type,
        value: item.value,
        time: item.time,
      }
    })
  }

  dragStart(event) {
    if (event.target && event.target.alt) {
      this.setState({ viceEvent: JSON.parse(event.target.alt) }, () => {})
    }
  }
  dragEnd(event) {}
  allowDrop(event) {
    event.preventDefault()
  }
  drop(event) {
    event.preventDefault()
    if (!event || !event.target || !event.target.alt) return
    let viceAlt = JSON.parse(event.target.alt)
    if (event.target && viceAlt && viceAlt.value && this.state.viceEvent && this.state.viceEvent.value && viceAlt.value !== this.state.viceEvent.value) {
      let viceGroupList = JSON.parse(JSON.stringify(this.state.groupList))
      const vice = JSON.parse(JSON.stringify(viceGroupList))
      viceGroupList.splice(
        viceGroupList.findIndex((e) => e.value === this.state.viceEvent.value),
        1
      )

      viceGroupList.splice(
        vice.findIndex((e) => e.value === viceAlt.value),
        0,
        this.state.viceEvent
      )

      const viceImgList = []
      viceGroupList.forEach((r, index) => {
        r.time = new Date().getTime()
        r.type === 2 ? viceImgList.push(r) : ''
      })

      this.setState({ groupList: viceGroupList, imgList: viceImgList }, () => {
        if (this.props.onChange) {
          this.props.onChange(this.dealList())
        }
      })
    }
  }

  /**
   * 渲染
   */
  render() {
    const { disabled, imgUploadText = '图片/视频' } = this.props
    const { visible, groupList, imgList, isUpload } = this.state

    return (
      <Fragment>
        <div className={styles.title}>{this.state.visible ? '详情如下' : <a onClick={this.toggleShow}>点击设置</a>}</div>
        <div className={styles.wrap} style={{ display: visible ? 'block' : 'none' }}>
          <div className={styles.content}>
            <div className={styles.container}>
              {groupList.map((obj, index) => {
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
                    />
                  )
                } else if (obj.type == 2) {
                  const nameArr = (obj && obj?.name && obj?.name.split('.')) || []
                  const name = nameArr[nameArr.length - 1]
                  if (name && isVIDEO(name)) {
                    dom = <video style={{ width: '100%', height: 'auto' }} src={obj.value} key={obj} />
                  } else {
                    //图片
                    dom = <img style={{ width: '100%', height: 'auto' }} src={obj.value} key={obj} alt={JSON.stringify(obj)} />
                  }
                }
                return (
                  <div
                    key={index}
                    draggable="true"
                    onDragEnd={(event) => this.dragEnd(event)}
                    onDragStart={(event) => this.dragStart(event)}
                    onDrop={(event) => this.drop(event)}
                    onDragOver={(event) => this.allowDrop(event)}
                  >
                    {dom}
                    {!disabled && (
                      <div style={{ textAlign: 'right' }}>
                        <a
                          onClick={() => {
                            this.deleteItem(index, obj.type)
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
            {!disabled && (
              <div className={styles.subgroup_wrap}>
                <div style={{ padding: '0 0 5px 5px' }}>组件</div>
                <Row justify="start">
                  <UploadForDetails callback={this.imgUploadCallback} imgFileList={imgList}>
                    <Button
                      style={{ borderRadius: '4px' }}
                      className={styles.sub_btn}
                      size="small"
                      onClick={() => {
                        this.addSubGroup(2)
                      }}
                      disabled={!isUpload}
                    >
                      {isUpload ? imgUploadText : '上传中'}
                    </Button>
                  </UploadForDetails>
                  <Button
                    style={{ borderRadius: '4px' }}
                    className={styles.sub_btn}
                    size="small"
                    disabled={!isUpload}
                    onClick={() => {
                      this.addSubGroup(1)
                    }}
                  >
                    文字
                  </Button>
                </Row>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    )
  }
}
