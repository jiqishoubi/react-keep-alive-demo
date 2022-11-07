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
        margin: `${item?.marginTopBottom || 0}px ${item?.marginLeftRight || 0}px`,
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
          <div
            className={styles.item}
            style={{
              margin: `${item?.marginTopItem || 0}px ${item?.marginLeftRightItem || 0}px ${item?.marginBottomItem || 0}px`,
              padding: `${item?.paddingTopBottomItem || 0}px ${item?.paddingLeftRightItem || 0}px`,
              borderRadius: item?.borderRadiusItem || 0,
              backgroundColor: item?.backgroundColorItem || 'transparent',
            }}
          >
            <div
              className={styles.img_box}
              style={{
                padding: `0 ${item.imgPaddingLeftRight || 0}px`,
                borderRadius: item.borderRadiusImg || 0,
              }}
            >
              <img
                className={styles.img}
                src={obj.imgUrl}
                style={{
                  height: item.imgHeight || 'auto',
                }}
              />
            </div>

            <div>
              {item.haveTitle ? (
                <div
                  className={styles.title}
                  style={{
                    textAlign: item.titleTextAlign || 'left',
                    fontSize: item.titleTextFontSize ? item.titleTextFontSize + 'px' : 'inherit',
                  }}
                >
                  {obj.title}
                </div>
              ) : null}
              {item.isHaveItemDesc ? (
                <div
                  className={styles.desc}
                  style={{
                    margin: `0 ${item.itemDescLeftRightMargin}px`,
                    height: `calc(${item.descLineNum}em + ${item.descLineNum}*8px)`,
                    color: item.itemDescColor || 'inherit',
                    fontSize: item.itemDescFontSize ? item.itemDescFontSize + 'px' : 'inherit',
                  }}
                >
                  {obj.desc}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(ImgCube)
