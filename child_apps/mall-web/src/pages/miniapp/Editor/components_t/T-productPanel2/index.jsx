import React from 'react'
import { connect } from 'dva'
import styles from './index.less'

const Index = (props) => {
  const { h5Editor, tItem } = props
  const { itemList } = h5Editor

  const item = itemList.find((obj) => obj.id == tItem.id)

  return (
    <div
      className={styles.container}
      style={{
        margin: `${item.marginTop || 0}px ${item.marginLeftRight || 0}px ${item.marginBottom || 0}px`,
        borderRadius: (item.borderRadius || 0) + 'px',
        backgroundColor: item.backgroundColor || 'transparent',
      }}
    >
      {item.isHaveTitle && (
        <div className={styles.title}>
          <div
            style={{
              color: item.titleColor || '#fff',
              fontSize: 13,
              fontWeight: 500,
              marginRight: 9,
            }}
          >
            {item.titleText || ''}
          </div>
          {item.isHaveTitleDesc && (
            <div
              style={{
                color: item.titleDescColor || '#fff',
                fontSize: 11,
              }}
            >
              {item.titleDescText || ''}
            </div>
          )}
        </div>
      )}

      <div className={styles.item_wrap}>
        {item.list &&
          item.list.length &&
          item.list.map((obj, index) => {
            return (
              <div key={index} className={styles.item}>
                <div className={styles.desc}>
                  {obj.isInternation && (
                    <img
                      style={{
                        height: 12,
                        marginRight: 4,
                        position: 'relative',
                        top: 0,
                        left: 0,
                      }}
                      src="https://cdn.s.bld365.com/shangyao/lable/xinxuanguoji.png"
                    ></img>
                  )}
                  {obj.title}
                </div>
                <div className={styles.price}>
                  <span>&yen;</span>
                  <span style={{ paddingLeft: 2, fontWeight: 'bold' }}>{obj.price}</span>
                </div>
                <div className={styles.img_box}>
                  <img src={obj.imgUrl} alt=""></img>
                </div>
              </div>
            )
          })}
        <div style={{ width: 12, flex: '0 0 12' }}></div>
      </div>
    </div>
  )
}

export default Index
