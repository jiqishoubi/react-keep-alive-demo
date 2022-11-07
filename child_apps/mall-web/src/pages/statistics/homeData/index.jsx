import { Col, Row, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import SCTemplateMyCom from './SCTemplateMyCom'
import * as echarts from 'echarts'
import { getOrgHotSaleGoodsList, getSupplierHotSaleGoodsList, getTradeCurveList, getTradeSaleNum } from './service'
import { router } from 'umi'
import styles from './index.less'
import { haveCtrlElementRight } from '@/utils/utils'
import './index_localName.less'

const imgList = ['https://cdn.s.bld365.com/saas/pc/ranking/top1.png', 'https://cdn.s.bld365.com/saas/pc/ranking/top2.png', 'https://cdn.s.bld365.com/saas/pc/ranking/top3.png']
const shopColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    align: 'center',
    render: (e) => {
      if (Number(e) < 4) {
        return <img style={{ width: 28, height: 40 }} src={imgList[Number(e) - 1]} alt="" />
      } else {
        return <div>NO.{e}</div>
      }
    },
  },
  {
    dataIndex: 'goodsName',
    title: '商品名称',
    align: 'center',
  },
  {
    dataIndex: 'goodsSaleCount',
    title: '支付件数',
    align: 'center',
  },
]

const supplierColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    align: 'center',
    render: (e) => {
      if (Number(e) < 4) {
        return <img style={{ width: 28, height: 40 }} src={imgList[Number(e) - 1]} alt="" />
      } else {
        return <div>NO.{e}</div>
      }
    },
  },
  {
    dataIndex: 'supplierOrgName',
    title: '供应商',
    align: 'center',
  },
  {
    dataIndex: 'goodsName',
    title: '商品名称',
    align: 'center',
  },

  {
    dataIndex: 'goodsSaleCount',
    title: '支付件数',
    align: 'center',
  },
]

/**
 *
 * @returns
 */
const Index = () => {
  const { Option } = Select
  const [titleData, setTitleData] = useState({})
  const [shopData, setShopData] = useState([])
  const [supplierData, setSupplierData] = useState([])
  let myChart

  const option = {
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      formatter: (params) => {
        let data = params[0]
        let marker = ''
        // "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:rgba(4, 130, 252, 1);'/>";
        return `${data.name}<br/>  ${data.value}`
      },
    },
    grid: {
      top: '5%',
      left: '5%',
      right: '3%',
      bottom: '8%',
      // containLabel: true
    },
    legend: {
      show: true,
      right: '8%',
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(151, 151, 151, 1)',
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000',
          },
          rotate: 45,
        },
        axisTick: {
          show: false,
        },
        data: [],
      },
    ],

    yAxis: [
      {
        type: 'value',
        min: 0,
        splitNumber: 4,
        minInterval: 1,
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(151, 151, 151, 1)',
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000',
          },
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: 'rgba(151, 151, 151, 1)',
          },
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(226, 232, 236, 1)',
            type: 'dashed',
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#fff', 'rgba(245, 246, 250, 1)'],
          },
        },
      },
    ],
    series: [
      {
        name: '',
        type: 'line',
        // smooth: true, //是否平滑
        showAllSymbol: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: {
          normal: {
            width: 2,
            color: '#06C25B',
            shadowColor: 'rgba(6, 194, 91, .73)',
            shadowBlur: 2,
            shadowOffsetY: 1,
          },
        },
        label: {
          show: false,
          position: 'top',
          textStyle: {
            color: '#48B3FF',
          },
        },

        itemStyle: {
          color: '#FFF',
          borderColor: '#06C25B',
          borderWidth: 2,
        },
        tooltip: {
          show: true,
        },
        data: [],
      },
    ],
  }

  useEffect(() => {
    getChartData()
    getTradeSaleNum_()
    getOrgHotSaleGoodsList_()
    getSupplierHotSaleGoodsList_()
  }, [])

  //商品数据
  const getChartData = async (e) => {
    myChart = echarts.init(document.getElementById('thresholdReport_chart'))
    const postData = { beforeDays: e || 7 }
    let data = (await getTradeCurveList(postData)) || []
    let key = []
    let value = []
    data.map((r) => {
      key.push(r.payDate)
      value.push(r.tradeCount)
    })
    option.xAxis[0].data = key
    option.series[0].data = value
    myChart.setOption(option)
  }
  //获取订单数据以及订单提醒 getTradeSaleNum
  const getTradeSaleNum_ = async () => {
    const data = await getTradeSaleNum()
    setTitleData(data)
  }
  //获取店铺热售商品
  const getOrgHotSaleGoodsList_ = async () => {
    let data = await getOrgHotSaleGoodsList()
    data.map((r, index) => {
      r['index'] = index + 1
    })
    setShopData(data)
  }

  // 获取供货商热售商品
  const getSupplierHotSaleGoodsList_ = async () => {
    let data = await getSupplierHotSaleGoodsList()
    data.map((r, index) => {
      r['index'] = index + 1
    })
    setSupplierData(data)
  }
  //跳转其他页面
  const goUrl = (url) => {
    router.push(url)
  }

  //时间改变 selectChange
  const selectChange = async (e) => {
    getChartData(e)
  }

  return (
    <div style={{ background: '#F0F0F0' }}>
      {haveCtrlElementRight('shoye-shop') && (
        <div className={styles.shop}>
          <div className={styles.shop_title}>店铺概况</div>
          <Row gutter={[15, 5]} style={{ marginLeft: 40 }} wrap="true">
            {haveCtrlElementRight('shoye-shop-sale') && (
              <Col span={5} flex="true">
                <div className={styles.spread_div_sell}>
                  <div className={styles.spread_div1}>
                    <div className={styles.spread_div2}>今日销售额:</div>
                    {titleData.tradeFeeStr || '0'} <span style={{ fontSize: '12px' }}>元</span>
                  </div>
                  <div className={styles.spread_div2}>累计销售额:{titleData.totalTradeFeeStr || '0'}元</div>
                </div>
              </Col>
            )}
            {haveCtrlElementRight('shoye-shop-order') && (
              <Col span={5} flex="true" offset={1}>
                <div className={styles.spread_div_b}>
                  <div className={styles.spread_div1}>
                    <div className={styles.spread_div2}>今日订单数:</div>
                    {titleData.tradeCount || '0'} <span style={{ fontSize: '12px' }}>件</span>
                  </div>
                  <div className={styles.spread_div2}>累计订单数:{titleData.totalTradeCount || '0'}</div>
                </div>
              </Col>
            )}
            {haveCtrlElementRight('shoye-shop-distribute') && (
              <Col span={5} flex="true" offset={1}>
                <div className={styles.spread_div_c}>
                  <div className={styles.spread_div1}>
                    <div className={styles.spread_div2}>今日新增推广人:</div>
                    {titleData.distributeCount || '0'} <span style={{ fontSize: '12px' }}>人</span>
                  </div>
                  <div className={styles.spread_div2}>累计推广人：{titleData.totalDistributeCount || '0'} </div>
                </div>
              </Col>
            )}
            {haveCtrlElementRight('shoye-shop-doctor') && (
              <Col span={5} flex="true" offset={1}>
                <div className={styles.spread_div_d}>
                  <div className={styles.spread_div1}>
                    <div className={styles.spread_div2}>今日新增合伙人:</div>
                    {titleData.salePersonCount || '0'} <span style={{ fontSize: '12px' }}>人</span>
                  </div>
                  <div className={styles.spread_div2}>累计合伙人：{titleData.totalSalePersonCount || '0'} </div>
                </div>
              </Col>
            )}
          </Row>
        </div>
      )}

      <div className="home-center">
        <div style={{ width: '50%' }}>
          {haveCtrlElementRight('shoye-trade') && (
            <div className="homeData-order">
              <div className="homeData-order-title">
                <div className={styles.shop_title}>订单提醒</div>
                <a onClick={() => goUrl('/web/supplier/trade/trademgr')}>{'去处理>'}</a>
              </div>
              <div className="homeData-order-center">
                {haveCtrlElementRight('shoye-trade-express') && (
                  <div className={styles.order_center}>
                    <div className={styles.order_center_left}>{titleData.tradeExpressCount || '0'}</div>
                    <div style={{ color: '#666666' }}> 待发货订单</div>
                  </div>
                )}
                {haveCtrlElementRight('shoye-trade-return') && (
                  <div className={styles.order_center}>
                    <div className={styles.order_center_right}>{titleData.tradeAuditCount || '0'}</div>
                    <div style={{ color: '#666666' }}>待退款订单</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {haveCtrlElementRight('shoye-trade') && haveCtrlElementRight('shoye-list') && <div style={{ height: 20, background: '#F0F0F0', width: '100%' }} />}

          {haveCtrlElementRight('shoye-list') && (
            <div className="homeData-order">
              <div className="homeData-order-title">
                <div className={styles.shop_title}>常用功能</div>
              </div>
              <div className="homeDat-function">
                {haveCtrlElementRight('shoye-list-trade') && (
                  <div className="homeDat-function-item" onClick={() => goUrl('/web/supplier/trade/trademgr')}>
                    <img className={styles.home_img} alt="" src="https://cdn.s.bld365.com/saas/pc/nav/dingdan.png" />
                    订单管理
                  </div>
                )}
                {haveCtrlElementRight('shoye-list-goods') && (
                  <div className="homeDat-function-item" onClick={() => goUrl('/web/supplier/goods/goodsmgr')}>
                    <img className={styles.home_img} alt="" src="https://cdn.s.bld365.com/saas/pc/nav/shangpin.png" />
                    商品管理
                  </div>
                )}
                {haveCtrlElementRight('shoye-list-active') && (
                  <div className="homeDat-function-item" onClick={() => goUrl('/web/supplier/active/activemgr')}>
                    <img className={styles.home_img} alt="" src="https://cdn.s.bld365.com/saas/pc/nav/yingxiao.png" />
                    活动管理
                  </div>
                )}
                {haveCtrlElementRight('shoye-list-template') && (
                  <div className="homeDat-function-item" onClick={() => goUrl('/web/supplier/template/templatemgr')}>
                    <img className={styles.home_img} alt="" src="https://cdn.s.bld365.com/saas/pc/nav/shouye.png" />
                    首页模板
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 20, background: '#F0F0F0', height: 490 }} />

        {haveCtrlElementRight('shoye-tradeTotal') && (
          <div style={{ width: '50%', height: 440 }}>
            <div className="home-echart">
              <div className={styles.shop_title}>
                订单统计
                <span style={{ color: '#7f7878', marginLeft: 10, fontSize: 13 }}>(支付订单)</span>
              </div>

              <Select onChange={selectChange} defaultValue="7" style={{ width: 100 }}>
                <Option value="7">近七日</Option>
                <Option value="15">近十五日</Option>
                <Option value="30">近一月</Option>
              </Select>
            </div>
            <div id="thresholdReport_chart" style={{ width: '100%', height: 400 }} />
          </div>
        )}
      </div>

      <div className="home-center">
        {haveCtrlElementRight('shoye-mallGoods') && (
          <div style={{ width: '50%', borderRight: '10px solid #F0F0F0' }}>
            <div className={styles.shop_title} style={{ margin: '20px 20px' }}>
              本店热销商品
            </div>
            <Table className="home_data_table" bordered={true} pagination={false} columns={shopColumns} dataSource={shopData} />
          </div>
        )}

        {haveCtrlElementRight('shoye-supplierGoods') && (
          <div style={{ width: '50%', borderLeft: '10px solid #F0F0F0' }}>
            <div className={styles.shop_title} style={{ margin: '20px 20px' }}>
              供应商热销商品
            </div>
            <Table className="home_data_table" bordered={true} pagination={false} columns={supplierColumns} dataSource={supplierData} />
          </div>
        )}
      </div>

      {/* <div style={{ marginTop: '20px', background: '#FFFFFF' }}>
        <div className="homeData-order-title" style={{ margin: '20px 20px 0 20px', paddingTop: 30 }}>
          <div className={styles.shop_title}>分组模板</div>
          <a onClick={() => goUrl('/web/supplier/cmsmgr/customindexmng')}>{'去看看>'}</a>
        </div>
        <SCTemplateMyCom ban={true} />
      </div> */}
    </div>
  )
}
export default Index
