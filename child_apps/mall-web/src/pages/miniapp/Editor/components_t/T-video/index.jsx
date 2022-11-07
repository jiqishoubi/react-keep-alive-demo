import React, { useMemo } from 'react'
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
          height: item.height || 'auto',
          margin: `${item.marginTop || 0}px ${item.marginLeftRight || 0}px ${item.marginBottom || 0}px`,
          borderRadius: item.borderRadius || 0,
        }}
      >
        <video className={styles.img} src={item.videoUrl} alt="视频"></video>
        <img className={styles.play_icon} src="https://cdn.s.bld365.com/jiesuanbaocardh3c/video_play_icon.png" alt="播放按钮"></img>
      </div>
    </div>
  )
}

export default Index
