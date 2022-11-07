import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'

const Item = (props) => {
  const { item, columns } = props

  return (
    <div className={styles.list_item}>
      <div style={{ flex: '1 0 0' }}>
        <div className={styles.item_td_wrap}>
          {columns &&
            columns.length &&
            columns.map((obj, index) => (
              <div key={index} className={styles.item_td} style={{ width: obj.width || 'auto' }}>
                {item[obj.dataIndex]}
              </div>
            ))}
        </div>
      </div>
      {/* { */}
      {/* // item.isnoDelete?null: */}
      <div className={styles.cancel_btn} onClick={props.onDelete}>
        <DeleteOutlined />
      </div>
      {/* } */}
    </div>
  )
}

export default Item
