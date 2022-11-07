import React, { Component, useState, useCallback, useEffect } from 'react'
import { Form, Input, Radio, Select, Button, message, Modal } from 'antd'
import { formatMillisecond } from '@/utils/utils'
import styles from './FormDetail.less'

const formStyle = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const fileTypeMap = {
  // 图片
  png: 'img',
  jpg: 'img',
  jpeg: 'img',
  gif: 'img',
  webp: 'img',
  // word
  doc: 'word',
  docx: 'word',
  // excel
  xls: 'excel',
  xlsx: 'excel',
  // powerpoint
  ppt: 'ppt',
  pptx: 'ppt',
  // pdf
  pdf: 'pdf',
}

const fileTypeIconMap = {
  img: 'https://cdn.s.bld365.com/lexin_tongyong/component/file-type-img.png',
  word: 'https://cdn.s.bld365.com/lexin_tongyong/component/file-type-word.png',
  excel: 'https://cdn.s.bld365.com/lexin_tongyong/component/file-type-word.png',
  ppt: 'https://cdn.s.bld365.com/lexin_tongyong/component/file-type-ppt.png',
  pdf: 'https://cdn.s.bld365.com/lexin_tongyong/component/file-type-pdf.png',
  file: 'https://cdn.s.bld365.com/lexin_tongyong/component/file-type-file.png',
}

const getFileIcon = (ext) => {
  return (ext && fileTypeMap[ext] && fileTypeIconMap[fileTypeMap[ext]]) || fileTypeIconMap.file
}

//计算时间段
const getTimeRange = (item2, formValueContent) => {
  let item1Id = item2.startClockIn
  let item1 = formValueContent.find((itm) => itm.id == item1Id)
  let time1 = item1 && item1.valueTemp && JSON.parse(item1.valueTemp).positionTime
  let time2 = item2 && item2.valueTemp && JSON.parse(item2.valueTemp).positionTime
  if (time1 && time2 && time1 !== time2) {
    return formatMillisecond(new Date(time2).getTime() - new Date(time1).getTime())
  }
}

export default class FormDetail extends Component {
  state = {
    imgModal: false,
    imgurl: '',
  }
  imgClick = (record) => {
    this.setState({
      imgModal: true,
      imgurl: record.url,
    })
  }
  cancelImgModal = () => {
    this.setState({
      imgModal: false,
      imgurl: '',
    })
  }
  render() {
    const { item, ind, formValueContent } = this.props
    const typeName = (item && item.name && item.name.toLowerCase()) || ''

    if (typeName == 'input') {
      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>{item.valueTemp}</div>
          </Form.Item>
        </div>
      )
    } else if (typeName == 'radio') {
      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>{item.valueTemp}</div>
          </Form.Item>
        </div>
      )
    } else if (typeName == 'upload' || typeName == 'uploade') {
      let uploadData = []
      if (item.valueTemp) {
        item.valueTemp.split(',').map((it, id) => {
          let obj = {
            name: it,
            uid: id + 1,
            url: it,
            status: 'done',
          }
          uploadData.push(obj)
        })
      }
      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>
              {uploadData.map((i, d) => (
                <img width={200} onClick={() => this.imgClick(i)} src={i.url} key={d} alt="" />
              ))}
            </div>
          </Form.Item>
          <Modal
            visible={this.state.imgModal}
            title="图片"
            footer={[
              <Button key="back" onClick={this.cancelImgModal}>
                关闭
              </Button>,
            ]}
          >
            <img src={this.state.imgurl} style={{ width: '90%' }} alt="" />
          </Modal>
        </div>
      )
    } else if (typeName == 'datepicker') {
      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>{item.valueTemp}</div>
          </Form.Item>
        </div>
      )
    } else if (typeName == 'rangepicker') {
      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>{item.valueTemp ? item.valueTemp.replace(',', ' 至 ') : ''}</div>
          </Form.Item>
        </div>
      )
    } else if (typeName == 'location') {
      let valueObj = {}
      try {
        valueObj = JSON.parse(item.valueTemp)
      } catch (e) {}

      //计算时间段
      let timeRange
      if (item.clockInProp == '2') {
        timeRange = getTimeRange(item, formValueContent)
      }

      let valueDom = (
        <div>
          <div>定位：{valueObj.position || '-'}</div>
          <div>时间：{valueObj.positionTime || '-'}</div>
          {timeRange && <div>用时：{timeRange}</div>}
        </div>
      )

      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>{valueDom}</div>
          </Form.Item>
        </div>
      )
    } else if (typeName == 'count') {
      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>{item.valueTemp}</div>
          </Form.Item>
        </div>
      )
    } else if (typeName == 'uploadfile') {
      const valueDom =
        item.valueTemp && item.valueTemp.length && item.valueTemp
          ? item.valueTemp.map((obj, index) => (
              <div key={index} className={styles.file_item}>
                <img src={getFileIcon(obj.ext)} onClick={() => imgClick(getFileIcon(obj.ext))} style={{ width: 40, marginRight: 10 }} />
                <a className={styles.file_name} href={obj.url} target="_blank" style={{ wordBreak: 'break-all' }}>
                  {obj.fullName || ''}
                </a>
              </div>
            ))
          : ''
      return (
        <div style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}>
          <Form.Item label={<span style={{ fontWeight: 'bold' }}>{item.label}</span>} disabled required={item.isRequired} {...formStyle}>
            <div style={{ paddingLeft: 24 }}>{valueDom}</div>
          </Form.Item>
        </div>
      )
    } else {
      return <div key={ind} style={{ position: 'relative', marginTop: 5, marginLeft: 20 }}></div>
    }
  }
}
