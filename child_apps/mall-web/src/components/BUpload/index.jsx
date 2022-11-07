import React, { memo, useState, useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc'
import en_US from 'antd/es/locale-provider/en_US'
import { cloneDeep } from 'lodash'
import { Upload, Button, Modal, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import UploadList from 'antd/es/upload/UploadList'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { globalHost } from '@/utils/utils'
import requestw from '@/utils/requestw'
import styles from './index.less'
import './index_localName.less'

const listStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '100%',
  cursor: 'grab',
}

const getAccept = (type) => {
  if (type == 'img') {
    return 'image/*'
  } else if (type == 'excel') {
    return '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  } else if (type == 'pdf') {
    return 'application/pdf'
  } else if (type == 'video') {
    return 'video/*'
  } else if (type == '*') {
    return 'video/*,image/*'
  } else {
    //file
    return null
  }
}

//处理value 返回一个arr （fileList）
function getItemObj(itm) {
  if (Object.prototype.toString.call(itm) === '[object Object]') {
    return {
      status: 'done',
      uid: itm.url,
      url: itm.url,
      name: itm.name,
    }
  } else {
    return {
      status: 'done',
      uid: itm,
      url: itm,
      name: itm,
    }
  }
}

//处理传进来的value=>fileList
const dealValue = (value, valueType) => {
  //=>Array
  if (!value) {
    return []
  }
  //有值
  if (valueType == 'Array<string>') {
    return value.map((fileUrl) => getItemObj(fileUrl))
  } else if (valueType == 'string') {
    return [getItemObj(value)]
  } else if (valueType == 'string<,>') {
    return value.split(',').map((fileUrl) => getItemObj(fileUrl))
  }
}

//按钮
const defaultBtnDom = (type, loading) => {
  return type == 'img' || type == '*' ? (
    <span>
      {loading ? <LoadingOutlined style={{ marginRight: 5 }} /> : <UploadOutlined style={{ marginRight: 5 }} />}
      上传
    </span>
  ) : (
    <Button icon={<UploadOutlined />} loading={loading}>
      上传
    </Button>
  )
}

// 上传文件
export async function uploadAjax({ file, fileKey, api, postData }) {
  const data = {
    [fileKey]: file,
    ...postData,
  }
  let formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return requestw({
    type: 'formdata',
    url: api,
    data: formData,
    isNeedCheckResponse: true,
    errMsg: true,
  })
}

//文件大小 kb
const getSizeStr = (size) => {
  // kb
  let sizeNumber = Number(size)
  if (sizeNumber > 1000) {
    return (sizeNumber / 1000).toFixed(0) + 'MB'
  } else {
    return sizeNumber.toFixed(0) + 'KB'
  }
}

/**
 *
 * @param {object} props
 *
 * @param {Array|string} props.value
 * @param {function} props.onChange
 *
 * @param {'Array<string>'|'string'|'string<,>'} props.valueType
 * @param {img|excel|pdf|video|file} props.type // img excel pdf video file
 *
 * @param {string} props.api
 * @param {function} props.getPostData // 额外参数
 * @param {string} props.fileKey
 * @param {function} props.dealResFunc
 * @param {function} props.onSuccessCallback
 *
 * @param {Number|string} props.length
 * @param {Number|string} props.limitSize //文件大小 单位kb
 *
 * @param {boolean} [props.isCanSort=false]
 * @param {boolean} [props.disabled=false]
 *
 * 剪裁
 * @param {false | object} [props.imgCrop=false] // type=img的时候 并且该属性为对象，才会开启剪裁 // 注意 多选和剪裁 互斥！
 */
const Index = (props) => {
  const {
    valueType = 'string',
    value,
    type,

    api,
    getPostData,
    fileKey = 'file',
    dealResFunc,
    length = 1,
    limitSize,
    isCanSort = false,
    imgCrop = false,
    disabled = false,
  } = props

  const valueRef = useRef(undefined)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  const [loading, setLoading] = useState(false)

  const accept = getAccept(type)
  const fileList = useMemo(() => dealValue(value, valueType), [value, valueType])

  //根据value的类型处理fileList
  const dealFileListTemp = (fileList) => {
    return (fileList = fileList.map((obj) => {
      if (obj.response) {
        return getItemObj(obj.response)
      } else if (obj.status && obj.status == 'done') {
        return getItemObj(obj)
      }
    }))
  }

  //把fileList转化成可以emit的value
  const dealFileListToEmitValue = (fileList) => {
    let fileUrlList = fileList.map((itm) => itm.url)
    //转换成emitValue
    if (valueType == 'Array<string>') {
      return fileUrlList
    } else if (valueType == 'string') {
      return fileUrlList[0] || ''
    } else if (valueType == 'string<,>') {
      return fileUrlList.join(',')
    }
  }

  //自定义上传
  const customRequest = async (e) => {
    const file = e.file

    //上传前 验证
    //文件大小
    if (limitSize !== undefined) {
      if (file.size / 1000 > limitSize) {
        //KB比较
        const sizeStr = getSizeStr(limitSize)
        message.warning(`请上传小于${sizeStr}的文件`)
        return
      }
    }
    //上传前 验证 end

    setLoading(true)
    const fileUrl = await uploadAjax({
      file,
      fileKey,
      api,
      postData: (getPostData && getPostData(e)) || {},
    })
    setLoading(false)

    if (!fileUrl) {
      message.warning('上传失败')
      return
    }

    //成功
    const response = {
      status: 'done',
      uid: file.uid,
      url: fileUrl,
      name: file.name,
    }
    e.onSuccess(response)

    //发射onChange
    if (props.onChange) {
      const fileList = dealValue(valueRef.current, valueType)
      const emitValue = dealFileListToEmitValue([...fileList, getItemObj(response)]) //根据value的类型处理 fileList
      props.onChange(emitValue)
    }

    if (props.onSuccessCallback) {
      props.onSuccessCallback(response, res)
    }
  }

  const onFileChange = (e) => {
    let file = e.file
    let fileListTemp = e.fileList
    //发射onChange
    if (props.onChange && file.status == 'removed') {
      let fileList = dealFileListTemp(fileListTemp)
      const emitValue = dealFileListToEmitValue(fileList) //根据value的类型处理 fileList
      props.onChange(emitValue)
    }
  }

  // 拖拽相关
  const onRemove = (file) => {
    const fileList2 = cloneDeep(fileList)
    const fileListTemp = fileList2.filter((item) => item.uid !== file.uid)
    const fileList3 = dealFileListTemp(fileListTemp)
    const emitValue = dealFileListToEmitValue(fileList3) //根据value的类型处理 fileList
    props.onChange(emitValue)
  }
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const fileList2 = arrayMove(fileList, oldIndex, newIndex)
    const fileList3 = dealFileListTemp(fileList2)
    const emitValue = dealFileListToEmitValue(fileList3) //根据value的类型处理 fileList
    props.onChange(emitValue)
  }

  /**
   * 渲染
   */
  const listType = type == 'img' || type == '*' ? 'picture-card' : 'text'

  let dom = null
  if (props.children) {
    if (Object.prototype.toString.call(props.children) === '[object Function]') {
      dom = props.children(loading, fileList)
    } else {
      dom = props.children
    }
  } else {
    dom = length && fileList && fileList.length >= length ? null : defaultBtnDom(type, loading)
    // dom = defaultBtnDom(type, loading);
  }

  const SortableItem = memo(
    SortableElement((params) => {
      return (
        <div>
          <UploadList
            locale={{ previewFile: '预览图片', removeFile: '删除图片' }}
            showDownloadIcon={false}
            listType={listType} // text, picture 和 picture-card
            onRemove={onRemove}
            items={[params.item]}
          />
        </div>
      )
    })
  )

  const SortableList = memo(
    SortableContainer((params) => {
      return (
        <div style={listStyle}>
          {params.items.map((item, index) => (
            <SortableItem key={`${item.uid}`} index={index} item={item} />
          ))}
        </div>
      )
    })
  )

  const uploadDom = (
    <Upload
      accept={accept}
      listType={listType} // text, picture 和 picture-card
      disabled={loading}
      action={globalHost() + api}
      customRequest={customRequest}
      {...props}
      showUploadList={isCanSort ? false : props.showUploadList || true}
      fileList={fileList}
      onChange={onFileChange}
    >
      {!disabled && dom}
    </Upload>
  )

  const showUploadDom = type == 'img' && imgCrop ? <ImgCrop {...imgCrop}>{uploadDom}</ImgCrop> : uploadDom

  return (
    <div
      className={classNames({
        [styles.custom_bupload_container]: true,
        disabled,
      })}
      style={{
        minWidth: listType == 'picture-card' ? 112 : 0,
        minHeight: listType == 'picture-card' ? 112 : 0,
      }} // 解决upload 闪动问题
    >
      <div className="bupload_iscansort_wrap">{isCanSort && fileList && <SortableList distance={1} items={fileList} onSortEnd={onSortEnd} axis="xy" helperClass="SortableHelper" props={props} />}</div>
      {showUploadDom}
    </div>
  )
}

export default Index
