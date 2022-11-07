import React, { memo, useMemo } from 'react'
import { connect } from 'dva'
import styles from './index.less'

const ImgCube = (props) => {
  const { h5Editor, tItem } = props
  const { itemList } = h5Editor

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == tItem.id)
  }, [itemList, tItem])

  return (
    <div
      className={styles.cube_wrap}
      style={{
        margin: `${item?.marginTop || 0}px ${item?.marginLeftRight || 0}px ${item?.marginBottom || 0}px`,
        padding: `${item?.paddingTopBottom || 0}px ${item?.paddingLeftRight || 0}px`,
        backgroundColor: item?.backgroundColor || 'transparent',
        borderRadius: item?.borderRadius || 0,
      }}
    >
      {item?.list.map((obj, index) => (
        <div
          key={index}
          className={styles.item_wrap}
          style={{
            width: (1 / item.lineNum).toFixed(6) * 100 + '%',
          }}
        >
          <div className={styles.item}>
            <div
              className={styles.img_box}
              style={{
                height: item.itemHeight || 'inherit',
              }}
            >
              <img className={styles.img} src={obj.itemUrl} alt="图片" />
              {obj.itemType == 'video' && <img className={styles.play_icon} src="https://cdn.s.bld365.com/jiesuanbaocardh3c/video_play_icon.png" alt="播放按钮"></img>}
            </div>
            <div className={styles.title}>{obj.title}</div>
            <div
              className={styles.desc}
              style={{
                maxHeight: item.itemDescHeight || null,
                height: Number(item.lineNum) == 1 ? 'inherit' : item.itemDescHeight,
              }}
            >
              {obj.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(ImgCube)
