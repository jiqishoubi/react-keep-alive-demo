import React, { useMemo, useCallback } from 'react'
import { connect } from 'dva'
import { Popover, Tabs } from 'antd'
import { com_map } from '../../components_t/components_map'
import styles from './index.less'
import './index_localName.less'

const { TabPane } = Tabs

const GroupMap = {
  unit: '组件',
  product: '商品',
}

const Index = (props) => {
  const { dispatch, h5Editor } = props
  const { itemList, activeItem } = h5Editor

  const addItem = useCallback(
    (com) => {
      let item = com.createItem()
      let list = [...itemList]
      list.push(item)
      dispatch({
        type: 'h5Editor/save',
        payload: {
          itemList: [...list],
        },
      })
    },
    [itemList, dispatch]
  )

  //处理组件列表
  const comArr = useMemo(() => {
    let arr = [] // { group:'unit',list:[] }
    Object.keys(com_map).forEach((keyStr, index) => {
      const com = com_map[keyStr]
      const groupIndex = arr.findIndex((group) => group.group == com.group)
      if (groupIndex > -1) {
        arr[groupIndex].list.push(com)
      } else {
        arr.push({
          group: com.group, //unit
          groupName: GroupMap[com.group], //组件
          list: [com],
        })
      }
    })
    return arr
  }, [])

  return (
    <div id="custom_editor_left">
      <Tabs tabPosition="left">
        {comArr.map((group) => {
          return (
            <TabPane key={group.group} tab={group.groupName}>
              {group.list &&
                group.list.length > 0 &&
                group.list.map((com, idx) => {
                  return (
                    <div
                      key={idx}
                      className={styles.comItem}
                      onClick={() => {
                        addItem(com)
                      }}
                    >
                      {com.title}
                    </div>
                  )
                })}
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}

export default connect(({ h5Editor }) => ({
  h5Editor,
}))(Index)
