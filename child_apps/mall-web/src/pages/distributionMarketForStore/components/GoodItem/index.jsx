import React, { useState } from 'react'
import { router } from 'umi'
import Button from 'antd/es/button'
import styles from './index.less'

/**
 * 总余额统计
 * @param {object} props
 * @param {Array<{
 *  title:string,
 *  value:string,
 * }> props.items
 */
function GoodItem(props) {
  const { items = [], style = {} } = props
  const [hover, setHover] = useState(false)
  const [hoverKey, setHoverKey] = useState(-1)

  const styleBox = {
    width: '18.5%',
    minWidth: '276px',
    float: 'left',
    margin: '10px 10px',
    borderRadius: '12px',
    overflow: 'hidden',
  }

  // function itemOnClick(item) {
  //   router.push({
  //     pathname: '/web/supplier/goods/suppliergoodsmgr/detail',
  //     query: {
  //       goodsCode: item.goodsCode,
  //     },
  //   })
  // }

  const onHover = (e) => {
    setHoverKey(e)
    setHover(true)
  }

  const onNoHover = () => {
    setHoverKey(-1)
    setHover(false)
  }
  const getPrice = (item) => {
    let name, price
    item &&
      item.skuList &&
      item.skuList.length &&
      item.skuList.map((r) => {
        if (r.salePriceStr === item.minSalePriceStr) {
          name = r.costPriceTypeName || '划线价'
          price = r.costPriceStr || '0.00'
        }
      })
    return { name, price }
  }

  return (
    <div style={style}>
      <div style={{ marginBottom: 10, display: 'flex', flexWrap: 'wrap' }}>
        {items &&
          items.length > 0 &&
          items.map((item, index) => {
            const showPrice = item.minSkuPriceStr == item.maxSkuPriceStr ? item.minSkuPriceStr : `${item.minSkuPriceStr} - ${item.maxSkuPriceStr}`
            return (
              <div key={index} className={hover && index === hoverKey ? 'supper_hover' : 'supper_nohover'} style={styleBox} onMouseEnter={() => onHover(index)} onMouseLeave={onNoHover}>
                <div>
                  <img style={{ width: '100%', height: 276 }} src={item.goodsImg && item.goodsImg.split(',')[0]} alt="" />
                  <div
                    style={{
                      fontSize: 16,
                      padding: '6px 6px',
                      width: '100%',
                      height: '30px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: ' #262626',
                      fontWeight: 'bold',
                    }}
                    title={item.goodsName}
                  >
                    {item.goodsName}
                  </div>
                  {/* 供应商 */}
                  <div className={styles.orgName}>供应商：{item.orgName}</div>
                  <div
                    style={{
                      marginTop: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    <div
                      style={{
                        marginLeft: 6,
                        marginRight: 6,
                        marginBottom: 10,
                        color: '#666666',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ color: '#666666', marginRight: 30 }}>
                        售价：
                        <span
                          style={{
                            color: '#E12424',
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}
                        >
                          &yen;{showPrice}元
                        </span>
                      </div>
                    </div>
                    <div style={{ marginLeft: 6, color: '#666666' }}>
                      渠道推广费：
                      <span style={{ color: '#E12424' }}>&yen;{item.channelServiceFeeStr}</span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 18,
                  }}
                >
                  {item.drugstoreCount == 1 ? (
                    <Button
                      style={{
                        borderRadius: 16,
                        marginRight: 10,
                        width: 200,
                        background: '#F2F2F2',
                        color: '#262626',
                        marginBottom: 16,
                        boxShadow: '0px 2px 0px 0px #D8D8D8',
                        fontWeight: 'bold',
                      }}
                      size="middle"
                    >
                      已添加
                    </Button>
                  ) : (
                    <Button
                      onClick={() => props.goodClick(item, index)}
                      style={{
                        borderRadius: 16,
                        marginRight: 10,
                        width: 200,
                        marginBottom: 16,
                        fontWeight: 'bold',
                      }}
                      type="primary"
                      size="middle"
                    >
                      添加到药房
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default GoodItem
