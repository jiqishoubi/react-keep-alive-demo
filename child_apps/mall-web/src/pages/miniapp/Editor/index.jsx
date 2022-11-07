import React, { memo, useRef, useEffect } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Row, Button, Modal } from 'antd'
import ComponentsList from './components/ComponentsList'
import ItemList from './components/ItemList'
import ItemAttrPanel from './components/ItemAttrPanel'
import GlobalHeaderRight from '@/components/GlobalHeader/RightContent'
import { mConfirm, getUrlParam } from '@/utils/utils'
//请求
import {
  getTemplateAjax,
  //templateData
  getTemplateDataAjax,
  createTemplateDataAjax,
  updateTemplateDataAjax,
} from '../services'
import { getCustomPageInfoAjax, updateAjax as updateCustomPageAjax } from '@/pages/cmsManage/customPageMng/services'
import styles from './index.less'
import './index_localName.less'

/**
 * urlParams
 * @param {'admin'|'company'} type
 */

/**
 *
 */

const Index = (props) => {
  const {
    //dva
    dispatch,
    h5Editor,
  } = props
  const { activeItem } = h5Editor

  useEffect(() => {
    dispatch({ type: 'h5Editor/getItemList' })

    return () => {
      dispatch({ type: 'h5Editor/saveDefault' })
    }
  }, [])

  const goBack = () => {
    mConfirm('确认放弃当前操作，返回页面？', () => {
      router.goBack()
    })
  }

  //保存
  const save = () => {
    mConfirm('确认保存？', async () => {
      dispatch({ type: 'h5Editor/saveItemList' })
    })
  }

  //拖拽 点击
  const onDropEnd = (
    list
    // fromIndex, toIndex
  ) => {
    dispatch({
      type: 'h5Editor/save',
      payload: {
        itemList: [...list],
      },
    })
  }

  const onDelete = (list) => {
    dispatch({
      type: 'h5Editor/save',
      payload: {
        itemList: [...list],
      },
    })
  }

  const onClick = (tItem) => {
    if (tItem.id !== (activeItem && activeItem.id ? activeItem.id : '')) {
      dispatch({
        type: 'h5Editor/save',
        payload: {
          isPageConfig: false,
          activeItem: JSON.parse(JSON.stringify(tItem)),
        },
      })
    }
  }

  return (
    <div className={styles.editor} id="saas_editor_container_id">
      <Row className={styles.header} align="middle" justify="end">
        <div className={styles.left_content}>
          <Button className={`${styles.btn} ${styles.btn_cancel}`} onClick={goBack}>
            返回
          </Button>
          <Button className={`${styles.btn} ${styles.btn_save}`} type="primary" onClick={save}>
            保存
          </Button>
        </div>
        {/* <GlobalHeaderRight /> */}
      </Row>

      {/* 左侧组件列表 */}
      <ComponentsList />

      {/* 中间展示面板 */}
      <ItemList onDropEnd={onDropEnd} onDelete={onDelete} onClick={onClick} />

      {/* 右侧属性面板 */}
      <ItemAttrPanel />
    </div>
  )
}

export default memo(
  connect(({ h5Editor }) => ({
    h5Editor,
  }))(Index)
)
