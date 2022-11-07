import React from 'react'
import { Dropdown, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'

const MoreBtn = ({ record, onClick }) => {
  return (
    <Dropdown
      overlay={
        <Menu
          onClick={({ key }) => {
            if (onClick) onClick(key, record)
          }}
        >
          <Menu.Item key="toggleStatus">{record.status == '0' ? '上架' : '下架'}</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  )
}

export default MoreBtn
