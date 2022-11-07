import React, { memo, useEffect, useMemo, useState } from 'react'
import { connect } from 'dva'
import { getGoodImg } from '../../utils_editor'
import styles from './index.less'

const Index = (props) => {
  const { tItem } = props
  const [viceSkuArray, setViceSkuArray] = useState([])
  useEffect(() => {
    const skuArray = []
    tItem.list.map((obj, index) => {
      let viceSkuList = (obj && obj.skuList && obj.skuList.length && JSON.parse(JSON.stringify(obj.skuList))) || []
      viceSkuList.length &&
        viceSkuList.sort((a, b) => {
          return a.salePrice - b.salePrice
        })
      skuArray.push(viceSkuList)
    })
    setViceSkuArray(skuArray)
  }, [tItem.list])

  return (
    <div
      className={styles.cube_wrap}
      style={{
        margin: `${tItem.marginTop}px ${tItem.marginLeftRight}px ${tItem.marginBottom}px`,
        borderRadius: tItem.borderRadius || 0,
        backgroundColor: tItem.backgroundColor || '#fff',
      }}
    >
      {tItem.isHaveTitle && (
        <div
          className={styles.title_wrap}
          style={{
            margin: `0px ${tItem.titleMarginLeftRight || 0}px`,
          }}
        >
          <div className={styles.title} style={{ color: tItem.titleColor }}>
            {tItem.titleText || ''}
          </div>
          {tItem.isHaveTitleDesc && (
            <div className={styles.desc} style={{ color: tItem.titleDescColor }}>
              {tItem.titleDescText || ''}
            </div>
          )}
        </div>
      )}

      {/* 商品 */}
      <div className={styles.item_wrap}>
        {tItem.list.map((obj, index) => (
          <div
            key={index}
            className={`${styles.item}${tItem.isItemHaveBottomBorder ? ` ${styles.bottomBorder}` : ''}`}
            style={{
              width: (1 / tItem.lineNum).toFixed(6) * 100 + '%',
              margin: `${tItem.itemMarginTop || 0}px ${tItem.itemMarginLeftRight || 0}px ${tItem.itemMarginBottom || 0}px`,
              padding: `${tItem.itemPaddingTopBottom || 0}px ${tItem.itemPaddingLeftRight || 0}px`,
              backgroundColor: tItem.itemBackgroundColor || 'transparent',
              borderRadius: tItem.itemBorderRadius || 0,
            }}
          >
            <div
              className={styles.img_box}
              style={{
                borderRadius: tItem.imgBorderRadius || 0,
              }}
            >
              <img className={styles.img} src={getGoodImg((obj && obj.goodsImg) || '')} />
            </div>
            <div className={styles.img_content}>
              <div className={styles.img_title}>{obj && obj.goodsName}</div>
              {obj && obj.goodsDesc ? <div className={styles.img_desc}>{(obj && obj.goodsDesc) || ''}</div> : null}
              {/* <div className={styles.price_wrap}>
                <div className={styles.price}>
                  <span className={styles.price_1}>
                    <span>&yen;</span>
                    {obj && obj.minSalePrice ? obj.minSalePrice / 100 : 0}
                  </span>
                  <span className={styles.priceType} style={{ fontSize: 2 }}>
                    {viceSkuArray && viceSkuArray.length && viceSkuArray[index] && viceSkuArray[index][0]?.costPriceStr && (
                      <>
                        <span>&yen;</span>
                        {viceSkuArray[index][0]?.costPriceTypeName && false ? viceSkuArray[index][0]?.costPriceTypeName + viceSkuArray[index][0]?.costPriceStr : viceSkuArray[index][0]?.costPriceStr}
                      </>
                    )}
                  </span>
                </div>
                <div className={styles.price_btn}>点击购买</div>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(Index)
