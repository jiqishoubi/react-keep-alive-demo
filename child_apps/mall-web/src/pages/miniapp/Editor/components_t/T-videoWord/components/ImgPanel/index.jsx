/**
 * props:
 * imgItem
 */
import React, { memo, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { connect } from 'dva'
import lodash from 'lodash'
import { Select, Form, Input, Button, Radio } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import BUpload from '@/components/BUpload'
import SelectItemFromTable from '@/components/SelectItemFromTable'
import TEditDetails from '@/components/goods/T-EditDetails'
import EditDetailBtn from '../EditDetailBtn'
import { goTypeOptionsList, getSelectItemFromTableProps } from '../../../../utils_editor'
import styles from './index.less'

const { Option } = Select
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const formItemLayoutTail = {
  wrapperCol: { span: 18, offset: 4 },
}

const Index = (props) => {
  const [formRef] = Form.useForm()
  const selectItemFromTableRef = useRef()
  const { h5Editor, imgItem, tIndex, tLength, dispatch } = props
  const { itemList, activeItem } = h5Editor

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  const [goTypeState, setGoTypeState] = useState(undefined)

  const init = () => {
    let list = lodash.cloneDeep(itemList)
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.id == activeItem.id) {
        let imgList = item.list
        //找到它当前的index
        const curIndex = imgList.findIndex((obj) => obj.id == imgItem.id)
        const itm = item.list[curIndex]
        formRef.setFieldsValue({
          ...itm,
        })
        setGoTypeState(itm.goType)
        break
      }
    }
  }

  useEffect(() => {
    init()
  }, [itemList, activeItem])

  //排序
  const changeOrder = (type) => {
    let list = lodash.cloneDeep(itemList)
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.id == activeItem.id) {
        let imgList = item.list
        //找到它当前的index
        let curIndex = imgList.findIndex((obj) => obj.id == imgItem.id)
        //上移
        if (type < 0) {
          imgList.splice(curIndex, 1)
          imgList.splice(curIndex - 1, 0, imgItem)
        }
        //下移
        if (type > 0) {
          let nextItem = imgList[curIndex + 1]
          imgList.splice(curIndex + 1, 1)
          imgList.splice(curIndex, 0, nextItem)
        }
        //移动完成
        dispatch({
          type: 'h5Editor/save',
          payload: {
            itemList: list,
          },
        })
        break
      }
    }
  }

  //删除img
  const deleteImg = () => {
    let list = lodash.cloneDeep(itemList)
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == activeItem.id) {
        let imgList = list[i].list
        //找到它当前的index
        let curIndex = imgList.findIndex((obj) => obj.id == imgItem.id)
        imgList.splice(curIndex, 1)
        list[i].list = imgList
        dispatch({
          type: 'h5Editor/save',
          payload: {
            itemList: [...list],
          },
        })
        break
      }
    }
  }

  //改变
  const onValuesChange = useCallback(
    (changedValues) => {
      let list = lodash.cloneDeep(itemList)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        if (item.id == activeItem.id) {
          let imgList = item.list
          //找到它当前的index
          let curIndex = imgList.findIndex((obj) => obj.id == imgItem.id)
          //改变相关属性
          item.list[curIndex] = {
            ...item.list[curIndex],
            ...changedValues,
          }
          //移动完成
          dispatch({
            type: 'h5Editor/save',
            payload: {
              itemList: list,
            },
          })
          break
        }
      }

      if (window.t_changeTimer) {
        window.clearTimeout(window.t_changeTimer)
      }
      window.t_changeTimer = setTimeout(() => {
        dispatch({
          type: 'h5Editor/save',
          payload: {
            itemList: list,
          },
        })
      }, 50)
    },
    [itemList, dispatch, window.t_changeTimer]
  )

  const onGoTypeChange = useCallback(
    (val) => {
      setGoTypeState(val)
      selectItemFromTableRef.current?.resetVal()
    },
    [selectItemFromTableRef]
  )

  const SelectItemFromTableProps = getSelectItemFromTableProps(goTypeState)

  return (
    <div className={styles.imgPanel}>
      <Form form={formRef} {...formItemLayout} onValuesChange={onValuesChange}>
        {/* 图片 */}
        <div>
          <div>
            第<span style={{ fontWeight: 'bold', color: '#000' }}>{tIndex + 1}</span>
            张图片
          </div>
          <Form.Item label="类型" name="itemType" initialValue={imgItem.itemType || 'img'}>
            <Radio.Group>
              <Radio value="img">图片</Radio>
              <Radio value="video">视频</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="图片" name="itemUrl" rules={[{ required: true, message: '请上传图片' }]}>
            <BUpload
              valueType="string"
              type="img"
              api="/web/sys/uploadFile"
              getPostData={(e) => {
                const file = e.file
                const fileExt = file.type.split('/')[1]
                return {
                  fileExt,
                  fileType: 'customIndex',
                }
              }}
              limitSize={3000}
            />
          </Form.Item>
          <Form.Item label="标题" name="title" initialValue={imgItem.title || ''}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item label="介绍" name="desc" initialValue={imgItem.desc || ''}>
            <TextArea placeholder="请输入介绍" style={{ minHeight: 80 }} />
          </Form.Item>
        </div>
        <Form.Item label="详情设置" name="details" initialValue={imgItem.details || []}>
          <EditDetailBtn imgItem={imgItem} />
        </Form.Item>
      </Form>

      {item.list.length == 1 ? null : (
        <Form.Item {...formItemLayoutTail} style={{ marginBottom: 0 }}>
          <Button onClick={deleteImg}>删除</Button>
        </Form.Item>
      )}

      {/* 排序按钮 */}
      {tIndex == 0 ? null : (
        <span
          className={styles.order_btn + ' ' + styles.order_btn_up}
          onClick={() => {
            changeOrder(-1)
          }}
        >
          <ArrowUpOutlined />
        </span>
      )}
      {tIndex == tLength - 1 ? null : (
        <span
          className={styles.order_btn + ' ' + styles.order_btn_down}
          onClick={() => {
            changeOrder(1)
          }}
        >
          <ArrowDownOutlined />
        </span>
      )}
    </div>
  )
}

export default memo(
  connect(({ h5Editor }) => ({
    h5Editor,
  }))(Index)
)
