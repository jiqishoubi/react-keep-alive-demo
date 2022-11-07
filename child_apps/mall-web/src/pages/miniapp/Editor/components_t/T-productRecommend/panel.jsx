import React, { memo, useRef, useMemo } from 'react'
import { connect } from 'dva'
import { Tabs, Button } from 'antd'
import PanelStyle from './components/PanelStyle'
import ImgPanel from './components/ImgPanel'
import SelectProductModal from '../../components/SelectProductModal'
import { defaultItem } from './utils'
import lodash from 'lodash'
import { getUrlParam } from '@/utils/utils'
import api_goods from '@/services/api/goods'
import styles from './index.less'
import styles_com from '../../index.less'
import getNumber from '@/utils/number'

const { TabPane } = Tabs

const Index = (props) => {
  const orgCode = getUrlParam('orgCode')
  const selectProductModalRef = useRef(null)

  const { dispatch, h5Editor } = props
  const { itemList, activeItem } = h5Editor

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  //模态框
  const clickAdd = () => {
    selectProductModalRef.current?.open()
  }
  const selectProductModalOk = (rows) => {
    let list = lodash.cloneDeep(itemList)
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == activeItem.id) {
        list[i].list = [...list[i].list, ...rows]
        break
      }
    }
    dispatch({
      type: 'h5Editor/save',
      payload: {
        itemList: [...list],
      },
    })
  }

  return (
    <div className={styles.panel}>
      <Tabs type="card" tabBarStyle={{ marginBottom: 0 }}>
        <TabPane tab="内容" key="2">
          <div className={styles_com.rightPanel}>
            {item.list.map((obj, index) => {
              return <ImgPanel key={index} {...props} imgItem={obj} tLength={item.list.length} tIndex={index} />
            })}
            <Button onClick={clickAdd}>新增商品</Button>
          </div>
        </TabPane>
        <TabPane tab="样式" key="1">
          <div className={styles_com.rightPanel}>
            <PanelStyle />
          </div>
        </TabPane>
      </Tabs>

      {/* 模态 */}
      <SelectProductModal
        onRef={(e) => {
          selectProductModalRef.current = e
        }}
        api={api_goods.getUIGoodsListApi()}
        params={{ distributeOrgCode: orgCode }}
        pageKey="page"
        pageSizeKey="rows"
        columns={[
          {
            title: '商品名称',
            align: 'center',
            dataIndex: 'goodsName',
          },
          {
            title: '商品类型',
            align: 'center',
            dataIndex: 'goodsTypeName',
          },
          {
            title: '供应商',
            dataIndex: 'supplierName',
            align: 'center',
          },
          {
            title: '价格(元)',
            align: 'center',
            width: 200,
            render: (record) => {
              let min, max
              const { skuList = [] } = record
              skuList.sort((a, b) => getNumber(a.salePriceStr) - getNumber(b.salePriceStr))
              min = skuList[0]?.salePriceStr
              max = skuList[skuList.length - 1]?.salePriceStr
              if (min && max) {
                if (min == max) {
                  return min
                } else {
                  return `${min} - ${max}`
                }
              }
              return '-'
            },
          },
        ]}
        rowKey="goodsCode"
        onOk={selectProductModalOk}
      />
    </div>
  )
}

export default memo(
  connect(({ h5Editor }) => ({
    h5Editor,
  }))(Index)
)
