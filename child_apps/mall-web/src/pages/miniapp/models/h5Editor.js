import router from 'umi/router'
import { message } from 'antd'
import lodash from 'lodash'
import { getCustomPageInfoAjax, updateAjax as updateCustomPageInfoAjax } from '@/pages/cmsManage/customPageMng/services'
import {
  getGoodsInfoAjax,
  //模板
  getUiTemplateInfoAjax,
  //管理
  createUiTemplateDataAjax,
  updateUiTemplateDataAjax,
  //企业
  createUiTemplateDataStaffAjax,
  updateUiTemplateDataStaffAjax,
} from '../services'
import { loginStateKey } from '@/utils/consts'
import { localDB, isArrayFn, randomStrKey, getUrlParam } from '@/utils/utils'
import { deleteTemplateDataSomeProps } from '../Editor/utils_editor.jsx'
import { ConsoleSqlOutlined } from '@ant-design/icons'

//提交的时候 处理itemList
const dealItemListSubmit = (arr) => {
  const arrTemp = arr.map((item) => {
    if (item.type.indexOf('product') > -1) {
      //商品
      const listTemp = item.list.map((itm) => {
        const productId = itm.goodsCode
        return {
          id: randomStrKey(),
          productId,
        }
      })
      return {
        ...item,
        list: listTemp,
      }
    } else {
      return item
    }
  })
  return arrTemp
}

//获取的时候 处理itemList
export const dealItemListGet = (arr) => {
  return new Promise((resolve) => {
    let ajaxArr = [] //请求队列
    let arrTemp = lodash.cloneDeep(arr)

    //方法
    const setArrProduct = (goodsCode, index, idx) => {
      return new Promise(async (resolve) => {
        const productObj = await getGoodsInfoAjax(goodsCode)
        if (productObj) {
          arrTemp[index].list[idx] = productObj
        }
        resolve()
      })
    }

    //调用ajx获取商品详情
    arr.forEach((item, index) => {
      if (item.type.indexOf('product') > -1) {
        //商品
        let listTemp = []
        item.list.forEach((itm, idx) => {
          if (itm.productId) {
            const p = setArrProduct(itm.productId, index, idx)
            ajaxArr.push(p)
          }
        })
      }
    })

    Promise.all(ajaxArr).then((resArr) => {
      resolve(arrTemp)
    })
  })
}

const defaultState = {
  //页面配置
  isPageConfig: false,
  pageConfig: {
    templateDataName: '',
    backgroundColor: '',
    ifDefault: '0',
  },
  // 中间面板
  activeItem: null, //当前选中的item
  itemList: [],
}

const Model = {
  namespace: 'h5Editor',
  /**
   * state
   */
  state: lodash.cloneDeep(defaultState),
  /**
   * 异步
   */
  effects: {
    //获取模板详情
    *getItemList(_, { call, put, select }) {
      //url params
      const options = {
        type: getUrlParam('type'),
        isAdd: getUrlParam('isAdd'),
        isUse: getUrlParam('isUse'), //用来复制的
        id: getUrlParam('id'),
      }

      const h5EditorState = yield select((state) => state.h5Editor)
      const { pageConfig } = h5EditorState

      //没有id
      if (!options.id) {
        yield put({
          type: 'save',
          payload: { isPageConfig: true },
        })
        return
      }

      //请求数据
      let postData = { id: options.id }
      let ajaxFunc = getUiTemplateInfoAjax

      //调查询请求
      if (!ajaxFunc) return
      const template = yield call(ajaxFunc, postData)
      if (!template) return
      console.log('模板', template)

      //请求成功
      const pageConfigResult = {
        templateDataName: template.templateDataName || '',
        ifDefault: template.ifDefault,
      }

      let json
      try {
        json = JSON.parse(template.templateData)
      } catch (e) {}

      if (Object.prototype.toString.call(json) === '[object Object]') {
        //查到了 有模板
        const itemList = yield call(dealItemListGet, json.itemList || [])
        yield put({
          type: 'save',
          payload: {
            isPageConfig: true,
            //页面配置
            pageConfig: lodash.cloneDeep({
              ...pageConfig,
              ...(json.pageConfig || {}),
              ...pageConfigResult,
            }),
            itemList: options.isUse ? deleteTemplateDataSomeProps(itemList) : itemList,
          },
        })
      } else {
        yield put({ type: 'saveDefault' }) //清空 默认
      }
    },

    //保存
    *saveItemList(_, { call, put, select }) {
      //url params
      const options = {
        type: getUrlParam('type'),
        isAdd: getUrlParam('isAdd'),
        isUse: getUrlParam('isUse'), //用来复制的
        id: getUrlParam('id'),
      }

      //模板数据
      const h5EditorState = yield select((state) => state.h5Editor)
      const { pageConfig, itemList } = h5EditorState
      const itemListTemp = dealItemListSubmit(itemList)
      const templateData = {
        pageConfig,
        itemList: itemListTemp,
      }
      console.log('保存的模板数据', templateData)

      //请求数据
      let postData = {}
      let ajaxFunc

      //验证
      if (!templateData.pageConfig.templateDataName) {
        message.warning('模板名称不能为空')
        return
      }
      //验证 end

      //分情况
      if (options.type == 'admin' && options.isAdd == '1') {
        //管理端 新建
        postData = {
          templateDataName: templateData.pageConfig.templateDataName,
          templateDataImg: '123',
          templateData: JSON.stringify(templateData),
        }
        ajaxFunc = createUiTemplateDataAjax
      } else if (options.type == 'admin' && options.isAdd !== '1') {
        //管理端 编辑
        postData = {
          id: options.id,
          templateDataName: templateData.pageConfig.templateDataName,
          templateDataImg: '123',
          templateData: JSON.stringify(templateData),
        }
        ajaxFunc = updateUiTemplateDataAjax
      } else if (options.type == 'company' && options.isAdd == '1') {
        //企业端 新建
        postData = {
          templateCode: '',
          templateDataName: templateData.pageConfig.templateDataName,
          ifDefault: templateData.pageConfig.ifDefault,
          templateDataImg: '123',
          templateData: JSON.stringify(templateData),
        }
        ajaxFunc = createUiTemplateDataStaffAjax
      } else if (options.type == 'company' && options.isAdd !== '1') {
        //企业端 编辑
        postData = {
          id: options.id,
          templateDataName: templateData.pageConfig.templateDataName,
          ifDefault: templateData.pageConfig.ifDefault,
          templateDataImg: '123',
          templateData: JSON.stringify(templateData),
        }
        ajaxFunc = updateUiTemplateDataStaffAjax
      }
      //分情况 end
      //调请求
      const res = yield call(ajaxFunc, postData)
      router.goBack()
    },

    /**
     *
     */
    /**
     * 自定义页面
     */
    //获取这个企业 使用的模板
    *getCustomPage({ payload, success, error }, { call, put, select }) {
      const templateCode = payload
      const postData = { templateCode }
      const res = yield call(getCustomPageInfoAjax, postData)
      const jsonStr = (res && res.code == '0' && res.data && res.data.templateConfig) || '[]'
      try {
        let list = JSON.parse(jsonStr)
        if (isArrayFn(list)) {
          yield put({
            type: 'save',
            payload: {
              itemList: list,
            },
          })
        }
      } catch (e) {}
    },
    //修改
    *updateCustomPage({ payload, success, error }, { call, put, select }) {
      const templateCode = payload
      const h5EditorState = yield select((state) => state.h5Editor)
      const postData = {
        templateCode, // 要修改的模板编码
        templateConfig: JSON.stringify(h5EditorState.itemList),
      }
      const res = yield call(updateCustomPageInfoAjax, postData)

      //成功
      yield put({ type: 'getCustomPage', payload: templateCode })
      if (success) success()
    },
  },
  /**
   * 同步
   */
  reducers: {
    saveDefault(state, { payload }) {
      return lodash.cloneDeep(defaultState)
    },
    save(state, { payload }) {
      const newState = {
        ...state,
        ...payload,
      }
      try {
        return JSON.parse(JSON.stringify(newState))
      } catch (e) {
        return newState
      }
    },
  },
}

export default Model
