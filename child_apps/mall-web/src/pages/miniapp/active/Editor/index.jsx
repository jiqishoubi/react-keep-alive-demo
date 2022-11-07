import React, { memo, useRef, useEffect } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Row, Button, Modal } from 'antd'
import ComponentsList from '@/pages/miniapp/Editor/components/ComponentsList'
import ItemList from '@/pages/miniapp/Editor/components/ItemList'
import ItemAttrPanel from '@/pages/miniapp/Editor/components/ItemAttrPanel'
import GlobalHeaderRight from '@/components/GlobalHeader/RightContent'
import { mConfirm, getUrlParam, getOrgKind } from '@/utils/utils'
//请求
import {
  getTemplateAjax,
  //templateData
  getTemplateDataAjax,
  createTemplateDataAjax,
  updateTemplateDataAjax,
} from '../services'
import { getCustomPageInfoAjax, updateAjax as updateCustomPageAjax } from '@/pages/cmsManage/customPageMng/services'
import styles from '@/pages/miniapp/Editor/index.less'
import '@/pages/miniapp/Editor/index_localName.less'

/**
 * urlParams:
 * isAdd  '1' '0'
 * type
 *
 * type=templateData:
 * orgCode //推广公司
 * templateCode //模板
 * id //样板 如果编辑的话 有id
 *
 * type=customPage:
 * templateCode //模板
 */

const Index = (props) => {
  const {
    //dva
    dispatch,
    h5Editor,
  } = props
  const { activeItem } = h5Editor
  const urlIsAdd = getUrlParam('isAdd')
  const urlType = getUrlParam('type')

  useEffect(() => {
    if (urlType == 'templateData') {
      //样板
      const orgCode = getUrlParam('orgCode')
      let payload
      if (urlIsAdd == '0') {
        //编辑
        payload = {
          ajaxFunc: getTemplateDataAjax,
          postData: {
            id: getUrlParam('id'),
          },
        }
      } else {
        //新建
        payload = {
          ajaxFunc: getTemplateAjax,
          postData: {
            templateCode: getUrlParam('templateCode'),
          },
        }
      }
      dispatch({
        type: 'h5Editor/getItemList',
        payload,
      })
    } else if (urlType == 'customPage') {
      //自定义页面
      const payload = {
        ajaxFunc: getCustomPageInfoAjax,
        postData: {
          templateCode: getUrlParam('templateCode'),
        },
      }
      dispatch({
        type: 'h5Editor/getItemList',
        payload,
      })
    }

    return () => {
      dispatch({ type: 'h5Editor/saveDefault' })
    }
  }, [])

  const goBack = () => {
    getOrgKind().isCompany &&
      mConfirm('确认放弃当前操作，返回页面？', () => {
        router.goBack()
      })

    getOrgKind().isAdmin && router.goBack()
  }

  //保存
  const save = () => {
    mConfirm('确认保存？', async () => {
      const { h5Editor } = props

      if (urlType == 'templateData') {
        //样板
        const orgCode = getUrlParam('orgCode')
        const payload = {
          ajaxFunc: urlIsAdd == '0' ? updateTemplateDataAjax : createTemplateDataAjax, //编辑、创建
          getPostData: (tData) => {
            return {
              orgCode,
              id: urlIsAdd == '0' ? getUrlParam('id') : '',
              templateData: JSON.stringify(tData),
              //pageConfig
              templateDataName: tData.pageConfig.templateDataName,
              ifDefault: tData.pageConfig.ifDefault,
            }
          },
        }
        dispatch({
          type: 'h5Editor/saveItemList',
          payload,
        })
      } else {
        //自定义页面
        const orgCode = getUrlParam('orgCode')
        const payload = {
          ajaxFunc: updateCustomPageAjax,
          getPostData: (tData) => {
            return {
              templateCode: getUrlParam('templateCode'),
              templateConfig: JSON.stringify((tData && tData.itemList) || []),
              remark: JSON.stringify((tData && tData.pageConfig) || {}),
            }
          },
        }
        dispatch({
          type: 'h5Editor/saveItemList',
          payload,
        })
      }
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
    <div className={styles.editor} id="sass_editor_container_id">
      <Row className={styles.header} align="middle" justify="end">
        <div className={styles.left_content}>
          <Button className={`${styles.btn} ${styles.btn_cancel}`} onClick={goBack}>
            返回
          </Button>

          {getOrgKind().isCompany && (
            <Button className={`${styles.btn} ${styles.btn_save}`} type="primary" onClick={save}>
              保存
            </Button>
          )}
        </div>
        <GlobalHeaderRight />
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
