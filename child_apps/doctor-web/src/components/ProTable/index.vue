<script>
export default {
  emits: ['pageChange'],
  props: {
    // 传了就用传进来的，否则就用route.path当做id
    tableId: { type: String, default: '' },
    rowKey: {
      type: String,
      default: 'id',
    },
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
    isSelection: {
      type: Boolean,
      default: false,
    },
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
    // 多选
    getSelectedRows() {
      return this.$refs.elTableRef?.getSelectionRows()
    },
    getSelectedKeys(prop) {
      const propForSelection = prop ?? this.rowKey
      const rows = this.$refs.elTableRef?.getSelectionRows() ?? []
      return rows.map((record) => record[propForSelection])
    },
    clearSelectedRows() {
      this.$refs.elTableRef?.clearSelection()
    },
  },

  render() {
    const curPath = this.$route.path
    const tableId = this.tableId || `pro_table_id_${curPath}`

    return (
      <div className="my_pro_table_wrap">
        <div className="my_pro_table" id={tableId}>
          <el-table
            ref="elTableRef"
            class="table_my"
            rowKey={(row) => {
              return row[this.rowKey]
            }}
            border={true}
            size="small"
            data={this.tableData}
            v-loading={this.loading}
            //
          >
            {this.isSelection && <el-table-column type="selection" width="35" reserveSelection={true} />}
            {this.columns.map((columnObj, index) => {
              let columnProps = {
                label: columnObj.label,
                prop: columnObj.prop,
                align: 'center',
              }
              if (columnObj.width) columnProps.width = columnObj.width
              if (columnObj.fixed) columnProps.fixed = columnObj.fixed

              return (
                <el-table-column key={columnObj.prop || index} {...columnProps}>
                  {(e) => {
                    const record = e.row
                    if (columnObj.render) {
                      return columnObj.render(record[columnObj.prop || ''], record)
                    }
                    return record[columnObj.prop || '']
                  }}
                </el-table-column>
              )
            })}
          </el-table>

          <div className="pagination_box">
            <div className="total_text">共{this.total}条</div>
            <el-pagination
              class="pro_table_pagination"
              current-page={this.pageState.page}
              page-size={this.pageState.pageSize}
              page-sizes={[10, 20, 50, 100, 200, 300, 400]}
              total={this.total}
              layout="sizes, prev, pager, next, jumper"
              onCurrentChange={this.handleCurrentChange}
              onSizeChange={this.handleSizeChange}
            ></el-pagination>
          </div>
        </div>
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
