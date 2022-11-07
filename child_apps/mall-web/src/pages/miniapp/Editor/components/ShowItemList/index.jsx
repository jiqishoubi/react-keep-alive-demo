import React, { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { connect } from 'dva'
import { DragSource, DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { getComponent } from '../../components_t/components_map'
import ItemWrap from './ItemWrap'
import { localDB } from '@/utils/utils'
import { dealItemListGet } from '../../../models/h5Editor'
import styles from './index.less'

const List = (props) => {
  const { templateData } = props
  const { pageConfig, itemList } = templateData

  const [showItemList, setShowItemList] = useState([])

  //根据id返回一个source对象
  const find = (id) => {
    let item
    let index
    for (let i = 0; i < itemList.length; i++) {
      let obj = itemList[i]
      if (obj.id == id) {
        item = obj
        index = i
        break
      }
    }
    return {
      item,
      index,
    }
  }

  //获取商品图片
  function getShowItemList() {
    dealItemListGet(itemList || []).then((arr) => {
      if (arr && Array.isArray(arr) && arr.length > 0) {
        setShowItemList(arr)
      }
    })
  }

  useEffect(() => {
    getShowItemList()
  }, [itemList])

  return (
    <div
      className={styles.panel}
      style={{
        backgroundColor: (pageConfig && pageConfig.backgroundColor) || '#f3f3f3',
      }}
    >
      <div className={`${styles.header}`}>小程序</div>

      {/* 内容 */}
      <div className={styles.content} id="itemlist_scroll_content">
        <div
          style={{
            minHeight: 439,
          }}
        >
          {showItemList &&
            showItemList.length > 0 &&
            showItemList.map((obj, index) => {
              const Com = getComponent(obj)
              return (
                <div key={index} onClick={() => props.templateClick && props.templateClick(templateData)}>
                  <ItemWrap
                    key={index}
                    wrappedComponent={Com}
                    tItem={obj}
                    {...props}
                    //一些方法
                    find={find}
                  />
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default memo(List)
