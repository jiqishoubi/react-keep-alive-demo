import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, message, Select, Carousel, Spin } from 'antd'
import { getUserRoles, getGoodsList, putGoodsIntoMarket, checkGoodsExistInCompany } from '@/services/distribution'
import styles from './index.less'
import { router } from 'umi'
import requestw from '@/utils/requestw'

const { Option } = Select

function Index(props) {
  const goodsCode = props.location.query.goodsCode

  const [goodsInfo, setGoodsInfo] = useState({})
  const [getLoading, setGetLoading] = useState(false)
  const [addtokuLoading, setAddtokuLoading] = useState(false)

  /**
   * 请求
   */
  useEffect(() => {
    getGoodsInfo()
  }, [])

  async function getGoodsInfo() {
    let goodsCode = props.location.query.goodsCode
    setGetLoading(true)
    requestw({
      url: '/web/supplier/goods/getGoodsMarketInfo',
      data: { goodsCode },
      isNeedCheckResponse: true,
    })
      .finally(() => setGetLoading(false))
      .then((data) => {
        setGoodsInfo(data ?? {})
      })
  }

  async function addtoku() {
    const postData = {
      goodsCodes: JSON.stringify([goodsCode]),
    }
    setAddtokuLoading(true)
    return requestw({
      url: '/web/supplier/goods/createGoodsBySupplier',
      data: postData,
      isNeedCheckResponse: true,
      errMsg: true,
    })
      .finally(() => {
        setAddtokuLoading(false)
      })
      .then(() => {
        message.success('添加成功')
        setGoodsInfo((obj) => {
          return {
            ...obj,
            goodsExistFromSupplier: true,
          }
        })
      })
  }

  function toGoodList() {
    router.push({
      pathname: '/web/company/goodsmgr/goodsskumgr',
    })
  }

  const contentStyle = {
    width: '350px',
    height: '350px',
    color: '#fff',
    lineHeight: '350px',
    textAlign: 'center',
    background: '#364d79',
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

  const goodsDetail = useMemo(() => {
    return JSON.parse(goodsInfo?.goodsDetail ?? '[]')
  }, [goodsInfo])

  return (
    <>
      <Spin spinning={getLoading}>
        <div className="global_table_box">
          <div style={{ width: '100%', height: '60px', float: 'left' }}></div>
          <div>
            <div className={styles.leftImg}>
              <Carousel autoplay>
                {goodsInfo &&
                  goodsInfo?.goodsImg?.split(',').map((item, ind) => {
                    return (
                      <div key={ind}>
                        <h3 style={contentStyle}>
                          <img style={contentStyle} src={item} />
                        </h3>
                      </div>
                    )
                  })}
              </Carousel>
            </div>
            <div className={styles.rightContent}>
              <div className={styles.title}>{goodsInfo?.goodsName}</div>
              <div className={styles.goodcenter}>
                <div className={styles.jianyi}>
                  <div>
                    <span style={{ color: ' #666666' }}>售价：</span>
                    <span
                      style={{
                        color: '#E12424',
                        fontSize: 22,
                        fontWeight: 'bold',
                      }}
                    >
                      {(goodsInfo?.minSkuPrice ?? 0) / 100}
                    </span>
                    元
                  </div>
                </div>
                <div className={styles.gonghuo}>
                  <span style={{ color: ' #666666' }}>
                    渠道推广费：
                    <span
                      style={{
                        color: '#E12424',
                        fontSize: 22,
                        fontWeight: 'bold',
                      }}
                    >
                      {(goodsInfo?.maxChannelServiceFee ?? 0) / 100}元
                    </span>
                  </span>
                </div>
              </div>
              <div className={styles.goodbottom}>
                {/* <div className={styles.goodbottomitem}>
                <span style={{ float: 'left', color: ' #666666' }}>总销量：</span>
                <div style={{ paddingLeft: 70 }}>
                  <span style={{ color: '#f30' }}>{goodsInfo?.totalSaleCount}</span>件 <span style={{ margin: '0 5px' }}>丨</span> 已有
                  <span style={{ color: '#f30' }}>{goodsInfo?.supplierOnSaleCount}</span>
                  位分销商上架
                </div>
              </div> */}
                {/* <div className={styles.goodbottomitem}>
                <span style={{ float: 'left', color: ' #666666' }}>总库存：</span>
                <div style={{ paddingLeft: 71 }}>{goodsInfo?.ifStock == '0' ? '不限量' : goodsInfo?.totalStockCount ? goodsInfo?.totalStockCount + '件' : '0' + '件'} </div>
              </div> */}
              </div>
              {goodsInfo && goodsInfo?.skuList?.length > 1 ? (
                <div className={styles.skubox}>
                  {goodsInfo &&
                    goodsInfo?.skuList?.map((item, ind) => {
                      return (
                        <div key={ind} style={{ marginLeft: 10, marginTop: 10 }}>
                          {item.goodsPropertyStr}
                          <span style={{ marginLeft: 10 }}>{item.salePriceStr}元</span>
                          <span style={{ marginLeft: 40 }}>{goodsInfo?.ifStock == '0' ? '不限量' : item.stockCount + '件可售'}</span>
                        </div>
                      )
                    })}
                </div>
              ) : (
                ''
              )}

              <div className={styles.addgoodsbtnbox}>
                {!goodsInfo?.goodsExistFromSupplier && (
                  <Button className={styles.addgoodsbtn} onClick={addtoku} loading={addtokuLoading}>
                    添加到商品管理
                  </Button>
                )}
              </div>
            </div>
            {/* <div className={styles.shopinformation}>
            <div className={styles.shoplogo}>
              <img
                style={{ width: '100%', height: '100%' }}
                src={goodsInfo?.organizationDTO?.attrMap?.org_icon}
              />
            </div>
            <div className={styles.shopcontent}>
              <div className={styles.shoptitle}>
                {goodsInfo?.organizationDTO?.orgName}
                <img
                  style={{
                    width: 80,
                    height: 20,
                    marginLeft: 20,
                    marginTop: -5,
                  }}
                  src={'https://cdn.s.bld365.com/shopicon/baozhengjin.png'}
                />
                <img
                  style={{
                    width: 80,
                    height: 20,
                    marginLeft: 20,
                    marginTop: -5,
                  }}
                  src={'https://cdn.s.bld365.com/shopicon/zizhi.png'}
                />
              </div>
              <div className={styles.shopdesc}>
                {goodsInfo?.organizationDTO?.attrMap?.org_desc}
              </div>
            </div>
          </div> */}
            <div className={styles.goodsdetail}>
              {goodsDetail &&
                goodsDetail?.map((item, ind) => {
                  if (item.type == 2) {
                    return <img key={ind} className={styles.gooddetailimg} src={item.value} />
                  } else if (item.type == 1) {
                    return (
                      <div key={ind} style={{ textAlign: 'center' }}>
                        {item.value}
                      </div>
                    )
                  }
                })}
            </div>
          </div>
        </div>
      </Spin>
    </>
  )
}
export default Index
