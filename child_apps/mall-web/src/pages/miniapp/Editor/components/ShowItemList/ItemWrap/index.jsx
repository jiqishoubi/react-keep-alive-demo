/**
 * 给item增加拖拽方法的高姐函数
 */
import React, { memo } from 'react'
import { CloseCircleFilled, UpCircleFilled, DownCircleFilled } from '@ant-design/icons'
import lodash from 'lodash'
import styles from './index.less'

const ItemWrap = (props) => {
  const {
    //组件
    wrappedComponent,
    //其他props
    find,
    ...restProps
  } = props
  const { tItem, templateData } = restProps

  const Com = wrappedComponent

  const h5Editor = lodash.cloneDeep(templateData)

  return (
    <div className={`${styles.item_wrap}`}>
      <Com {...restProps} h5Editor={h5Editor} />
    </div>
  )
}

export default memo(ItemWrap)
