import React, { memo, useMemo } from 'react'
import { connect } from 'dva'
import lodash from 'lodash'
import { Tabs, Button } from 'antd'
import PanelStyle from './components/PanelStyle'
import ItemStyle from './components/ItemStyle'
import ImgPanel from './components/ImgPanel'
import { defaultItem } from './utils'
import styles from './index.less'
import styles_com from '../../index.less'

const { TabPane } = Tabs

const Index = (props) => {
  const { dispatch, h5Editor } = props
  const { itemList, activeItem } = h5Editor

  const item = useMemo(() => {
    return itemList.find((obj) => obj.id == activeItem.id)
  }, [itemList, activeItem])

  //新增图片
  const addImg = () => {
    let list = lodash.cloneDeep(itemList)
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == activeItem.id) {
        list[i].list.push(defaultItem().list[0])
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
        <TabPane tab="常规" key="1">
          <div className={styles_com.rightPanel}>
            {item.list.map((obj, index) => (
              <ImgPanel key={index} {...props} imgItem={obj} tLength={item.list.length} tIndex={index} />
            ))}
            <Button onClick={addImg}>新增</Button>
          </div>
        </TabPane>
        <TabPane tab="面板样式" key="2">
          <div className={styles_com.rightPanel}>
            <PanelStyle />
          </div>
        </TabPane>
        <TabPane tab="子元素样式" key="3">
          <div className={styles_com.rightPanel}>
            <ItemStyle />
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default memo(
  connect(({ h5Editor }) => ({
    h5Editor,
  }))(Index)
)
