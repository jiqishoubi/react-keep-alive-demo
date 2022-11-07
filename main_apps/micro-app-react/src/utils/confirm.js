import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
export function showConfirm(content = '', onOk = () => {}) {
  Modal.confirm({
    title: '提示',
    icon: <ExclamationCircleOutlined />,
    content,
    onOk,
    onCancel() {},
    cancelText: '取消',
    okText: '确定',
  })
}
