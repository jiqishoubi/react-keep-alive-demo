import React, { memo, useMemo } from 'react'
import { connect } from 'dva'
import styles from './index.less'

const Index = (props) => {
  const { h5Editor, tItem } = props
  const { itemList } = h5Editor

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == tItem.id)
  }, [itemList, tItem])

  return (
    <div className={styles.img_box_wrap}>
      <div
        className={styles.img_box}
        style={{
          height: item?.height || 'auto',
          margin: `${item?.marginTop || 0}px ${item?.marginLeftRight || 0}px ${item?.marginBottom || 0}px`,
          borderRadius: item?.borderRadius || 0,
        }}
      >
        <img className={styles.img} src={item?.imgUrl} />
      </div>
    </div>
  )
}

export default memo(Index)
