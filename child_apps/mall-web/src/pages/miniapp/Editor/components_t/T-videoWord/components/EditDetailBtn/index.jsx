import React, { useState, useEffect } from 'react'
import lodash from 'lodash'
import { Modal, Button, Row } from 'antd'
import EditDetailsItem from '../EditDetailsItem'

/**
 * value
 * onChange
 */

const Index = (props) => {
  const { imgItem, value } = props

  const [isShowModal, setIsShowModal] = useState(false)
  const [detailList, setDetailList] = useState([]) //维护自身的 detailList

  //modal
  const openModal = () => {
    setIsShowModal(true)
    setDetailList(lodash.cloneDeep(value))
  }
  const closeModal = () => {
    setIsShowModal(false)
    setDetailList([])
  }
  const clickBtn = () => {
    openModal()
  }
  const onDetailChange = (list) => {
    setDetailList(list)
  }
  const onModalOk = () => {
    closeModal()
    if (props.onChange) {
      props.onChange(detailList)
    }
  }

  return (
    <>
      <Button onClick={clickBtn}>设置详情</Button>

      <Modal key={imgItem.id} visible={isShowModal} width={400} onCancel={closeModal} onOk={onModalOk}>
        <Row type="flex" justify="center">
          <EditDetailsItem value={detailList} onChange={onDetailChange} />
        </Row>
      </Modal>
    </>
  )
}

export default Index
