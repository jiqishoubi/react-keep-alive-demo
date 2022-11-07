import router from 'umi/router'
import { message } from 'antd'
import _ from 'lodash'
import { getCustomPageInfoAjax, updateAjax as updateCustomPageInfoAjax } from '@/pages/cmsManage/customPageMng/services'
import { getGoodsInfoAjax } from '../services'
import { loginStateKey } from '@/utils/consts'
import { localDB, isArrayFn, randomStrKey } from '@/utils/utils'

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
const dealItemListGet = (arr) => {
  return new Promise((resolve) => {
    let ajaxArr = [] //请求队列
    let arrTemp = _.cloneDeep(arr)

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
  state: _.cloneDeep(defaultState),
  /**
   * 异步
   */
  effects: {
    //获取模板
    *getItemList({ payload, success, error }, { call, put, select }) {
      const h5EditorState = yield select((state) => state.h5Editor)
      const { pageConfig } = h5EditorState
      //ajaxFunc, postData
      const { ajaxFunc, postData } = payload
      const result = yield call(ajaxFunc, postData)
      if (!result) {
        return
      }

      //成功
      const jsonStr = result.templateData
      let remark = {}
      try {
        remark = remark && JSON.parse(result.remark)
      } catch (e) {}
      const pageConfigAjax = {
        backgroundColor: (remark && remark.backgroundColor) || '',
        templateDataName: (remark && remark.templateDataName) || result.templateName,
        ifDefault: result.ifDefault,
      }
      let json
      try {
        json = JSON.parse(jsonStr)
      } catch (e) {}
      console.log('模板', json)
      if (Object.prototype.toString.call(json) === '[object Object]') {
        const itemList = yield call(dealItemListGet, json.itemList || [])
        yield put({
          type: 'save',
          payload: {
            isPageConfig: true,
            pageConfig: _.cloneDeep({
              ...pageConfig,
              ...(json.pageConfig || {}),
              ...pageConfigAjax,
            }),
            itemList,
          },
        })
      } else if (isArrayFn(json)) {
        const itemList = yield call(dealItemListGet, json)
        yield put({
          type: 'save',
          payload: {
            pageConfig: _.cloneDeep({
              ...pageConfig,
              ...pageConfigAjax,
            }),
            itemList,
          },
        })
      } else {
        yield put({ type: 'saveDefault' }) //清空 默认
      }
    },

    //保存
    *saveItemList({ payload, success, error }, { call, put, select }) {
      //ajaxFunc
      const { ajaxFunc, getPostData } = payload
      const h5EditorState = yield select((state) => state.h5Editor)
      const { pageConfig, itemList } = h5EditorState

      const itemListTemp = dealItemListSubmit(itemList)
      const templateData = {
        pageConfig,
        itemList: itemListTemp,
      }

      if (!window.isProd) console.log('自定义首页', itemListTemp)
      if (!window.isProd) console.log('自定义首页json', JSON.stringify(templateData))

      const postData = getPostData(templateData)
      const res = yield call(ajaxFunc, postData)
      message.success('操作成功')
      router.goBack()
      // window.close()
    },

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
      return _.cloneDeep(defaultState)
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
