<template>
  <div class="my_pro_table_wrap">
    <div class="my_pro_table" :id="showTableId">
      <el-table
        ref="tableRef"
        class="table_my"
        size="small"
        :border="true"
        :rowKey="rowKey"
        :data="tableData"
        v-loading="loading"
        :reserveSelection="true"
        @select="selectionController?.onSelect($event, tableRef)"
        @selectionChange="selectionController?.onSelectionChange($event, tableRef)"
      >
        <el-table-column type="selection" width="35" />
        <template v-for="(columnObj, index) in columns" :key="columnObj.prop || index">
          <el-table-column
            align="center"
            :label="columnObj.label"
            :prop="columnObj.prop"
            :width="columnObj.width ?? null"
            :fixed="columnObj.fixed ?? null"
          >
            <template #default="scope">
              <span v-if="columnObj.render">{{ 1 }}</span>
              <span v-else>{{ scope.row[columnObj.prop] ?? '' }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->
      <div className="pagination_box">
        <div className="total_text">共{this.total}条</div>
        <el-pagination
          class="pro_table_pagination"
          :current-page="pageState.page"
          :page-size="pageState.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
          @currentChange="handleCurrentChange"
          @sizeChange="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
export default {
  emits: ['pageChange'],
  props: {
    // 传了就用传进来的，否则就用route.path当做id
    tableId: { type: String, default: '' },
    columns: {
      type: Array,
      default: () => [],
    },
    defaultColumnWidth: {
      type: Number,
      default: 200,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageState: {
      type: Object,
      default: () => ({ page: 1, pageSize: 10 }),
    },
    // 多选controller
    selectionController: {},
  },
  setup(props) {
    const { columns } = props

    const renderArr = columns.map((item) => item.render)

    const tableRef = ref(null)
    const route = useRoute()
    // const curPath = this.$route.path
    // const showTableId  = this.tableId || `pro_table_id_${curPath}`
    const showTableId = 'sdfsfs'

    function rowKey(row) {
      return row.id
    }

    return {
      tableRef,
      showTableId,
      rowKey,
      renderArr,
    }
  },
  methods: {
    handleCurrentChange(v) {
      this.$emit('pageChange', {
        page: v,
        pageSize: this.pageState.pageSize,
      })
    },
    handleSizeChange(v) {
      this.$emit('pageChange', {
        page: 1, // pageSize改变的时候，重新回到第一页
        pageSize: v,
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
