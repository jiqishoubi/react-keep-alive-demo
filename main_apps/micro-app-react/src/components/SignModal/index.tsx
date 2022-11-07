import React, { useState } from 'react'
import { Modal } from 'antd'

const Index: React.FC = () => {
  const [visible, setVisile] = useState(false)
  return <Modal visible={visible}></Modal>
}
export default Index
