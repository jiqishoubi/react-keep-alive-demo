import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect } from 'react'
import { Button, Input, message, Upload, Image } from 'antd'
import FodderModal from './fodderModal'
import { queryNewsPage, queryOtherMaterialPage, uploadPermanentOtherNews } from '../services'
import requestw from '@/utils/requestw'
const Mark = (props, ref) => {
  const { value } = props
  const fodderModalRef = useRef()
  const inputRef = useRef()
  const [typeIndex, setTypeIndex] = useState(0)
  const [fileList, setFileList] = useState([])
  const [viceValue, setViceValue] = useState({})

  const typeList = [
    { name: '图文消息', key: 'news' },
    { name: '文字', key: 'text' },
    { name: '图片', key: 'image', accept: 'image/*' },
    { name: '音频', key: 'voice', accept: 'audio/*' },
    { name: '视频', key: 'video', accept: 'video/*' },
  ]
  // 发送消息 类型切换
  const typeClick = (index) => {
    setTypeIndex(index)
    setFileList([])
  }
  // 监控 value的变化
  useEffect(() => {
    if (value && value.mediaType) {
      const index = typeList.findIndex((r) => r.key === value?.mediaType)
      setTypeIndex(index)
      setViceValue({ typeIndex: index, ...value, type: value.mediaType })
    }
  }, [props.value])

  // 选择素材的参数
  const fodderModalProps = {
    url: typeIndex === 0 ? queryNewsPage : queryOtherMaterialPage,
    type: typeList[typeIndex].key,
  }

  // 获取到选择的数据
  const fodderChange = (e) => {
    if (typeIndex !== 1) {
      setViceValue({
        type: typeList[typeIndex].key,
        typeIndex: typeIndex,
        ...e,
      })
    } else {
      setViceValue({ type: typeList[typeIndex].key, typeIndex: typeIndex })
    }
  }

  // 获取input数据’
  const getInputData = () => {
    return inputRef.current.resizableTextArea.props.value
  }
  const getViceValue = () => {
    return viceValue
  }
  useImperativeHandle(ref, () => ({
    getInputData,
    getViceValue,
  }))

  const getSizeStr = (size) => {
    // kb
    let sizeNumber = Number(size)
    if (sizeNumber > 1000) {
      return (sizeNumber / 1000).toFixed(0) + 'MB'
    } else {
      return sizeNumber.toFixed(0) + 'KB'
    }
  }

  // 自定义上传 文件
  const customRequest = async (e) => {
    if (fileList.length) return
    setFileList([e.file])
    const typeItem = typeList[typeIndex]
    const file = e.file

    // if (file.size / 1000 > 5) {
    //   //KB比较
    //   message.warning(`请上传小于5M的文件`);
    //   return;
    // }

    const postData = {
      file,
      mediaType: typeItem.key,
    }
    typeItem.key !== 'video'
      ? (postData['name'] = file.name || 'typeItem.key')
      : ((postData['videoTitle'] = file.name || 'typeItem.key'), (postData['videoIntroduction'] = file.name || 'typeItem.key'))
    let formData = new FormData()
    for (let key in postData) {
      formData.append(key, postData[key])
    }
    setFileList([{ status: 'uploading', ...file }])
    const res = await requestw({
      type: 'formdata',
      url: '/web/staff/media/uploadPermanentOtherNews',
      data: formData,
    })
    if (res && res.code === '0') {
      //成功
      setFileList([{ status: 'done', uid: file.uid, url: res.data.url, name: file.name }])

      message.success('上传成功')
      fodderChange(res.data)
    } else {
      e.onError()
      setFileList([])
      message.warning('上传失败')
    }
  }
  //
  const uploadOnchange = (e) => {
    if (e.fileList.length > 1 && e.file.status !== 'removed') {
      message.warn('只能上传一个文件')
      return
    }
    let file = e.file
    if (file.status == 'removed') {
      setFileList([])
    }
  }

  const deleteValue = () => {
    setViceValue({})
    setFileList([])
  }

  return (
    <div style={{ width: '100%', height: 240, border: '1px solid #D9D9D9' }}>
      <div
        style={{
          width: '100%',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          background: '#f2f2f2',
          color: '#262626',
          fontSize: '16px',
        }}
      >
        {typeList.map((r, index) => {
          return (
            <div
              onClick={() => typeClick(index)}
              style={{
                cursor: 'pointer',
                color: typeIndex === index ? ' #1D7BFF' : '',
                fontWeight: typeIndex === index ? 'bold' : '',
              }}
              key={r.key}
            >
              {r.name}
            </div>
          )
        })}
      </div>
      {viceValue && viceValue.type && viceValue.typeIndex === typeIndex && viceValue.type !== 'text' ? (
        <div style={{ display: 'flex', marginTop: 20 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: 10,
              cursor: 'pointer',
            }}
          >
            {viceValue.type === 'video' || viceValue.type === 'voice' ? (
              <>
                {viceValue.type === 'video' && (
                  <video controls style={{ height: 100, width: 'auto' }}>
                    <source src={viceValue.url} type="video/mp4" />
                  </video>
                )}

                {viceValue.type === 'voice' && (
                  <audio controls>
                    <source src={viceValue.url} type="audio/ogg; codecs=opus" />
                  </audio>
                )}
              </>
            ) : (
              <Image alt="" src={viceValue.url} style={{ height: 100, width: 'auto' }} />
            )}

            <div style={{ width: 240, position: 'relative', minHeight: 10 }}>
              <div
                style={{
                  fontSize: 13,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  webkitLineClamp: '3',
                  webkitBoxOrient: 'vertical',
                  textIndent: '2em',
                }}
              >
                {viceValue.title}
              </div>
              <Button
                style={{
                  borderRadius: 8,
                  marginLeft: 10,
                  position: 'absolute',
                  bottom: 0,
                  right: -50,
                }}
                size="small"
                type="primary"
                onClick={deleteValue}
              >
                删除
              </Button>
            </div>
          </div>
        </div>
      ) : typeIndex === 1 ? (
        <Input.TextArea
          ref={inputRef}
          placeholder="请输入..."
          autoSize={{ minRows: 7, maxRows: 7 }}
          maxLength={200}
          onChange={() => fodderChange(inputRef.current.resizableTextArea.props.value)}
          defaultValue={viceValue.typeIndex === 1 ? viceValue.title : ''}
          style={{ border: 'none' }}
        />
      ) : (
        <div style={{ display: 'flex', marginTop: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginLeft: 20,
              cursor: 'pointer',
              width: 114,
              height: 32,
              background: '#FFFFFF',
              borderRadius: 4,
              border: '1px dashed #D9D9D9',
            }}
            onClick={() => fodderModalRef.current?.open()}
          >
            <img alt="" src="https://cdn.s.bld365.com/saas/public/shagnchuan_icon.png" style={{ height: 12 }} />
            <div style={{ fontSize: 14, color: '#8c8c8c' }}>素材库选择</div>
          </div>
          {typeIndex !== 0 && (
            <Upload accept={typeList[typeIndex].accept} customRequest={customRequest} style={{ width: 50 }} onChange={uploadOnchange} fileList={fileList}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginLeft: 20,
                  cursor: 'pointer',
                  width: 114,
                  height: 32,
                  background: '#FFFFFF',
                  borderRadius: 4,
                  border: '1px dashed #D9D9D9',
                }}
              >
                <img alt="" src="https://cdn.s.bld365.com/saas/public/shagnchuan_icon.png" style={{ height: 12 }} />
                <div style={{ fontSize: 14, color: '#8c8c8c' }}>本地上传</div>
                <Upload />
              </div>
            </Upload>
          )}

          <FodderModal ref={fodderModalRef} {...fodderModalProps} onChange={(e) => fodderChange(e)} />
        </div>
      )}
    </div>
  )
}
export default forwardRef(Mark)
