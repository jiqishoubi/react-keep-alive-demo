import React from 'react'
import { connect } from 'dva'
import styles from './index.less'

const Text = (props) => {
  const { h5Editor, tItem } = props
  const { itemList } = h5Editor

  const item = itemList.find((obj) => obj.id == tItem.id)

  return (
    <div className={styles.wrap}>
      <div
        className={styles.text_box}
        style={{
          height: item.height || 'inherit',
          fontSize: item.fontSize || null,
          color: item.color || null,
          fontWeight: item.fontWeight || null,
          justifyContent: item.justifyContent || null,
          backgroundColor: item.backgroundColor || 'transparent',
          margin: `${item.marginTopBottom || 0}px ${item.marginLeftRight || 0}px`,
          textIndent: item.isIndent ? '2em' : 'inherit',
        }}
      >
        {item.content}
      </div>
    </div>
  )
}

export default Text
