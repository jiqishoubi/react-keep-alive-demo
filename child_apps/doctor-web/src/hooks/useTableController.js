import { onMounted, reactive, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import _ from 'lodash'

/**
 * 返回格式
 * @typedef TableController
 * @property {Array<any>} columns
 * @property {Array<any>} tableData
 * @property {boolean} loading
 * @property {number} total
 * @property {{page:number;pageSize:number;}} pageState
 * @property {(e: {page:number;pageSize:number;}) => void} onPageChange
 * @property {function} search // 回到第一页 刷新
 * @property {function} refresh // 在当前页刷新
 */

/**
 *
 * @param {object} options
 * @param {string} [options.tableId] 传了就用传进来的，否则就用route.path当做id
 * @param {Array<any>} [options.columns=[]] columns透传
 * @param {function} options.ajax 要返回{ list, totalNum }
 * @param {number} [options.columnsWidth=200] 一列默认的宽度
 * @param {number} [options.defaultPageSize=10] 一页默认显示页数
 * @param {function} [options.getIsReady] 如果有这个的话  只有返回true的时候才调用
 * @param {any[]} [options.depArr=[]] 依赖改变的话 需要重新请求
 * @returns {TableController}
 */
function useTableController(options) {
  const route = useRoute()

  const { tableId: optionsTableId, columns = [], ajax, columnsWidth = 200, defaultPageSize = 10, getIsReady, depArr = [] } = options

  const pageState = reactive({
    page: 1,
    pageSize: defaultPageSize,
  })
  const total = ref(0)
  const tableData = ref([])
  const loading = ref(false)

  // table dom 元素
  const tableId = computed(() => {
    return optionsTableId ?? `pro_table_id_${route.path}`
  })
  const tableDom = reactive({ dom: null })
  const tableDomWidth = computed(() => {
    if (tableDom.dom?.clientWidth) {
      return tableDom.dom?.clientWidth
    }
    return 0
  }) // 1440 number

  // columns
  const showColumns = computed(() => {
    const columnWidthSum = columns.reduce((acc, columnObj) => acc + (columnObj.width ?? columnsWidth), 0)

    let otherWidthSum = 0

    return (
      _.cloneDeep(columns).map((columnObj, index) => {
        // showWidth 根据columns的总width是否大于，当前table dom的clientWidth判断
        let showWidth = ''
        if (columnWidthSum < tableDomWidth.value) {
          try {
            delete columnObj.fixed // 如果table宽度够的话 就不用fixed了
          } catch (err) {
            console.log(err)
          }
          // 取百分比
          const percentNum = (columnObj.width ?? columnsWidth) / columnWidthSum // 小数点

          // 注： 这里做一下处理，如果总长度 不大于 table dom的长度，是用百分比计算的，但是这样可能有误差，所以把其中的一个columnObj width设置为false，让这一列column去自适应
          if (index == columns.length - 1) {
            showWidth = tableDomWidth.value - 1 - otherWidthSum // 这里减去一个border的像素
          } else {
            showWidth = Math.round(tableDomWidth.value * percentNum)
            otherWidthSum = otherWidthSum + showWidth
          }
        } else {
          // 去columnObj自己的width
          showWidth = columnObj.width ?? columnsWidth
        }

        return {
          ...columnObj,
          width: showWidth,
        }
      }) || []
    )
  })

  /**
   * 周期
   */
  onMounted(() => {
    if (document.getElementById(tableId.value)) {
      tableDom.dom = document.getElementById(tableId.value)
    }
    getData()
  })
  watch(
    depArr,
    (vArr) => {
      if (vArr?.length > 0) {
        getData()
      }
    },
    { deep: true }
  )

  /**
   * 方法
   */
  function getData(pageStateParam) {
    if (getIsReady && !getIsReady()) return
    const postPage = pageStateParam ?? pageState
    // 请求
    loading.value = true
    return ajax(postPage)
      .finally(() => {
        loading.value = false
      })
      .then(({ list, totalNum }) => {
        tableData.value = list ?? []
        total.value = totalNum ?? 0
      })
  }

  function onPageChange(e) {
    pageState.page = e.page
    pageState.pageSize = e.pageSize
    getData(e)
  }

  // 查询（回到第一页）
  function search() {
    return getData({
      page: 1,
      pageSize: pageState.pageSize,
    })
  }
  // 刷新（在当前页）
  function refresh() {
    return getData()
  }

  return reactive({
    tableId,
    columns: showColumns,
    tableData,
    loading,
    total,
    pageState,
    onPageChange,
    search,
    refresh,
  })
}

export default useTableController
