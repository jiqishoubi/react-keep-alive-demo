import lodash from 'lodash'
import { getUrlParam } from '@/utils/utils'
import {
  SelectItemFromTablePropsGoodsClass,
  SelectItemFromTablePropsGoodsType,
  SelectItemFromTablePropsGoodsDetail,
  SelectItemFromTablePropsCustomPage,
  SelectItemFromTablePropsCustomArticle,
} from './SelectItemFromTableProps'

export const defaultImg = 'https://filedown.bld365.com/bld_mall/image/customIndex/20201221/IMG2020122118e5fb00024.jpeg'

export const onValuesChange = ({ changedValues, allValues, itemList, activeItem, dispatch }) => {
  //处理
  const changedValuesTemp = {
    ...changedValues,
  }

  //修改相关属性
  let list = lodash.cloneDeep(itemList)
  for (let i = 0; i < list.length; i++) {
    let obj = list[i]
    if (obj.id == activeItem.id) {
      list[i] = {
        ...obj,
        ...changedValuesTemp,
      }
    }
  }

  if (window.t_changeTimer) {
    window.clearTimeout(window.t_changeTimer)
  }
  window.t_changeTimer = setTimeout(() => {
    dispatch({
      type: 'h5Editor/save',
      payload: {
        itemList: list,
      },
    })
  }, 50)
}

//跳转类型
export const goTypeOptionsList = () => {
  const orgCode = getUrlParam('orgCode')
  return [
    {
      value: 'type',
      text: '商品类目',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsGoodsClass,
    },
    {
      value: 'allGoods',
      text: '全部商品列表',
      disabled: false,
      selectItemFromTableProps: undefined,
    },
    {
      value: 'goodsDetail',
      text: '商品详情',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsGoodsDetail({
        distributeOrgCode: orgCode,
      }),
    },
    {
      value: 'customPage',
      text: '自定义页面',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsCustomPage,
    },
    {
      value: 'customArticle',
      text: '自定义文章',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsCustomArticle,
    },
  ]
}

export const goTypeOptionsListOne = () => {
  const orgCode = getUrlParam('orgCode')
  return [
    {
      value: 'type',
      text: '商品类目',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsGoodsClass,
    },
    {
      value: 'allGoods',
      text: '全部商品列表',
      disabled: false,
      selectItemFromTableProps: undefined,
    },
    {
      value: 'goodsDetail',
      text: '商品详情',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsGoodsDetail({
        distributeOrgCode: orgCode,
      }),
    },
    {
      value: 'customPage',
      text: '自定义页面',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsCustomPage,
    },
    {
      value: 'customArticle',
      text: '自定义文章',
      disabled: false,
      selectItemFromTableProps: SelectItemFromTablePropsCustomArticle,
    },
    {
      value: 'jumpMiniApp',
      text: '跳转小程序',
      disabled: false,
      selectItemFromTableProps: '',
    },
    {
      value: 'wxArticle',
      text: '公众号文章/H5页面',
      disabled: false,
      selectItemFromTableProps: '',
    },
    {
      value: 'miniPages',
      text: '小程序内页面',
      disabled: false,
      selectItemFromTableProps: '',
    },
  ]
}

export const getSelectItemFromTableProps = (goTypeState) => {
  const option = goTypeOptionsList().find((item) => item.value == goTypeState)
  return (option && option.selectItemFromTableProps) || {}
}

//商品图片
export const getGoodImg = (str) => {
  if (!str) return ''
  if (str.indexOf(',') > -1) {
    return str.split(',')[0]
  } else {
    return str
  }
}

//在管理端 复制企业的模板时，清除goType和goUrl
export const deleteTemplateDataSomeProps = (itemList) => {
  const propsStrArr = ['goUrl', 'goType', 'productId'] //需要删除的属性

  function deleteProps(o) {
    if (Array.isArray(o)) {
      o.forEach((obj) => {
        deleteProps(obj)
      })
    } else if (Object.prototype.toString.call(o) === '[object Object]') {
      for (let key in o) {
        if (propsStrArr.indexOf(key) > -1) {
          // o[key] = undefined
          o[key] = ''
        } else {
          deleteProps(o[key])
        }
      }
    }
  }

  let newList = lodash.cloneDeep(itemList)
  deleteProps(newList)

  return newList
}
