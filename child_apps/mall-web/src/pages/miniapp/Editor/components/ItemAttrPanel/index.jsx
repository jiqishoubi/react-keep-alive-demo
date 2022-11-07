import React, { Fragment, memo, useMemo } from 'react'
import { connect } from 'dva'
import PageConfigPanel from '../../components_t/PageConfigPanel'
import { getComponentPanel, com_map } from '../../components_t/components_map'
import styles from './index.less'
import './index_localName.less'

const Index = (props) => {
  const { h5Editor } = props
  const { isPageConfig, pageConfig, activeItem, itemList } = h5Editor

  let panel = null
  let panel_title = ''
  if (activeItem) {
    let item = itemList.find((obj) => obj.id == activeItem.id)
    if (item) {
      let ComPanel = getComponentPanel(activeItem)
      if (ComPanel) {
        panel = <ComPanel />
      }
    }
    //title
    panel_title = com_map[activeItem.type].title
  }

  return (
    <div className={styles.attr_wrap} id="custom_editor_panel_wrap">
      {isPageConfig ? (
        // 页面配置
        <div className={styles.attr_wrap_content}>
          <div className={styles.panel_title}>页面配置</div>
          <PageConfigPanel />
        </div>
      ) : (
        <Fragment>
          {panel_title ? (
            <div className={styles.attr_wrap_content}>
              {panel_title ? <div className={styles.panel_title}>{panel_title}</div> : null}
              {panel}
            </div>
          ) : null}
        </Fragment>
      )}
    </div>
  )
}

const Index2 = connect(({ h5Editor }) => ({
  h5Editor,
}))(Index)

export default memo(Index2)
