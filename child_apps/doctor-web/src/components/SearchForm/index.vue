<script>
import { ref } from 'vue'

export default {
  emits: {
    search: null,
  },
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
    searchLoading: Boolean,
    default: false,
  },
  setup(props, ctx) {
    const formRef = ref(null)

    function reset() {
      formRef.value?.resetFields()
    }

    function clickSearch() {
      ctx.emit('search')
    }

    return {
      formRef,
      // func
      reset,
      clickSearch,
    }
  },
  render() {
    const formItems = (this.$slots.form?.() || []).filter((node) => node.type?.name == 'ElFormItem') // 注：这里会筛选 ELFormItem
    const controllItems = (this.$slots.controll?.() || []).filter((node) => node.type?.name == 'ElButton') // 注：这里会筛选 ELButton

    const colSpanProps = {
      xs: 6,
      sm: 6,
      md: 6,
      lg: 4,
      xl: 4,
    }

    return (
      <div className="my_searchForm_wrap">
        <el-form class="form_wrap" ref="formRef" model={this.formModel} inline={false}>
          <el-row gutter={10}>
            {formItems.map((item, index) => {
              return (
                <el-col key={index} {...colSpanProps}>
                  <div className="item_box">{item}</div>
                </el-col>
              )
            })}
            <el-col className="searchFrom_ctrl_box">
              <el-button onClick={this.reset}>重置</el-button>
            </el-col>
            <el-col className="searchFrom_ctrl_box">
              <el-button type="primary" onClick={this.clickSearch} disabled={this.searchLoading}>
                查询
              </el-button>
            </el-col>
            {controllItems.map((item, index) => {
              return (
                <el-col key={index} className="searchFrom_ctrl_box">
                  {item}
                </el-col>
              )
            })}
          </el-row>
        </el-form>
      </div>
    )
  },
}
</script>

<style lang="less" scoped>
.my_searchForm_wrap {
  padding: 0 15px;
  background-color: #fff;
  margin: 0 0 15px;
  border-radius: 3px;
  overflow: hidden;
}
.form_wrap {
  padding: 15px 0 0;

  .flex_div {
    flex: 1 0 0;
  }
  .searchFrom_ctrl_box {
    margin-bottom: 22px; // 为了和el-item一样
  }
}
</style>
