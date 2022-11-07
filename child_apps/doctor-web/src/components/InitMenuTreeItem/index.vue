<template>
  <div class="tree_form_item_box">
    <el-tree
      ref="treeRef"
      :default-expand-all="true"
      :show-checkbox="true"
      :expand-on-click-node="false"
      :check-strictly="true"
      :props="defaultProps"
      :data="treeData"
      node-key="menuCode"
      @check-change="handleCheckChange"
    />
  </div>
</template>

<script>
import { ref, toRefs, watch } from 'vue'

/**
我看tree没有受控的属性，
这里是利用 emit + watch modelValue，去改变tree自身的store（组件自带的store，通过ref去改变）信息
 */

export default {
  emits: ['update:modelValue'],
  data() {
    return {
      defaultProps: {
        label: 'menuTitle',
        children: 'children',
      },
    }
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const treeRef = ref(null)

    const { modelValue, treeData } = toRefs(props)

    watch(modelValue, (newV) => {
      const checkedKeys = newV?.split(',') ?? []
      treeRef.value?.setCheckedKeys(checkedKeys)
    })

    // watch(treeData, (newV, oldV) => {
    //   if (JSON.stringify(newV) !== JSON.stringify(oldV)) {
    //     ctx.emit('update:modelValue', '')
    //   }
    // })

    function handleCheckChange() {
      const checkedKeys = treeRef.value?.getCheckedKeys() ?? []

      const emitValue = checkedKeys.join(',')
      ctx.emit('update:modelValue', emitValue)
    }

    return {
      treeRef,
      handleCheckChange,
    }
  },
}
</script>

<style lang="less" scoped>
.tree_form_item_box {
  padding-top: 7px;
}
</style>
