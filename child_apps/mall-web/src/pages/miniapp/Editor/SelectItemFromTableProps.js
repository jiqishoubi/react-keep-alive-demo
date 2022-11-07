import { getSecondGroupList } from '@/services/goods'
import api_article from '@/services/api/article'
import api_goods from '@/services/api/goods'
import { getOrgKind } from '@/utils/utils'

/**
 * SelectItemFormTable的props
 */
//商品类目
export const SelectItemFromTablePropsGoodsClass = {
  width: 700,
  title: '商品类目',
  api: api_goods.getFirstGroupList(),
  dealResFunc: (data) => {
    return new Promise((resolve) => {
      let tableData = []
      let total = 0
      tableData = data.data || []
      total = data.rowTop || 0
      //获取二级类目 //给原有的tableData加children
      const getSecondArr = tableData.map((item) => {
        return getSecondGroupList({ groupCode: item.groupCode })
      })
      Promise.all(getSecondArr).then((resArr) => {
        resArr.forEach((r, idx) => {
          let arr = []
          if (r && r.code == '0' && r.data) {
            arr = r.data
          }
          tableData[idx].children = arr
        })
        resolve({
          tableData,
          total,
        })
      })
    })
  },
  columns: [
    {
      title: '分类名称',
      dataIndex: 'groupName',
    },
    {
      title: '分类级别',
      dataIndex: 'groupLevel',
      render: (v) => v + 1,
    },
  ],
  rowKey: 'groupCode',
  inputValKey: 'groupName',
  inputCodeKey: 'groupCode',
}

//商品类型 goodsType 国际
export const SelectItemFromTablePropsGoodsType = {
  title: '商品类型',
  getStaticData: () => {
    const tableData = [{ goodsType: 'INTERNATION', goodsTypeName: '国际' }]
    return {
      tableData,
      total: tableData.length,
    }
  },
  columns: [
    {
      title: '商品类型',
      dataIndex: 'goodsTypeName',
    },
  ],
  rowKey: 'goodsType',
  inputValKey: 'goodsTypeName',
  inputCodeKey: 'goodsType',
}

//商品详情
export const SelectItemFromTablePropsGoodsDetail = (params) => {
  const statusStr = (status) => {
    if (status == 0) {
      return '待审核'
    }
    if (status == 2) {
      return '已上架'
    }
    if (status == 3) {
      return '已下架'
    }
    if (status == 9) {
      return '已删除'
    }
  }
  return {
    width: 1000,
    title: '商品详情',
    searchFormItems: [{ name: 'goodsName', placeholder: '商品名称' }],
    api: api_goods.getUIGoodsListApi(),
    params: {
      ...params,
    },
    columns: [
      {
        title: '商品名称',
        dataIndex: 'goodsName',
      },
      {
        title: '价格',
        dataIndex: 'minSkuPriceStr',
        render: (v) => {
          return v || '-'
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (v) => {
          return statusStr(v)
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDateStr',
      },
    ],
    rowKey: 'goodsCode',
    inputValKey: 'goodsName',
    inputCodeKey: 'goodsCode',
    pageKey: 'page',
    pageSizeKey: 'rows',
  }
}

//自定义页面
export const SelectItemFromTablePropsCustomPage = {
  width: 850,
  title: '自定义页面',
  searchFormItems: [{ name: 'templateName', placeholder: '名称' }],
  // api: '/web/uiTemplate/getUiTemplateList',
  api: getOrgKind().isAdmin ? '/web/system/uiTemplate/getUiTemplateList' : '/web/supplier/uiTemplate/getUiTemplateList',
  columns: [
    {
      title: '名称',
      dataIndex: 'templateName',
    },
    {
      title: '创建时间',
      dataIndex: 'createDateStr',
    },
  ],
  rowKey: 'templateCode',
  inputValKey: 'templateName',
  inputCodeKey: 'id',
  pageKey: 'nowPage',
  pageSizeKey: 'rowsPage',
}

//自定义文章customArticle
export const SelectItemFromTablePropsCustomArticle = {
  width: 850,
  title: '自定义文章',
  searchFormItems: [{ name: 'textName', placeholder: '名称' }],
  api: api_article.getSoftTextPagingApi(),
  columns: [
    {
      title: '文章名称',
      dataIndex: 'textName',
    },
    {
      title: '创建时间',
      dataIndex: 'createDateStr',
    },
  ],
  rowKey: 'textCode',
  inputValKey: 'textName',
  inputCodeKey: 'id',
  pageKey: 'page',
  pageSizeKey: 'rows',
}
